import { fetchJson, requireProviderKey } from "./http";

export type ApiFootballResponse<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: unknown[];
  results: number;
  response: T;
};

export type ApiFootballLeague = {
  league: {
    id: number;
    name: string;
    type: string;
  };
  country: {
    name: string;
  };
  seasons: Array<{
    year: number;
    current: boolean;
  }>;
};

const baseUrl = "https://v3.football.api-sports.io";

export async function fetchApiFootballLeagues(
  search = "Libertadores",
): Promise<ApiFootballResponse<ApiFootballLeague[]>> {
  const key = requireProviderKey("apiFootball", "API_FOOTBALL_KEY");
  const params = new URLSearchParams({ search });

  return fetchJson<ApiFootballResponse<ApiFootballLeague[]>>(
    "apiFootball",
    `${baseUrl}/leagues?${params}`,
    {
      headers: {
        "x-apisports-key": key,
      },
    },
  );
}
