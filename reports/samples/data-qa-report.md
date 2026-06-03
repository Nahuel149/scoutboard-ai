# ScoutBoard AI Sample Data QA Report

This is a self-created sample report using synthetic football records.

## Summary

The validation engine checks player and team records for missing required fields,
implausible numeric values, source metadata gaps, and consistency problems.

The sample data intentionally includes one flawed player record so the QA page and
unit tests can demonstrate real findings.

## Example Findings

- `p-004` has an age outside the expected range.
- `p-004` uses a detailed position value that does not match the current schema.
- `p-004` has a negative market value.
- `p-004` has goal contributions while minutes are set to zero.
- `p-004` is missing source metadata and last checked date.

## Recommended Fixes

- Correct impossible numeric values before export.
- Map detailed positions to the MVP schema: GK, DF, MF, FW.
- Add source URL, source name, and checked date for all research claims.
- Keep the flawed row only as an internal QA demonstration.
