# ScoutBoard AI

Americas football scouting database, event analytics, data QA, and report generator portfolio app.

ScoutBoard AI is a self-created portfolio project that demonstrates practical
full-stack development, football research structure, public-data ETL,
event-level football analytics, spreadsheet-style data QA, AI-assisted writing
workflow design, and client-ready reporting.

## Current MVP

- Next.js + TypeScript app shell.
- Dashboard with sample football metrics.
- Performance workspace page for the progressive build plan.
- Player list and player detail pages.
- Analytics page using StatsBomb Open Data for Copa America 2024 forward shot quality.
- Champions League ETL demo page for Football-Data.org basic match data.
- Data QA page powered by reusable validation rules.
- Report builder preview with manual human verification checklist.
- Synthetic CSV sample data.
- Wikidata import scripts for current-player coverage across the Americas.
- StatsBomb Open Data scripts for event-level analytics examples.
- Unit tests for validation behavior.

## Proof Item Added

- Before/after correction sample for proofreading, AI text cleanup, and
  instruction-compliance jobs.
- Visible page: `/proof/before-after`
- Markdown sample: `reports/samples/before-after-correction.md`

## Local Setup

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Testing

```powershell
npm test
npm run build
```

## Data And Source Policy

The repo uses self-created synthetic data, Wikidata-derived public identity
samples, and StatsBomb Open Data analytics outputs. It must not include private
resumes, CrowdWorks logs/messages, Telegram files, secrets, raw personal
screenshots, player photos, club logos, or restricted football datasets.

See [docs/data-source-policy.md](docs/data-source-policy.md).
The provider adapter plan is in [docs/data-providers.md](docs/data-providers.md).
The merged product plan is in [docs/unified-product-roadmap.md](docs/unified-product-roadmap.md).

## Portfolio Note

This is a self-created portfolio project. It demonstrates full-stack
development, data validation, football analytics, QA reporting, and
source-backed research workflows using public-safe football data. It does not
include client-confidential material.

The original build plan is in [PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md).
