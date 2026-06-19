import type { DataIssue, Player } from "./types";
import {
  forwardShotQualityData,
  type ForwardShotQualityPlayer,
} from "./statsbomb-forward-shot-quality";
import { calculateScoutingScore } from "./scouting-model";

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

Portfolio sample. This does not include private client work or non-public data.

ポートフォリオ用のサンプルレポートです。実在のクライアント案件や非公開データは含みません。

Reporte de muestra para portafolio. No incluye trabajos reales de clientes ni datos privados.

## Profile

- Club: ${player.club}
- League: ${player.league}
- Position: ${player.position}
- Nationality: ${player.nationality || "Needs verification"}
- Age: ${player.age}

## Performance snapshot

- Appearances: ${player.appearances}
- Goals: ${player.goals}
- Assists: ${player.assists}
- Minutes: ${player.minutes}

## Research note

${player.researchNote}

${player.researchNoteJa}

${player.researchNoteEs}

## Source

- ${player.sourceName || "Missing source name"}: ${player.sourceUrl || "Missing source URL"}
- Last checked: ${player.lastCheckedAt || "Missing checked date"}

## Manual QA checklist

- Check imported fields
- Confirm source name, URL, and review date
- Remove unsupported claims
- Edit final wording by hand

## 納品前チェック

- 入力データを確認
- 出典名、URL、確認日を確認
- 根拠のない表現を削除
- 最後は人の目で文章を調整

## Revisión antes de entregar

- Revisar los datos importados
- Confirmar fuente, URL y fecha de revisión
- Quitar frases sin respaldo
- Ajustar el texto final con criterio humano

## Open data issues

${issueSummary}
`;
}

export function buildForwardShotQualityReport(player: ForwardShotQualityPlayer): string {
  const model = calculateScoutingScore(player);

  return `# ${player.player} - forward shot-quality note

Portfolio sample. Source: ${forwardShotQualityData.source.name}, ${forwardShotQualityData.source.competition}.

This note uses open event data. It is an analysis sample, not a transfer recommendation.

## Context

- Team: ${player.team}
- Positions in sample: ${player.positions}
- Matches with shot: ${player.matches_with_shot}
- Minutes: ${player.minutes}
- Age in tournament sample: ${model.age ?? "Not available"}
- Source scope: ${forwardShotQualityData.source.note}

## Shot quality

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

## Screening score

- Score: ${model.score}/100
- Non-penalty xG per 90: ${model.npxgPer90}
- Shots per 90: ${model.shotsPer90}
- Sample reliability: ${Math.round(model.sampleReliability * 100)}%
- Age adjustment: ${model.ageAdjustment}
- Competition adjustment: ${model.competitionAdjustment}

## Working interpretation

The first scouting read is about chance quality, not reputation. A high non-penalty xG total means the player reached valuable shooting positions several times in this competition sample.

## Japanese note

このメモは公開イベントデータを使ったポートフォリオ用サンプルです。移籍判断ではなく、シュートの質、チャンス量、出場時間を同じ基準で確認するための分析メモです。

## Nota en español

Este reporte usa datos abiertos de eventos. Sirve para mostrar el flujo de análisis: fuente, métrica, interpretación y revisión humana antes de entregar. No pretende predecir el rendimiento futuro de un jugador.

## Manual QA checklist

- Confirm competition and source
- Separate penalties from open-play chances
- Do not claim current form from an old tournament
- Do not turn this into a transfer recommendation without more recent data
- Human-edit wording before delivery
`;
}

export function buildForwardMatchReport(players: ForwardShotQualityPlayer[]): string {
  const playerRows = players
    .slice(0, 8)
    .map((player, index) => {
      const model = calculateScoutingScore(player);
      return `| ${index + 1} | ${player.player} | ${player.team} | ${player.minutes} | ${player.non_penalty_xg} | ${model.npxgPer90} | ${model.score} |`;
    })
    .join("\n");

  return `# Copa America 2024 forward shot-quality report

Source: ${forwardShotQualityData.source.name}. Competition: ${forwardShotQualityData.source.competition}.

This report ranks forwards and wingers from South American national teams using open event data. It is a scouting workflow sample, not a professional recruitment model.

## Summary

- Matches analyzed: ${forwardShotQualityData.summary.matches}
- Players with forward/wing shots: ${forwardShotQualityData.summary.players}
- Forward shots: ${forwardShotQualityData.summary.total_forward_shots}
- Forward xG: ${forwardShotQualityData.summary.total_forward_xg}

## Top screening table

| Rank | Player | Team | Minutes | NP xG | NP xG/90 | Score |
| --- | --- | --- | ---: | ---: | ---: | ---: |
${playerRows}

## Japanese note

このレポートは公開データを使ったサンプルです。選手の現在の状態や移籍後の成績を断定せず、シュートの質とサンプルの大きさを分けて見ます。

## Nota en español

El reporte usa datos abiertos y antiguos, pero confiables para mostrar método. La lectura separa volumen, calidad de remate y tamaño de muestra.
`;
}
