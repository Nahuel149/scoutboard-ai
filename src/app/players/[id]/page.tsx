import { UI } from "@/app/components/ui-text";
import { LocalizedContent, T } from "@/app/components/language";
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
        <UI text="Players / 選手リスト" /></Link>

      <section className="detailHero">
        <div>
          <p className="eyebrow">{player.club}</p>
          <h1>{player.name}</h1>
          <p><LocalizedContent en={<>{player.researchNote}</>} ja={<>{player.researchNoteJa}</>} es={<>{player.researchNoteEs}</>} /></p>
        </div>
        <div className="profileGrid">
          <span><UI text="Age / 年齢" />{" "}<strong>{player.age}</strong></span>
          <span><UI text="Position / 位置" />{" "}<strong><UI text={player.position} /></strong></span>
          <span><UI text="Foot / 利き足" />{" "}<strong>{player.preferredFoot}</strong></span>
          <span><UI text="Value / 評価額" />{" "}<strong>EUR {player.marketValueEur.toLocaleString()}</strong></span>
        </div>
      </section>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow"><UI text="Source notes / 出典メモ" /></p>
          <h2><LocalizedContent en={<>Where this note comes from</>} ja={<>このメモの根拠として残しておく情報です。</>} es={<>Datos que quedan guardados como respaldo de esta nota.</>} /></h2>
          <p>{player.sourceName || "Missing source name"}</p>
          <p className="muted">{player.sourceUrl || "Missing source URL"}</p>
          <p className="muted"><UI text="Last checked:" />{" "}{player.lastCheckedAt || "Missing"}</p>
        </div>

        <div className="qaPanel">
          <p className="eyebrow"><UI text="Delivery checklist / 納品前チェック" /></p>
          <h2><UI text="Before export" /></h2>
          <ul className="checklist">
            <li><UI text="Confirm source metadata" /></li>
            <li><UI text="Review data warnings" /></li>
            <li><UI text="Separate facts from scouting opinion" /></li>
            <li><UI text="Human-edit final wording" /></li>
          </ul>
        </div>
      </section>

      <section className="sectionHeader">
        <p className="eyebrow"><UI text="Open issues / 未対応の確認事項" /></p>
        <h2><LocalizedContent en={<>{playerIssues.length} validation findings</>} ja={<>この選手データで、まだ確認が必要な項目です。</>} es={<>Puntos de este jugador que todavía necesitan revisión.</>} /></h2>
      </section>
      <div className="issueList">
        {playerIssues.length === 0 ? (
          <p className="emptyState">
            <UI text="No validation issues for this player." />
          </p>
        ) : (
          playerIssues.map((issue) => (
            <article key={issue.id} className="issueItem">
              <span className={`pill ${issue.severity}`}><UI text={issue.severity} /></span>
              <strong><UI text={issue.field} /></strong>
              <p>
                <T text={{ en: issue.message, ja: issue.messageJa ?? issue.message, es: issue.messageEs ?? issue.message }} />
              </p>
              <small>
                <T text={{ en: issue.suggestedFix, ja: issue.suggestedFixJa ?? issue.suggestedFix, es: issue.suggestedFixEs ?? issue.suggestedFix }} />
              </small>
            </article>
          ))
        )}
      </div>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow"><UI text="Markdown preview / Markdown下書き" /></p>
          <h2><LocalizedContent en={<>Player report draft</>} ja={<>日本語メモも含めたサンプルレポートのプレビューです。</>} es={<>Vista previa del reporte con notas en español latinoamericano.</>} /></h2>
        </div>
        <button className="iconButton" type="button" aria-label="Export available in next milestone">
          <Download size={18} aria-hidden="true" />
        </button>
        <pre>{report}</pre>
      </section>
    </div>
  );
}
