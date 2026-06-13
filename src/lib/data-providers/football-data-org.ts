import { fetchJson, requireProviderKey } from "./http";

export type FootballDataCompetitionMatches = {
  filters?: {
    season?: string;
  };
  competition?: {
    id: number;
    name: string;
    code: string;
  };
  resultSet?: {
    count: number;
    first: string;
    last: string;
    played: number;
  };
  matches: Array<{
    id: number;
    utcDate: string;
    status: string;
    matchday?: number;
    stage?: string;
    homeTeam: { name: string };
    awayTeam: { name: string };
    score?: {
      fullTime?: {
        home: number | null;
        away: number | null;
      };
    };
  }>;
};

export type FootballDataMatch = FootballDataCompetitionMatches["matches"][number];

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
      cache: "no-store",
      headers: {
        "X-Auth-Token": token,
      },
    },
  );
}
