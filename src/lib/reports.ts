import type { DataIssue, Player } from "./types";
import { forwardShotQualityData, type ForwardShotQualityPlayer } from "./statsbomb-forward-shot-quality";

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

export function buildForwardShotQualityReport(player: ForwardShotQualityPlayer): string {
  return `# ${player.player} - Forward shot-quality note

Portfolio sample. Source: ${forwardShotQualityData.source.name}, ${forwardShotQualityData.source.competition}.

This note uses open event data and should be treated as an analysis sample, not a transfer recommendation.

## Context

- Team: ${player.team}
- Positions in sample: ${player.positions}
- Matches with shot: ${player.matches_with_shot}
- Source scope: ${forwardShotQualityData.source.note}

## Shot Quality

- Shots: ${player.shots}
- Open-play shots: ${player.open_play_shots}
- Penalty shots: ${player.penalty_shots}
- Goals: ${player.goals}
- Total xG: ${player.xg}
- Non-penalty xG: ${player.non_penalty_xg}
- Average non-penalty xG per shot: ${player.avg_non_penalty_xg_per_shot}
- Shot accuracy: ${player.shot_accuracy}
- Goals minus xG: ${player.goal_minus_xg}
- Average shot distance: ${player.avg_shot_distance}m

## Working Interpretation

The first scouting read is about chance quality, not reputation. A high non-penalty xG total means the player repeatedly reached valuable shooting positions in this competition sample.

## Japanese note

このメモは公開イベントデータを使ったポートフォリオ用サンプルです。移籍判断ではなく、シュートの質とチャンス量を確認するための分析メモです。

## Nota en español

Este reporte usa datos abiertos de eventos. Sirve para mostrar el flujo de análisis: fuente, métrica, interpretación y revisión humana antes de entregar.

## Manual QA Checklist

- Confirm competition and source
- Separate penalties from open-play chances
- Do not claim current form from an old tournament
- Do not turn this into a transfer recommendation without more recent data
- Human-edit wording before delivery
`;
}
