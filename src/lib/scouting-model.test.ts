import { describe, expect, it } from "vitest";
import { ageAtDate, calculateScoutingScore } from "./scouting-model";
import type { ForwardShotQualityPlayer } from "./statsbomb-forward-shot-quality";

const player: ForwardShotQualityPlayer = {
  player: "Test Forward", team: "Test", positions: "Center Forward", matches_with_shot: 4,
  minutes: 360, shots: 12, open_play_shots: 12, penalty_shots: 0, goals: 3,
  shots_on_target: 6, xg: 2.4, non_penalty_xg: 2.4, penalty_xg: 0,
  avg_xg_per_shot: 0.2, avg_non_penalty_xg_per_shot: 0.2, shot_accuracy: 0.5,
  goal_minus_xg: 0.6, avg_shot_distance: 15, birth_date: "2000-01-31",
  age_source_url: "https://www.wikidata.org/", age_match_status: "name_match_needs_review",
  shots_detail: [],
};

describe("scouting model", () => {
  it("calculates age at the competition date", () => {
    expect(ageAtDate("2000-06-21", "2024-06-20")).toBe(23);
    expect(ageAtDate("2000-06-20", "2024-06-20")).toBe(24);
  });

  it("returns a bounded and transparent score", () => {
    const result = calculateScoutingScore(player);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.npxgPer90).toBe(0.6);
    expect(result.sampleReliability).toBe(1);
  });
});
