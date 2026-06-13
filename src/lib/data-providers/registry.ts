import type { DataProviderMetadata, ProviderStatus } from "./types";

export const dataProviders: DataProviderMetadata[] = [
  {
    id: "wikidata",
    name: "Wikidata",
    homepageUrl: "https://www.wikidata.org/",
    access: "open",
    portfolioUse: "Current-player identity, clubs, countries, labels, and source links.",
    licenseNote: "Structured data is available under CC0; completeness still needs QA.",
    cacheRule: "Small derived samples can be stored with source URL and checked date.",
    capabilities: ["playerIdentity", "currentSquads"],
  },
  {
    id: "statsbombOpenData",
    name: "StatsBomb Open Data",
    homepageUrl: "https://github.com/statsbomb/open-data",
    access: "open",
    portfolioUse: "Event-level analysis examples such as xG, shot quality, passing, and pressures.",
    licenseNote: "Use only competitions published in the open-data repo and keep attribution visible.",
    cacheRule: "Generated analytics outputs can be committed when sourced from open competitions.",
    capabilities: ["matchEvents", "eventAnalytics", "playerStats"],
  },
  {
    id: "footballDataOrg",
    name: "Football-Data.org",
    homepageUrl: "https://www.football-data.org/",
    access: "free-tier-key",
    envVar: "FOOTBALL_DATA_API_TOKEN",
    portfolioUse: "Fixtures, results, standings, and basic competition data such as Champions League.",
    licenseNote: "Free tier still requires a token and provider terms review before redistribution.",
    cacheRule: "Prefer live fetch or tiny reviewed samples; do not bulk republish.",
    capabilities: ["fixtures", "standings"],
  },
  {
    id: "apiFootball",
    name: "API-Football",
    homepageUrl: "https://www.api-football.com/",
    access: "free-tier-key",
    envVar: "API_FOOTBALL_KEY",
    portfolioUse: "Current competitions, Libertadores coverage, teams, fixtures, lineups, and stats.",
    licenseNote: "Terms and plan limits control what can be cached, displayed, or exported.",
    cacheRule: "Use short-lived cache for app views unless terms allow stored samples.",
    capabilities: ["fixtures", "standings", "lineups", "playerStats", "currentSquads"],
  },
  {
    id: "sportmonks",
    name: "Sportmonks",
    homepageUrl: "https://www.sportmonks.com/football-api/",
    access: "paid-or-trial-key",
    envVar: "SPORTMONKS_API_TOKEN",
    portfolioUse: "Broad paid/trial football API option for Libertadores, Champions League, squads, and stats.",
    licenseNote: "Requires plan-specific review before storing or republishing provider data.",
    cacheRule: "Keep credentials server-side and cache only within the provider terms.",
    capabilities: ["fixtures", "standings", "lineups", "playerStats", "currentSquads"],
  },
];

export function getProviderStatus(env: NodeJS.ProcessEnv = process.env): ProviderStatus[] {
  return dataProviders.map((provider) => ({
    ...provider,
    status: provider.envVar && !env[provider.envVar] ? "missing-key" : "ready",
  }));
}

export function getProvider(id: DataProviderMetadata["id"]): DataProviderMetadata {
  const provider = dataProviders.find((item) => item.id === id);

  if (!provider) {
    throw new Error(`Unknown data provider: ${id}`);
  }

  return provider;
}
