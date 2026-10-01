import { expect, it } from "vitest";
import { copy } from "./copy";
import { buildLocalizedForwardReport } from "./localized-reports";
import { topForwardShotQualityPlayers } from "./statsbomb-forward-shot-quality";
it("keeps source and competition metadata in all language exports", () => { for (const locale of ["en", "ja", "es"] as const) { const report = buildLocalizedForwardReport(topForwardShotQualityPlayers.slice(0, 2), locale); expect(report).toContain(copy.compare[locale]); expect(report).toContain("StatsBomb"); expect(report).toContain("https://github.com/hudl/open-data"); } });
it("includes all three languages for every shared label", () => { for (const entry of Object.values(copy)) for (const value of Object.values(entry)) expect(value.trim().length).toBeGreaterThan(0); });
