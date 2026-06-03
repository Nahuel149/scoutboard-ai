import { players, teams } from "@/lib/sample-data";
import { summarizeIssues, validateData } from "@/lib/validation";

export default function DataQaPage() {
  const issues = validateData(players, teams);
  const summary = summarizeIssues(issues);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Data QA</p>
        <h1>Validation report</h1>
        <p>Open findings from player and team sample records.</p>
      </div>

      <section className="metricGrid">
        <article className="metric alert">
          <span>Critical</span>
          <strong>{summary.critical}</strong>
        </article>
        <article className="metric">
          <span>Warnings</span>
          <strong>{summary.warning}</strong>
        </article>
        <article className="metric">
          <span>Info</span>
          <strong>{summary.info}</strong>
        </article>
        <article className="metric">
          <span>Total</span>
          <strong>{summary.total}</strong>
        </article>
      </section>

      <div className="tableShell">
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Entity</th>
              <th>Field</th>
              <th>Issue</th>
              <th>Suggested fix</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <span className={`pill ${issue.severity}`}>{issue.severity}</span>
                </td>
                <td>{issue.entityId}</td>
                <td>{issue.field}</td>
                <td>{issue.message}</td>
                <td>{issue.suggestedFix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
