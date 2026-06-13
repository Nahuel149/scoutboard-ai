export { fetchApiFootballLeagues } from "./api-football";
export { fetchFootballDataCompetitionMatches } from "./football-data-org";
export { fetchSportmonksLeagues } from "./sportmonks";
export { fetchStatsBombOpenCompetitions, fetchStatsBombOpenMatches } from "./statsbomb-open-data";
export { dataProviders, getProvider, getProviderStatus } from "./registry";
export { fetchWikidataFootballPlayerSample } from "./wikidata";
export type {
  DataProviderAccess,
  DataProviderCapability,
  DataProviderConfigStatus,
  DataProviderId,
  DataProviderMetadata,
  ProviderStatus,
} from "./types";
