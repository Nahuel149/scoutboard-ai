import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { players } from "@/lib/sample-data";
import { buildPlayerReport } from "@/lib/reports";
import { validatePlayers } from "@/lib/validation";

export function generateStaticParams() {
  return players.map((player) => ({ id: player.id }));
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = players.find((item) => item.id === id);

  if (!player) {
    notFound();
  }

  const issues = validatePlayers(players);
  const playerIssues = issues.filter((issue) => issue.entityId === player.id);
  const report = buildPlayerReport(player, issues);

  return (
    <div className="pageStack">
      <Link className="backLink" href="/players">
        <ArrowLeft size={16} aria-hidden="true" />
        Players
      </Link>

      <section className="detailHero">
        <div>
          <p className="eyebrow">{player.club}</p>
          <h1>{player.name}</h1>
          <p>{player.researchNote}</p>
        </div>
        <div className="profileGrid">
          <span>Age <strong>{player.age}</strong></span>
          <span>Position <strong>{player.position}</strong></span>
          <span>Foot <strong>{player.preferredFoot}</strong></span>
          <span>Value <strong>EUR {player.marketValueEur.toLocaleString()}</strong></span>
        </div>
      </section>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow">Source notes</p>
          <h2>Research metadata</h2>
          <p>{player.sourceName || "Missing source name"}</p>
          <p className="muted">{player.sourceUrl || "Missing source URL"}</p>
          <p className="muted">Last checked: {player.lastCheckedAt || "Missing"}</p>
        </div>

        <div className="qaPanel">
          <p className="eyebrow">Delivery checklist</p>
          <h2>Before export</h2>
          <ul className="checklist">
            <li>Confirm source metadata</li>
            <li>Review data warnings</li>
            <li>Separate facts from scouting opinion</li>
            <li>Human-edit final wording</li>
          </ul>
        </div>
      </section>

      <section className="sectionHeader">
        <p className="eyebrow">Open issues</p>
        <h2>{playerIssues.length} validation findings</h2>
      </section>
      <div className="issueList">
        {playerIssues.length === 0 ? (
          <p className="emptyState">No validation issues for this player.</p>
        ) : (
          playerIssues.map((issue) => (
            <article key={issue.id} className="issueItem">
              <span className={`pill ${issue.severity}`}>{issue.severity}</span>
              <strong>{issue.field}</strong>
              <p>{issue.message}</p>
              <small>{issue.suggestedFix}</small>
            </article>
          ))
        )}
      </div>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow">Markdown export preview</p>
          <h2>Player report draft</h2>
        </div>
        <button className="iconButton" type="button" aria-label="Export available in next milestone">
          <Download size={18} aria-hidden="true" />
        </button>
        <pre>{report}</pre>
      </section>
    </div>
  );
}
