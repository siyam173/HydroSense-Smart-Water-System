# 🧪 Water Quality Index (WQI) Mathematical Model
*Based on Weighted Arithmetic Index Method (Brown et al., 1972 & WHO Guidelines)*

---

## 1. Mathematical Formulation

Water Quality Index (WQI) aggregates multiple physico-chemical water parameters into a single composite numerical rating between 0 and 100.

The formula is expressed as:
$$WQI = \frac{\sum_{i=1}^{n} q_i \cdot W_i}{\sum_{i=1}^{n} W_i}$$

Where:
- $n$ = Number of water quality parameters evaluated.
- $q_i$ = Quality rating or sub-index for the $i$-th parameter.
- $W_i$ = Unit weight factor assigned to the $i$-th parameter based on its health importance.

---

## 2. Parameter Standards & Weights

| Parameter | Ideal Value ($V_{ideal}$) | Permissible Limit ($S_i$) | Unit Weight ($W_i$) | Relative Weight ($w_i$) |
|---|---|---|---|---|
| **pH** | 7.0 | 6.5 – 8.5 | 4 | 0.333 |
| **Turbidity (NTU)** | 0.0 NTU | 5.0 NTU | 3 | 0.250 |
| **TDS (Total Dissolved Solids)** | 0.0 ppm | 300 ppm | 2 | 0.167 |
| **Temperature (°C)** | 25.0 °C | 30.0 °C | 1 | 0.083 |
| **Dissolved Oxygen (DO mg/L)**| 14.6 mg/L | 5.0 mg/L | 2 | 0.167 |
| **Total** | - | - | **12** | **1.000** |

---

## 3. Sub-Index Calculation ($q_i$)

For most chemical parameters where zero or neutral is ideal:
$$q_i = \left( \frac{V_i - V_{ideal}}{S_i - V_{ideal}} \right) \times 100$$

For **pH**:
$$q_{pH} = \left( \frac{|V_{pH} - 7.0|}{8.5 - 7.0} \right) \times 100$$

For **Dissolved Oxygen (DO)**:
$$q_{DO} = \left( \frac{14.6 - V_{DO}}{14.6 - 5.0} \right) \times 100$$

---

## 4. WQI Rating Classification Scale

| WQI Score Range | Water Quality Status | Practical Recommendation | UI Badge Color |
|---|---|---|---|
| **90 – 100** | **Excellent (Grade A)** | Safe for direct consumption | Emerald Green (#10B981) |
| **70 – 89** | **Good (Grade B)** | Safe for drinking and cooking | Cyan Blue (#06B6D4) |
| **50 – 69** | **Poor (Grade C)** | Filtration/Boiling required | Amber Orange (#F59E0B) |
| **25 – 49** | **Very Poor (Grade D)**| Domestic / Irrigation only | Rose Red (#F43F5E) |
| **0 – 24** | **Unfit / Toxic (Grade E)** | Hazardous! Automatic Cut-off | Crimson / Dark Red (#991B1B) |
