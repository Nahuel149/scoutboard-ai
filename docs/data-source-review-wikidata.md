# Data source review: Wikidata

## Source

- Source name: Wikidata
- URL: https://www.wikidata.org/
- Access method: Wikimedia category discovery plus Wikidata entity API
- Primary endpoint: https://www.wikidata.org/w/api.php
- Discovery endpoint: https://en.wikipedia.org/w/api.php
- Fallback endpoint: https://query.wikidata.org/sparql
- Reviewed date: 2026-06-07
- Initial use: South America footballer identity import

## License and terms

Wikidata structured data in the main, property, and lexeme namespaces is made
available under Creative Commons CC0. This makes it the safest first source for
ScoutBoard's player identity layer.

Attribution is not required by CC0, but ScoutBoard should still show source
metadata because source visibility is part of the product's QA promise.

## Data fit

Good for:

- player identity
- nationality
- birth date
- position
- current or former team references
- multilingual labels
- Wikidata entity URLs

Not enough for:

- current scouting performance
- reliable current squad status
- full match statistics
- market values

## Storage and display rules

- Can store locally: yes
- Can commit a small reviewed sample to GitHub: yes
- Can display publicly: yes, with source metadata
- Can export in reports: yes, with source metadata
- Cache rule: keep imported rows marked `needs_manual_review` until checked

## Implementation note

Use:

```powershell
npm run import:south-america
```

Optional:

```powershell
npm run import:south-america -- --limit=100 --out=data/imported/south-america-players.sample.json
```

The importer writes a JSON sample under `data/imported/` and marks every row as
`needs_manual_review`.

The primary path starts from country-specific English Wikipedia footballer
categories, resolves each page to a Wikidata entity, then validates player
occupation and nationality claims before writing rows. A SPARQL fallback remains
available when the entity API path fails.

For current Argentina Primera Division squads, use:

```powershell
npm run import:argentina-first-division
```

That command uses the official LPF club index as the first-division club source
set, then imports Wikidata players whose `member of sports team` (`P54`) claim
points to one of those clubs and does not have an `end time` (`P582`) qualifier.
This is a useful first pass for current squads, but it is not an official player
registration feed. Transfers, loans, youth call-ups, and stale Wikidata claims
still need manual review.

For current Brazil Serie A squads, use:

```powershell
npm run import:brazil-first-division
```

That command uses the official CBF 2026 Campeonato Brasileiro Serie A team page
as the league source set, then applies the same Wikidata current-team rule:
`member of sports team` (`P54`) pointing to one of those clubs, with no
`end time` (`P582`) qualifier. As with Argentina, this is a first-pass scouting
database seed, not official registration data.

CBF club pages also expose athlete lists, which are a better source for
registration-level current squads, but the site marks its content as all rights
reserved. Review CBF terms before storing or committing athlete data from those
pages.

For current Chile Liga de Primera squads, use:

```powershell
npm run import:chile-first-division
```

That command uses the official Campeonato Chileno Liga de Primera page as the
league source set, then applies the same Wikidata current-team rule plus a
conservative birth-date guard to filter obvious retired players from stale
open-ended Wikidata claims. It is a seed for the scouting database, not a
substitute for ANFP/COMET registration data.

For the remaining CONMEBOL first divisions, use:

```powershell
npm run import:uruguay-first-division
npm run import:colombia-first-division
npm run import:peru-first-division
npm run import:ecuador-first-division
npm run import:paraguay-first-division
npm run import:bolivia-first-division
npm run import:venezuela-first-division
```

These commands use current 2026 season club lists for each league, then apply the
same Wikidata current-team rule and conservative birth-date guard. Treat the
generated files as scouting database seeds only; official registration feeds or
club squad pages should be reviewed separately before being stored.

Some rebranded clubs may use `playerSourceIds` so the output keeps the current
club identity while reading still-open player claims from the older Wikidata
club item. Those mappings are source workarounds and need manual review.

For Argentina and Brazil second divisions, use:

```powershell
npm run import:argentina-second-division
npm run import:brazil-second-division
```

These commands follow the same method as the first-division imports: current
season club list, Wikidata current-team claims, coverage metadata, and manual
review status on every player row.

## Decision

Status: approved for an import spike.

Next action: review the generated rows, then map a small clean subset into the
app data model.
