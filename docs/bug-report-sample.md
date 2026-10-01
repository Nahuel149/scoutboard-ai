# CSV date normalization

Self-created QA example, observed during development on 2026-10-01.

Severity: medium. An impossible review date could make a data source appear checked.

Steps: submit a row with checkedAt `2026-02-30` to a validator that only checks
whether JavaScript can parse the date.

Expected: reject the row and explain the invalid date.

Actual in the initial validator: JavaScript normalizes the date to March.

Fix: check ISO format, finite parsed timestamp and equality between the parsed
ISO date and the original date. Invalid dates stay out of the clean export.

Regression coverage: `src/lib/csv-import.test.ts` checks February 30, month 13
and non-date text.
