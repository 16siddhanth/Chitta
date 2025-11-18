<div align="center">

# 🌿 Chitta — Vedic-Inspired Emotional Studio

Mindful wellbeing powered by the tri-guna model, compassionate AI, and privacy-first local storage.

</div>

## Table of Contents
1. [Vision & Principles](#vision--principles)
2. [Feature Highlights](#feature-highlights)
3. [Architecture & Stack](#architecture--stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Emotional Model Reference](#emotional-model-reference)
7. [Interventions & Scripture Links](#interventions--scripture-links)
8. [Privacy & Data Stewardship](#privacy--data-stewardship)
9. [Contributing & Next Steps](#contributing--next-steps)

---

## Vision & Principles
Chitta blends Vedic psychology and modern UX to help people notice, name, and nourish their inner climate. Every decision follows four principles:

- **Tri-guna intelligence** – map Sattva, Rajas, and Tamas using transparent formulas documented in `vedic-model.md`.
- **Micro, actionable rituals** – present 3–7 minute practices that can be completed during a break.
- **Warm, contextual AI** – Aaranya (Gemini-powered) responds with scripture-informed empathy when the user opts into context sharing.
- **Local-first trust** – emotional history is stored on-device; cloud calls only happen for chat completions.

---

## Feature Highlights
- **Daily emotional mapping** – sliders in `app/emotional-mapping/page.tsx` capture clarity, peace, drive, and inertia, then normalize into guna percentages.
- **Insight dashboards** – `/insights` and `/insights/latest` visualize trends, streaks, and recommended interventions.
- **Guided interventions** – `/interventions` pairs breath, mantra, journaling, and movement practices with real-time timers and scripture references.
- **Aaranya chat companion** – `/chat` streams Gemini responses shaped by the latest check-ins plus moderation context.
- **Offline-friendly PWA** – `public/manifest.json` and `public/sw.js` keep the app installable and functional without connectivity.
- **Vedic documentation** – `/docs/vedic-model` exposes the computation pipeline, slider mapping, and sacred source material.

---

## Architecture & Stack

| Layer | Details |
| --- | --- |
| Framework | Next.js 15 / React 19 with the App Router. |
| Styling | Tailwind CSS, CSS variables, custom gradients, and Radix UI primitives. |
| Data | IndexedDB/localStorage via helpers in `lib/storage.ts`; interventions tracked in `lib/interventions.ts`. |
| AI | `app/api/chat/route.ts` calls `gemini-2.5-flash` through `@google/genai` using `GEMINI_API_KEY`. |
| Charts | Recharts (`components/emotional-trends.tsx`) for weekly trendlines. |
| State hooks | Custom hooks under `hooks/` encapsulate emotional data, offline state, and PWA prompts. |

---

## Project Structure

```
app/
  emotional-mapping/        # Daily check-in flow
  insights/                 # Dashboard + latest snapshot
  docs/vedic-model          # In-app documentation reader
  api/chat                  # Gemini response endpoint
components/
  guna-orbit.tsx            # Animated tri-guna visual
  emotional-trends.tsx      # Recharts wrapper
  ui/                       # Radix-based design system
lib/
  emotional-model.ts        # Slider → guna formula + recommendations
  interventions.ts          # Practice catalog + scripture references
  chat-context.ts           # Context payload for Gemini
public/
  manifest.json, sw.js      # PWA essentials
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Google Gemini API key (`GEMINI_API_KEY`)

### Installation & Local Dev

```bash
pnpm install
cp .env.example .env.local   # create if the file is missing; ensure GEMINI_API_KEY is set
pnpm dev
```

Visit `http://localhost:3000` to open the studio. The chat route requires the environment variable at runtime.

### Useful Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the Next.js dev server with hot reload. |
| `pnpm lint` | Execute the Next.js/ESLint config. |
| `pnpm build && pnpm start` | Create a production build and serve it locally. |

---

## Emotional Model Reference

The full derivations live in [`vedic-model.md`](./vedic-model.md) and are rendered in-app at `/docs/vedic-model`. Highlights:

- Sliders are grouped by guna affinity (clarity & peace → Sattva, energy/restlessness → Rajas, inertia → Tamas).
- `lib/emotional-model.ts` smooths sliders with counter-weights, enforces a normalization floor, and computes `balanceIndex` and confidence.
- Recommendations call `recommendInterventions`, which examines the dominant guna plus the balance score to choose calming, energizing, uplifting, or integrative rituals.

Keep the document and the formulas in sync whenever the model changes.

---

## Interventions & Scripture Links

`lib/interventions.ts` exports `INTERVENTION_SCRIPTURE_REFERENCES`, tying each guided practice to Bhagavad Gita anchors:

- **Sattva** – gratitude reflection (BG 17.15, 10.41), mindful awareness (BG 6.26), vision clarity (BG 2.41/18.45).
- **Rajas** – alternate nostril breath (BG 4.29, 5.27-28), calming breath (BG 4.29), focus mantra (BG 8.13, 9.14).
- **Tamas** – energizing breath (BG 3.30, 6.16-17), body scan activation (BG 6.11-13), gentle movement (BG 3.7, 6.16).

Components like the interventions detail page can surface these metadata to explain “why this practice.”

---

## Privacy & Data Stewardship
- Emotional entries, chat memory, and intervention sessions are stored locally via IndexedDB/localStorage utilities.
- PWA service worker keeps data accessible offline; users can clear it at any time from settings.
- The only outbound request is the `/api/chat` route when a user initiates a conversation; payloads include context only if consent is granted.
- Future enhancements include optional encrypted sync so multiple devices can share the same log without compromising privacy.

---

## Contributing & Next Steps
1. Fork or branch off `main`.
2. Run `pnpm lint` before submitting PRs.
3. Document any emotional-model changes both in code and `vedic-model.md`.

**Roadmap ideas**
1. Wearable ingestion adapters (HealthKit/Fitbit) using the existing `WearableInputs` types.
2. Export/import of emotional history JSON.
3. Expanded intervention studio with audio guidance and streak tracking.

Chitta is a living experiment in modern wellbeing rooted in timeless wisdom—feel free to open issues with ideas, scripture clarifications, or UX polish suggestions.

