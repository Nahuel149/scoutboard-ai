# ScoutBoard AI next steps

This file is the working plan for the next build phase.

## Product direction

ScoutBoard AI should become a trilingual football research and data QA portfolio app:

- English for global recruiters and clients.
- Japanese for Japan-based portfolio viewers and CrowdWorks-style clients.
- Latin American Spanish for Americas football research and Spanish-language work.

The long-term data goal is a database of players from the whole American
continent: North America, Central America, South America, and the Caribbean.

The app should keep its main proof areas visible:

- player research notes
- team/player data checks
- source-backed reporting
- AI-assisted drafting with human review
- before/after proofreading and text-cleanup proof
- QA evidence and bug-report discipline
- multilingual delivery workflow

## Current state

Already done:

- Next.js app foundation.
- Editorial card-style UI.
- English, Japanese, and Latin American Spanish page copy.
- Synthetic sample player/team data.
- Data validation rules.
- QA page with localized issue messages.
- Markdown report preview with multilingual notes.
- Basic Vitest coverage for validation.
- Real data plan in `docs/real-data-plan.md`.
- Before/after correction proof for proofreading, AI text cleanup, and
  instruction-compliance work.
- Visible before/after route at `/proof/before-after`.
- Markdown sample at `reports/samples/before-after-correction.md`.

## Data source strategy

### Use first: Wikidata

Use Wikidata as the first real player identity source.

Good for:

- player names
- nationality
- date of birth
- positions
- clubs / teams
- identifiers
- multilingual labels
- source links

Why:

- Wikidata structured data is CC0.
- It can cover players across the Americas.
- It is safer for a public portfolio than scraping commercial football sites.

Limits:

- data can be incomplete or stale
- current squads may need manual review
- not enough for scouting stats by itself

### Use as supplement: StatsBomb Open Data

Use StatsBomb Open Data for event/match analytics examples, not as the main
player directory.

Good for:

- match event demos
- passing/shot/xG-style analytics
- portfolio charts later

Limit:

- selected competitions only
- not a full Americas player database

### Use as supplement: Football-Data.co.uk

Use only for match CSVs where useful.

Good for:

- MLS / Liga MX match-result style demos
- CSV import workflow

Limit:

- not a player database
- betting/odds context should be kept out of the product positioning

### Paid APIs later

API-Football or similar providers can be evaluated later, but only after a
licensing review.

Important:

- an API subscription is not the same as rights to republish all data, logos, or
  images
- do not use club logos, league logos, or player photos unless clearly licensed
- document what can be stored, displayed, cached, and exported

## Sources to avoid as raw imports

Do not scrape or bulk-import from these unless terms clearly allow our exact use:

- Transfermarkt
- FBref
- SofaScore
- FotMob
- Futbin
- club/league sites with unclear reuse terms
- image/logo sources without explicit rights

Manual browsing can still be used for learning and source-check notes, but the
data should not be copied into the repo without a terms review.

## Immediate implementation tasks

1. Add a `docs/data-source-review-template.md`.
   - source name
   - URL
   - license / terms summary
   - allowed use
   - not allowed / unclear use
   - attribution requirement
   - cache/storage rule
   - display/export rule
   - reviewed date

2. Add a Wikidata import experiment.
   - create `scripts/wikidata-americas-players.ts` or similar
   - query a small safe sample first
   - start with 20-50 players
   - include source URL and checked date
   - save generated output under `data/imported/` only if it passes review

3. Expand the data model for Americas coverage.
   - country / region
   - federation: CONMEBOL, CONCACAF
   - current club confidence
   - data source confidence
   - source language
   - source license note

4. Add language structure.
   - move visible copy into a simple `src/lib/copy.ts`
   - keep English, Japanese, and Spanish keys together
   - avoid full i18n framework until there is a real language switcher

5. Add language display controls.
   - start with simple chips: EN / JP / ES / All
   - default can stay "All" for portfolio proof
   - make dense tables easier to read on mobile

6. Add Americas sample data.
   - Argentina
   - Brazil
   - Uruguay
   - Chile
   - Colombia
   - Ecuador
   - Paraguay
   - Peru
   - Mexico
   - USA
   - Canada
   - selected Central America / Caribbean examples

7. Add source-backed report samples.
   - English player note
   - Japanese delivery-style note
   - Latin American Spanish scouting note
   - data QA report showing before/after cleanup

8. Add before/after correction proof.
   - status: done
   - create `reports/samples/before-after-correction.md`
   - create `src/lib/correction-sample.ts`
   - create a visible route such as `/proof/before-after`
   - include one flawed short draft and one corrected final version
   - include a correction table with issue, original text, corrected text,
     reason, and QA category
   - cover realistic proofreading/text-cleanup issues: unsupported claim,
     vague AI-like wording, duplicated sentence, inconsistent number, missing
     source note, formatting inconsistency, and instruction-compliance issue
   - make it proposal-ready for CrowdWorks proofreading, rewrite, AI-text
     cleanup, and OCR/copy-paste QA jobs

9. Add tests.
   - validation rules for imported rows
   - language copy smoke test
   - report builder output includes source metadata
   - correction sample includes every required QA category

10. Update README.
   - add screenshots after reviewing them
   - explain trilingual workflow
   - mention the before/after correction sample as the proof item for
     proofreading/text-cleanup proposals
   - link to `docs/real-data-plan.md`
   - link to this file

## Copy and localization rules

English:

- plain and specific
- avoid inflated AI wording
- use "data check", "source check", "draft", "review", "report"

Japanese:

- keep lines short
- use natural work terms: リサーチ, データ確認, 出典確認, レポート下書き, 納品前チェック
- avoid over-formal machine translation
- keep claims modest

Spanish:

- use Latin American Spanish
- prefer "portafolio", "jugador", "reporte", "fuente", "revisión", "datos"
- avoid Spain-only phrasing
- keep tone practical, not salesy

All languages:

- no fake client claims
- no unsupported scouting claims
- no scraped commercial data without license review
- source, checked date, and confidence note should be visible for real data

## Next recommended commit

Suggested next commit:

```text
Add proof navigation and README screenshots
```

After that:

```text
Add data source review template
```

Then:

```text
Add Wikidata Americas player import spike
```
