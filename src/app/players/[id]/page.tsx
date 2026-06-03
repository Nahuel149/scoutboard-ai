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
        Players / 選手リスト
      </Link>

      <section className="detailHero">
        <div>
          <p className="eyebrow">{player.club}</p>
          <h1>{player.name}</h1>
          <p>{player.researchNote}</p>
          <p className="jp">{player.researchNoteJa}</p>
          <p className="es">{player.researchNoteEs}</p>
        </div>
        <div className="profileGrid">
          <span>Age / 年齢 <strong>{player.age}</strong></span>
          <span>Position / 位置 <strong>{player.position}</strong></span>
          <span>Foot / 利き足 <strong>{player.preferredFoot}</strong></span>
          <span>Value / 評価額 <strong>EUR {player.marketValueEur.toLocaleString()}</strong></span>
        </div>
      </section>

      <section className="split">
        <div className="qaPanel">
          <p className="eyebrow">Source notes / 出典メモ</p>
          <h2>Where this note comes from</h2>
          <p className="jp">このメモの根拠として残しておく情報です。</p>
          <p className="es">Datos que quedan guardados como respaldo de esta nota.</p>
          <p>{player.sourceName || "Missing source name"}</p>
          <p className="muted">{player.sourceUrl || "Missing source URL"}</p>
          <p className="muted">Last checked: {player.lastCheckedAt || "Missing"}</p>
        </div>

        <div className="qaPanel">
          <p className="eyebrow">Delivery checklist / 納品前チェック</p>
          <h2>Before export</h2>
          <ul className="checklist">
            <li>Confirm source metadata</li>
            <li>Review data warnings</li>
            <li>Separate facts from scouting opinion</li>
            <li>Human-edit final wording</li>
          </ul>
          <ul className="checklist jp">
            <li>出典情報を確認</li>
            <li>データ不備を確認</li>
            <li>事実とスカウト所感を分ける</li>
            <li>最後は人の目で文章を整える</li>
          </ul>
          <ul className="checklist es">
            <li>Confirmar fuente y fecha de revisión</li>
            <li>Revisar alertas de datos</li>
            <li>Separar datos de opinión de scouting</li>
            <li>Editar el texto final a mano</li>
          </ul>
        </div>
      </section>

      <section className="sectionHeader">
        <p className="eyebrow">Open issues / 未対応の確認事項</p>
        <h2>{playerIssues.length} validation findings</h2>
        <p className="jp">この選手データで、まだ確認が必要な項目です。</p>
        <p className="es">Puntos de este jugador que todavía necesitan revisión.</p>
      </section>
      <div className="issueList">
        {playerIssues.length === 0 ? (
          <p className="emptyState">
            No validation issues for this player.
            <span className="jp tableSubline">この選手データには未対応の不備はありません。</span>
            <span className="es tableSubline">No hay errores abiertos para este jugador.</span>
          </p>
        ) : (
          playerIssues.map((issue) => (
            <article key={issue.id} className="issueItem">
              <span className={`pill ${issue.severity}`}>{issue.severity}</span>
              <strong>{issue.field}</strong>
              <p>
                {issue.message}
                {issue.messageJa ? <span className="jp tableSubline">{issue.messageJa}</span> : null}
                {issue.messageEs ? <span className="es tableSubline">{issue.messageEs}</span> : null}
              </p>
              <small>
                {issue.suggestedFix}
                {issue.suggestedFixJa ? (
                  <span className="jp tableSubline">{issue.suggestedFixJa}</span>
                ) : null}
                {issue.suggestedFixEs ? (
                  <span className="es tableSubline">{issue.suggestedFixEs}</span>
                ) : null}
              </small>
            </article>
          ))
        )}
      </div>

      <section className="reportPreview">
        <div className="sectionHeader">
          <p className="eyebrow">Markdown preview / Markdown下書き</p>
          <h2>Player report draft</h2>
          <p className="jp">日本語メモも含めたサンプルレポートのプレビューです。</p>
          <p className="es">Vista previa del reporte con notas en español latinoamericano.</p>
        </div>
        <button className="iconButton" type="button" aria-label="Export available in next milestone">
          <Download size={18} aria-hidden="true" />
        </button>
        <pre>{report}</pre>
      </section>
    </div>
  );
}
