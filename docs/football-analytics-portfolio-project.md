# Football analytics portfolio project

## Working title

ScoutBoard Football Analytics: squad coverage, transfer shortlists, and value signals.

## Why this project exists

The portfolio should show the kind of work a football club, agency, or data
provider would expect from a junior football data analyst: collecting messy data,
cleaning it, checking source quality, building dashboards, and explaining what
the numbers mean in plain language.

The first version should stay realistic. We already have a Wikidata-based player
identity layer for the Americas. That is a good base for coverage, source QA,
and squad discovery, but it is not enough for performance scouting. The next
layer should add event data, match statistics, and valuation signals.

## Main football question

Use one Argentine Primera Division team as the case study, then compare its squad
profile against potential transfer targets from other leagues.

Good first questions:

- Which positions have the thinnest squad coverage?
- Which players look undervalued once age, position, league, and market context
  are considered?
- Which right-backs or central midfielders could raise the current level without
  breaking the budget?
- How much of the team's performance profile is explained by shot quality,
  chance creation, defensive activity, and ball progression?

## Data sources to evaluate

| Source | Use | Status | Notes |
| --- | --- | --- | --- |
| Wikidata | Player identity, club membership, multilingual names | In use | CC0. Good identity layer, uneven current-squad coverage. |
| StatsBomb Open Data | Event data, shots, passes, pressures, pitch locations | Next build target | Free JSON data on GitHub. Good for event-level analysis examples. |
| API-Football | Fixtures, lineups, match stats, player stats | Evaluate later | Free plan exists, but API terms and rate limits need review. |
| FBref | Team/player tables, per-90 stats, xG/xA where available | Evaluate carefully | Useful public tables, but scraping and reuse need terms review. |
| Understat | xG and shot data for selected European leagues | Evaluate carefully | Useful for European comparison targets, not broad Americas coverage. |
| Transfermarkt | Market value and contract context | Manual/review only | Do not bulk scrape until terms and reuse risk are reviewed. |
| Tracking/GPS public datasets | Speed, distance, workload, positional metrics | Optional later | Useful if a clean open dataset is available. |

## MVP build path

1. Build a league coverage dataset from the imported current-squad JSON files.
2. Add a source QA dashboard: rows by league, clubs covered, missing clubs, and
   manual-review status.
3. Add a StatsBomb Open Data ETL step for one competition and create event-level
   tables for shots, passes, pressures, and carries.
4. Build a notebook or dashboard with basic KPIs: xG, xA, xG differential,
   progressive passes, defensive actions, and player age profile.
5. Add a simple value model that combines age, position, squad coverage, and
   performance indicators.
6. Write a short bilingual methodology article in English and Spanish.

## Current build status

The first ETL step starts from local JSON files under `data/imported/` and writes
analytics-ready coverage summaries under `data/analytics/`.

Run:

```powershell
npm run analytics:coverage
```

Outputs:

- `data/analytics/league_coverage_summary.csv`
- `data/analytics/league_coverage_summary.json`
- `data/analytics/source_registry.json`

## Portfolio narrative

This project is not trying to pretend free data is perfect. The useful story is
the opposite: show how to build a workflow that knows where the data is strong,
where it is weak, and where a human analyst has to review the source. That is a
better signal for club work than a dashboard that hides uncertainty.

My accounting background fits naturally here. A recruitment report is partly a
football report and partly an investment memo: what do we get, what does it cost,
and what risk are we accepting?

## Next technical tasks

- Add a StatsBomb Open Data fetcher for competitions and matches.
- Pick one public competition as the event-data demo.
- Add `analytics/features/` tables for player age, league, position, and squad
  coverage.
- Add a first Streamlit or dashboard prototype after the coverage and event
  tables are stable.
- Keep source licensing notes next to every imported dataset.

## Source references

- StatsBomb Open Data: https://github.com/statsbomb/open-data
- API-Football: https://www.api-football.com/
- API-SPORTS football documentation: https://api-sports.io/documentation/football/v3
- FBref: https://fbref.com/en/
- Understat: https://understat.com/

