# ScoutBoard AI

Football research, data QA, and report generator portfolio app.

ScoutBoard AI is a self-created portfolio project that demonstrates practical
full-stack development, football research structure, spreadsheet-style data QA,
AI-assisted writing workflow design, and client-ready reporting.

## Current MVP

- Next.js + TypeScript app shell.
- Dashboard with sample football metrics.
- Player list and player detail pages.
- Data QA page powered by reusable validation rules.
- Report builder preview with manual human verification checklist.
- Synthetic CSV sample data.
- Unit tests for validation behavior.

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

## Data Policy

The repo currently uses self-created synthetic data only. It must not include
private resumes, CrowdWorks logs/messages, Telegram files, secrets, raw personal
screenshots, or restricted football datasets.

See [docs/data-source-policy.md](docs/data-source-policy.md).

## Portfolio Note

This is a self-created portfolio project. It demonstrates full-stack
development, data validation, QA reporting, and source-backed research workflows
using football sample data. It does not include client-confidential material.

The original build plan is in [PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md).
