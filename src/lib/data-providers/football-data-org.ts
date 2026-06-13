import { fetchJson, requireProviderKey } from "./http";

export type FootballDataCompetitionMatches = {
  competition?: {
    id: number;
    name: string;
    code: string;
  };
  matches: Array<{
    id: number;
    utcDate: string;
    status: string;
    homeTeam: { name: string };
    awayTeam: { name: string };
  }>;
};

const baseUrl = "https://api.football-data.org/v4";

export async function fetchFootballDataCompetitionMatches(
  competitionCode = "CL",
  season?: number,
): Promise<FootballDataCompetitionMatches> {
  const token = requireProviderKey("footballDataOrg", "FOOTBALL_DATA_API_TOKEN");
  const params = new URLSearchParams();

  if (season) {
    params.set("season", String(season));
  }

  const query = params.toString() ? `?${params}` : "";
  return fetchJson<FootballDataCompetitionMatches>(
    "footballDataOrg",
    `${baseUrl}/competitions/${competitionCode}/matches${query}`,
    {
      headers: {
        "X-Auth-Token": token,
      },
    },
  );
}
