import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { players, teams } from "@/lib/sample-data";
import { getCompletenessScore, summarizeIssues, validateData } from "@/lib/validation";

export default function DashboardPage() {
  const issues = validateData(players, teams);
  const summary = summarizeIssues(issues);
  const completeness = getCompletenessScore(players.length + teams.length, issues.length);
  const topPlayers = [...players]
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 3);
  const featureCards = [
    {
      tone: "amber",
      kicker: "Research note",
      title: "A midfield profile with source checks attached.",
      meta: "Mateo Alvarez / River Norte",
      href: "/players/p-001",
    },
    {
      tone: "blue",
      kicker: "QA finding",
      title: "One flawed import row becomes a client-ready data issue report.",
      meta: `${summary.total} open findings`,
      href: "/qa",
    },
    {
      tone: "green",
      kicker: "Report builder",
      title: "Draft, source list, and final human verification in one workflow.",
      meta: "Markdown preview",
      href: "/reports",
    },
  ];

  return (
    <div className="pageStack">
      <section className="heroBand">
        <div>
          <p className="eyebrow">Portfolio MVP</p>
          <h1>Football research with a QA trail.</h1>
          <p>
            ScoutBoard AI turns sample player and team data into validation
            evidence, research notes, and export-ready report drafts.
          </p>
        </div>
        <Link className="primaryAction" href="/qa">
          Review issues
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="featureRail" aria-label="Featured ScoutBoard workflows">
        {featureCards.map((card, index) => (
          <Link
            className={`featureCard ${card.tone}`}
            href={card.href}
            key={card.title}
            style={{ "--enter-d": `${index * 110}ms` } as CSSProperties & Record<"--enter-d", string>}
          >
            <div className="featureImage" aria-hidden="true">
              <span className="pitchLine one" />
              <span className="pitchLine two" />
              <span className="ballDot" />
            </div>
            <div className="featureCaption">
              <p className="eyebrow">{card.kicker}</p>
              <h2>{card.title}</h2>
              <span>{card.meta}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="metricGrid" aria-label="Project metrics">
        <article className="metric">
          <Users size={20} aria-hidden="true" />
          <span>Players</span>
          <strong>{players.length}</strong>
        </article>
        <article className="metric">
          <TrendingUp size={20} aria-hidden="true" />
          <span>Teams</span>
          <strong>{teams.length}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Completeness</span>
          <strong>{completeness}%</strong>
        </article>
        <article className="metric alert">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Open issues</span>
          <strong>{summary.total}</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow">Player board</p>
            <h2>Top contribution snapshot</h2>
          </div>
          <div className="tableShell">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Club</th>
                  <th>Pos</th>
                  <th>G+A</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <Link href={`/players/${player.id}`}>{player.name}</Link>
                    </td>
                    <td>{player.club}</td>
                    <td>{player.position}</td>
                    <td>{player.goals + player.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="qaPanel">
          <p className="eyebrow">QA summary</p>
          <h2>Validation catches flawed import rows.</h2>
          <div className="severityGrid">
            <span>Critical <strong>{summary.critical}</strong></span>
            <span>Warning <strong>{summary.warning}</strong></span>
            <span>Info <strong>{summary.info}</strong></span>
          </div>
          <p>
            The intentionally flawed sample player proves the workflow can find
            missing sources, impossible values, and consistency problems before a
            report is delivered.
          </p>
        </div>
      </section>

      <section className="tagMarquee" aria-label="Portfolio proof tags">
        <span>Data QA</span>
        <span>Research notes</span>
        <span>Source policy</span>
        <span>Report drafts</span>
        <span>Vitest checks</span>
        <span>Portfolio proof</span>
      </section>
    </div>
  );
}
