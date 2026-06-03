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
        messageEs: "El nombre del jugador es necesario para el reporte.",
        suggestedFix: "Add the verified display name before exporting.",
        suggestedFixJa: "書き出し前に確認済みの表示名を入力します。",
        suggestedFixEs: "Agregar el nombre verificado antes de exportar.",
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
        messageEs: "La edad está fuera del rango normal para esta muestra.",
        suggestedFix: "Check the birth date, or keep the row marked as test data.",
        suggestedFixJa: "生年月日を確認するか、テスト用データとして扱います。",
        suggestedFixEs: "Revisar la fecha de nacimiento o dejar la fila marcada como dato de prueba.",
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
        messageEs: "Falta la nacionalidad.",
        suggestedFix: "Add nationality or remove the player from final client-facing exports.",
        suggestedFixJa: "国籍を入力するか、提出用データから外します。",
        suggestedFixEs: "Agregar la nacionalidad o quitar al jugador de los entregables finales.",
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
        messageEs: "La posición debe quedar como GK, DF, MF o FW.",
        suggestedFix: "Map detailed positions to the allowed portfolio schema.",
        suggestedFixJa: "細かいポジション名をポートフォリオ用の形式に変換します。",
        suggestedFixEs: "Convertir la posición detallada al formato simple del portafolio.",
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
        messageEs: "La altura parece poco común y conviene revisarla.",
        suggestedFix: "Verify the height against the source or keep a note explaining the value.",
        suggestedFixJa: "出典で身長を確認し、必要なら補足メモを残します。",
        suggestedFixEs: "Confirmar la altura con la fuente o dejar una nota aclaratoria.",
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
        messageEs: "El valor de mercado no puede ser negativo.",
        suggestedFix: "Set unknown values to 0 or null in the import before reporting.",
        suggestedFixJa: "不明な値はレポート前に 0 または null に直します。",
        suggestedFixEs: "Usar 0 o null para valores desconocidos antes de reportar.",
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
        messageEs: "La fecha de contrato ya quedó en el pasado para esta temporada de muestra.",
        suggestedFix: "Re-check the contract end date or label the record as historical.",
        suggestedFixJa: "契約終了日を再確認するか、過去データとして明記します。",
        suggestedFixEs: "Revisar la fecha de fin de contrato o marcar el registro como histórico.",
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
        messageEs: "Goles, asistencias y minutos no pueden ser negativos.",
        suggestedFix: "Correct the numeric import values before using this row.",
        suggestedFixJa: "この行を使う前に数値の取り込みミスを修正します。",
        suggestedFixEs: "Corregir los números importados antes de usar esta fila.",
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
        messageEs: "El jugador tiene goles o asistencias con 0 minutos jugados.",
        suggestedFix: "Verify minutes played or add a note explaining the competition context.",
        suggestedFixJa: "出場時間を確認し、特殊な大会条件があればメモを残します。",
        suggestedFixEs: "Revisar los minutos o dejar una nota si hay un contexto especial.",
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
        messageEs: "Las afirmaciones de scouting necesitan nombre de fuente y URL.",
        suggestedFix: "Add source metadata or keep the claim out of the final report.",
        suggestedFixJa: "出典情報を追加するか、根拠のない記述を最終レポートから外します。",
        suggestedFixEs: "Agregar la fuente o sacar esa afirmación del reporte final.",
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
        messageEs: "Falta la fecha de revisión.",
        suggestedFix: "Record the date when the source was reviewed.",
        suggestedFixJa: "出典を確認した日付を記録します。",
        suggestedFixEs: "Registrar la fecha en que se revisó la fuente.",
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
        messageEs: "El nombre del equipo es necesario.",
        suggestedFix: "Add the verified team name before export.",
        suggestedFixJa: "書き出し前に確認済みのチーム名を入力します。",
        suggestedFixEs: "Agregar el nombre verificado antes de exportar.",
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
        messageEs: "El tamaño del plantel está fuera del rango esperado.",
        suggestedFix: "Check whether youth, reserve, or duplicate rows were included.",
        suggestedFixJa: "下部組織、リザーブ、重複行が混ざっていないか確認します。",
        suggestedFixEs: "Revisar si se mezclaron juveniles, reserva o filas duplicadas.",
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
        messageEs: "La edad promedio necesita revisión.",
        suggestedFix: "Verify the squad list used for the calculation.",
        suggestedFixJa: "計算に使った選手リストを確認します。",
        suggestedFixEs: "Verificar la lista de jugadores usada para el cálculo.",
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
        messageEs: "Faltan datos de fuente para el equipo.",
        suggestedFix: "Add source URL, source name, and checked date.",
        suggestedFixJa: "出典URL、出典名、確認日を追加します。",
        suggestedFixEs: "Agregar URL, nombre de fuente y fecha de revisión.",
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
