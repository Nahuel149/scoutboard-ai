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
        <p className="eyebrow">Report builder / レポート作成</p>
        <h1>Draft with AI, check it like a human.</h1>
        <p>
          This page does not call an AI API yet. It shows the workflow I want:
          draft the report, check the sources, then edit the wording before
          delivery.
        </p>
        <p className="jp">
          まだAI APIは使っていません。まずは「下書き、出典確認、人の目での最終調整」
          という納品前の流れを見せています。
        </p>
      </div>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow">Selected report / 選択中</p>
          <h2>{selectedPlayer.name}</h2>
          <p>A player note that keeps source metadata and validation checks nearby.</p>
          <p className="jp">出典情報とデータ確認を近くに置いた選手レポートの下書きです。</p>
        </div>
        <div className="qaPanel">
          <p className="eyebrow">Human verification / 納品前チェック</p>
          <h2>Before this leaves the desk</h2>
          <ul className="checklist">
            <li>Check each factual claim against the source list</li>
            <li>Make the wording fit the client, not the tool</li>
            <li>Remove unsupported transfer or injury claims</li>
            <li>Record the final review date</li>
          </ul>
          <ul className="checklist jp">
            <li>事実関係を出典リストで確認</li>
            <li>クライアント向けの自然な文章に調整</li>
            <li>根拠のない移籍・怪我の話は削除</li>
            <li>最終確認日を記録</li>
          </ul>
        </div>
      </section>

      <section className="reportPreview">
        <pre>{report}</pre>
      </section>
    </div>
  );
}
