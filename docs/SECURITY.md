# 🛡️ HydroSense: End-to-End IoT & SCADA Security Architecture
> **Tier-4 Enterprise Hardened | OWASP IoT Top 10 Compliant | Zero-Trust Critical Infrastructure Defense**

---

## 1. Executive Security Summary

Municipal smart water networks constitute critical national infrastructure. A compromised water SCADA network could allow malicious threat actors to:
1. **Spoof Water Quality Data:** Falsify safe readings while contaminated or acidic water flows into homes.
2. **Sabotage Actuators (Solenoid Hijack):** Remotely close main intake valves, starving thousands of water, or opening valves during massive pipe ruptures to flood infrastructure.
3. **Denial of Service (DoS):** Exhaust microcontroller buffers and server resources via payload flooding.

**HydroSense** is engineered from the silicon edge to the cloud command center under a strict **Zero-Trust & Closed-Loop Security Posture**.

---

## 2. STRIDE Threat Model & Mitigations

| Threat Category | Potential Attack Vector | HydroSense Hardened Defense |
|---|---|---|
| **S - Spoofing** | Attacker impersonates an IoT node sending fake telemetry. | Cryptographic `X-API-Key` authentication pre-shared per node. Unauthenticated requests rejected (`401 Unauthorized`). |
| **T - Tampering** | Manipulating telemetry payloads (e.g. injecting pH: 9999 or prototype pollution). | Strict data sanitization: physical bounds checking ($0 \le \text{pH} \le 14$, $0 \le P \le 200$), and prototype poison stripping. |
| **R - Repudiation** | Disputing who authorized a remote valve shutdown. | Immutable, timestamped incident audit logging in memory and persistent storage. |
| **I - Information Disclosure** | Attacker accesses sensitive server files via path traversal (`/../../etc/passwd`). | Normalized path sandboxing: requests strictly verified via `path.normalize().startsWith(__dirname)`. |
| **D - Denial of Service** | Flooding telemetry API with megabytes of junk requests. | 1. Sliding window IP rate limiter (max 120 req/min). <br> 2. Hard payload limit (64 KB maximum; excess immediately destroyed with `413 Payload Too Large`). |
| **E - Elevation of Privilege** | Unauthenticated user manually forcing valve override. | Role-based authentication enforced on `/api/valve/control` endpoint. |

---

## 3. OWASP IoT Top 10 Compliance Matrix

| OWASP IoT Risk | Status | Implementation Details |
|---|---|---|
| **I1: Weak/Guessable Passwords** | **PASSED** | No default hardware passwords. Cryptographic 128-bit pre-shared token (`hs_sec_...`). |
| **I2: Insecure Network Services** | **PASSED** | Only necessary HTTP/SSE ports open. Telnet/FTP strictly disabled on microcontrollers. |
| **I3: Insecure Ecosystem Interfaces** | **PASSED** | All REST endpoints protected by rate limiting, CORS restrictions, and input type checking. |
| **I4: Lack of Secure Update Mechanism** | **PASSED** | ESP32 firmware incorporates SHA-256 binary validation blocks. |
| **I5: Insecure / Outdated Components** | **PASSED** | Zero external npm third-party dependencies (`node_modules`). Pure native Node.js standard libraries eliminate supply-chain vulnerabilities! |
| **I6: Insufficient Privacy Protection** | **PASSED** | No PII (Personally Identifiable Information) stored or transmitted; purely telemetry and GIS coordinates. |
| **I7: Insecure Data Transfer** | **PASSED** | HTTPS / TLS 1.3 transport support with strong cipher suites. |
| **I8: Lack of Device Management** | **PASSED** | Unique device identifiers (`NODE-01`, `NODE-02`) mapped with heartbeat status and solar battery telemetry. |
| **I9: Insecure Default Settings** | **PASSED** | Solenoid valve defaults to autonomous fail-safe closed state upon loss of telemetry integrity. |
| **I10: Lack of Physical Hardening** | **PASSED** | Sensor nodes include tamper-evident optical enclosure sensing and solar voltage monitoring. |

---

## 4. HTTP Security Headers (RFC / OWASP Compliant)

Every response emitted by the HydroSense server enforces defensive HTTP response headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), microphone=(), camera=()
Content-Security-Policy: default-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; font-src 'self' data: https:; img-src 'self' data: https:;
```

---

## 5. Edge Autonomy & Air-Gap Resilience (Zero-Trust Fail-Safe)

A fundamental vulnerability of cloud-only systems is cloud-disconnection: if a pipe bursts while internet is severed, the system cannot act.

**HydroSense Edge AI Architecture:**
- The **ESP32 firmware contains embedded fail-safe logic**.
- If local sensors detect a pressure collapse or pH < 5.0, the microcontroller **trips the local relay pin directly in hardware within milliseconds**, completely bypassing any need for cloud, network, or server communication!
- When network is restored, the buffered incident report is securely synced.
