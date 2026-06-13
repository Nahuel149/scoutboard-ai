# Data Providers

ScoutBoard AI should not depend on one football data source. This layer separates identity data, open event data, and current competition APIs.

## Provider Strategy

| Provider | Key needed | Best use | Portfolio rule |
| --- | --- | --- | --- |
| Wikidata | No | Player identity, countries, clubs, multilingual labels | Good for public samples, but always show source and checked date. |
| StatsBomb Open Data | No | Event-level analytics, xG-style demos, shot maps | Use only competitions published in the open-data repo and keep attribution. |
| Football-Data.org | Yes, free tier | Champions League fixtures/results/standings | Use server-side token from `.env.local`; avoid bulk republishing. |
| API-Football | Yes, free tier/trial | Libertadores, current fixtures, lineups, player stats | Review plan terms before caching or exporting data. |
| Sportmonks | Yes, trial/paid | Broad current competition coverage | Treat as paid provider; cache only within terms. |

## Environment Variables

Create `.env.local` locally when using keyed providers:

```text
FOOTBALL_DATA_API_TOKEN=...
API_FOOTBALL_KEY=...
SPORTMONKS_API_TOKEN=...
```

Never commit `.env.local` or real keys. The repo includes `.env.example` only.

## Commands

Check provider availability without saving data:

```powershell
npm run providers:check
```

Expected behavior:

- Wikidata and StatsBomb should run without keys.
- Football-Data.org, API-Football, and Sportmonks should report missing keys until `.env.local` is configured in the local shell/session.

## Data Quality Rules

- Old trusted data is acceptable for portfolio analytics when the dataset is clearly dated.
- Current APIs are useful for live/current demos, but API terms decide whether we can store or show the data.
- Event data and identity data should stay separate in the model.
- Every imported or generated file should include source name, source URL, checked date, and license/terms note.
