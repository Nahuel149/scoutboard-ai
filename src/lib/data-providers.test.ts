import { describe, expect, it } from "vitest";
import { dataProviders, getProviderStatus } from "./data-providers";

describe("data provider registry", () => {
  it("keeps every provider uniquely registered", () => {
    const ids = dataProviders.map((provider) => provider.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "wikidata",
      "statsbombOpenData",
      "footballDataOrg",
      "apiFootball",
      "sportmonks",
    ]);
  });

  it("marks key-based providers as missing when env vars are absent", () => {
    const statuses = getProviderStatus({});

    expect(statuses.find((provider) => provider.id === "wikidata")?.status).toBe("ready");
    expect(statuses.find((provider) => provider.id === "statsbombOpenData")?.status).toBe("ready");
    expect(statuses.find((provider) => provider.id === "footballDataOrg")?.status).toBe("missing-key");
    expect(statuses.find((provider) => provider.id === "apiFootball")?.status).toBe("missing-key");
    expect(statuses.find((provider) => provider.id === "sportmonks")?.status).toBe("missing-key");
  });

  it("documents portfolio use and cache rules for each source", () => {
    for (const provider of dataProviders) {
      expect(provider.portfolioUse.length).toBeGreaterThan(20);
      expect(provider.licenseNote.length).toBeGreaterThan(20);
      expect(provider.cacheRule.length).toBeGreaterThan(20);
      expect(provider.capabilities.length).toBeGreaterThan(0);
    }
  });
});
