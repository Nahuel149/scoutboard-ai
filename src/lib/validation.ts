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
        messageJa: "レポートには選手名が必要です。",
        suggestedFix: "Add the verified display name before exporting.",
        suggestedFixJa: "書き出し前に確認済みの表示名を入力します。",
      });
    }

    if (player.age < 15 || player.age > 45) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "age",
        severity: "warning",
        issueType: "range",
        message: "Age is outside the normal player range for this sample.",
        messageJa: "年齢がサンプル想定の範囲外です。",
        suggestedFix: "Check the birth date, or keep the row marked as test data.",
        suggestedFixJa: "生年月日を確認するか、テスト用データとして扱います。",
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
        messageJa: "国籍が空欄です。",
        suggestedFix: "Add nationality or remove the player from final client-facing exports.",
        suggestedFixJa: "国籍を入力するか、提出用データから外します。",
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
        messageJa: "ポジションは GK / DF / MF / FW の形式にそろえる必要があります。",
        suggestedFix: "Map detailed positions to the allowed portfolio schema.",
        suggestedFixJa: "細かいポジション名をポートフォリオ用の形式に変換します。",
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
        messageJa: "身長の値がやや不自然です。",
        suggestedFix: "Verify the height against the source or keep a note explaining the value.",
        suggestedFixJa: "出典で身長を確認し、必要なら補足メモを残します。",
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
        messageJa: "市場価値がマイナスになっています。",
        suggestedFix: "Set unknown values to 0 or null in the import before reporting.",
        suggestedFixJa: "不明な値はレポート前に 0 または null に直します。",
      });
    }

    if (new Date(player.contractUntil).getFullYear() < currentYear) {
      push({
        entityType: "player",
        entityId: player.id,
        field: "contractUntil",
        severity: "warning",
        issueType: "range",
        message: "Contract date is already in the past for this sample season.",
        messageJa: "契約終了日がサンプルの対象シーズンより過去です。",
        suggestedFix: "Re-check the contract end date or label the record as historical.",
        suggestedFixJa: "契約終了日を再確認するか、過去データとして明記します。",
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
        messageJa: "得点・アシスト・出場時間はマイナスにできません。",
        suggestedFix: "Correct the numeric import values before using this row.",
        suggestedFixJa: "この行を使う前に数値の取り込みミスを修正します。",
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
        messageJa: "出場時間が 0 分なのに得点関与があります。",
        suggestedFix: "Verify minutes played or add a note explaining the competition context.",
        suggestedFixJa: "出場時間を確認し、特殊な大会条件があればメモを残します。",
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
        messageJa: "リサーチ内容には出典URLと出典名が必要です。",
        suggestedFix: "Add source metadata or keep the claim out of the final report.",
        suggestedFixJa: "出典情報を追加するか、根拠のない記述を最終レポートから外します。",
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
        messageJa: "確認日が未入力です。",
        suggestedFix: "Record the date when the source was reviewed.",
        suggestedFixJa: "出典を確認した日付を記録します。",
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
        messageJa: "チーム名が必要です。",
        suggestedFix: "Add the verified team name before export.",
        suggestedFixJa: "書き出し前に確認済みのチーム名を入力します。",
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
        messageJa: "登録人数が想定範囲外です。",
        suggestedFix: "Check whether youth, reserve, or duplicate rows were included.",
        suggestedFixJa: "下部組織、リザーブ、重複行が混ざっていないか確認します。",
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
        messageJa: "平均年齢は確認が必要です。",
        suggestedFix: "Verify the squad list used for the calculation.",
        suggestedFixJa: "計算に使った選手リストを確認します。",
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
        messageJa: "チーム情報の出典メタデータが不足しています。",
        suggestedFix: "Add source URL, source name, and checked date.",
        suggestedFixJa: "出典URL、出典名、確認日を追加します。",
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
