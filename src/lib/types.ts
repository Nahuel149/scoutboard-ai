export type Position = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position | string;
  club: string;
  league: string;
  preferredFoot: "Left" | "Right" | "Both" | string;
  heightCm: number | null;
  marketValueEur: number;
  contractUntil: string;
  appearances: number;
  goals: number;
  assists: number;
  minutes: number;
  sourceUrl: string;
  sourceName: string;
  lastCheckedAt: string;
  researchNote: string;
  researchNoteJa: string;
};

export type Team = {
  id: string;
  name: string;
  country: string;
  league: string;
  manager: string;
  stadium: string;
  squadSize: number;
  averageAge: number;
  sourceUrl: string;
  sourceName: string;
  lastCheckedAt: string;
};

export type DataIssue = {
  id: string;
  entityType: "player" | "team";
  entityId: string;
  field: string;
  severity: "critical" | "warning" | "info";
  issueType: "missing" | "range" | "consistency" | "source" | "format";
  message: string;
  messageJa?: string;
  suggestedFix: string;
  suggestedFixJa?: string;
  status: "open" | "reviewed";
};
