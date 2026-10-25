# 🤖 AI-Based Leakage Prediction & Anomaly Detection Model

---

## 1. Overview & Hydraulic Principles

Traditional pipeline monitoring relies merely on simple threshold alerts (e.g. "is pressure below 20 PSI?"). However, normal pressure variations occur during peak hours (morning/evening) without any leaks.

HydroSense AI uses a dual-layer predictive architecture:
1. **Hydraulic Mass Balance Analysis (Discrepancy Modeling)**
2. **Dynamic Pressure Gradient Decay ($dP/dt$ Anomaly Vector)**

---

## 2. Mass Balance Equation

In an intact pipe segment between Node $A$ (Upstream) and Node $B$ (Downstream):
$$Q_{in}(t) - Q_{out}(t) = \frac{dV_{pipe}}{dt}$$

Because water is an incompressible fluid ($\rho \approx \text{const}$), in steady state without leakage:
$$Q_A(t) \approx Q_B(t)$$

If a physical leak of discharge $Q_{leak}$ occurs between Node $A$ and Node $B$:
$$Q_{leak} = Q_A(t) - Q_B(t) - \Delta Q_{demand}$$

When the normalized difference exceeds the confidence threshold:
$$\text{Discrepancy Ratio } \delta = \frac{Q_A - Q_B}{Q_A} > \tau_{leak} \quad (\text{typically } \tau = 0.08 \text{ or } 8\%)$$

---

## 3. Pressure Gradient Anomaly Score ($S_P$)

A sudden fissure produces a transient negative pressure wave propagating along the pipeline:
$$\Delta P = \rho \cdot a \cdot \Delta v \quad (\text{Joukowsky's Hydraulic Equation})$$

Where $a$ is acoustic wave speed in water pipe (~$1200\text{ m/s}$) and $\Delta v$ is fluid velocity change.

Our model computes the **Leak Probability Score ($L_p$)**:
$$L_p = \sigma\left( w_1 \cdot \left(\frac{Q_A - Q_B}{Q_A}\right) + w_2 \cdot \left|\frac{dP_B}{dt}\right| + w_3 \cdot \Delta P_{expected} \right) \times 100\%$$

---

## 4. Pre-Rupture Micro-Fissure Early Warning (Predictive)

Micro-fissures often exhibit **hydraulic micro-jitter** (subtle high-frequency pressure oscillation damping) 24 to 72 hours before catastrophic rupture. 
Our Edge AI model computes a **Pipe Stress Degradation Index (PSDI)**:
- **PSDI < 30%**: Pipeline healthy. Normal expansion/contraction.
- **PSDI 30% - 69%**: Moderate wear, minor turbulence detected.
- **PSDI 70% - 89%**: High fatigue! Pre-rupture warning dispatched.
- **PSDI $\ge$ 90%**: Impending structural failure. Auto-throttle valve.
