import { expect, it } from "vitest";
import { reviewMembership } from "./roster-review";
it("quarantines deceased, historical and non-matching category/sport records", () => {
  expect(reviewMembership("Q10274069", "Q80964", null, { birth: null, death: "+2000-00-00T00:00:00Z" }).reason).toBe("deceased");
  expect(reviewMembership("Q1", "Q2", "1930-01-01").reason).toBe("historical-age");
  expect(reviewMembership("Q1", "Q2", null, { birth: null, death: null, gender: "Q6581072" }).reason).toBe("different-category");
  expect(reviewMembership("Q1", "Q2", null, { birth: null, death: null, sports: ["Q185851"] }).reason).toBe("different-sport");
});
it("does not infer active status from an undated club claim", () => { expect(reviewMembership("Q1", "Q2", null, { birth: null, death: null, latestMemberships: ["Q2"] }).status).toBe("unverified"); });
it("uses evidence only for its exact player-club pair", () => { expect(reviewMembership("Q106687895", "Q170703", null).status).toBe("confirmed"); expect(reviewMembership("Q106687895", "Q80964", null).status).toBe("unverified"); expect(reviewMembership("Q1033783", "Q170703", null).reason).toBe("contradicted"); });
it("expires confirmed roster evidence after thirty days", () => { expect(reviewMembership("Q106687895", "Q170703", null, undefined, "2026-11-15").reason).toBe("stale-evidence"); });
it("expires evidence independently of the metadata snapshot date", () => { expect(reviewMembership("Q106687895", "Q170703", null, undefined, "2026-10-01", "2026-11-15").reason).toBe("stale-evidence"); });
