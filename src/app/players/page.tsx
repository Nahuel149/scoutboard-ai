import Link from "next/link";
import { players } from "@/lib/sample-data";
import { validatePlayers } from "@/lib/validation";

export default function PlayersPage() {
  const issues = validatePlayers(players);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Research table</p>
        <h1>Players</h1>
        <p>Sample records for scouting notes, validation, and report drafts.</p>
      </div>

      <div className="filterBar" aria-label="Static MVP filters">
        <span>Search-ready table</span>
        <span>Position filter</span>
        <span>Source review</span>
      </div>

      <div className="tableShell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Club</th>
              <th>League</th>
              <th>Position</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const playerIssues = issues.filter((issue) => issue.entityId === player.id);
              return (
                <tr key={player.id}>
                  <td>
                    <Link href={`/players/${player.id}`}>{player.name}</Link>
                  </td>
                  <td>{player.club}</td>
                  <td>{player.league}</td>
                  <td>{player.position}</td>
                  <td>{player.goals}</td>
                  <td>{player.assists}</td>
                  <td>
                    <span className={playerIssues.length ? "pill danger" : "pill"}>
                      {playerIssues.length}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
