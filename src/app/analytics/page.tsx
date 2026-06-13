import Link from "next/link";
import { ArrowRight, Database, Target, TrendingUp } from "lucide-react";
import {
  forwardShotQualityData,
  topForwardShotQualityPlayers,
  topForwardShotQualityTeams,
} from "@/lib/statsbomb-forward-shot-quality";

const maxPlayerXg = Math.max(...topForwardShotQualityPlayers.map((player) => player.non_penalty_xg));
const maxTeamXg = Math.max(...topForwardShotQualityTeams.map((team) => team.xg));

function percent(value: number, max: number) {
  if (max === 0) {
    return "0%";
  }

  return `${Math.max(4, Math.round((value / max) * 100))}%`;
}

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default function AnalyticsPage() {
  const { source, summary } = forwardShotQualityData;

  return (
    <div className="pageStack">
      <section className="detailHero analyticsHero">
        <div>
          <p className="eyebrow">Event analytics / イベント分析 / Análisis de eventos</p>
          <h1>Shot quality for South American forwards.</h1>
          <p>
            This module uses StatsBomb Open Data from Copa America 2024 to turn raw shots
            into a clean xG board for forwards and wingers.
          </p>
          <p className="jp">
            Copa America 2024のStatsBomb Open Dataを使い、FWとウイングのシュートをxGで整理します。
          </p>
          <p className="es">
            Usa datos abiertos de StatsBomb de la Copa America 2024 para medir calidad de
            remate en delanteros y extremos sudamericanos.
          </p>
        </div>
        <Link className="primaryAction" href="/reports">
          Turn into report
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Database size={20} aria-hidden="true" />
          <span>Matches / 試合 / Partidos</span>
          <strong>{summary.matches}</strong>
        </article>
        <article className="metric">
          <Target size={20} aria-hidden="true" />
          <span>Forward shots / シュート / Remates</span>
          <strong>{summary.total_forward_shots}</strong>
        </article>
        <article className="metric">
          <TrendingUp size={20} aria-hidden="true" />
          <span>Total xG / 合計xG</span>
          <strong>{formatNumber(summary.total_forward_xg, 1)}</strong>
        </article>
        <article className="metric">
          <Target size={20} aria-hidden="true" />
          <span>Players / 選手 / Jugadores</span>
          <strong>{summary.players}</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow">Best forward chances / FWチャンス / Mejores ocasiones</p>
            <h2>Ranked by non-penalty xG</h2>
            <p>
              Penalties are separated so the first read focuses on repeatable shot quality:
              location, chance volume, and open-play danger.
            </p>
            <p className="jp">PKを分けて、流れの中で作ったチャンスの質を見ます。</p>
            <p className="es">Los penales quedan separados para leer mejor el peligro en jugada abierta.</p>
          </div>
          <div className="tableShell">
            <table>
              <thead>
                <tr>
                  <th>Player / 選手</th>
                  <th>Team / 代表</th>
                  <th>Shots</th>
                  <th>NP xG</th>
                  <th>xG/shot</th>
                  <th>Goals-xG</th>
                </tr>
              </thead>
              <tbody>
                {topForwardShotQualityPlayers.map((player) => (
                  <tr key={`${player.player}-${player.team}`}>
                    <td>
                      <strong>{player.player}</strong>
                      <span className="tableSubline">{player.positions}</span>
                    </td>
                    <td>{player.team}</td>
                    <td>{player.shots}</td>
                    <td>{formatNumber(player.non_penalty_xg)}</td>
                    <td>{formatNumber(player.avg_non_penalty_xg_per_shot, 3)}</td>
                    <td>{formatNumber(player.goal_minus_xg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="qaPanel">
          <p className="eyebrow">Method / 方法 / Método</p>
          <h2>From events to scouting question</h2>
          <p>
            The script downloads matches and event JSON, filters South American teams,
            keeps forward and winger positions, then aggregates shot quality metrics.
          </p>
          <p className="jp">
            試合とイベントJSONを取得し、南米代表のFW/ウイングだけを抽出して集計します。
          </p>
          <p className="es">
            El script descarga eventos, filtra selecciones sudamericanas y resume métricas
            de remate para atacantes.
          </p>
          <div className="severityGrid">
            <span>Source <strong>{source.name}</strong></span>
            <span>Competition <strong>{source.competition}</strong></span>
            <span>Scope <strong>{summary.teams} teams</strong></span>
          </div>
          <Link className="backLink" href="/players">
            Compare with player base
          </Link>
        </aside>
      </section>

      <section className="qaStory analyticsStory">
        <div>
          <p className="eyebrow">Team xG / チーム別xG / xG por equipo</p>
          <h2>Where the forward shot volume came from</h2>
          <p className="jp">国別に、FWとウイングのシュート量とxGを確認します。</p>
          <p className="es">Lectura rápida por selección: volumen de remates y xG de atacantes.</p>
        </div>
        <div className="barList" aria-label="Team xG bars">
          {topForwardShotQualityTeams.map((team) => (
            <div className="barRow" key={team.team}>
              <span>{team.team}</span>
              <div className="barTrack">
                <div className="barFill" style={{ width: percent(team.xg, maxTeamXg) }} />
              </div>
              <strong>{formatNumber(team.xg)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="playerCardGrid" aria-label="Top player xG cards">
        {topForwardShotQualityPlayers.slice(0, 4).map((player, index) => (
          <article className={`miniArticleCard tone-${index % 4}`} key={player.player}>
            <div className="miniArticleVisual" aria-hidden="true">
              <span>{index + 1}</span>
            </div>
            <div className="miniArticleBody">
              <p className="eyebrow">{player.team}</p>
              <h2>{player.player}</h2>
              <p>
                {player.shots} shots, {formatNumber(player.non_penalty_xg)} non-penalty xG,
                average distance {formatNumber(player.avg_shot_distance, 1)}m.
              </p>
              <div className="sparkBar" aria-hidden="true">
                <span style={{ width: percent(player.non_penalty_xg, maxPlayerXg) }} />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
