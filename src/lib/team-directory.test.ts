import { expect, it } from "vitest";
import { buildTeamDirectory } from "./team-directory";
import type { WatchlistPlayer } from "./american-watchlist";
it("separates same-named clubs across leagues and excludes unknown clubs", () => {
  const row = { club: "United", league: "League A", country: "Argentina", missingFields: [] } as unknown as WatchlistPlayer;
  const result = buildTeamDirectory([row, { ...row }, { ...row, league: "League B" }, { ...row, missingFields: ["club"] }]);
  expect(result).toHaveLength(2); expect(result.map(t => t.players.length).sort()).toEqual([1, 2]); expect(new Set(result.map(t => t.id)).size).toBe(2);
});
