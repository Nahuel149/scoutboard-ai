# Performance Workspace Roadmap

This list turns the Sportian-style idea into progressive ScoutBoard AI work. The goal is not to copy an enterprise platform. The goal is to build a public-safe portfolio version of a professional football analysis desk.

## Why This Belongs In ScoutBoard AI

Professional platforms combine video, tracking, match events, squad data, coaching notes, live alerts, and reports. ScoutBoard AI can show the same workflow shape with open or reviewed data:

- Wikidata for player identity and club context.
- StatsBomb Open Data for event-level examples.
- Football-Data.org for basic current competition context.
- API-Football or Sportmonks later if keys and terms allow it.
- Manual QA and report generation as the visible delivery layer.

## Progressive Build List

### 1. Performance Workspace Shell

Status: in progress.

Build one page that shows the whole operating model:

- data provider status
- active analysis modules
- next build queue
- scouting questions
- report-ready outputs

This gives the project a clear product center instead of separate pages.

### 2. Data Readiness Board

Status: next.

Show which providers are ready, missing a token, or only usable as static open-data demos.

Fields:

- provider
- source type
- key status
- allowed portfolio use
- cache/display rule
- next action

### 3. Match And Competition Context

Status: planned.

Connect Football-Data.org Champions League data to a cleaner competition view:

- fixtures
- results
- match status
- basic team context
- provider setup state when token is missing

No xG claims here.

### 4. Event Analytics Room

Status: partially built.

Expand the StatsBomb module:

- shot quality board
- shot map
- team xG summary
- player comparison
- match-level breakdown

Use only open competitions.

### 5. Player Watchlist

Status: planned.

Turn imported Americas data into a working scouting watchlist:

- player search
- league filters
- source confidence
- current-club confidence
- missing-data warnings
- short notes

### 6. Report Room

Status: partially built.

Connect the workspace to report drafts:

- player report
- match note
- data QA note
- English, Japanese, Spanish variants
- final human review checklist

### 7. Alert And Task Queue

Status: planned.

Add simple internal alerts:

- provider token missing
- stale source date
- player row missing club
- high xG player needs report
- report awaiting QA

### 8. Video And Tracking Placeholder

Status: later.

Do not fake proprietary video/tracking. Add a clearly labeled placeholder showing how a licensed provider would plug in later.

Possible public-safe demo:

- manual video URL field
- timestamp notes
- event ID links
- no copyrighted footage committed

## Product Rule

Every feature must answer one portfolio question:

> Can this prove that we can collect data, check it, analyze it, explain it, and deliver a useful football report?

If a feature does not help answer that, it waits.
