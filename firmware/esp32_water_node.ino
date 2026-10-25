/*
 * =========================================================================================
 * Project: HydroSense AI - Smart Water Quality & Leakage Monitoring System
 * Target Board: ESP32 Dev Module (WROOM-32)
 * Features:
 *   - Flow Sensor (YF-S201) via Hardware Interrupt
 *   - Pressure Sensor (MPX5010DP / MPS20N0040D Analog Transducer)
 *   - Analog pH Sensor (DFRobot Gravity Analog pH)
 *   - Turbidity Sensor (DFRobot Optical Turbidity)
 *   - Temperature Sensor (DS18B20 1-Wire)
 *   - Solenoid Cut-off Valve Relay (12V High-Torque)
 *   - Solar Panel Voltage Divider Telemetry
 *   - Wi-Fi HTTP / JSON Telemetry Dispatch with Auto-Shutdown Relay
 * =========================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------- WIFI CONFIGURATION ----------
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL    = "http://192.168.1.100:3000/api/telemetry"; // Change to your Dashboard IP
const char* IOT_API_KEY   = "hs_sec_9938a1c4b7e2"; // Cryptographic Pre-Shared Key

// ---------- NODE IDENTITY ----------
const char* NODE_ID       = "NODE-02";
const char* SECTOR_NAME   = "Sector B - Trunk Line";

// ---------- GPIO PIN ASSIGNMENTS ----------
#define PIN_FLOW_SENSOR    14   // GPIO 14 (Interrupt pin for YF-S201)
#define PIN_PRESSURE       34   // GPIO 34 (ADC1 Analog In)
#define PIN_PH_SENSOR      35   // GPIO 35 (ADC1 Analog In)
#define PIN_TURBIDITY      32   // GPIO 32 (ADC1 Analog In)
#define PIN_ONE_WIRE_BUS    4   // GPIO 4  (DS18B20 Data with 4.7k pullup)
#define PIN_VALVE_RELAY    16   // GPIO 16 (Relay Signal: Active LOW or HIGH)
#define PIN_SOLAR_ADC      33   // GPIO 33 (ADC1 - Resistor Divider for Solar)
#define PIN_STATUS_LED      2   // Onboard Blue LED

// ---------- SENSOR CALIBRATION CONSTANTS ----------
const float FLOW_CALIBRATION_FACTOR = 7.5; // YF-S201 pulses per sec per L/min
const float PH_SLOPE                = -5.70;  // Standard Gravity pH calibration slope
const float PH_INTERCEPT            = 21.34;
const float SOLAR_DIVIDER_RATIO     = 5.0;    // (R1=40k + R2=10k) / R2 = 5.0

// ---------- GLOBAL VARIABLES ----------
volatile unsigned long pulseCount = 0;
unsigned long lastTelemetryTime   = 0;
const unsigned long TELEMETRY_INTERVAL = 3000; // Send telemetry every 3 seconds

bool valveState = true; // true = OPEN, false = CLOSED (Cut-off)

OneWire oneWire(PIN_ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// ---------- HARDWARE INTERRUPT SERVICE ROUTINE ----------
void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==============================================");
  Serial.println("  HydroSense AI - ESP32 Smart Water Node      ");
  Serial.println("==============================================");

  // Configure Pins
  pinMode(PIN_FLOW_SENSOR, INPUT_PULLUP);
  pinMode(PIN_VALVE_RELAY, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  // Set Valve initially OPEN (Supply flowing)
  setValveState(true);

  // Attach flow pulse interrupt
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), pulseCounter, RISING);

  // Initialize Dallas Temperature
  tempSensor.begin();

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  // Reconnect WiFi if lost
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Periodic Telemetry Send
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    readSensorsAndDispatch();
  }
}

// ---------- VALVE CONTROL FUNCTION ----------
void setValveState(bool openValve) {
  valveState = openValve;
  if (openValve) {
    // Normal operation: Relay engaged or energized (or de-energized depending on NC/NO wiring)
    digitalWrite(PIN_VALVE_RELAY, HIGH);
    Serial.println("[VALVE] Valve State: OPEN (Normal Flow)");
  } else {
    // Emergency cut-off triggered!
    digitalWrite(PIN_VALVE_RELAY, LOW);
    Serial.println("[VALVE EMERGENCY] Solenoid Valve Closed! Water flow severed.");
  }
}

// ---------- READ SENSORS & TRANSMIT JSON ----------
void readSensorsAndDispatch() {
  digitalWrite(PIN_STATUS_LED, HIGH);

  // 1. Calculate Flow Rate (L/min)
  detachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR));
  float flowRateLPM = ((1000.0 / TELEMETRY_INTERVAL) * pulseCount) / FLOW_CALIBRATION_FACTOR;
  pulseCount = 0;
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_SENSOR), pulseCounter, RISING);

  // 2. Read Pressure (PSI)
  int rawPressure = analogRead(PIN_PRESSURE);
  float voltagePressure = (rawPressure / 4095.0) * 3.3;
  // MPX5010DP: 0.2V to 4.7V = 0 to 10 kPa (~1.45 psi). Linear mapping:
  float pressurePSI = map(rawPressure, 400, 3800, 15, 80);
  if (pressurePSI < 0) pressurePSI = 0;

  // 3. Read pH Sensor
  int rawPH = analogRead(PIN_PH_SENSOR);
  float voltagePH = (rawPH / 4095.0) * 3.3;
  float phValue = (voltagePH * 3.5); // Simplified linear mapping (Calibrate with buffer 4.0 & 7.0)
  if (phValue < 0.0) phValue = 0.0;
  if (phValue > 14.0) phValue = 14.0;

  // 4. Read Turbidity (NTU)
  int rawTurbidity = analogRead(PIN_TURBIDITY);
  float voltageTurb = (rawTurbidity / 4095.0) * 3.3;
  // DFRobot Turbidity equation: NTU decreases as voltage increases (clear water = high voltage)
  float turbidityNTU = -1120.4 * (voltageTurb * voltageTurb) + 5742.3 * voltageTurb - 4352.9;
  if (turbidityNTU < 0.5) turbidityNTU = 0.5;

  // 5. Read Temperature (°C)
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);
  if (tempC == -127.00) tempC = 25.0; // Fallback default if sensor unhooked

  // 6. Read Solar Panel / Battery Voltage
  int rawSolar = analogRead(PIN_SOLAR_ADC);
  float solarVoltage = (rawSolar / 4095.0) * 3.3 * SOLAR_DIVIDER_RATIO;
  int batteryPct = constrain(map((int)(solarVoltage * 10), 110, 142, 0, 100), 0, 100);

  // 7. Calculate On-Device Water Quality Index (WQI)
  float wqi = calculateWQI(phValue, turbidityNTU, tempC);

  // 8. On-Device Fail-Safe Autonomous Trip (Edge Computing Safety)
  // Even if server is unreachable, close valve if hazardous pH or burst pressure drop
  if (phValue < 5.0 || phValue > 9.5 || (pressurePSI < 15.0 && flowRateLPM > 40.0)) {
    Serial.println("[EDGE AI SAFETY] Anomaly Detected Locally! Auto-Closing Valve!");
    setValveState(false);
  }

  // 9. Format JSON Payload
  String payload = "{";
  payload += "\"node_id\":\"" + String(NODE_ID) + "\",";
  payload += "\"pressure_psi\":" + String(pressurePSI, 1) + ",";
  payload += "\"flow_rate_lpm\":" + String(flowRateLPM, 1) + ",";
  payload += "\"ph\":" + String(phValue, 2) + ",";
  payload += "\"turbidity_ntu\":" + String(turbidityNTU, 1) + ",";
  payload += "\"temperature_c\":" + String(tempC, 1) + ",";
  payload += "\"battery_pct\":" + String(batteryPct) + ",";
  payload += "\"solar_volts\":" + String(solarVoltage, 2) + ",";
  payload += "\"valve_status\":\"" + String(valveState ? "OPEN" : "CLOSED") + "\",";
  payload += "\"wqi_score\":" + String(wqi, 1);
  payload += "}";

  Serial.println("[TELEMETRY] " + payload);

  // 10. Transmit to Dashboard Server via HTTP POST
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-API-Key", IOT_API_KEY); // Secure Hardware Authentication

    int httpResponseCode = http.POST(payload);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("[HTTP] Code: %d | Response: %s\n", httpResponseCode, response.c_str());

      // Parse server command (e.g. Remote Valve Override)
      if (response.indexOf("\"valve_command\":\"CLOSE\"") >= 0) {
        setValveState(false);
      } else if (response.indexOf("\"valve_command\":\"OPEN\"") >= 0) {
        setValveState(true);
      }
    } else {
      Serial.printf("[HTTP ERROR] Failed to send: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }

  digitalWrite(PIN_STATUS_LED, LOW);
}

// ---------- COMPUTE LOCAL WQI (Weighted Arithmetic Method) ----------
float calculateWQI(float ph, float turb, float temp) {
  // pH sub-index (Ideal 7.0, Permissible 6.5 - 8.5)
  float q_ph = 100.0 - (abs(ph - 7.0) / 1.5) * 100.0;
  if (q_ph < 0) q_ph = 0;

  // Turbidity sub-index (Ideal 0 NTU, Permissible 5 NTU)
  float q_turb = 100.0 - (turb / 5.0) * 100.0;
  if (q_turb < 0) q_turb = 0;

  // Weighted combination
  float wqi = (q_ph * 0.6) + (q_turb * 0.4);
  return constrain(wqi, 0.0, 100.0);
}

// ---------- WIFI CONNECTION HELPER ----------
void connectWiFi() {
  Serial.print("[WIFI] Connecting to ");
  Serial.print(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] Connected Successfully!");
    Serial.print("[WIFI] Node IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WIFI WARNING] Connection timed out. Running in Autonomous Offline Mode.");
  }
}
