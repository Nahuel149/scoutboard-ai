import { describe, expect, it } from "vitest";
import {
  buildCorrectionMarkdown,
  correctionSample,
  requiredCorrectionCategories,
} from "./correction-sample";

describe("correction sample", () => {
  it("covers every required QA category", () => {
    const categories = new Set(correctionSample.corrections.map((item) => item.category));

    requiredCorrectionCategories.forEach((category) => {
      expect(categories.has(category)).toBe(true);
    });
  });

  it("keeps the source and privacy caveats in the output", () => {
    const markdown = buildCorrectionMarkdown();

    expect(markdown).toContain("Self-created sample");
    expect(markdown).toContain("StatsBomb Open Data");
    expect(markdown).toContain("Wikidata");
  });
});
