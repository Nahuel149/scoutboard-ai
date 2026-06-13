import { fetchJson, requireProviderKey } from "./http";

export type SportmonksResponse<T> = {
  data: T;
};

export type SportmonksLeague = {
  id: number;
  name: string;
  active: boolean;
};

const baseUrl = "https://api.sportmonks.com/v3/football";

export async function fetchSportmonksLeagues(
  search = "Copa Libertadores",
): Promise<SportmonksResponse<SportmonksLeague[]>> {
  const token = requireProviderKey("sportmonks", "SPORTMONKS_API_TOKEN");
  const params = new URLSearchParams({
    api_token: token,
    "filters[search]": search,
  });

  return fetchJson<SportmonksResponse<SportmonksLeague[]>>(
    "sportmonks",
    `${baseUrl}/leagues?${params}`,
  );
}
