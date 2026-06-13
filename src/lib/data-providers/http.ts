import { DataProviderError, type DataProviderId } from "./types";

export async function fetchJson<T>(
  providerId: DataProviderId,
  url: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch (error) {
    throw new DataProviderError(
      error instanceof Error ? error.message : "Network request failed",
      providerId,
    );
  }

  if (!response.ok) {
    throw new DataProviderError(
      `Request failed with HTTP ${response.status}`,
      providerId,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export function requireProviderKey(providerId: DataProviderId, envVar: string): string {
  const value = process.env[envVar];

  if (!value) {
    throw new DataProviderError(`Missing ${envVar}. Add it to .env.local.`, providerId);
  }

  return value;
}
