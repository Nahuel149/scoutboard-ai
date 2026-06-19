import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type WatchlistPlayer = {
  id: string;
  name: string;
  nameJa: string | null;
  country: string;
  league: string;
  club: string;
  position: string;
  birthDate: string | null;
  sourceUrl: string;
  sourceName: string;
  sourceLicense: string;
  importedAt: string;
  reviewStatus: string;
  confidence: "medium" | "low";
  missingFields: string[];
  note: string;
};

type ImportedPlayer = {
  id: string;
  name: string;
  nameJa?: string | null;
  birthDate?: string | null;
  position?: string | null;
  currentClubName?: string | null;
  sourceUrl?: string;
  sourceName?: string;
  sourceLicense?: string;
  importedAt?: string;
  reviewStatus?: string;
};

type ImportedFile = {
  source: { leagueSeason?: string; currentnessRule?: string };
  reviewNote?: string;
  players: ImportedPlayer[];
};

const positionLabels: Record<string, string> = {
  Q193592: "Midfielder",
  Q336286: "Forward",
  Q280658: "Defender",
  Q201330: "Goalkeeper",
  Q8025128: "Winger",
  Q90173132: "Attacking midfielder",
  Q268258: "Full-back",
  Q904289: "Centre-back",
};

function title(value: string) {
  return value.split("-").map((word) => word === "mls" ? "USA" : word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

export async function loadAmericanWatchlist(): Promise<WatchlistPlayer[]> {
  const directory = path.join(process.cwd(), "data", "imported");
  const files = (await fs.readdir(directory)).filter((file) => file.includes("division-current-players") && file.endsWith(".json"));
  const rows: WatchlistPlayer[] = [];

  for (const file of files) {
    const payload = JSON.parse(await fs.readFile(path.join(directory, file), "utf8")) as ImportedFile;
    const scope = file.replace("-current-players.sample.json", "");
    const parts = scope.split("-");
    const country = parts[0] === "mls" ? "United States" : title(parts[0]);
    const league = payload.source.leagueSeason ?? title(scope);

    payload.players.forEach((player, index) => {
      const position = player.position ? positionLabels[player.position] ?? "Other / review" : "Missing";
      const missingFields = [
        !player.birthDate && "birth date",
        !player.position && "position",
        !player.currentClubName && "club",
        !player.nameJa && "Japanese name",
        !player.sourceUrl && "source URL",
      ].filter(Boolean) as string[];
      rows.push({
        id: `${scope}-${player.id}-${index}`,
        name: player.name,
        nameJa: player.nameJa ?? null,
        country,
        league,
        club: player.currentClubName ?? "Club not recorded",
        position,
        birthDate: player.birthDate ?? null,
        sourceUrl: player.sourceUrl ?? "",
        sourceName: player.sourceName ?? "Wikidata",
        sourceLicense: player.sourceLicense ?? "CC0",
        importedAt: player.importedAt ?? "",
        reviewStatus: player.reviewStatus ?? "needs_manual_review",
        confidence: missingFields.includes("club") || missingFields.includes("source URL") ? "low" : "medium",
        missingFields,
        note: payload.reviewNote ?? "Roster membership can lag transfers and needs a club-source check.",
      });
    });
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}
