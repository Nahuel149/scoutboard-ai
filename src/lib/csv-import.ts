import Papa from "papaparse";
export const fields = ["id", "name", "club", "position", "goals", "minutes", "sourceUrl", "checkedAt"] as const;
export type ImportField = typeof fields[number];
export type ImportRow = Record<ImportField, string>;
export type ImportIssue = { row: number; field: string; code: "missing" | "duplicate" | "invalid"; message: string };
export const sampleCsv = 'id,name,club,position,goals,minutes,sourceUrl,checkedAt\np1,"Álvarez, Mateo",River Norte,FW,3,420,https://example.com/synthetic,2026-09-20\np1,Duplicate,River Norte,FW,3,420,https://example.com/synthetic,2026-09-20\np2,,River Norte,XX,-1,abc,,2026-02-30\np3,佐藤 健司,Yokohama Bays,FW,0,90,https://example.com/synthetic,2026-09-20\n';
export function parseCsv(text: string) {
  if (text.length > 2_000_000) throw new Error("CSV exceeds 2 MB.");
  const parsed = Papa.parse<string[]>(text.replace(/^\uFEFF/, ""), { skipEmptyLines: "greedy" });
  if (parsed.errors.length) throw new Error(parsed.errors[0].message);
  const [header = [], ...values] = parsed.data;
  const headers = header.map(value => value.trim());
  if (!headers.length || headers.some(value => !value) || new Set(headers).size !== headers.length) throw new Error("Column names must be present and unique.");
  if (values.length > 10000) throw new Error("CSV exceeds 10,000 rows.");
  if (values.some(row => row.length !== headers.length)) throw new Error("A row has a different number of columns.");
  return { headers, rows: values.map(row => Object.fromEntries(headers.map((key, index) => [key, row[index]]))) };
}
export function transformCsv(rows: Record<string, string>[], mapping: Record<ImportField, string>) {
  const issues: ImportIssue[] = [];
  const seen = new Set<string>();
  const valid: ImportRow[] = [];
  rows.forEach((raw, index) => {
    const row = Object.fromEntries(fields.map(field => [field, (raw[mapping[field]] ?? "").trim()])) as ImportRow;
    const start = issues.length;
    const add = (field: string, code: ImportIssue["code"], message: string) => issues.push({ row: index + 2, field, code, message });
    for (const field of fields) if (!row[field]) add(field, "missing", "Required value is empty.");
    if (row.id && seen.has(row.id)) add("id", "duplicate", "Duplicate ID; first occurrence is retained if valid.");
    if (row.id) seen.add(row.id);
    if (row.position && !["GK", "DF", "MF", "FW"].includes(row.position)) add("position", "invalid", "Use GK, DF, MF or FW.");
    for (const field of ["goals", "minutes"] as const) if (row[field] && (!/^\d+$/.test(row[field]) || !Number.isSafeInteger(Number(row[field])))) add(field, "invalid", "Use a non-negative whole number.");
    if (row.minutes === "0" && Number(row.goals) > 0) add("goals", "invalid", "Goals with zero minutes need review.");
    if (row.sourceUrl) { try { const url = new URL(row.sourceUrl); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { add("sourceUrl", "invalid", "Use an HTTP or HTTPS source URL."); } }
    const date = new Date(row.checkedAt);
    if (row.checkedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(row.checkedAt) || !Number.isFinite(date.getTime()) || date.toISOString() !== `${row.checkedAt}T00:00:00.000Z`)) add("checkedAt", "invalid", "Use a real date in YYYY-MM-DD format.");
    if (issues.length === start) valid.push(row);
  });
  return { valid, issues, rejected: rows.length - valid.length };
}
export function exportCsv(rows: ImportRow[]) { return "\uFEFF" + Papa.unparse({ fields: [...fields], data: rows.map(row => fields.map(field => /^[=+\-@\t\r]/.test(row[field]) ? "'" + row[field] : row[field])) }); }
