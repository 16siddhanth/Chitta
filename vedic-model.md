# Chitta Vedic Model

Chitta grounds every check-in, recommendation, and intervention in the tri-guna model described in the Bhagavad Gita (14.5-13) and Samkhya philosophy. This document records how each UI control maps to guna signals, the formulas used inside `lib/emotional-model.ts`, and the scriptural anchors referenced when surfacing interventions.

## Slider-to-Guna Mapping

| Check-in slider | Primary guna | Verse lens | Implementation notes |
| --- | --- | --- | --- |
| Mental Clarity | Sattva | BG 14.11 describes sattva as illuminating and free from impurity. | Combined with low inertia/restlessness to form `clarityBlend` before smoothing. |
| Inner Peace | Sattva | BG 14.6-11 links sattva with steadiness and peace. | Weighted at 0.5 inside `peaceBlend`, also counterbalances rajas when peace dips. |
| Energy Level | Rajas | BG 14.7 ties rajas to movement and passion. | Shares weight with activity/restlessness in `rajasActivation`. |
| Restlessness | Rajas | BG 14.12 names restlessness (rajas) as a sign of attachment and desire. | Inversely affects sattva (through `clarityBlend`) while boosting rajas. |
| Desire for Activity | Rajas | BG 3.5 & 14.7 highlight action-orientation. | Direct input to `rajasActivation`; high activity with low peace tilts toward rajas. |
| Mental Inertia | Tamas | BG 14.8 portrays tamas as inertia, delusion, and lethargy. | Used with low energy/clarity to form `tamasWeight`; floor keeps tamas observable. |

## Computation Flow (`lib/emotional-model.ts`)

1. **Weighted smoothing** – `smoothAverage` blends each slider with contextual counters:
   - `clarityBlend = smoothAverage([clarity, 100 - inertia, 100 - restlessness], [0.45, 0.3, 0.25])`
   - `peaceBlend = smoothAverage([peace, 100 - restlessness, 100 - activity], [0.5, 0.3, 0.2])`
   - `rajasActivation = smoothAverage([energy, activity, restlessness], [0.45, 0.35, 0.2])`
   - `tamasWeight = smoothAverage([inertia, 100 - energy, 100 - clarity], [0.5, 0.3, 0.2])`
2. **Sattva composite** – `sattvaRaw = smoothAverage([clarityBlend, peaceBlend], [0.6, 0.4])` keeps luminosity + calm paired, mirroring BG 14.11’s “light-giving” quality.
3. **Rajas counterbalance** – `rajasCounterbalance = smoothAverage([100 - peace, 100 - clarity], [0.6, 0.4])` prevents false rajas spikes when calm focus is high.
4. **Normalization** – `normalizeTrio` enforces a minimum contribution (`NORMALIZATION_FLOOR = 5`) before re-scaling to 0-100, ensuring no guna is erased entirely (Samkhya asserts all three are always present).
5. **Dominant guna detection** – Highest of the normalized trio becomes `dominantGuna`, matching BG 14.10-13’s guidance that one guna “prevails” over the others moment to moment.
6. **Balance index** – `balanceIndex = 100 - |sattva - rajas| - |sattva - tamas| / 2`, so large spreads reduce harmony. This models BG 14.22-26’s encouragement toward equanimity.
7. **Confidence** – Spread-based confidence plus wearable bonuses (`computeConfidence`) mirrors BG 6.16-17’s reminder that disciplined habits (sleep, food, breath) add reliability to reflection.
8. **Recommendations** – `recommendInterventions` selects up to three practices matching the dominant guna and whether the balance index needs calming, energizing, uplifting, or integration.

## Intervention Scripture Lookup (`lib/interventions.ts`)

| Intervention | Guna | Verse anchors | Theme |
| --- | --- | --- | --- |
| gratitude-reflection | Sattva | BG 17.15 (gentle, truthful speech), BG 10.41 (honouring the sacred in all) | Cultivates appreciative awareness to stabilize sattva. |
| mindful-awareness | Sattva | BG 6.26 (steadily bring the mind back) | Classic dharana/dhyana instruction for luminous awareness. |
| vision-clarity | Sattva | BG 2.41 & 18.45 (single-pointed purpose/dharma) | Visualization to align daily intention with dharma. |
| alternate-nostril | Rajas | BG 4.29 & 5.27-28 (pranayama & sense withdrawal) | Breath ratio harmonizes prana when rajas is spiking. |
| calming-breath | Rajas | BG 4.29 (pranayama sacrifice) | Lengthened exhale relaxes rajasic agitation. |
| focus-mantra | Rajas | BG 8.13 & 9.14 (japa of Om) | Redirects rajasic momentum into mantra repetition. |
| energizing-breath | Tamas | BG 3.30 & 6.16-17 (disciplined action + moderated habits) | Stimulates vital force to disperse tamasic heaviness. |
| body-scan-activation | Tamas | BG 6.11-13 (steady posture, awareness from base to crown) | Sequential attention awakens each locus of awareness. |
| gentle-movement | Tamas | BG 3.7 (yogic action without attachment) | Conscious movement overcomes inertia while keeping intent sattvic. |

These entries drive the exported `INTERVENTION_SCRIPTURE_REFERENCES` table, which other surfaces (tooltips, chat, interventions UI) can query to explain *why* a practice was suggested.

## Reference Notes

- **BG 14.5-13** – Core description of sattva (luminosity), rajas (movement), and tamas (inertia).
- **BG 6.10-28** – Meditation posture, sense withdrawal, breath discipline for stabilizing the mind.
- **BG 17.14-16** – Tapas of body, speech, and mind; used for gratitude and reflection practices.
- **BG 3.5-9 & 3.27** – Necessity of action and disciplined effort, informing rajas/tamas balancing.

Future changes to the emotional model or interventions should update both this document and the code constants so product copy, tooltips, and documentation stay in sync.
