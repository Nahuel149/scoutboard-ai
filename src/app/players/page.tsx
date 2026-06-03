import Link from "next/link";
import type { CSSProperties } from "react";
import { players } from "@/lib/sample-data";
import { validatePlayers } from "@/lib/validation";

export default function PlayersPage() {
  const issues = validatePlayers(players);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Research table / 選手リサーチ</p>
        <h1>Players</h1>
        <p>Small sample records for scouting notes, data checks, and report drafts.</p>
        <p className="jp">
          スカウティングメモ、データ確認、レポート下書きに使うサンプル選手データです。
        </p>
      </div>

      <div className="filterBar" aria-label="Static MVP filters">
        <span>Search-ready / 検索対応予定</span>
        <span>Position filter / ポジション絞り込み</span>
        <span>Source review / 出典確認</span>
      </div>

      <section className="playerCardGrid" aria-label="Player research cards">
        {players.map((player, index) => {
          const playerIssues = issues.filter((issue) => issue.entityId === player.id);
          return (
            <Link
              className={`miniArticleCard tone-${index % 4}`}
              href={`/players/${player.id}`}
              key={player.id}
              style={{ "--enter-d": `${index * 85}ms` } as CSSProperties & Record<"--enter-d", string>}
            >
              <div className="miniArticleVisual" aria-hidden="true">
                <span>{player.position}</span>
              </div>
              <div className="miniArticleBody">
                <p className="eyebrow">{player.club}</p>
                <h2>{player.name}</h2>
                <p>{player.researchNote}</p>
                <p className="jp">{player.researchNoteJa}</p>
                <div>
                  <span className={playerIssues.length ? "pill danger" : "pill"}>
                    {playerIssues.length} issues / 不備
                  </span>
                  <span className="pill">{player.goals + player.assists} G+A</span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="tableShell">
        <table>
          <thead>
            <tr>
              <th>Name / 選手</th>
              <th>Club / 所属</th>
              <th>League / リーグ</th>
              <th>Position / 位置</th>
              <th>Goals / 得点</th>
              <th>Assists / A</th>
              <th>Issues / 不備</th>
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
