import { fetchJson } from "./http";

type WikidataSparqlResponse = {
  results: {
    bindings: Array<{
      player?: { value: string };
      playerLabel?: { value: string };
      countryLabel?: { value: string };
      clubLabel?: { value: string };
    }>;
  };
};

export type WikidataPlayerIdentity = {
  id: string;
  name: string;
  country?: string;
  club?: string;
  sourceUrl: string;
};

const endpoint = "https://query.wikidata.org/sparql";

export async function fetchWikidataFootballPlayerSample(limit = 25): Promise<WikidataPlayerIdentity[]> {
  const query = `
SELECT ?player ?playerLabel ?countryLabel ?clubLabel WHERE {
  ?player wdt:P106 wd:Q937857.
  OPTIONAL { ?player wdt:P27 ?country. }
  OPTIONAL { ?player wdt:P54 ?club. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es,ja". }
}
LIMIT ${Math.max(1, Math.min(limit, 100))}
`;
  const url = `${endpoint}?format=json&query=${encodeURIComponent(query)}`;
  const data = await fetchJson<WikidataSparqlResponse>("wikidata", url, {
    headers: {
      "User-Agent": "ScoutBoardAI/0.1 portfolio research contact: github.com/Nahuel149/scoutboard-ai",
    },
  });

  return data.results.bindings.map((row) => {
    const sourceUrl = row.player?.value ?? "";
    return {
      id: sourceUrl.split("/").pop() ?? sourceUrl,
      name: row.playerLabel?.value ?? "Unknown player",
      country: row.countryLabel?.value,
      club: row.clubLabel?.value,
      sourceUrl,
    };
  });
}
