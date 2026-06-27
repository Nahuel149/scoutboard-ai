# Before/after correction sample

Self-created sample for portfolio use. It does not contain client material or private data.

## Flawed draft

```text
ScoutBoard AI is a groundbreaking platform that revolutionizes football scouting forever.

It reviewed 52 Copa America forwards and proves that Lautaro Martinez is the best transfer target for every club.

The report checks 52 forwards. The report checks 52 forwards.

The dashboard analyzed 54 forwards and 32 matches, using xG, shots and market value.

Source: open football data.

Delivery notes:
- English
- Japanese
- Spanish
- Add a friendly sales ending
```

## Corrected final

```text
ScoutBoard AI is a portfolio app for football research, data QA, and report drafting.

This sample reviews 52 Copa America 2024 forwards and wingers from South American national teams. Lautaro Martinez ranks first in this small event-data sample by non-penalty xG, but the report does not treat that as a transfer recommendation.

The dashboard analyzed 52 forwards and 32 matches. The main metrics are shots, non-penalty xG, xG per shot, shot location, and minutes played.

Source: StatsBomb Open Data, Copa America 2024. Wikidata is used only to enrich player age, and name matches need manual review.

Delivery notes:
- English: concise portfolio explanation
- Japanese: short work-style summary
- Latin American Spanish: practical scouting note
- No sales ending
```

## Correction table

| Category | Issue | Original text | Corrected text | Reason |
| --- | --- | --- | --- | --- |
| Unsupported claim | The draft made a transfer claim the data cannot support. | proves that Lautaro Martinez is the best transfer target for every club | Lautaro Martinez ranks first in this small event-data sample by non-penalty xG | The data supports a ranking inside one tournament sample. It does not support a universal transfer recommendation. |
| AI-like wording | The opening used inflated promotional language. | a groundbreaking platform that revolutionizes football scouting forever | a portfolio app for football research, data QA, and report drafting | The corrected version states what the app does without hype or vague claims. |
| Duplicate sentence | One sentence was copied twice. | The report checks 52 forwards. The report checks 52 forwards. | This sample reviews 52 Copa America 2024 forwards and wingers. | Duplicate text was removed and the scope was made more precise. |
| Inconsistent number | The player count changed from 52 to 54. | The dashboard analyzed 54 forwards and 32 matches | The dashboard analyzed 52 forwards and 32 matches | The corrected number matches the generated StatsBomb dataset. |
| Missing source note | The source note was too vague for a portfolio report. | Source: open football data. | Source: StatsBomb Open Data, Copa America 2024. Wikidata is used only to enrich player age, and name matches need manual review. | The final text names the source, competition, enrichment source, and review caveat. |
| Formatting inconsistency | The language list mixed broad language names with no delivery purpose. | English / Japanese / Spanish | English: concise portfolio explanation / Japanese: short work-style summary / Latin American Spanish: practical scouting note | The corrected bullets use one format and clarify the intended output. |
| Instruction compliance | The draft asked for a sales ending, which conflicts with the project tone. | Add a friendly sales ending | No sales ending | The project rules favor modest, source-backed writing. The final instruction keeps that boundary visible. |

## Localized notes

- English: This proof item shows the review process: find the weak claim, fix the wording, and leave the source caveat visible.
- Japanese: このサンプルは、弱い主張を直し、出典の注意点を残すための校正プロセスを見せるものです。
- Spanish: Este ejemplo muestra el proceso de revisión: detectar una afirmación floja, corregir el texto y dejar visible la fuente.
