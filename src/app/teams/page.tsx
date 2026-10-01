import { loadAmericanWatchlist } from "@/lib/american-watchlist";
import { buildTeamDirectory } from "@/lib/team-directory";
import { TeamDirectory } from "./team-directory";
export default async function TeamsPage() { const teams = buildTeamDirectory(await loadAmericanWatchlist()); return <TeamDirectory teams={teams.map(team => ({ ...team, players: undefined, count: team.players.length }))} />; }
