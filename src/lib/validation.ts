import type { DataIssue, Player, Team } from "./types";

const allowedPositions = new Set(["GK", "DF", "MF", "FW"]);
const currentYear = 2026;

function issue(
  input: Omit<DataIssue, "id" | "status">,
  index: number,
): DataIssue {
  return {
    ...input,
    id: `${input.entityType}-${input.entityId}-${input.field}-${index}`,
    status: "open",
  };
}

export function validatePlayers(players: Player[]): DataIssue[] {
  const issues: DataIssue[] = [];

  players.forEach((player) => {
    const push = (input: Omit<DataIssue, "id" | "status">) => {
      issues.push(issue(input, issues.length + 1));
    };

    if (!player.name.trim()) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "name",
        severity: "critical",
        issueType: "missing",
        message: "Player name is required for reports.",
        suggestedFix: "Add the verified display name before exporting.",
      });
    }

    if (player.age < 15 || player.age > 45) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "age",
        severity: "warning",
        issueType: "range",
        message: "Player age is outside the expected 15-45 range.",
        suggestedFix: "Confirm the date of birth or mark the row as synthetic test data.",
      });
    }

    if (!player.nationality.trim()) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "nationality",
        severity: "critical",
        issueType: "missing",
        message: "Nationality is blank.",
        suggestedFix: "Add nationality or remove the player from final client-facing exports.",
      });
    }

    if (!allowedPositions.has(player.position)) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "position",
        severity: "warning",
        issueType: "format",
        message: "Position must be one of GK, DF, MF, or FW.",
        suggestedFix: "Map detailed positions to the allowed portfolio schema.",
      });
    }

    if (player.heightCm !== null && (player.heightCm < 165 || player.heightCm > 210)) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "heightCm",
        severity: "info",
        issueType: "range",
        message: "Height is unusual and should be checked.",
        suggestedFix: "Verify the height against the source or keep a note explaining the value.",
      });
    }

    if (player.marketValueEur < 0) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "marketValueEur",
        severity: "critical",
        issueType: "range",
        message: "Market value cannot be negative.",
        suggestedFix: "Set unknown values to 0 or null in the import before reporting.",
      });
    }

    if (new Date(player.contractUntil).getFullYear() < currentYear) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "contractUntil",
        severity: "warning",
        issueType: "range",
        message: "Contract date is in the past for the current sample season.",
        suggestedFix: "Re-check the contract end date or label the record as historical.",
      });
    }

    if (player.goals < 0 || player.assists < 0 || player.minutes < 0) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "stats",
        severity: "critical",
        issueType: "range",
        message: "Goals, assists, and minutes cannot be negative.",
        suggestedFix: "Correct the numeric import values before using this row.",
      });
    }

    if (player.minutes === 0 && (player.goals > 0 || player.assists > 0)) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "minutes",
        severity: "warning",
        issueType: "consistency",
        message: "Player has goal contributions despite 0 minutes.",
        suggestedFix: "Verify minutes played or add a note explaining the competition context.",
      });
    }

    if (!player.sourceUrl.trim() || !player.sourceName.trim()) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "source",
        severity: "critical",
        issueType: "source",
        message: "Source URL and source name are required for research claims.",
        suggestedFix: "Add source metadata or keep the claim out of the final report.",
      });
    }

    if (!player.lastCheckedAt.trim()) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "lastCheckedAt",
        severity: "warning",
        issueType: "source",
        message: "Last checked date is missing.",
        suggestedFix: "Record the date when the source was reviewed.",
      });
    }
  });

  return issues;
}

export function validateTeams(teams: Team[]): DataIssue[] {
  const issues: DataIssue[] = [];

  teams.forEach((team) => {
    const push = (input: Omit<DataIssue, "id" | "status">) => {
      issues.push(issue(input, issues.length + 1));
    };

    if (!team.name.trim()) {
      push({
        entityType: "team",
        entityId: team.id,
        field: "name",
        severity: "critical",
        issueType: "missing",
        message: "Team name is required.",
        suggestedFix: "Add the verified team name before export.",
      });
    }

    if (team.squadSize < 11 || team.squadSize > 45) {
      push({
        entityType: "team",
        entityId: team.id,
        field: "squadSize",
        severity: "warning",
        issueType: "range",
        message: "Squad size is outside the expected range.",
        suggestedFix: "Check whether youth, reserve, or duplicate rows were included.",
      });
    }

    if (team.averageAge < 16 || team.averageAge > 36) {
      push({
        entityType: "team",
        entityId: team.id,
        field: "averageAge",
        severity: "info",
        issueType: "range",
        message: "Average age should be reviewed.",
        suggestedFix: "Verify the squad list used for the calculation.",
      });
    }

    if (!team.sourceUrl.trim() || !team.sourceName.trim() || !team.lastCheckedAt.trim()) {
      push({
        entityType: "team",
        entityId: team.id,
        field: "source",
        severity: "critical",
        issueType: "source",
        message: "Team source metadata is incomplete.",
        suggestedFix: "Add source URL, source name, and checked date.",
      });
    }
  });

  return issues;
}

export function validateData(players: Player[], teams: Team[]): DataIssue[] {
  return [...validatePlayers(players), ...validateTeams(teams)];
}

export function getCompletenessScore(totalRecords: number, issueCount: number): number {
  if (totalRecords === 0) {
    return 0;
  }

  return Math.max(0, Math.round(100 - (issueCount / totalRecords) * 10));
}

export function summarizeIssues(issues: DataIssue[]) {
  return {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
    total: issues.length,
  };
}
