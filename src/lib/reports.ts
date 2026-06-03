import type { DataIssue, Player } from "./types";

export function buildPlayerReport(player: Player, issues: DataIssue[]): string {
  const playerIssues = issues.filter(
    (issue) => issue.entityType === "player" && issue.entityId === player.id,
  );
  const issueSummary =
    playerIssues.length === 0
      ? "No open data issues for this sample record."
      : playerIssues.map((issue) => `- ${issue.severity}: ${issue.message}`).join("\n");

  return `# ${player.name} - ScoutBoard AI Sample Report

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

## Source

- ${player.sourceName || "Missing source name"}: ${player.sourceUrl || "Missing source URL"}
- Last checked: ${player.lastCheckedAt || "Missing checked date"}

## Manual QA Checklist

- Data fields reviewed
- Source metadata checked
- Unsupported claims removed
- Final wording edited by a human

## Open Data Issues

${issueSummary}
`;
}
