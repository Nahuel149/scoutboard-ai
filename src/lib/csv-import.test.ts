import { describe, expect, it } from "vitest";
import { exportCsv, fields, parseCsv, sampleCsv, transformCsv, type ImportField } from "./csv-import";
const mapping = Object.fromEntries(fields.map(f => [f, f])) as Record<ImportField, string>;
describe("CSV workflow", () => {
  it("preserves commas, Japanese and accented names; excludes duplicates and invalid rows", () => {
    const input = parseCsv(sampleCsv); const result = transformCsv(input.rows, mapping);
    expect(result.valid.map(p => p.name)).toEqual(["Álvarez, Mateo", "佐藤 健司"]);
    expect(result.rejected).toBe(2); expect(result.issues).toContainEqual(expect.objectContaining({ field: "checkedAt", code: "invalid" }));
    expect(parseCsv(exportCsv(result.valid)).rows).toHaveLength(2);
  });
  it("rejects duplicate headers, mismatched rows and malformed quotation", () => { for (const input of ['id,id\n1,2', 'id,name\n1', 'id,name\n1,"unfinished']) expect(() => parseCsv(input)).toThrow(); });
  it("supports mapping and rejects unsafe URLs and impossible dates without crashing", () => {
    const raw = parseCsv(sampleCsv).rows[0];
    expect(transformCsv([{ ...raw, name: "", FullName: "Ana" }], { ...mapping, name: "FullName" }).valid[0].name).toBe("Ana");
    for (const checkedAt of ["not-a-date", "2026-02-30", "2026-13-01"]) expect(transformCsv([{ ...raw, checkedAt }], mapping).valid).toHaveLength(0);
    expect(transformCsv([{ ...raw, sourceUrl: "javascript:alert(1)" }], mapping).valid).toHaveLength(0);
  });
  it("escapes spreadsheet formulas in downloads", () => { const result = transformCsv([{ ...parseCsv(sampleCsv).rows[0], name: "=SUM(1,2)" }], mapping); expect(exportCsv(result.valid)).toContain("'=SUM"); });
});
