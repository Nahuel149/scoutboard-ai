import { players } from "@/lib/sample-data";
import {
  buildForwardMatchReport,
  buildForwardShotQualityReport,
  buildPlayerReport,
} from "@/lib/reports";
import { topForwardShotQualityPlayers } from "@/lib/statsbomb-forward-shot-quality";
import { validatePlayers } from "@/lib/validation";

export default function ReportsPage() {
  const issues = validatePlayers(players);
  const selectedPlayer = players[0];
  const playerReport = buildPlayerReport(selectedPlayer, issues);
  const analyticsPlayer = topForwardShotQualityPlayers[0];
  const analyticsReport = buildForwardShotQualityReport(analyticsPlayer);
  const matchReport = buildForwardMatchReport(topForwardShotQualityPlayers);

  return (
    <div className="pageStack">
      <div className="sectionHeader">
        <p className="eyebrow">Report builder / レポート作成 / Reportes</p>
        <h1>Write the report, then show the checks.</h1>
        <p>
          Report exports are deliberately plain: source, method, metrics, caveats, and
          final human review before the file leaves the desk.
        </p>
        <p className="jp">
          出典、方法、指標、注意点を残したまま、納品前に人が確認できる形で出力します。
        </p>
        <p className="es">
          Exporta reportes simples, con fuente, método, métricas y límites visibles antes de entregar.
        </p>
      </div>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow">Selected sample / 選択中</p>
          <h2>{selectedPlayer.name}</h2>
          <p>A player note that keeps source metadata and validation checks nearby.</p>
          <p className="jp">出典情報とデータ確認を近くに置いた選手レポートの下書きです。</p>
          <p className="es">Un borrador de jugador con fuentes y control de datos a la vista.</p>
        </div>
        <div className="qaPanel">
          <p className="eyebrow">Export options / 出力</p>
          <h2>Markdown now, PDF through print.</h2>
          <ul className="checklist">
            <li>Markdown downloads from a server route</li>
            <li>Printable page keeps EN, JA, and ES text readable</li>
            <li>PDF export uses the browser print dialog</li>
          </ul>
        </div>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow">Synthetic player report</p>
          <h2>Source-backed player draft</h2>
        </div>
        <pre>{playerReport}</pre>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow">Player report / StatsBomb Open Data</p>
          <h2>{analyticsPlayer.player} shot-quality note</h2>
          <p>
            This draft connects the analytics room to delivery. It uses open event data
            and keeps the sample limitation visible.
          </p>
          <p className="jp">分析画面の内容を、そのまま確認しやすいレポートに変換します。</p>
          <p className="es">Conecta el análisis con una entrega clara: datos abiertos, métrica y revisión humana.</p>
          <div className="reportActions">
            <a className="primaryAction" href={`/reports/export?kind=player&player=${encodeURIComponent(analyticsPlayer.player)}`}>
              Download Markdown
            </a>
            <a className="backLink" href={`/reports/print?kind=player&player=${encodeURIComponent(analyticsPlayer.player)}`}>
              Print PDF
            </a>
          </div>
        </div>
        <pre>{analyticsReport}</pre>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow">Match report / Informe de competencia</p>
          <h2>Copa America forward ranking report</h2>
          <p>Clean export for the full forward board, available as Markdown or print-ready PDF.</p>
          <p className="jp">ランキング全体をMarkdownまたは印刷用PDFとして出力できます。</p>
          <p className="es">Reporte completo del ranking, listo para Markdown o PDF desde impresión.</p>
          <div className="reportActions">
            <a className="primaryAction" href="/reports/export?kind=match">
              Download Markdown
            </a>
            <a className="backLink" href="/reports/print?kind=match">
              Print PDF
            </a>
          </div>
        </div>
        <pre>{matchReport}</pre>
      </section>
    </div>
  );
}
