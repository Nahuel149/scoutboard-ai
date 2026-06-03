import type { DataIssue, Player } from "./types";

export function buildPlayerReport(player: Player, issues: DataIssue[]): string {
  const playerIssues = issues.filter(
    (issue) => issue.entityType === "player" && issue.entityId === player.id,
  );
  const issueSummary =
    playerIssues.length === 0
      ? "No open data issues for this sample record.\n\nこのサンプルでは未対応のデータ不備はありません。\n\nNo hay errores abiertos en este registro de muestra."
      : playerIssues
          .map(
            (issue) =>
              `- ${issue.severity}: ${issue.message}\n  ${issue.messageJa ?? ""}\n  ${issue.messageEs ?? ""}`,
          )
          .join("\n");

  return `# ${player.name} - ScoutBoard AI sample report

自作ポートフォリオ用のサンプルレポートです。実在のクライアント案件や非公開データは含みません。

Reporte de muestra para portafolio. No incluye trabajos reales de clientes ni datos privados.

## Profile

- Club: ${player.club}
- League: ${player.league}
- Position: ${player.position}
- Nationality: ${player.nationality || "Needs verification"}
- Age: ${player.age}

## Performance Snapshot

- Appearances: ${player.appearances}
- Goals: ${player.goals}
- Assists: ${player.assists}
- Minutes: ${player.minutes}

## Research Note

${player.researchNote}

${player.researchNoteJa}

${player.researchNoteEs}

## Source

- ${player.sourceName || "Missing source name"}: ${player.sourceUrl || "Missing source URL"}
- Last checked: ${player.lastCheckedAt || "Missing checked date"}

## Manual QA Checklist

- Data fields reviewed
- Source metadata checked
- Unsupported claims removed
- Final wording edited by a human

## 納品前チェック

- 入力データを確認
- 出典名・URL・確認日を確認
- 根拠のない表現を削除
- 最後は人の目で文章を調整

## Revisión antes de entregar

- Revisar los datos importados
- Confirmar fuente, URL y fecha de revisión
- Quitar frases sin respaldo
- Ajustar el texto final con criterio humano

## Open Data Issues

${issueSummary}
`;
}
