import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import Link from "next/link";
import { ArrowLeft, Database, ListChecks, Search, ShieldAlert } from "lucide-react";
import {
  leagueCoverage,
  leagueCoverageRows,
  leaguesNeedingClubReview,
  strongestCoverageLeagues,
} from "@/lib/league-coverage";

export default function LeagueCoveragePage() {
  const { summary } = leagueCoverage;

  return (
    <div className="pageStack">
      <Link className="backLink" href="/workspace">
        <ArrowLeft size={16} aria-hidden="true" />
        <UI text="Back to workspace" /></Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow"><UI text="Americas coverage / 選手DB / Cobertura americana" /></p>
          <h1><T text={pageTitles["/workspace/league-coverage"]} /></h1>
          <p><LocalizedContent en={<>
            The watchlist should start with honest coverage. This board shows what was imported,
            where club rows are missing, and what still needs manual review.
          </>} ja={<>
            選手検索の前に、どのリーグとクラブがどこまで取得できているかを確認します。
          </>} es={<>
            Antes de hacer scouting, revisamos cobertura por liga, clubes faltantes y estado de revisión.
          </>} /></p>
        </div>
        <Link className="primaryAction" href="/players">
          <UI text="Open sample players" /></Link>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Database size={20} aria-hidden="true" />
          <span><UI text="Player rows" /></span>
          <strong>{summary.total_player_rows.toLocaleString("en-US")}</strong>
        </article>
        <article className="metric">
          <ListChecks size={20} aria-hidden="true" />
          <span><UI text="League files" /></span>
          <strong>{summary.league_files}</strong>
        </article>
        <article className="metric">
          <Search size={20} aria-hidden="true" />
          <span><UI text="Clubs with rows" /></span>
          <strong>{summary.clubs_with_rows}/{summary.total_clubs}</strong>
        </article>
        <article className={summary.clubs_without_rows > 0 ? "metric alert" : "metric"}>
          <ShieldAlert size={20} aria-hidden="true" />
          <span><UI text="Missing club rows" /></span>
          <strong>{summary.clubs_without_rows}</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow"><UI text="Coverage table / Tabla de cobertura" /></p>
            <h2><UI text="What we can search next" /></h2>
            <p>
              <UI text="Every row comes from the generated coverage summary, not from live scraping. All rows remain marked for manual review before public scouting claims." /></p>
          </div>
          <div className="tableShell readinessTable">
            <table>
              <thead>
                <tr>
                  <th><UI text="League" /></th>
                  <th><UI text="Players" /></th>
                  <th><UI text="Clubs" /></th>
                  <th><UI text="Missing clubs" /></th>
                  <th><UI text="Source" /></th>
                  <th><UI text="Review" /></th>
                </tr>
              </thead>
              <tbody>
                {leagueCoverageRows.map((league) => (
                  <tr key={league.file}>
                    <td>
                      {league.league_season}
                      <span className="tableSubline">{league.import_scope}</span>
                    </td>
                    <td>{league.player_rows.toLocaleString("en-US")}</td>
                    <td>
                      {league.clubs_with_rows}/{league.club_count}
                    </td>
                    <td>
                      {league.clubs_without_rows === 0 ? (
                        <span className="pill"><UI text="none" /></span>
                      ) : (
                        <>
                          <span className="pill warning">{league.clubs_without_rows} {" "}<UI text="missing" /></span>
                          <span className="tableSubline">{league.missing_club_names}</span>
                        </>
                      )}
                    </td>
                    <td>
                      <a href={league.league_source} rel="noreferrer" target="_blank">
                        {league.source_name}
                      </a>
                      <span className="tableSubline">{league.source_license}</span>
                    </td>
                    <td>{league.review_status.replaceAll("_", " ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="qaPanel workspacePanel">
          <p className="eyebrow"><UI text="Next watchlist work" /></p>
          <h2><UI text="Search only after coverage is visible." /></h2>
          <p>
            <UI text="The next player-board step should load small reviewed slices first: league, club, player, source URL, import date, and confidence status." /></p>
          <div className="profileGrid">
            <span><UI text="Complete leagues" />{" "}<strong>{strongestCoverageLeagues.length}</strong></span>
            <span><UI text="Needs club review" />{" "}<strong>{leaguesNeedingClubReview.length}</strong></span>
            <span><UI text="Source" />{" "}<strong>Wikidata CC0</strong></span>
            <span><UI text="Display rule" />{" "}<strong><UI text="Needs review" /></strong></span>
          </div>
          <Link className="backLink" href="/workspace/data-readiness">
            <UI text="Check data rules" /></Link>
        </aside>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow"><UI text="Manual review queue" /></p>
          <h2><UI text="Missing-club rows become tasks, not hidden errors." /></h2>
          <p>
            <UI text="Leagues with missing club rows are still useful, but they should produce review tasks before the data becomes part of a player recommendation." /></p>
        </div>
        <div className="providerMiniList">
          {leaguesNeedingClubReview.slice(0, 6).map((league) => (
            <div className="providerMiniRow" key={league.file}>
              <span>{league.league_season}</span>
              <strong>{league.clubs_without_rows} {" "}<UI text="missing" /></strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
