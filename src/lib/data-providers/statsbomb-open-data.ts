import { fetchJson } from "./http";

export type StatsBombCompetition = {
  competition_id: number;
  season_id: number;
  country_name: string;
  competition_name: string;
  season_name: string;
};

const baseUrl = "https://raw.githubusercontent.com/statsbomb/open-data/master/data";

export async function fetchStatsBombOpenCompetitions(): Promise<StatsBombCompetition[]> {
  return fetchJson<StatsBombCompetition[]>(
    "statsbombOpenData",
    `${baseUrl}/competitions.json`,
  );
}

export async function fetchStatsBombOpenMatches(
  competitionId: number,
  seasonId: number,
): Promise<unknown[]> {
  return fetchJson<unknown[]>(
    "statsbombOpenData",
    `${baseUrl}/matches/${competitionId}/${seasonId}.json`,
  );
}
