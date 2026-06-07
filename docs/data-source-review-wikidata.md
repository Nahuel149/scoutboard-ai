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

## Decision

Status: approved for an import spike.

Next action: review the generated rows, then map a small clean subset into the
app data model.
