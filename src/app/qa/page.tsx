import { players, teams } from "@/lib/sample-data";
import { summarizeIssues, validateData } from "@/lib/validation";

export default function DataQaPage() {
  const issues = validateData(players, teams);
  const summary = summarizeIssues(issues);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Data QA / データ確認</p>
        <h1>Data check report</h1>
        <p>Open findings from the player and team sample records.</p>
        <p className="jp">
          選手・チームのサンプルデータから見つかった未対応の確認事項です。
        </p>
      </div>

      <section className="metricGrid">
        <article className="metric alert">
          <span>Critical / 重要</span>
          <strong>{summary.critical}</strong>
        </article>
        <article className="metric">
          <span>Warnings / 注意</span>
          <strong>{summary.warning}</strong>
        </article>
        <article className="metric">
          <span>Info / 確認</span>
          <strong>{summary.info}</strong>
        </article>
        <article className="metric">
          <span>Total / 合計</span>
          <strong>{summary.total}</strong>
        </article>
      </section>

      <section className="qaStory">
        <div>
          <p className="eyebrow">Review path / 確認の流れ</p>
          <h2>Find the issue, explain it, leave the next fix clear.</h2>
          <p className="jp">不備を見つけて、理由と修正案まで残します。</p>
        </div>
        <ol>
          <li>Catch strange values and missing source fields.</li>
          <li>Group findings by severity before they reach a report.</li>
          <li>Keep flawed rows as internal QA proof, not final delivery data.</li>
        </ol>
      </section>

      <div className="tableShell">
        <table>
          <thead>
            <tr>
              <th>Severity / 重要度</th>
              <th>Entity / 対象</th>
              <th>Field / 項目</th>
              <th>Issue / 内容</th>
              <th>Suggested fix / 修正案</th>
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
                <td>
                  {issue.message}
                  {issue.messageJa ? <span className="jp tableSubline">{issue.messageJa}</span> : null}
                </td>
                <td>
                  {issue.suggestedFix}
                  {issue.suggestedFixJa ? (
                    <span className="jp tableSubline">{issue.suggestedFixJa}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
