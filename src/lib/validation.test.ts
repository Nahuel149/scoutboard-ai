import { describe, expect, it } from "vitest";
import { players, teams } from "./sample-data";
import {
  getCompletenessScore,
  summarizeIssues,
  validateData,
  validatePlayers,
} from "./validation";

describe("ScoutBoard validation", () => {
  it("flags intentionally flawed sample player data", () => {
    const issues = validatePlayers(players);

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityId: "p-004",
          field: "marketValueEur",
          severity: "critical",
        }),
        expect.objectContaining({
          entityId: "p-004",
          field: "minutes",
          issueType: "consistency",
        }),
        expect.objectContaining({
          entityId: "p-004",
          field: "source",
          severity: "critical",
        }),
      ]),
    );
  });

  it("summarizes severity counts for the full sample set", () => {
    const issues = validateData(players, teams);
    const summary = summarizeIssues(issues);

    expect(summary.total).toBeGreaterThan(0);
    expect(summary.critical).toBeGreaterThan(0);
    expect(summary.warning).toBeGreaterThan(0);
  });

  it("calculates a bounded completeness score", () => {
    expect(getCompletenessScore(players.length + teams.length, 0)).toBe(100);
    expect(getCompletenessScore(players.length + teams.length, 999)).toBe(0);
  });
});
