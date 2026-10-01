import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import Link from "next/link";
import type { CSSProperties } from "react";
import { players } from "@/lib/sample-data";
import { validatePlayers } from "@/lib/validation";

export default function PlayersPage() {
  const issues = validatePlayers(players);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow"><UI text="Research table / 選手リサーチ" /></p>
        <h1><T text={pageTitles["/players"]} /></h1>
        <p><LocalizedContent en={<>Small sample records for scouting notes, data checks, and report drafts.</>} ja={<>
          スカウティングメモ、データ確認、レポート下書きに使うサンプル選手データです。
        </>} es={<>
          Registros de muestra para notas de scouting, control de datos y borradores de reporte.
        </>} /></p>
      </div>

      <div className="filterBar" aria-label="Static MVP filters">
        <Link className="backLink" href="/players/watchlist"><UI text="Open Americas watchlist" /></Link>
        <span><UI text="Search-ready / 検索対応予定" /></span>
        <span><UI text="Position filter / ポジション絞り込み" /></span>
        <span><UI text="Source review / 出典確認" /></span>
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
                <span><UI text={player.position} /></span>
              </div>
              <div className="miniArticleBody">
                <p className="eyebrow">{player.club}</p>
                <h2>{player.name}</h2>
                <p><LocalizedContent en={<>{player.researchNote}</>} ja={<>{player.researchNoteJa}</>} es={<>{player.researchNoteEs}</>} /></p>
                <div>
                  <span className={playerIssues.length ? "pill danger" : "pill"}>
                    {playerIssues.length} <UI text="issues / 不備 / errores" /></span>
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
              <th><UI text="Name / 選手" /></th>
              <th><UI text="Club / 所属" /></th>
              <th><UI text="League / リーグ" /></th>
              <th><UI text="Position / 位置" /></th>
              <th><UI text="Goals / 得点" /></th>
              <th><UI text="Assists / A" /></th>
              <th><UI text="Issues / 不備" /></th>
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
                  <td><UI text={player.position} /></td>
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
