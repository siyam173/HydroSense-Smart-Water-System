/**
 * =========================================================================================
 * HydroSense AI - Client Application & Simulation Controller
 * Full IoT Command Center, AI Prediction Engine, WQI Math & Automated Valve Control
 * =========================================================================================
 */

// Application State
const AppState = {
  lang: 'bn', // 'bn' (Bangla) or 'en' (English)
  soundEnabled: true,
  activePreset: 'normal',
  selectedNodeId: 'NODE-02',
  nodes: [
    {
      id: "NODE-01",
      name: "Central Pumping Station (Intake)",
      name_bn: "সেন্ট্রাল পাম্পিং স্টেশন (ইনটেক)",
      location: { lat: 23.7925, lng: 90.4078, sector: "Sector A - Main Intake", sector_bn: "সেক্টর এ - গুলশান লেক পাম্প" },
      telemetry: { pressure_psi: 58.4, flow_rate_lpm: 125.0, ph: 7.4, turbidity_ntu: 2.1, tds_ppm: 185, temperature_c: 24.5 },
      solar: { battery_pct: 98, panel_volts: 18.2, charging_ma: 840, mode: "High Performance", mode_bn: "উচ্চ কর্মক্ষমতা" },
      valve: { status: "OPEN", mode: "AUTO", relayPin: 16 },
      status: "NORMAL",
      ai_leak_prob: 3
    },
    {
      id: "NODE-02",
      name: "Mid-Distribution Junction",
      name_bn: "মধ্যবর্তী বিতরণ জংশন",
      location: { lat: 23.7805, lng: 90.4125, sector: "Sector B - Commercial Trunk", sector_bn: "সেক্টর বি - বনানী ১১ ট্রাঙ্ক" },
      telemetry: { pressure_psi: 54.2, flow_rate_lpm: 119.0, ph: 7.3, turbidity_ntu: 2.8, tds_ppm: 195, temperature_c: 24.8 },
      solar: { battery_pct: 92, panel_volts: 17.8, charging_ma: 790, mode: "High Performance", mode_bn: "উচ্চ কর্মক্ষমতা" },
      valve: { status: "OPEN", mode: "AUTO", relayPin: 17 },
      status: "NORMAL",
      ai_leak_prob: 4
    },
    {
      id: "NODE-03",
      name: "Residential Distribution",
      name_bn: "আবাসিক বিতরণ সাব-সেক্টর",
      location: { lat: 23.7712, lng: 90.4052, sector: "Sector C - Residential Feeder", sector_bn: "সেক্টর সি - মহাখালী ডিওএইচএস" },
      telemetry: { pressure_psi: 51.0, flow_rate_lpm: 113.0, ph: 7.2, turbidity_ntu: 3.5, tds_ppm: 210, temperature_c: 25.1 },
      solar: { battery_pct: 88, panel_volts: 16.9, charging_ma: 680, mode: "High Performance", mode_bn: "উচ্চ কর্মক্ষমতা" },
      valve: { status: "OPEN", mode: "AUTO", relayPin: 18 },
      status: "NORMAL",
      ai_leak_prob: 5
    },
    {
      id: "NODE-04",
      name: "Industrial Terminal Feed",
      name_bn: "শিল্পাঞ্চল টার্মিনাল লাইন",
      location: { lat: 23.7598, lng: 90.3920, sector: "Sector D - Terminal Line", sector_bn: "সেক্টর ডি - তেজগাঁও টার্মিনাল" },
      telemetry: { pressure_psi: 48.5, flow_rate_lpm: 106.0, ph: 7.1, turbidity_ntu: 3.9, tds_ppm: 225, temperature_c: 25.4 },
      solar: { battery_pct: 79, panel_volts: 15.6, charging_ma: 520, mode: "Eco Mode", mode_bn: "ইকো মোড" },
      valve: { status: "OPEN", mode: "AUTO", relayPin: 19 },
      status: "NORMAL",
      ai_leak_prob: 3
    }
  ],
  analytics: {
    total_water_saved_liters: 148500,
    financial_savings_bdt: 8167.50,
    current_leak_rate_lpm: 0,
    lost_liters_current_session: 0,
    active_incidents: []
  }
};

// Bilingual Translation Dictionary (100% Complete)
const i18n = {
  bn: {
    header_subtitle: "স্মার্ট ওয়াটার কোয়ালিটি ও লিকেজ মনিটরিং সিস্টেম",
    system_live: "সিস্টেম সক্রিয় (রিয়েলটাইম)",
    lang_btn: "English",
    sound_mute: "মিউট এলার্ম",
    sound_unmute: "সাউন্ড চালু",
    print_btn: "রিপোর্ট প্রিন্ট",
    sandbox_label: "বিচারকদের সামনে লাইভ ডেমোস্ট্রেশন (Demo Controls):",
    preset_normal: "🟢 স্বাভাবিক অবস্থা (Normal)",
    preset_burst: "🚨 পাইপ ব্লাস্ট (Pipe Burst)",
    preset_microleak: "⚠️ মাইক্রো-ফাটল (Predictive)",
    preset_acid: "☣️ এসিড দূষণ (pH ৪.১)",
    preset_mud: "🌊 ঘোলাটে পানি (Turbidity ৮৪)",
    preset_solar: "☀️ সোলার ড্রেন (১৪%)",
    card1_title: "Water Quality Index",
    card1_sub: "WHO ও Brown et al. Weighted Arithmetic মানদণ্ড অনুযায়ী পরিমাপকৃত।",
    param_ph: "pH:",
    param_turbidity: "টার্বিডিটি:",
    param_tds: "টিডিএস:",
    param_temp: "পানির তাপমাত্রা:",
    card2_title: "AI Predictive Analytics",
    card2_tag: "ML Model",
    card2_risk_label: "ঝুঁকির সম্ভাবনা (Leak Risk):",
    card2_upstream: "আপস্ট্রিম ফ্লো:",
    card2_downstream: "ডাউনস্ট্রিম:",
    card3_title: "Solenoid Cut-Off Valve",
    card3_sub: "ত্রুটি বা দূষণ শনাক্ত হলে ২৪০ মিলি-সেকেন্ডে স্বয়ংক্রিয়ভাবে বন্ধ হয় (ক্লিকে ওভাররাইড)।",
    param_pressure: "প্রেসার:",
    param_relay: "রিলে রেসপন্স:",
    card4_title: "Economic & Water ROI",
    card4_tariff: "ওয়াসা ট্যারিফ",
    card4_saved_water: "মোট সাশ্রয়কৃত পানি:",
    card4_saved_money: "বাঁচানো আর্থিক ক্ষতি:",
    card4_leak_rate: "বর্তমান লিকেজ রেট:",
    digital_twin_title: "Pipeline Digital Twin Visualizer",
    digital_twin_sector: "সেক্টর বি - বনানী ট্রাঙ্ক পাইপলাইন",
    digital_twin_velocity: "পানির গতিবেগ: ১.৮ মি/সে",
    digital_twin_response: "সোলেনয়েড রেসপন্স: ২৪০ মি.সে.",
    gps_map_title: "GPS Fault Mapping & Geo-Tagging",
    gps_map_live: "লাইভ জিআইএস",
    gps_map_target: "লক্ষ্য: বনানী ১১ ট্রাঙ্ক (২৩.৭৮০৫° উ, ৯০.৪১২২° পূ)",
    btn_whatsapp: "WhatsApp Alert",
    btn_gmaps: "Google Maps",
    solar_title: "সোলার পাওয়ার ও পরিবেশবান্ধব এনার্জি",
    solar_battery_label: "LiFePO4 ব্যাটারি লেভেল:",
    solar_voltage_label: "প্যানেল ভোল্টেজ:",
    solar_current_label: "চার্জিং কারেন্ট:",
    log_title: "ঘটনা ও স্বয়ংক্রিয় একশন লগ (Incident Log)",
    log_autologged: "অটো-রেকর্ডকৃত",
    col_id: "আইডি",
    col_time: "সময় (Time)",
    col_type: "ধরণ (Incident Type)",
    col_action: "গৃহীত স্বয়ংক্রিয় ব্যবস্থা",
    log_empty: "কোনো সক্রিয় বিপদ বা লিকেজ সনাক্ত হয়নি",
    valve_open: "ভালভ চালু (OPEN)",
    valve_closed: "ভালভ বন্ধ (CLOSED)",
    auto_mode: "স্বয়ংক্রিয় (Auto)",
    manual_mode: "ম্যানুয়াল (Manual)",
    svg_reservoir: "জলাধার (ইনটেক)",
    svg_city: "নগর বিতরণ",
    svg_burst: "পাইপ ফেটে গেছে!",
    mode_high: "উচ্চ কর্মক্ষমতা",
    mode_eco: "ইকো মোড",
    mode_sleep: "জরুরি ডিপ স্লিপ (১৪%)",
    wqi_grade_a: "চমৎকার - সরাসরি পানযোগ্য",
    wqi_grade_b: "ভালো - গৃহস্থালি ও পানের উপযোগী",
    wqi_grade_c: "নিম্নমানের - ফুটিয়ে পান করুন",
    wqi_grade_d: "অত্যন্ত খারাপ - কেবল সেচ কাজে",
    wqi_grade_e: "বিপজ্জনক / দূষিত!",
    ai_status_crit: "উচ্চ ঝুঁকি! তাৎক্ষণিক ব্যবস্থা গ্রহণ প্রয়োজন",
    ai_status_warn: "সতর্কতা: মাইক্রো-ফাটলের লক্ষণ পরিলক্ষিত",
    ai_status_norm: "স্বাভাবিক: পাইপলাইনের ভারসাম্য স্থিতিশীল",
    toast_burst_title: "জরুরি অ্যালার্ট: পাইপ ব্লাস্ট!",
    toast_burst_desc: "সেক্টর বি-তে পাইপ ফেটে যাওয়ায় স্বয়ংক্রিয় সোলেনয়েড ভালভ বন্ধ করা হয়েছে!",
    toast_acid_title: "জরুরি অ্যালার্ট: এসিড দূষণ!",
    toast_acid_desc: "ক্ষতিকর এসিডিক পানি শনাক্ত হওয়ায় স্বয়ংক্রিয়ভাবে সোলেনয়েড ভালভ লকআউট করা হয়েছে!",
    toast_mud_title: "জরুরি অ্যালার্ট: ঘোলাটে কাদা পানি!",
    toast_mud_desc: "অতিরিক্ত ঘোলাটে পানি (৮৪ NTU) শনাক্ত হওয়ায় ফিল্টারিং লাইন বিচ্ছিন্ন করা হয়েছে!"
  },
  en: {
    header_subtitle: "Smart Water Quality & Leakage Monitoring System",
    system_live: "System Live (Real-Time)",
    lang_btn: "বাংলা",
    sound_mute: "Mute Siren",
    sound_unmute: "Unmute Siren",
    print_btn: "Print Report",
    sandbox_label: "Live Fault Injection Sandbox for Judges:",
    preset_normal: "🟢 Normal Operation",
    preset_burst: "🚨 Pipe Burst",
    preset_microleak: "⚠️ Micro-Fissure (Predictive)",
    preset_acid: "☣️ Acid Spill (pH 4.1)",
    preset_mud: "🌊 Mud / Silt (Turbidity 84)",
    preset_solar: "☀️ Solar Drain (14%)",
    card1_title: "Water Quality Index",
    card1_sub: "Calculated via WHO & Brown et al. Weighted Arithmetic Method.",
    param_ph: "pH:",
    param_turbidity: "Turbidity:",
    param_tds: "TDS:",
    param_temp: "Water Temp:",
    card2_title: "AI Predictive Analytics",
    card2_tag: "ML Model",
    card2_risk_label: "Leak Risk Probability:",
    card2_upstream: "Upstream Flow:",
    card2_downstream: "Downstream:",
    card3_title: "Solenoid Cut-Off Valve",
    card3_sub: "Auto-trips in 240ms on critical rupture or contamination (Click to override).",
    param_pressure: "Pressure:",
    param_relay: "Relay Response:",
    card4_title: "Economic & Water ROI",
    card4_tariff: "WASA Tariff",
    card4_saved_water: "Total Water Saved:",
    card4_saved_money: "Financial Loss Prevented:",
    card4_leak_rate: "Current Leak Rate:",
    digital_twin_title: "Pipeline Digital Twin Visualizer",
    digital_twin_sector: "Sector B - Commercial Trunk Line",
    digital_twin_velocity: "Water Velocity: 1.8 m/s",
    digital_twin_response: "Solenoid Response: 240 ms",
    gps_map_title: "GPS Fault Mapping & Geo-Tagging",
    gps_map_live: "Live GIS",
    gps_map_target: "Target: Banani 11 Trunk (23.7805° N, 90.4125° E)",
    btn_whatsapp: "WhatsApp Alert",
    btn_gmaps: "Google Maps",
    solar_title: "Solar Power & Green Energy",
    solar_battery_label: "LiFePO4 Battery Level:",
    solar_voltage_label: "Panel Voltage:",
    solar_current_label: "Charging Current:",
    log_title: "Incident & Autonomous Action Log",
    log_autologged: "Auto-logged",
    col_id: "ID",
    col_time: "Time",
    col_type: "Incident Type",
    col_action: "Autonomous Action Taken",
    log_empty: "No active incidents detected",
    valve_open: "VALVE OPEN",
    valve_closed: "VALVE CLOSED",
    auto_mode: "Autonomous (Auto)",
    manual_mode: "Manual Override",
    svg_reservoir: "RESERVOIR",
    svg_city: "CITY GRID",
    svg_burst: "PIPE BURST!",
    mode_high: "High Performance",
    mode_eco: "Eco Mode",
    mode_sleep: "Emergency Deep Sleep (14%)",
    wqi_grade_a: "Excellent - Safe for Drinking",
    wqi_grade_b: "Good - Domestic Use",
    wqi_grade_c: "Poor - Treatment Required",
    wqi_grade_d: "Very Poor - Irrigation Only",
    wqi_grade_e: "Hazardous / Toxic Contamination!",
    ai_status_crit: "CRITICAL RISK! Immediate shutdown recommended",
    ai_status_warn: "WARNING: Pre-rupture micro-fissure anomaly detected",
    ai_status_norm: "NORMAL: Hydraulic mass balance intact",
    toast_burst_title: "Critical Alert: Pipe Burst!",
    toast_burst_desc: "Main Solenoid Valve automatically shut down to halt water loss in Sector B!",
    toast_acid_title: "Critical Alert: Acid Spill!",
    toast_acid_desc: "Hazardous acidic water detected! Solenoid valve isolated to protect public health!",
    toast_mud_title: "Critical Alert: High Turbidity!",
    toast_mud_desc: "Excessive turbidity (84 NTU) detected! Distribution feeder isolated!"
  }
};

// Web Audio API Synthesizer (Realistic Industrial IoT Siren & Beeps)
let audioCtx = null;

function playAudioAlert(type) {
  if (!AppState.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'alarm') {
      osc.type = 'sawtooth';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.25);
      osc.frequency.linearRampToValueAtTime(750, now + 0.5);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.02, now + 0.5);
      osc.start();
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.warn("Audio warning:", e);
  }
}

// Compute Water Quality Index (Calibrated WHO & Brown et al. Weighted Arithmetic Method)
function calculateWQI(telemetry) {
  const { ph = 7.3, turbidity_ntu = 2.4, tds_ppm = 195, temperature_c = 25.0 } = telemetry;
  
  // 1. pH Sub-Index (WHO Standards: 6.5 - 8.5 permissible, 7.0 - 7.5 ideal)
  const diffPH = Math.abs(ph - 7.25);
  let q_ph = 100;
  if (diffPH <= 0.35) {
    q_ph = 100 - (diffPH / 0.35) * 4; // pH 7.1 - 7.5 => 96% - 100%
  } else if (diffPH <= 1.25) {
    q_ph = 96 - ((diffPH - 0.35) / 0.90) * 18; // pH 6.5 or 8.5 => ~78%
  } else {
    q_ph = Math.max(0, 78 - ((diffPH - 1.25) / 1.5) * 75); // Strong acid (4.1) => 0%
  }

  // 2. Turbidity Sub-Index (WHO Drinking Limit: < 5.0 NTU, Pristine: < 1.0 NTU)
  let q_turb = 100;
  if (turbidity_ntu <= 1.0) {
    q_turb = 100 - turbidity_ntu * 2; // 0.5 NTU => 99%
  } else if (turbidity_ntu <= 3.0) {
    q_turb = 98 - ((turbidity_ntu - 1.0) / 2.0) * 6; // 2.4 NTU => 93.8%
  } else if (turbidity_ntu <= 5.0) {
    q_turb = 92 - ((turbidity_ntu - 3.0) / 2.0) * 14; // 5.0 NTU => 78%
  } else if (turbidity_ntu <= 15.0) {
    q_turb = 78 - ((turbidity_ntu - 5.0) / 10.0) * 35; // 15 NTU => 43%
  } else {
    q_turb = Math.max(2, 43 - ((turbidity_ntu - 15.0) / 70.0) * 40); // 84.5 NTU => ~3%
  }

  // 3. TDS Sub-Index (WHO Guidelines: < 300 ppm is Excellent mineral drinking water)
  let q_tds = 100;
  if (tds_ppm <= 300) {
    q_tds = 100 - (tds_ppm / 300.0) * 4; // 195 ppm => 97.4%
  } else if (tds_ppm <= 600) {
    q_tds = 96 - ((tds_ppm - 300.0) / 300.0) * 16; // 600 ppm => 80%
  } else if (tds_ppm <= 1000) {
    q_tds = 80 - ((tds_ppm - 600.0) / 400.0) * 35; // 1000 ppm => 45%
  } else {
    q_tds = Math.max(5, 45 - ((tds_ppm - 1000.0) / 1000.0) * 40);
  }

  // Composite Weighted Score (pH: 40%, Turbidity: 35%, TDS: 25%)
  let score = (q_ph * 0.40) + (q_turb * 0.35) + (q_tds * 0.25);

  // Critical Safety Trip: Poisonous acid (< 5.5) or heavy sludge (> 30 NTU) caps the score to Grade E
  if (ph < 5.5 || ph > 9.5 || turbidity_ntu > 30) {
    score = Math.min(score, 18.5);
  }

  const rounded = Math.round(score * 10) / 10;

  let grade = "A";
  let color = "#10b981";
  let statusKey = "wqi_grade_a";

  if (rounded >= 90) {
    grade = "A"; color = "#10b981"; statusKey = "wqi_grade_a";
  } else if (rounded >= 70) {
    grade = "B"; color = "#06b6d4"; statusKey = "wqi_grade_b";
  } else if (rounded >= 50) {
    grade = "C"; color = "#f59e0b"; statusKey = "wqi_grade_c";
  } else if (rounded >= 25) {
    grade = "D"; color = "#f43f5e"; statusKey = "wqi_grade_d";
  } else {
    grade = "E"; color = "#991b1b"; statusKey = "wqi_grade_e";
  }

  return { score: rounded, grade, color, statusKey };
}

// AI Anomaly & Leakage Predictive Evaluation
function evaluatePredictiveEngine() {
  const nodeA = AppState.nodes[0]; // Upstream Intake
  const nodeB = AppState.nodes[1]; // Downstream Sector B

  const deltaFlow = nodeA.telemetry.flow_rate_lpm - nodeB.telemetry.flow_rate_lpm;
  const flowDiscrepancyPct = nodeA.telemetry.flow_rate_lpm > 0 ? (deltaFlow / nodeA.telemetry.flow_rate_lpm) * 100 : 0;
  const pressureB = nodeB.telemetry.pressure_psi;

  let leakProb = 0;
  let status = "NORMAL";

  // Check chemical contamination first
  if (nodeB.telemetry.ph < 5.5 || nodeB.telemetry.ph > 9.0 || nodeB.telemetry.turbidity_ntu > 20) {
    status = "CONTAMINATED";
    leakProb = Math.max(4, Math.round(flowDiscrepancyPct));
  } else if (flowDiscrepancyPct > 25 || pressureB < 30) {
    leakProb = Math.min(99, Math.round(60 + flowDiscrepancyPct * 1.2));
    status = "CRITICAL_LEAK";
    AppState.analytics.current_leak_rate_lpm = Math.max(20, Math.round(deltaFlow));
  } else if (flowDiscrepancyPct > 10 || pressureB < 48) {
    leakProb = Math.round(35 + flowDiscrepancyPct * 2);
    status = "WARNING";
    AppState.analytics.current_leak_rate_lpm = Math.max(5, Math.round(deltaFlow));
  } else {
    leakProb = Math.max(2, Math.round(Math.random() * 5));
    status = "NORMAL";
    AppState.analytics.current_leak_rate_lpm = 0;
  }

  nodeB.ai_leak_prob = leakProb;
  nodeB.status = status;

  // Closed-loop Autonomous Valve Shut-off Logic
  if ((status === "CRITICAL_LEAK" || status === "CONTAMINATED") && nodeB.valve.mode === "AUTO" && nodeB.valve.status === "OPEN") {
    nodeB.valve.status = "CLOSED";
    playAudioAlert('alarm');

    let incidentType = "Pipeline Burst & Leakage";
    let incidentTypeBn = "পাইপ ফেটে মারাত্মক লিকেজ";
    let toastTitle = i18n[AppState.lang].toast_burst_title;
    let toastDesc = i18n[AppState.lang].toast_burst_desc;

    if (nodeB.telemetry.ph < 5.5) {
      incidentType = "Corrosive Acid Intrusion (pH 4.1)";
      incidentTypeBn = "ক্ষতিকর এসিড দূষণ (pH ৪.১)";
      toastTitle = i18n[AppState.lang].toast_acid_title;
      toastDesc = i18n[AppState.lang].toast_acid_desc;
    } else if (nodeB.telemetry.turbidity_ntu > 20) {
      incidentType = "High Turbidity Mud Intrusion";
      incidentTypeBn = "ঘোলাটে কাদা পানির অনুপ্রবেশ";
      toastTitle = i18n[AppState.lang].toast_mud_title;
      toastDesc = i18n[AppState.lang].toast_mud_desc;
    }

    const incident = {
      id: "INC-" + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString(),
      type_en: incidentType,
      type_bn: incidentTypeBn,
      action_en: "Autonomous Solenoid Valve Cut-Off (240ms)",
      action_bn: "স্বয়ংক্রিয় সোলেনয়েড ভালভ বন্ধ (২৪০ মি.সে.)"
    };

    AppState.analytics.active_incidents.unshift(incident);
    triggerPushToast(toastTitle, toastDesc);
  }
}

// Push Notification Toast
function triggerPushToast(title, desc) {
  const toast = document.getElementById('alertToast');
  if (!toast) return;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastDesc').textContent = desc;
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 6000);
}

// Live Ticker (Updates flow metrics & savings dynamically)
function tickSimulation() {
  // If in 'normal' state, simulate natural real-world sensor micro-fluctuations
  if (AppState.activePreset === 'normal') {
    AppState.nodes.forEach(node => {
      if (node.status === "NORMAL") {
        const pJitter = (Math.random() - 0.5) * 0.3;
        const fJitter = (Math.random() - 0.5) * 0.5;
        const phJitter = (Math.random() - 0.5) * 0.04;
        const turbJitter = (Math.random() - 0.5) * 0.12;
        const tdsJitter = Math.round((Math.random() - 0.5) * 2);

        node.telemetry.pressure_psi = Math.max(30, Math.round((node.telemetry.pressure_psi + pJitter) * 10) / 10);
        node.telemetry.flow_rate_lpm = Math.max(80, Math.round((node.telemetry.flow_rate_lpm + fJitter) * 10) / 10);
        node.telemetry.ph = Math.max(7.15, Math.min(7.45, Math.round((node.telemetry.ph + phJitter) * 100) / 100));
        node.telemetry.turbidity_ntu = Math.max(1.8, Math.min(2.8, Math.round((node.telemetry.turbidity_ntu + turbJitter) * 10) / 10));
        node.telemetry.tds_ppm = Math.max(185, Math.min(205, node.telemetry.tds_ppm + tdsJitter));
      }
    });
  }

  // Accumulate water and financial savings
  if (AppState.analytics.current_leak_rate_lpm > 0) {
    const activeNode = AppState.nodes[1];
    if (activeNode.valve.status === "OPEN") {
      AppState.analytics.lost_liters_current_session += Math.round(AppState.analytics.current_leak_rate_lpm / 30);
    } else {
      AppState.analytics.total_water_saved_liters += Math.round(AppState.analytics.current_leak_rate_lpm / 30);
      AppState.analytics.financial_savings_bdt += (AppState.analytics.current_leak_rate_lpm / 30) * 0.0165;
    }
  }

  evaluatePredictiveEngine();
  renderDashboard();
}

// Apply 100% of Translations to HTML Elements
function applyTranslations() {
  const dict = i18n[AppState.lang];
  const isBn = AppState.lang === 'bn';

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update Language Button label
  document.getElementById('langBtnText').textContent = isBn ? 'English' : 'বাংলা';

  // Update Sound Toggle label
  document.getElementById('soundToggleBtn').textContent = AppState.soundEnabled ? dict.sound_mute : dict.sound_unmute;

  // Update SVG Digital Twin text
  const svgRes = document.getElementById('svgReservoirText');
  const svgCity = document.getElementById('svgCityGridText');
  const svgBurst = document.getElementById('svgPipeBurstText');
  if (svgRes) svgRes.textContent = dict.svg_reservoir;
  if (svgCity) svgCity.textContent = dict.svg_city;
  if (svgBurst) svgBurst.textContent = dict.svg_burst;

  // Update Sector Name in Twin
  const twinSector = document.getElementById('twinSectorName');
  if (twinSector) twinSector.textContent = dict.digital_twin_sector;
}

// Render Dashboard UI Elements
function renderDashboard() {
  const dict = i18n[AppState.lang];
  const isBn = AppState.lang === 'bn';
  const selectedNode = AppState.nodes.find(n => n.id === AppState.selectedNodeId) || AppState.nodes[1];
  const wqi = calculateWQI(selectedNode.telemetry);

  // 1. Apply all language translations
  applyTranslations();

  // 2. WQI Circular Gauge Card
  const wqiVal = document.getElementById('wqiValue');
  if (wqiVal) {
    wqiVal.textContent = wqi.score;
    wqiVal.style.color = wqi.color;
    document.getElementById('wqiGrade').textContent = `Grade ${wqi.grade}`;
    document.getElementById('wqiStatus').textContent = dict[wqi.statusKey];
    document.getElementById('wqiStatus').style.color = wqi.color;
    document.getElementById('wqiCircleProgress').style.strokeDashoffset = 283 - (283 * (wqi.score / 100));
    document.getElementById('wqiCircleProgress').style.stroke = wqi.color;
  }

  // 3. Sensor Readout Badges (pH, Turbidity, Pressure, Flow, Temp, TDS)
  document.getElementById('valPressure').textContent = `${selectedNode.telemetry.pressure_psi.toFixed(1)} PSI`;
  document.getElementById('valUpstreamFlow').textContent = `${AppState.nodes[0].telemetry.flow_rate_lpm.toFixed(1)} L/m`;
  document.getElementById('valFlow').textContent = `${selectedNode.telemetry.flow_rate_lpm.toFixed(1)} L/m`;
  document.getElementById('valPH').textContent = selectedNode.telemetry.ph.toFixed(1);
  document.getElementById('valTurbidity').textContent = `${selectedNode.telemetry.turbidity_ntu.toFixed(1)} NTU`;
  document.getElementById('valTemp').textContent = `${selectedNode.telemetry.temperature_c.toFixed(1)} °C`;
  document.getElementById('valTDS').textContent = `${selectedNode.telemetry.tds_ppm} ppm`;

  // Highlight abnormal sensor badges
  document.getElementById('valPH').className = (selectedNode.telemetry.ph < 6.5 || selectedNode.telemetry.ph > 8.5) 
    ? 'text-rose-400 font-bold animate-pulse' : 'text-cyan-400 font-semibold';
  document.getElementById('valTurbidity').className = (selectedNode.telemetry.turbidity_ntu > 5.0) 
    ? 'text-rose-400 font-bold animate-pulse' : 'text-cyan-400 font-semibold';

  // 4. AI Leak Prediction Card
  const aiProb = selectedNode.ai_leak_prob || 4;
  document.getElementById('aiLeakProb').textContent = `${aiProb}%`;
  const leakBar = document.getElementById('aiLeakBar');
  leakBar.style.width = `${aiProb}%`;
  
  const aiStatusEl = document.getElementById('aiLeakStatus');
  if (aiProb > 75) {
    leakBar.className = 'h-full bg-rose-500 transition-all duration-500 shadow-[0_0_12px_#f43f5e]';
    aiStatusEl.textContent = dict.ai_status_crit;
    aiStatusEl.className = "text-xs font-semibold text-rose-400";
  } else if (aiProb > 30) {
    leakBar.className = 'h-full bg-amber-500 transition-all duration-500';
    aiStatusEl.textContent = dict.ai_status_warn;
    aiStatusEl.className = "text-xs font-semibold text-amber-400";
  } else {
    leakBar.className = 'h-full bg-emerald-500 transition-all duration-500';
    aiStatusEl.textContent = dict.ai_status_norm;
    aiStatusEl.className = "text-xs font-semibold text-emerald-400";
  }

  // 5. Automated Valve Status Badge & Controls
  const valve = selectedNode.valve;
  const valveBtn = document.getElementById('valveStatusBtn');
  const valveText = document.getElementById('valveStatusText');
  const valveModeBadge = document.getElementById('valveModeBadge');
  
  if (valve.status === "OPEN") {
    valveBtn.className = "valve-badge valve-open cursor-pointer mb-2 transition-all";
    valveText.textContent = dict.valve_open;
  } else {
    valveBtn.className = "valve-badge valve-closed cursor-pointer mb-2 transition-all";
    valveText.textContent = dict.valve_closed;
  }
  valveModeBadge.textContent = valve.mode === "AUTO" ? dict.auto_mode : dict.manual_mode;

  // 6. Solar & Energy Telemetry
  document.getElementById('solarVolts').textContent = `${selectedNode.solar.panel_volts.toFixed(1)}V`;
  document.getElementById('batteryPct').textContent = `${selectedNode.solar.battery_pct}%`;
  document.getElementById('chargingMa').textContent = `${selectedNode.solar.charging_ma} mA`;
  
  // Power mode text
  const powerModeEl = document.getElementById('powerMode');
  if (selectedNode.solar.battery_pct < 20) {
    powerModeEl.textContent = dict.mode_sleep;
    powerModeEl.className = "text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse";
  } else if (selectedNode.solar.battery_pct < 80) {
    powerModeEl.textContent = dict.mode_eco;
    powerModeEl.className = "text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30";
  } else {
    powerModeEl.textContent = dict.mode_high;
    powerModeEl.className = "text-xs font-semibold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  }
  document.getElementById('batteryFill').style.width = `${selectedNode.solar.battery_pct}%`;

  // 7. Water Savings & Financial ROI Calculator (Both USD & BDT)
  document.getElementById('totalWaterSaved').textContent = `${AppState.analytics.total_water_saved_liters.toLocaleString()} L`;
  
  const bdtVal = Math.round(AppState.analytics.financial_savings_bdt);
  const usdVal = (AppState.analytics.financial_savings_bdt / 120.0).toFixed(2);
  
  const elUsd = document.getElementById('financialSavedUSD');
  const elBdt = document.getElementById('financialSavedBDT');
  if (elUsd) elUsd.textContent = `$ ${usdVal} USD`;
  if (elBdt) elBdt.textContent = `≈ ৳ ${bdtVal.toLocaleString()} BDT`;
  
  const elOld = document.getElementById('financialSaved');
  if (elOld) elOld.textContent = `$ ${usdVal} (৳ ${bdtVal.toLocaleString()})`;
  
  document.getElementById('currentLossRate').textContent = `${AppState.analytics.current_leak_rate_lpm} L/min`;

  // 8. Digital Twin Pipeline Visualizer SVG
  updateDigitalTwinSVG(selectedNode);

  // 9. Interactive GPS Map
  drawGPSMap();

  // 10. Update Incident Log Table
  renderIncidentLog();
}

// Update the Digital Twin Pipeline SVG
function updateDigitalTwinSVG(node) {
  const dict = i18n[AppState.lang];
  const isBurst = (node.status === "CRITICAL_LEAK");
  const isValveClosed = (node.valve.status === "CLOSED");

  const coreA = document.getElementById('flowCoreA');
  const coreB = document.getElementById('flowCoreB');
  const leakSpray = document.getElementById('leakSprayGroup');
  const valveIcon = document.getElementById('twinValveIcon');
  const twinValveText = document.getElementById('twinValveText');

  if (isValveClosed) {
    coreA.setAttribute('class', 'water-flow-core');
    coreB.setAttribute('class', 'water-flow-core stopped');
    if (leakSpray) leakSpray.style.display = 'none';
    if (valveIcon) valveIcon.setAttribute('fill', '#f43f5e');
    if (twinValveText) twinValveText.textContent = dict.valve_closed;
  } else if (isBurst) {
    coreA.setAttribute('class', 'water-flow-core leak');
    coreB.setAttribute('class', 'water-flow-core leak');
    if (leakSpray) leakSpray.style.display = 'block';
    if (valveIcon) valveIcon.setAttribute('fill', '#10b981');
    if (twinValveText) twinValveText.textContent = dict.valve_open;
  } else {
    coreA.setAttribute('class', 'water-flow-core');
    coreB.setAttribute('class', 'water-flow-core');
    if (leakSpray) leakSpray.style.display = 'none';
    if (valveIcon) valveIcon.setAttribute('fill', '#10b981');
    if (twinValveText) twinValveText.textContent = dict.valve_open;
  }
}

// Draw Canvas GPS Fault Map (High-tech Vector Map with Dhaka Grid Coordinates)
function drawGPSMap() {
  const canvas = document.getElementById('gpsMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth;
  const h = canvas.height = canvas.parentElement.clientHeight;

  // Background Dark Grid
  ctx.fillStyle = '#0a101f';
  ctx.fillRect(0, 0, w, h);

  // City Grid Lines (Map roads/canals)
  ctx.strokeStyle = 'rgba(30, 58, 95, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Draw Pipeline Polyline Network between Nodes
  const nodeCoords = [
    { x: w * 0.18, y: h * 0.30, node: AppState.nodes[0] }, // Node 1 (Intake)
    { x: w * 0.45, y: h * 0.48, node: AppState.nodes[1] }, // Node 2 (Junction)
    { x: w * 0.72, y: h * 0.62, node: AppState.nodes[2] }, // Node 3 (Residential)
    { x: w * 0.88, y: h * 0.82, node: AppState.nodes[3] }  // Node 4 (Terminal)
  ];

  // Pipeline path
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 0; i < nodeCoords.length - 1; i++) {
    const from = nodeCoords[i];
    const to = nodeCoords[i + 1];
    const isLeakSegment = (to.node.status === "CRITICAL_LEAK");

    ctx.strokeStyle = isLeakSegment ? '#f43f5e' : '#0284c7';
    ctx.shadowBlur = isLeakSegment ? 15 : 6;
    ctx.shadowColor = isLeakSegment ? '#f43f5e' : '#38bdf8';

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.shadowBlur = 0; // reset

  // Draw Node Markers & Status Rings
  nodeCoords.forEach((item) => {
    const isCritical = (item.node.status === "CRITICAL_LEAK" || item.node.status === "CONTAMINATED");
    const isWarning = (item.node.status === "WARNING");
    const isSelected = (item.node.id === AppState.selectedNodeId);

    // Radar pulse animation on fault node
    if (isCritical) {
      const pulseSize = 25 + Math.sin(Date.now() / 200) * 8;
      ctx.beginPath();
      ctx.arc(item.x, item.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Outer node circle
    ctx.beginPath();
    ctx.arc(item.x, item.y, isSelected ? 12 : 9, 0, Math.PI * 2);
    ctx.fillStyle = isCritical ? '#f43f5e' : (isWarning ? '#f59e0b' : '#10b981');
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isSelected ? 3 : 1.5;
    ctx.stroke();

    // Node Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`${item.node.id}`, item.x + 14, item.y - 4);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    const sectorLabel = AppState.lang === 'bn' ? item.node.location.sector_bn : item.node.location.sector;
    ctx.fillText(sectorLabel, item.x + 14, item.y + 10);
  });
}

// Strict XSS Sanitizer for Dynamic Content
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render Incident History Table in Selected Language (XSS-Safe)
function renderIncidentLog() {
  const tbody = document.getElementById('incidentTableBody');
  if (!tbody) return;
  const isBn = AppState.lang === 'bn';
  const dict = i18n[AppState.lang];

  if (AppState.analytics.active_incidents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-3 text-center text-slate-500 text-xs">${escapeHtml(dict.log_empty)}</td></tr>`;
    return;
  }

  tbody.innerHTML = AppState.analytics.active_incidents.map(inc => `
    <tr class="border-b border-slate-800 hover:bg-slate-800/40 text-xs">
      <td class="px-4 py-2 text-rose-400 font-mono font-bold">${escapeHtml(inc.id)}</td>
      <td class="px-4 py-2 text-slate-300">${escapeHtml(inc.time)}</td>
      <td class="px-4 py-2 text-amber-300">${escapeHtml(isBn ? inc.type_bn : inc.type_en)}</td>
      <td class="px-4 py-2 text-emerald-400 font-medium">${escapeHtml(isBn ? inc.action_bn : inc.action_en)}</td>
    </tr>
  `).join('');
}

// Reset Both Nodes to Clean Operational Baseline
function resetAllNodesToCleanBaseline() {
  const nodeA = AppState.nodes[0];
  const nodeB = AppState.nodes[1];

  // Reset Node 1 (Intake)
  nodeA.telemetry.pressure_psi = 58.4;
  nodeA.telemetry.flow_rate_lpm = 125.0;
  nodeA.telemetry.ph = 7.4;
  nodeA.telemetry.turbidity_ntu = 2.1;
  nodeA.telemetry.tds_ppm = 185;
  nodeA.telemetry.temperature_c = 24.5;
  nodeA.solar.battery_pct = 98;
  nodeA.solar.panel_volts = 18.2;
  nodeA.solar.charging_ma = 840;
  nodeA.valve.status = "OPEN";
  nodeA.valve.mode = "AUTO";
  nodeA.status = "NORMAL";
  nodeA.ai_leak_prob = 3;

  // Reset Node 2 (Sector B Trunk)
  nodeB.telemetry.pressure_psi = 54.2;
  nodeB.telemetry.flow_rate_lpm = 119.0;
  nodeB.telemetry.ph = 7.32;
  nodeB.telemetry.turbidity_ntu = 2.2;
  nodeB.telemetry.tds_ppm = 195;
  nodeB.telemetry.temperature_c = 24.8;
  nodeB.solar.battery_pct = 92;
  nodeB.solar.panel_volts = 17.8;
  nodeB.solar.charging_ma = 790;
  nodeB.valve.status = "OPEN";
  nodeB.valve.mode = "AUTO";
  nodeB.status = "NORMAL";
  nodeB.ai_leak_prob = 4;

  AppState.analytics.current_leak_rate_lpm = 0;
}

// Demo Presets Handler (100% Conflict-Free Fault Injection)
function triggerPreset(presetName) {
  AppState.activePreset = presetName;
  playAudioAlert('beep');

  // Highlight active button
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetName);
  });

  // Always reset to clean baseline first to eliminate leftover state from previous presets!
  resetAllNodesToCleanBaseline();

  const nodeB = AppState.nodes[1];

  if (presetName === 'normal') {
    // Already cleanly reset to normal above
  } else if (presetName === 'burst') {
    // 1. Catastrophic Pipe Burst: Huge pressure drop, flow starvation, leak spike!
    nodeB.telemetry.pressure_psi = 18.2;
    nodeB.telemetry.flow_rate_lpm = 62.0; // 125 in - 62 out = 63 LPM leaking!
    nodeB.ai_leak_prob = 98;
    nodeB.status = "CRITICAL_LEAK";
    AppState.analytics.current_leak_rate_lpm = 63.0;
  } else if (presetName === 'microleak') {
    // 2. Micro-Fissure: Predictive anomaly warning before burst
    nodeB.telemetry.pressure_psi = 46.0;
    nodeB.telemetry.flow_rate_lpm = 104.0;
    nodeB.ai_leak_prob = 74;
    nodeB.status = "WARNING";
    AppState.analytics.current_leak_rate_lpm = 21.0;
  } else if (presetName === 'acid') {
    // 3. Acid Contamination: Hydraulics normal, pH plummets, WQI drops, valve trips!
    nodeB.telemetry.ph = 4.1;
    nodeB.telemetry.turbidity_ntu = 4.2;
    nodeB.telemetry.tds_ppm = 380;
    nodeB.status = "CONTAMINATED";
  } else if (presetName === 'mud') {
    // 4. Mud / Silt Intrusion: Turbidity spikes to 84.5 NTU!
    nodeB.telemetry.ph = 7.2;
    nodeB.telemetry.turbidity_ntu = 84.5;
    nodeB.telemetry.tds_ppm = 820;
    nodeB.status = "CONTAMINATED";
  } else if (presetName === 'solar') {
    // 5. Solar Drain: Water normal, but solar battery drops to critical 14%
    nodeB.solar.battery_pct = 14;
    nodeB.solar.panel_volts = 9.2;
    nodeB.solar.charging_ma = 35;
  }

  evaluatePredictiveEngine();
  renderDashboard();
}

// WhatsApp Alert Message Generator with Pre-filled URL
function generateWhatsAppAlert() {
  const node = AppState.nodes[1];
  const isBn = AppState.lang === 'bn';
  const sector = isBn ? node.location.sector_bn : node.location.sector;
  const status = isBn ? (node.status === "NORMAL" ? "স্বাভাবিক" : "বিপদজনক") : node.status;
  
  const text = encodeURIComponent(
    `🚨 *HydroSense AI - Emergency Water Alert!*\n` +
    `Sector: ${sector}\n` +
    `Node ID: ${node.id}\n` +
    `Status: ${status}\n` +
    `Pressure: ${node.telemetry.pressure_psi.toFixed(1)} PSI | Flow: ${node.telemetry.flow_rate_lpm.toFixed(1)} L/min\n` +
    `WQI Score: ${calculateWQI(node.telemetry).score} / 100\n` +
    `Valve State: ${node.valve.status}\n` +
    `GPS Coordinates: https://maps.google.com/?q=${node.location.lat},${node.location.lng}\n` +
    `Autonomous Action: Solenoid Valve Closed to halt wastage.`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// Google Maps Dispatch Navigation
function openGoogleMapsDirections() {
  const node = AppState.nodes[1];
  window.open(`https://www.google.com/maps/search/?api=1&query=${node.location.lat},${node.location.lng}`, '_blank');
}

// Toggle Valve (Manual Override)
function toggleValveManual() {
  const node = AppState.nodes.find(n => n.id === AppState.selectedNodeId) || AppState.nodes[1];
  playAudioAlert('beep');
  node.valve.status = node.valve.status === "OPEN" ? "CLOSED" : "OPEN";
  renderDashboard();
}

// Toggle Valve Mode (Auto vs Manual)
function toggleValveMode() {
  const node = AppState.nodes.find(n => n.id === AppState.selectedNodeId) || AppState.nodes[1];
  playAudioAlert('beep');
  node.valve.mode = node.valve.mode === "AUTO" ? "MANUAL" : "AUTO";
  renderDashboard();
}

// Print Official Municipal Report
function printComplianceReport() {
  const dateEl = document.getElementById('printDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleString();
  window.print();
}

// Toggle Language (Bangla / English) - 100% Comprehensive Conversion
function toggleLanguage() {
  AppState.lang = AppState.lang === 'bn' ? 'en' : 'bn';
  playAudioAlert('beep');
  renderDashboard();
}

// Toggle Sound Alarm
function toggleSound() {
  AppState.soundEnabled = !AppState.soundEnabled;
  const dict = i18n[AppState.lang];
  document.getElementById('soundToggleBtn').textContent = AppState.soundEnabled ? dict.sound_mute : dict.sound_unmute;
}

// Setup Event Listeners & Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  setInterval(tickSimulation, 2200);

  // Bind Preset Click Events
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerPreset(btn.dataset.preset);
    });
  });

  // Try connecting to Node server SSE stream if available
  try {
    const sse = new EventSource('/api/stream');
    sse.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.state && msg.state.nodes) {
          AppState.nodes = msg.state.nodes;
          renderDashboard();
        }
      } catch (err) {}
    };
  } catch (e) {
    console.log("Running in autonomous client simulation mode.");
  }
});
