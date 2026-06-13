export type DataProviderId =
  | "wikidata"
  | "statsbombOpenData"
  | "footballDataOrg"
  | "apiFootball"
  | "sportmonks";

export type DataProviderAccess = "open" | "free-tier-key" | "paid-or-trial-key";

export type DataProviderCapability =
  | "playerIdentity"
  | "currentSquads"
  | "fixtures"
  | "standings"
  | "lineups"
  | "matchEvents"
  | "playerStats"
  | "eventAnalytics";

export type DataProviderConfigStatus = "ready" | "missing-key";

export type DataProviderMetadata = {
  id: DataProviderId;
  name: string;
  homepageUrl: string;
  access: DataProviderAccess;
  envVar?: string;
  portfolioUse: string;
  licenseNote: string;
  cacheRule: string;
  capabilities: DataProviderCapability[];
};

export type ProviderStatus = DataProviderMetadata & {
  status: DataProviderConfigStatus;
};

export class DataProviderError extends Error {
  constructor(
    message: string,
    public readonly providerId: DataProviderId,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "DataProviderError";
  }
}
