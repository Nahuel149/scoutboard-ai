import { players } from "@/lib/sample-data";
import { buildPlayerReport } from "@/lib/reports";
import { validatePlayers } from "@/lib/validation";

export default function ReportsPage() {
  const issues = validatePlayers(players);
  const selectedPlayer = players[0];
  const report = buildPlayerReport(selectedPlayer, issues);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Report builder</p>
        <h1>AI-assisted workflow sample</h1>
        <p>
          This page shows the intended draft, source check, and final human QA
          loop without calling an AI API yet.
        </p>
      </div>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow">Selected report</p>
          <h2>{selectedPlayer.name}</h2>
          <p>Player scouting note with source metadata and validation checks.</p>
        </div>
        <div className="qaPanel">
          <p className="eyebrow">Human verification</p>
          <h2>Required before delivery</h2>
          <ul className="checklist">
            <li>Check each factual claim against the source list</li>
            <li>Rewrite draft language for client tone</li>
            <li>Remove any unsupported transfer or injury claims</li>
            <li>Record final review date</li>
          </ul>
        </div>
      </section>

      <section className="reportPreview">
        <pre>{report}</pre>
      </section>
    </div>
  );
}
