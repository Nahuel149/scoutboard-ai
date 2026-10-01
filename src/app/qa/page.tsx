import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import { players, teams } from "@/lib/sample-data";
import { summarizeIssues, validateData } from "@/lib/validation";

export default function DataQaPage() {
  const issues = validateData(players, teams);
  const summary = summarizeIssues(issues);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow"><UI text="Data QA / データ確認" /></p>
        <h1><T text={pageTitles["/qa"]} /></h1>
        <p><LocalizedContent en={<>Open findings from the player and team sample records.</>} ja={<>
          選手・チームのサンプルデータから見つかった未対応の確認事項です。
        </>} es={<>
          Hallazgos pendientes en los datos de muestra de jugadores y equipos.
        </>} /></p>
      </div>

      <section className="metricGrid">
        <article className="metric alert">
          <span><UI text="Critical / 重要" /></span>
          <strong>{summary.critical}</strong>
        </article>
        <article className="metric">
          <span><UI text="Warnings / 注意" /></span>
          <strong>{summary.warning}</strong>
        </article>
        <article className="metric">
          <span><UI text="Info / 確認" /></span>
          <strong>{summary.info}</strong>
        </article>
        <article className="metric">
          <span><UI text="Total / 合計" /></span>
          <strong>{summary.total}</strong>
        </article>
      </section>

      <section className="qaStory">
        <div>
          <p className="eyebrow"><UI text="Review path / 確認の流れ" /></p>
          <h2><LocalizedContent en={<>Find the issue, explain it, leave the next fix clear.</>} ja={<>不備を見つけて、理由と修正案まで残します。</>} es={<>Encontrar el problema, explicar el motivo y dejar clara la corrección.</>} /></h2>
        </div>
        <ol>
          <li><UI text="Catch strange values and missing source fields." /></li>
          <li><UI text="Group findings by severity before they reach a report." /></li>
          <li><UI text="Keep flawed rows as internal QA proof, not final delivery data." /></li>
        </ol>
      </section>

      <div className="tableShell">
        <table>
          <thead>
            <tr>
              <th><UI text="Severity / 重要度" /></th>
              <th><UI text="Entity / 対象" /></th>
              <th><UI text="Field / 項目" /></th>
              <th><UI text="Issue / 内容" /></th>
              <th><UI text="Suggested fix / 修正案" /></th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <span className={`pill ${issue.severity}`}><UI text={issue.severity} /></span>
                </td>
                <td>{issue.entityId}</td>
                <td><UI text={issue.field} /></td>
                <td>
                  <T text={{ en: issue.message, ja: issue.messageJa ?? issue.message, es: issue.messageEs ?? issue.message }} />
                </td>
                <td>
                  <T text={{ en: issue.suggestedFix, ja: issue.suggestedFixJa ?? issue.suggestedFix, es: issue.suggestedFixEs ?? issue.suggestedFix }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
