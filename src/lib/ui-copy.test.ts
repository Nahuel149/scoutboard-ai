import { describe, expect, it } from "vitest";
import { translateUi, uiCopy } from "./ui-copy";
describe("UI translations", () => {
  it("provides nonempty copy in each language", () => {
    for (const value of Object.values(uiCopy)) for (const language of ["en", "ja", "es"] as const) expect(value[language].trim()).not.toBe("");
  });
  it("localizes CSV validation instead of exposing English errors", () => {
    expect(translateUi("Required value is empty.", "es")).toBe("Falta un dato obligatorio.");
    expect(translateUi("CSV exceeds 2 MB.", "ja")).toBe("CSVが2MBを超えています。");
  });
  it("preserves technical identifiers and proper names", () => {
    expect(translateUi("API_FOOTBALL_KEY", "ja")).toBe("API_FOOTBALL_KEY");
    expect(translateUi("Leandro Brey", "es")).toBe("Leandro Brey");
  });
});
