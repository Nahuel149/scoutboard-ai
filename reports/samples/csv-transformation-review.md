# Synthetic CSV transformation review

Self-created sample. Player names and clubs in this case are fictional.

Input: `sampleCsv` in `src/lib/csv-import.ts`.
Mapping: id → id, name → name, club → club, position → position,
goals → goals, minutes → minutes, sourceUrl → sourceUrl, checkedAt → checkedAt.

Four input rows produce two accepted rows. The duplicate ID row is rejected.
The incomplete row is rejected for missing name/source, invalid position,
negative goals, non-numeric minutes and an impossible calendar date.

Spot checks:

- `Álvarez, Mateo` retains its accent and comma as one CSV field.
- `佐藤 健司` retains Japanese text in UTF-8.
- Output headers follow the mapping specification.
- BOM is included for compatibility with spreadsheet imports.
- Spreadsheet formula prefixes are escaped on export.
- Accepted CSV can be parsed again into two rows.

The visible sample is at `/proof/csv-transformation`; `/import` lets a reviewer
load the input, correct rejected rows and download the result.
