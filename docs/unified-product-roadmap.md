# Unified Product Roadmap

This document consolidates the first ScoutBoard AI idea with the newer football analytics project.

## Common Product

**ScoutBoard AI** should become one portfolio product:

> An Americas football scouting desk that combines a current-player database, data QA, event analytics, and multilingual report writing.

The old project was strongest at research workflow, data checking, QA evidence, and report delivery.
The new project is strongest at real football data pipelines, StatsBomb event analytics, and player-performance questions.
Together they become one credible football data-analysis portfolio instead of two separate demos.

## Product Pillars

1. **Americas player base**
   - Current players from South America, Mexico, USA, Canada, Central America, and the Caribbean.
   - First safe source: Wikidata, with source URL, checked date, confidence notes, and league coverage summaries.
   - Goal: searchable player and club database, not a scraped commercial dataset.

2. **Event analytics**
   - First working target: StatsBomb Open Data for Copa America 2024 forward shot quality.
   - Current output: non-penalty xG, total xG, shots, shot accuracy, goals minus xG, and average shot distance.
   - Next targets: team xG trend, shot maps, pass progression, pressure maps, and player comparison pages.

3. **Data QA**
   - Keep validation visible: missing sources, stale dates, suspicious values, inconsistent stats, and schema mismatches.
   - The QA layer should work for sample data, imported Wikidata rows, and analytics outputs.

4. **Report builder**
   - Turn player records and analytics into short scouting reports.
   - Keep source metadata and manual checks beside every draft.
   - English, Japanese, and Latin American Spanish should be supported from the start.

5. **Portfolio evidence**
   - README, case study, screenshots, tests, methodology docs, and source policy.
   - Every dataset must be public-safe and license-reviewed before being committed.

## Unified User Flow

1. Pick a league, team, or player from the Americas database.
2. Check source confidence and data quality warnings.
3. Open analytics for the relevant competition or event-data sample.
4. Compare player output against peers by position.
5. Generate a report draft in English, Japanese, or Latin American Spanish.
6. Run the manual QA checklist before export.

## Current Build State

- Next.js + TypeScript app shell.
- Editorial card-style UI inspired by Japanese magazine/news layouts.
- Player list, player detail, Data QA, and Reports pages.
- Wikidata import scripts for South America plus Mexico, MLS, and Canada.
- Coverage summary pipeline for imported player data.
- StatsBomb Open Data pipeline for Copa America 2024 forward shot quality.
- New `/analytics` page showing the StatsBomb xG board inside the app.

## Development Roadmap

### Milestone 1: Product consolidation

- Keep one repo and one product name: ScoutBoard AI.
- Use this roadmap as the source of truth for the merged direction.
- Update README to describe the combined player database + analytics + QA + reporting product.
- Keep private job-search files outside the repo.

### Milestone 2: Analytics surface

- Expand `/analytics` with filters by team, player, position, and minimum shots.
- Add shot maps using StatsBomb coordinates.
- Add a player comparison section: xG, non-penalty xG, shot accuracy, goals minus xG.
- Add tests for analytics data formatting and sorting.

### Milestone 3: Americas database surface

- Add a leagues page with coverage totals.
- Add imported player search backed by generated JSON files.
- Add confidence badges: current club confidence, source confidence, last checked date.
- Add missing-club reports so the next import work is visible.

### Milestone 4: Report workflow

- Connect report drafts to both player identity data and analytics metrics.
- Add three sample reports:
  - English scouting note.
  - Japanese portfolio/client note.
  - Latin American Spanish scouting note.
- Keep wording modest and source-backed.

### Milestone 5: Polish and portfolio launch

- Add screenshots after browser verification.
- Add a concise case study.
- Run lint, tests, build, audit, and secret scan before every GitHub push.
- Decide whether to keep the repo private or make a sanitized public demo later.

## Data Rules

- Use StatsBomb Open Data for event examples with attribution.
- Use Wikidata for public player identity data where appropriate.
- Do not bulk-copy commercial football sites unless terms clearly allow storage, display, and redistribution.
- Do not commit player photos, club logos, raw screenshots, resumes, client messages, logs, secrets, or private documents.

## Next Technical Targets

1. Add filters and charts to `/analytics`.
2. Add league coverage page from `data/analytics/league_coverage_summary.json`.
3. Add imported player search for Americas data.
4. Connect analytics insights to the report builder.
5. Add Playwright checks and screenshots for portfolio evidence.
