import Link from "next/link";
import { ArrowLeft, CalendarDays, Database, ShieldCheck, Trophy } from "lucide-react";
import { fetchFootballDataCompetitionMatches } from "@/lib/data-providers";
import type { FootballDataMatch } from "@/lib/data-providers/football-data-org";
import { DataProviderError } from "@/lib/data-providers/types";

export const dynamic = "force-dynamic";

type ChampionsLoadResult =
  | {
      status: "ready";
      data: Awaited<ReturnType<typeof fetchFootballDataCompetitionMatches>>;
    }
  | {
      status: "missing-key" | "error";
      message: string;
    };

async function loadChampionsLeague(): Promise<ChampionsLoadResult> {
  try {
    const data = await fetchFootballDataCompetitionMatches("CL");
    return { status: "ready", data };
  } catch (error) {
    if (error instanceof DataProviderError) {
      return {
        status: error.message.includes("FOOTBALL_DATA_API_TOKEN") ? "missing-key" : "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to load Champions League data.",
    };
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function scoreLabel(match: FootballDataMatch) {
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;

  if (home === null || home === undefined || away === null || away === undefined) {
    return match.status;
  }

  return `${home}-${away}`;
}

export default async function ChampionsAnalyticsPage() {
  const result = await loadChampionsLeague();
  const matches = result.status === "ready" ? result.data.matches : [];
  const finishedMatches = matches.filter((match) => match.status === "FINISHED");
  const scheduledMatches = matches.filter((match) => ["TIMED", "SCHEDULED"].includes(match.status));
  const liveMatches = matches.filter((match) => ["IN_PLAY", "PAUSED"].includes(match.status));
  const nextMatches = scheduledMatches.slice(0, 8);
  const recentResults = [...finishedMatches].slice(-8).reverse();
  const stageRows = [...matches.reduce((map, match) => {
    const key = match.stage ?? "Unknown";
    const current = map.get(key) ?? { stage: key, total: 0, played: 0 };
    current.total += 1;
    current.played += match.status === "FINISHED" ? 1 : 0;
    map.set(key, current);
    return map;
  }, new Map<string, { stage: string; total: number; played: number }>()).values()];
  const played = result.status === "ready" ? result.data.resultSet?.played ?? 0 : 0;
  const total = result.status === "ready" ? result.data.resultSet?.count ?? result.data.matches.length : 0;
  const competitionName =
    result.status === "ready" ? result.data.competition?.name ?? "UEFA Champions League" : "UEFA Champions League";

  return (
    <div className="pageStack">
      <Link className="backLink" href="/analytics">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to analytics
      </Link>

      <section className="detailHero championsHero">
        <div>
          <p className="eyebrow">Football-Data.org / Champions League / Datos actuales</p>
          <h1>Champions League ETL demo.</h1>
          <p>
            This page is the basic-data side of ScoutBoard AI: fixtures, results, match
            status, and competition metadata from Football-Data.org.
          </p>
          <p className="jp">
            Football-Data.orgから試合日程、結果、ステータスを取得するETLデモです。
          </p>
          <p className="es">
            Una vista simple para mostrar partidos, resultados y estado de Champions con Football-Data.org.
          </p>
        </div>
        <div className="profileGrid">
          <span>Provider <strong>Football-Data.org</strong></span>
          <span>Competition <strong>{competitionName}</strong></span>
          <span>Status <strong>{result.status === "ready" ? "Connected" : "Needs token"}</strong></span>
        </div>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Trophy size={20} aria-hidden="true" />
          <span>Competition</span>
          <strong>{result.status === "ready" ? result.data.competition?.code ?? "CL" : "CL"}</strong>
        </article>
        <article className="metric">
          <CalendarDays size={20} aria-hidden="true" />
          <span>Matches loaded</span>
          <strong>{total}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Played</span>
          <strong>{played}</strong>
        </article>
        <article className={result.status === "ready" ? "metric" : "metric alert"}>
          <Database size={20} aria-hidden="true" />
          <span>Provider state</span>
          <strong>{result.status === "ready" ? "Live" : "Config"}</strong>
        </article>
      </section>

      {result.status === "ready" ? (
        <>
          <section className="championsContextGrid">
            <article className="qaPanel">
              <p className="eyebrow">Competition state</p>
              <h2>{liveMatches.length ? "Live matches are present." : "Live context loaded."}</h2>
              <div className="severityGrid">
                <span>Finished <strong>{finishedMatches.length}</strong></span>
                <span>Scheduled <strong>{scheduledMatches.length}</strong></span>
                <span>Live <strong>{liveMatches.length}</strong></span>
              </div>
              <p className="es">Datos básicos para contexto actualizado: fecha, fase, equipos, estado y resultado.</p>
            </article>
            <article className="qaPanel">
              <p className="eyebrow">Stage coverage</p>
              <div className="barList">
                {stageRows.map((row) => (
                  <div className="barRow" key={row.stage}>
                    <span>{row.stage.replaceAll("_", " ").toLowerCase()}</span>
                    <div className="barTrack">
                      <div className="barFill" style={{ width: `${Math.max(5, Math.round((row.played / row.total) * 100))}%` }} />
                    </div>
                    <strong>{row.played}/{row.total}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="split">
            <div className="qaPanel">
              <p className="eyebrow">Next matches / Próximos</p>
              <h2>Upcoming Champions fixtures</h2>
              <div className="compactMatchList">
                {nextMatches.map((match) => (
                  <div className="compactMatch" key={match.id}>
                    <span>{formatDate(match.utcDate)}</span>
                    <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong>
                    <small>{match.stage ?? "TBC"} · {match.group ?? "No group"}</small>
                  </div>
                ))}
                {nextMatches.length === 0 && <p className="muted">No upcoming matches returned by the API.</p>}
              </div>
            </div>
            <div className="qaPanel">
              <p className="eyebrow">Latest results / Últimos</p>
              <h2>Recent finished matches</h2>
              <div className="compactMatchList">
                {recentResults.map((match) => (
                  <div className="compactMatch" key={match.id}>
                    <span>{formatDate(match.utcDate)}</span>
                    <strong>{match.homeTeam.name} {scoreLabel(match)} {match.awayTeam.name}</strong>
                    <small>{match.stage ?? "TBC"} · matchday {match.matchday ?? "N/A"}</small>
                  </div>
                ))}
                {recentResults.length === 0 && <p className="muted">No finished matches returned by the API.</p>}
              </div>
            </div>
          </section>

          <section className="tableShell">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Stage</th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>{formatDate(match.utcDate)}</td>
                    <td>
                      {match.stage ?? "TBC"}
                      {match.matchday ? <span className="tableSubline">Matchday {match.matchday}</span> : null}
                    </td>
                    <td>{match.homeTeam.name}</td>
                    <td>{match.awayTeam.name}</td>
                    <td>
                      <span className="pill">{match.status.toLowerCase()}</span>
                    </td>
                    <td>{scoreLabel(match)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <section className="qaStory championsStatus">
          <div>
            <p className="eyebrow">Provider ready / Token pendiente</p>
            <h2>Football-Data.org is wired, but the local token is not configured.</h2>
            <p>
              Add `FOOTBALL_DATA_API_TOKEN` to `.env.local`, restart the dev server, and this
              page will render Champions League matches from the API.
            </p>
            <p className="jp">
              `.env.local`にトークンを追加すると、このページでChampions Leagueの試合データを表示できます。
            </p>
            <p className="es">
              Cuando agreguemos el token en `.env.local`, esta pantalla va a mostrar partidos reales de Champions.
            </p>
          </div>
          <div className="reportPreview inlineCodeBlock">
            <pre>{`FOOTBALL_DATA_API_TOKEN=your_local_token_here\n\nnpm run dev\n# open /analytics/champions`}</pre>
          </div>
        </section>
      )}

      <section className="qaPanel">
        <p className="eyebrow">Scope / Alcance</p>
        <h2>Basic current-data demo, not xG.</h2>
        <p>
          This provider is useful for updated competition context. Advanced shot quality and
          event-level xG stay in the StatsBomb Open Data module.
        </p>
        <p className="es">
          Sirve para contexto actualizado de competencia. El xG y eventos detallados siguen en el módulo StatsBomb.
        </p>
      </section>
    </div>
  );
}
