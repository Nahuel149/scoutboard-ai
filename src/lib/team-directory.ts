import type { WatchlistPlayer } from "./american-watchlist";
export function teamId(league: string, club: string) { return Buffer.from(JSON.stringify([league, club])).toString("base64url"); }
export function buildTeamDirectory(players: WatchlistPlayer[]) {
  const groups = new Map<string, { id: string; name: string; league: string; country: string; players: WatchlistPlayer[] }>();
  for (const player of players) {
    if (player.missingFields.includes("club")) continue;
    const id = teamId(player.league, player.club);
    if (!groups.has(id)) groups.set(id, { id, name: player.club, league: player.league, country: player.country, players: [] });
    groups.get(id)!.players.push(player);
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}
