# Data Alchemist — AI Resource‑Allocation Configurator

A beginner‑friendly, fully responsive Next.js 14 + TypeScript web‑app that:
- Ingests **CSV/XLSX** for **clients**, **workers**, **tasks**
- Maps messy headers, normalizes fields, and **validates** relationships
- Lets you **edit inline** in data grids with real‑time validation
- Provides **natural‑language** search & (optional) data modification
- Offers a **Rule Builder** (UI + plain English) to produce **rules.json**
- Lets you set **priorities/weights** (sliders + presets)
- Exports **clean CSVs + rules.json** for downstream allocation engines

---

## 0) TL;DR Quick Start
```bash
npm i
npm run dev
# open http://localhost:3000 and use /samples CSVs
```
Optional (advanced AI): set `OPENAI_API_KEY` in your shell before running `npm run dev`.

---

## 1) Features (Milestones ✅)
### Milestone 1 — Data Ingestion, Validators, In‑App Changes, Natural Language Retrieval
- Upload **CSV/XLSX** for each entity.
- **AI‑lite header mapper** handles misnamed/reordered columns.
- **Editable grids**; cells highlight on validation errors.
- **Validation Summary** panel shows errors/warnings + what to fix.
- **Natural‑language search**: e.g., `tasks longer than 1 phase and having phase 2`.

### Milestone 2 — Rule‑Input UI, Prioritization & Weights, NL → Rules
- Visual **Rule Builder**: Co‑run, Slot‑restriction, Load‑limit, Phase‑window, Pattern‑match, Precedence override.
- **Plain English → rule.json** (regex‑based intent parser, offline by default).
- **Priorities panel**: sliders + presets (Fulfillment, Fairness, Min Workload).

### Milestone 3 — Stretch Goals
- **Natural‑language data modification** (safe, opt‑in apply).
- **AI rule recommendations** (heuristic co‑run & overload hints).
- **AI‑based error correction** (auto‑fix suggestions).
- **AI‑based validator** (soft anomaly checks).
> All AI features shipped offline. If `OPENAI_API_KEY` is present, you can wire in a provider and prompt in `lib/ai/*` to go beyond heuristics.

---

## 2) Folder & File Structure
```
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DataGridEditable.tsx
│   ├── ExportPanel.tsx
│   ├── FileUploader.tsx
│   ├── NaturalLanguageBar.tsx
│   ├── PrioritiesPanel.tsx
│   ├── RuleBuilder.tsx
│   ├── ValidationSummary.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
├── lib/
│   ├── ai/
│   │   ├── aiHeaderMapper.ts
│   │   ├── aiNaturalQuery.ts
│   │   ├── aiNaturalRules.ts
│   │   └── aiSuggestions.ts
│   ├── export.ts
│   ├── parse.ts
│   ├── schemas.ts
│   ├── store.ts
│   ├── utils.ts
│   └── validate.ts
├── public/
│   └── favicon.ico
├── samples/
│   ├── clients.csv
│   ├── workers.csv
│   └── tasks.csv
├── tests/
│   ├── headerMapper.test.ts
│   └── validate.test.ts
├── next.config.mjs
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
└── package.json
```

---

## 3) Installation & Usage (Step‑by‑Step for Beginners)
1. Install Node.js 18+ from nodejs.org.
2. Open a terminal, extract the ZIP, and `cd` into the folder.
3. Run:
   ```bash
   npm i
   npm run dev
   ```
4. Visit **http://localhost:3000** in your browser.
5. Use the upload inputs to add **clients.csv**, **workers.csv**, **tasks.csv** (samples provided in `/samples`).
6. Fix highlighted cells directly in the tables.
7. Use the **Natural Language** bar for filtering or simple bulk edits.
8. Build rules in the **Rule Builder** (or type plain English).
9. Set **Priorities & Weights**.
10. Click **Export** → downloads `clients.csv`, `workers.csv`, `tasks.csv`, and `rules.json`.

---

## 4) Validation Coverage
- Missing required columns (mapped via AI‑lite header mapper).
- Duplicate IDs (ClientID/WorkerID/TaskID).
- Broken JSON in `AttributesJSON`.
- Out‑of‑range values (PriorityLevel 1–5; Duration ≥ 1).
- Unknown references (Client.RequestedTaskIDs → tasks).
- Skill coverage (each Task.RequiredSkills exists in at least one Worker.Skills).
- Overloaded workers (MaxLoadPerPhase vs AvailableSlots length).
- Phase‑slot saturation (sum of task durations per phase vs total worker slots).
- Max‑concurrency feasibility (MaxConcurrent ≤ qualified workers).

(Advanced circular rules & precedence conflict checks can be added in `lib/validate.ts` if needed by your dataset.)

---

## 5) Responsive Design Specs
- **Mobile first**: stacked sections, scrollable tables with sticky headers.
- **Tablet/Desktop**: two‑column grids where space allows.
- Touch‑friendly inputs, keyboard accessible, high contrast by default.
- Light/Dark aware via `color-scheme` and system preference.

---

## 6) Testing
- Run tests:
  ```bash
  npm test
  ```
- What’s covered:
  - Header mapping resilient to misnamed columns.
  - Core validation: missing skill produces an error.

---

## 7) Configuration
- Works **offline by default**; no API keys required.
- Optional env var: `OPENAI_API_KEY` if you plan to extend `lib/ai/*` to a hosted LLM.

---

## 8) License & Contact
- **License**: MIT (see `LICENSE`).
- **Author**: Digitalyz Candidate — Data Alchemist

Enjoy! 🎉
