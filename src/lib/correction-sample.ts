export type CorrectionCategory =
  | "unsupported-claim"
  | "ai-like-wording"
  | "duplicate-sentence"
  | "inconsistent-number"
  | "missing-source-note"
  | "formatting-inconsistency"
  | "instruction-compliance";

export type CorrectionItem = {
  id: string;
  category: CorrectionCategory;
  issue: string;
  originalText: string;
  correctedText: string;
  reason: string;
};

export const requiredCorrectionCategories: CorrectionCategory[] = [
  "unsupported-claim",
  "ai-like-wording",
  "duplicate-sentence",
  "inconsistent-number",
  "missing-source-note",
  "formatting-inconsistency",
  "instruction-compliance",
];

export const correctionSample = {
  title: "Before/after correction sample",
  subtitle: "Proofreading, AI text cleanup, and instruction-compliance QA",
  scope:
    "Self-created sample for portfolio use. It does not contain client material or private data.",
  jobFit: [
    "Proofreading and rewrite tasks",
    "AI text cleanup",
    "OCR or copy-paste QA",
    "Source and instruction checks before delivery",
  ],
  flawedDraft: `ScoutBoard AI is a groundbreaking platform that revolutionizes football scouting forever.

It reviewed 52 Copa America forwards and proves that Lautaro Martinez is the best transfer target for every club.

The report checks 52 forwards. The report checks 52 forwards.

The dashboard analyzed 54 forwards and 32 matches, using xG, shots and market value.

Source: open football data.

Delivery notes:
- English
- Japanese
- Spanish
- Add a friendly sales ending
`,
  correctedFinal: `ScoutBoard AI is a portfolio app for football research, data QA, and report drafting.

This sample reviews 52 Copa America 2024 forwards and wingers from South American national teams. Lautaro Martinez ranks first in this small event-data sample by non-penalty xG, but the report does not treat that as a transfer recommendation.

The dashboard analyzed 52 forwards and 32 matches. The main metrics are shots, non-penalty xG, xG per shot, shot location, and minutes played.

Source: StatsBomb Open Data, Copa America 2024. Wikidata is used only to enrich player age, and name matches need manual review.

Delivery notes:
- English: concise portfolio explanation
- Japanese: short work-style summary
- Latin American Spanish: practical scouting note
- No sales ending
`,
  corrections: [
    {
      id: "c-001",
      category: "unsupported-claim",
      issue: "The draft made a transfer claim the data cannot support.",
      originalText: "proves that Lautaro Martinez is the best transfer target for every club",
      correctedText:
        "Lautaro Martinez ranks first in this small event-data sample by non-penalty xG",
      reason:
        "The data supports a ranking inside one tournament sample. It does not support a universal transfer recommendation.",
    },
    {
      id: "c-002",
      category: "ai-like-wording",
      issue: "The opening used inflated promotional language.",
      originalText: "a groundbreaking platform that revolutionizes football scouting forever",
      correctedText:
        "a portfolio app for football research, data QA, and report drafting",
      reason:
        "The corrected version states what the app does without hype or vague claims.",
    },
    {
      id: "c-003",
      category: "duplicate-sentence",
      issue: "One sentence was copied twice.",
      originalText: "The report checks 52 forwards. The report checks 52 forwards.",
      correctedText: "This sample reviews 52 Copa America 2024 forwards and wingers.",
      reason: "Duplicate text was removed and the scope was made more precise.",
    },
    {
      id: "c-004",
      category: "inconsistent-number",
      issue: "The player count changed from 52 to 54.",
      originalText: "The dashboard analyzed 54 forwards and 32 matches",
      correctedText: "The dashboard analyzed 52 forwards and 32 matches",
      reason: "The corrected number matches the generated StatsBomb dataset.",
    },
    {
      id: "c-005",
      category: "missing-source-note",
      issue: "The source note was too vague for a portfolio report.",
      originalText: "Source: open football data.",
      correctedText:
        "Source: StatsBomb Open Data, Copa America 2024. Wikidata is used only to enrich player age, and name matches need manual review.",
      reason:
        "The final text names the source, competition, enrichment source, and review caveat.",
    },
    {
      id: "c-006",
      category: "formatting-inconsistency",
      issue: "The language list mixed broad language names with no delivery purpose.",
      originalText: "- English\n- Japanese\n- Spanish",
      correctedText:
        "- English: concise portfolio explanation\n- Japanese: short work-style summary\n- Latin American Spanish: practical scouting note",
      reason: "The corrected bullets use one format and clarify the intended output.",
    },
    {
      id: "c-007",
      category: "instruction-compliance",
      issue: "The draft asked for a sales ending, which conflicts with the project tone.",
      originalText: "- Add a friendly sales ending",
      correctedText: "- No sales ending",
      reason:
        "The project rules favor modest, source-backed writing. The final instruction keeps that boundary visible.",
    },
  ] satisfies CorrectionItem[],
  localizedNotes: {
    en: "This proof item shows the review process: find the weak claim, fix the wording, and leave the source caveat visible.",
    ja: "このサンプルは、弱い主張を直し、出典の注意点を残すための校正プロセスを見せるものです。",
    es: "Este ejemplo muestra el proceso de revisión: detectar una afirmación floja, corregir el texto y dejar visible la fuente.",
  },
};

export function buildCorrectionMarkdown() {
  const rows = correctionSample.corrections
    .map(
      (item) =>
        `| ${item.category} | ${item.issue} | ${item.originalText.replaceAll("\n", "<br>")} | ${item.correctedText.replaceAll("\n", "<br>")} | ${item.reason} |`,
    )
    .join("\n");

  return `# ${correctionSample.title}

${correctionSample.scope}

## Flawed draft

\`\`\`text
${correctionSample.flawedDraft}
\`\`\`

## Corrected final

\`\`\`text
${correctionSample.correctedFinal}
\`\`\`

## Correction table

| Category | Issue | Original text | Corrected text | Reason |
| --- | --- | --- | --- | --- |
${rows}

## Localized notes

- English: ${correctionSample.localizedNotes.en}
- Japanese: ${correctionSample.localizedNotes.ja}
- Spanish: ${correctionSample.localizedNotes.es}
`;
}
