import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import Link from "next/link";
import { LocalizedReportBuilder } from "./localized-builder";
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
        <p className="eyebrow"><UI text="Report builder / レポート作成 / Reportes" /></p>
        <h1><T text={pageTitles["/reports"]} /></h1>
        <p><LocalizedContent en={<>
          Report exports are deliberately plain: source, method, metrics, caveats, and
          final human review before the file leaves the desk.
        </>} ja={<>
          出典、方法、指標、注意点を残したまま、納品前に人が確認できる形で出力します。
        </>} es={<>
          Exporta reportes simples, con fuente, método, métricas y límites visibles antes de entregar.
        </>} /></p>
      </div>

      <LocalizedReportBuilder />
      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow"><UI text="Selected sample / 選択中" /></p>
          <h2>{selectedPlayer.name}</h2>
          <p><LocalizedContent en={<>A player note that keeps source metadata and validation checks nearby.</>} ja={<>出典情報とデータ確認を近くに置いた選手レポートの下書きです。</>} es={<>Un borrador de jugador con fuentes y control de datos a la vista.</>} /></p>
        </div>
        <div className="qaPanel">
          <p className="eyebrow"><UI text="Export options / 出力" /></p>
          <h2><UI text="Markdown now, PDF through print." /></h2>
          <ul className="checklist">
            <li><UI text="Markdown downloads from a server route" /></li>
            <li><UI text="Printable page keeps EN, JA, and ES text readable" /></li>
            <li><UI text="PDF export uses the browser print dialog" /></li>
          </ul>
          <Link className="backLink" href="/proof/before-after">
            <UI text="Open before/after proof" /></Link>
        </div>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow"><UI text="Synthetic player report" /></p>
          <h2><UI text="Source-backed player draft" /></h2>
        </div>
        <pre>{playerReport}</pre>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow"><UI text="Player report / StatsBomb Open Data" /></p>
          <h2>{analyticsPlayer.player} {" "}<UI text="shot-quality note" /></h2>
          <p><LocalizedContent en={<>
            This draft connects the analytics room to delivery. It uses open event data
            and keeps the sample limitation visible.
          </>} ja={<>分析画面の内容を、そのまま確認しやすいレポートに変換します。</>} es={<>Conecta el análisis con una entrega clara: datos abiertos, métrica y revisión humana.</>} /></p>
          <div className="reportActions">
            <a className="primaryAction" href={`/reports/export?kind=player&player=${encodeURIComponent(analyticsPlayer.player)}`}>
              <UI text="Download Markdown" /></a>
            <a className="backLink" href={`/reports/print?kind=player&player=${encodeURIComponent(analyticsPlayer.player)}`}>
              <UI text="Print PDF" /></a>
          </div>
        </div>
        <pre>{analyticsReport}</pre>
      </section>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow"><UI text="Match report / Informe de competencia" /></p>
          <h2><UI text="Copa America forward ranking report" /></h2>
          <p><LocalizedContent en={<>Clean export for the full forward board, available as Markdown or print-ready PDF.</>} ja={<>ランキング全体をMarkdownまたは印刷用PDFとして出力できます。</>} es={<>Reporte completo del ranking, listo para Markdown o PDF desde impresión.</>} /></p>
          <div className="reportActions">
            <a className="primaryAction" href="/reports/export?kind=match">
              <UI text="Download Markdown" /></a>
            <a className="backLink" href="/reports/print?kind=match">
              <UI text="Print PDF" /></a>
          </div>
        </div>
        <pre>{matchReport}</pre>
      </section>
    </div>
  );
}
