# Rukmani Arena Incentive Calculator

Separate Arena incentive calculator for Rukmani Motors, based on the October 2026 Arena incentive policy supplied by the dealership.

## Important
- This repository is intentionally separate from `RukmaniNEXA-Incentive-Calculator`.
- Vehicle/model/variant master is based only on the supplied Arena price list dated 19-09-2026.
- October 2026 policy values are isolated in `app.js` so later scheme changes can be made without touching the vehicle master.
- Current implementation includes RM/SRM incentive, Victoris incentive, higher-variant spot, Victoris sunroof spot, booking incentive, exchange, EW and MSGA/MGA calculations.
- Finance Spot is retained as a selection but is marked **Pending policy** because no finance incentive value was present in the supplied Arena policy.
- Tour-segment models from the supplied price list are included as separate model groups.

## Qualification
The supplied policy states: RM > 3 months qualifying condition = minimum 3 cars and retail of 1 Victoris in October. The calculator therefore shows the calculated opportunity but only unlocks the final potential when this condition is met. No additional deduction has been invented.
