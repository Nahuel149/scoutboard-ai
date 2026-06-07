import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const endpoint = "https://query.wikidata.org/sparql";
const entitySearchEndpoint = "https://www.wikidata.org/w/api.php";
const englishWikipediaEndpoint = "https://en.wikipedia.org/w/api.php";
const userAgent = "ScoutBoardAI/0.1 (portfolio import; https://github.com/Nahuel149/scoutboard-ai)";
const defaultLimit = 50;

const southAmericaCountries = [
  "Q414", // Argentina
  "Q155", // Brazil
  "Q77", // Uruguay
  "Q298", // Chile
  "Q739", // Colombia
  "Q419", // Peru
  "Q736", // Ecuador
  "Q733", // Paraguay
  "Q750", // Bolivia
  "Q717", // Venezuela
  "Q734", // Guyana
  "Q730", // Suriname
];

const countryAliases = {
  argentina: "Q414",
  brazil: "Q155",
  brasil: "Q155",
  uruguay: "Q77",
  chile: "Q298",
  colombia: "Q739",
  peru: "Q419",
  ecuador: "Q736",
  paraguay: "Q733",
  bolivia: "Q750",
  venezuela: "Q717",
  guyana: "Q734",
  suriname: "Q730",
};

const countrySearchTerms = {
  Q414: ["Argentina footballer", "Argentine football player", "futbolista argentino"],
  Q155: ["Brazil footballer", "Brazilian football player", "futbolista brasileño"],
  Q77: ["Uruguay footballer", "Uruguayan football player", "futbolista uruguayo"],
  Q298: ["Chile footballer", "Chilean football player", "futbolista chileno"],
  Q739: ["Colombia footballer", "Colombian football player", "futbolista colombiano"],
  Q419: ["Peru footballer", "Peruvian football player", "futbolista peruano"],
  Q736: ["Ecuador footballer", "Ecuadorian football player", "futbolista ecuatoriano"],
  Q733: ["Paraguay footballer", "Paraguayan football player", "futbolista paraguayo"],
  Q750: ["Bolivia footballer", "Bolivian football player", "futbolista boliviano"],
  Q717: ["Venezuela footballer", "Venezuelan football player", "futbolista venezolano"],
  Q734: ["Guyana footballer", "Guyanese football player"],
  Q730: ["Suriname footballer", "Surinamese football player"],
};

const countryWikipediaCategories = {
  Q414: "Category:Argentine men's footballers",
  Q155: "Category:Brazilian men's footballers",
  Q77: "Category:Uruguayan men's footballers",
  Q298: "Category:Chilean men's footballers",
  Q739: "Category:Colombian men's footballers",
  Q419: "Category:Peruvian men's footballers",
  Q736: "Category:Ecuadorian men's footballers",
  Q733: "Category:Paraguayan men's footballers",
  Q750: "Category:Bolivian men's footballers",
  Q717: "Category:Venezuelan men's footballers",
  Q734: "Category:Guyanese footballers",
  Q730: "Category:Surinamese footballers",
};

function getLimit() {
  const raw = process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1];
  const value = raw ? Number.parseInt(raw, 10) : defaultLimit;

  if (!Number.isFinite(value) || value < 1 || value > 500) {
    throw new Error("Use --limit with a number between 1 and 500.");
  }

  return value;
}

function getOutputPath() {
  const raw = process.argv.find((arg) => arg.startsWith("--out="))?.split("=")[1];
  return resolve(raw ?? "data/imported/south-america-players.sample.json");
}

function getCountryIds() {
  const raw = process.argv.find((arg) => arg.startsWith("--country="))?.split("=")[1];

  if (!raw) {
    return southAmericaCountries;
  }

  const normalized = raw.trim().toLowerCase();
  const id = countryAliases[normalized] ?? raw.trim();

  if (!/^Q\d+$/.test(id)) {
    throw new Error(`Unknown country "${raw}". Use a supported name or a Wikidata QID.`);
  }

  return [id];
}

function buildQuery(limit, countryIds) {
  const countryValues = countryIds.map((id) => `wd:${id}`).join(" ");

  return `
SELECT ?player ?playerLabel ?playerDescription ?country ?countryLabel ?birthDate ?positionLabel ?teamLabel WHERE {
  VALUES ?country { ${countryValues} }
  ?player wdt:P106 wd:Q937857;
          wdt:P27 ?country.
  OPTIONAL { ?player wdt:P569 ?birthDate. }
  OPTIONAL { ?player wdt:P413 ?position. }
  OPTIONAL { ?player wdt:P54 ?team. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en,es,ja".
  }
}
ORDER BY ?countryLabel ?playerLabel
LIMIT ${limit}
`;
}

function value(binding, key) {
  return binding[key]?.value ?? null;
}

function normalizeRows(bindings) {
  const seen = new Set();

  return bindings
    .map((binding) => {
      const wikidataUrl = value(binding, "player");
      const id = wikidataUrl?.split("/").pop();

      return {
        id: id ? `wikidata-${id}` : null,
        wikidataId: id,
        name: value(binding, "playerLabel"),
        description: value(binding, "playerDescription"),
        nationality: value(binding, "countryLabel"),
        birthDate: value(binding, "birthDate")?.slice(0, 10) ?? null,
        position: value(binding, "positionLabel"),
        currentOrFormerTeam: value(binding, "teamLabel"),
        sourceUrl: wikidataUrl,
        sourceName: "Wikidata",
        sourceLicense: "CC0",
        importedAt: new Date().toISOString(),
        importScope: "south-america-footballers",
        reviewStatus: "needs_manual_review",
      };
    })
    .filter((row) => {
      if (!row.wikidataId || seen.has(row.wikidataId)) {
        return false;
      }

      seen.add(row.wikidataId);
      return true;
    });
}

async function fetchWikidataPlayers(limit, countryIds) {
  const params = new URLSearchParams({
    query: buildQuery(limit, countryIds),
    format: "json",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Wikidata request failed: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  return response.json();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Wikidata API request failed: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  return response.json();
}

async function fetchCategoryPageIds(categoryTitle, limit) {
  const pageIds = [];
  let cmcontinue = null;

  while (pageIds.length < limit) {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmnamespace: "0",
      cmlimit: String(Math.min(50, limit - pageIds.length)),
      format: "json",
    });

    if (cmcontinue) {
      params.set("cmcontinue", cmcontinue);
    }

    const data = await fetchJson(`${englishWikipediaEndpoint}?${params.toString()}`);
    pageIds.push(...(data.query?.categorymembers?.map((page) => page.pageid) ?? []));

    cmcontinue = data.continue?.cmcontinue ?? null;

    if (!cmcontinue) {
      break;
    }
  }

  return pageIds;
}

async function fetchWikidataIdsForPages(pageIds) {
  if (pageIds.length === 0) {
    return [];
  }

  const ids = [];

  for (let index = 0; index < pageIds.length; index += 50) {
    const chunk = pageIds.slice(index, index + 50);
    const params = new URLSearchParams({
      action: "query",
      pageids: chunk.join("|"),
      prop: "pageprops",
      format: "json",
    });
    const data = await fetchJson(`${englishWikipediaEndpoint}?${params.toString()}`);
    const pages = Object.values(data.query?.pages ?? {});

    for (const page of pages) {
      const wikibaseItem = page.pageprops?.wikibase_item;

      if (wikibaseItem) {
        ids.push(wikibaseItem);
      }
    }
  }

  return ids;
}

async function searchEntityIds(searchTerm, limit) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: searchTerm,
    language: "en",
    uselang: "en",
    format: "json",
    limit: String(Math.min(limit, 50)),
  });
  const data = await fetchJson(`${entitySearchEndpoint}?${params.toString()}`);

  return data.search?.map((item) => item.id).filter(Boolean) ?? [];
}

function claimValue(entity, property) {
  const claim = entity.claims?.[property]?.[0];
  const value = claim?.mainsnak?.datavalue?.value;

  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value.time) {
    return value.time.replace(/^\+/, "").slice(0, 10);
  }

  if (value.id) {
    return value.id;
  }

  return null;
}

function label(entity, language) {
  return entity.labels?.[language]?.value ?? null;
}

function description(entity, language) {
  return entity.descriptions?.[language]?.value ?? null;
}

function hasClaim(entity, property, id) {
  return entity.claims?.[property]?.some((claim) => claim.mainsnak?.datavalue?.value?.id === id) ?? false;
}

async function fetchEntities(ids) {
  if (ids.length === 0) {
    return [];
  }

  const chunks = [];

  for (let index = 0; index < ids.length; index += 50) {
    chunks.push(ids.slice(index, index + 50));
  }

  const entities = [];

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      action: "wbgetentities",
      ids: chunk.join("|"),
      props: "labels|descriptions|claims",
      languages: "en|es|ja",
      format: "json",
    });
    const data = await fetchJson(`${entitySearchEndpoint}?${params.toString()}`);
    entities.push(...Object.values(data.entities ?? {}));
  }

  return entities;
}

async function fetchWikidataPlayersViaEntityApi(limit, countryIds) {
  const candidateIds = new Set();

  for (const countryId of countryIds) {
    const category = countryWikipediaCategories[countryId];

    if (category) {
      const pageIds = await fetchCategoryPageIds(category, limit * 2);
      const wikidataIds = await fetchWikidataIdsForPages(pageIds);
      wikidataIds.forEach((id) => candidateIds.add(id));
    }

    const terms = countrySearchTerms[countryId] ?? [`${countryId} footballer`];

    for (const term of terms) {
      const ids = await searchEntityIds(term, limit);
      ids.forEach((id) => candidateIds.add(id));

      if (candidateIds.size >= limit * 3) {
        break;
      }
    }
  }

  const entities = await fetchEntities([...candidateIds]);
  const rows = [];

  for (const entity of entities) {
    if (!hasClaim(entity, "P106", "Q937857")) {
      continue;
    }

    const countryId = claimValue(entity, "P27");

    if (!countryIds.includes(countryId)) {
      continue;
    }

    rows.push({
      id: `wikidata-${entity.id}`,
      wikidataId: entity.id,
      name: label(entity, "en") ?? label(entity, "es") ?? label(entity, "ja") ?? entity.id,
      nameEs: label(entity, "es"),
      nameJa: label(entity, "ja"),
      description:
        description(entity, "en") ?? description(entity, "es") ?? description(entity, "ja") ?? null,
      descriptionEs: description(entity, "es"),
      descriptionJa: description(entity, "ja"),
      nationality: countryId,
      birthDate: claimValue(entity, "P569"),
      position: claimValue(entity, "P413"),
      currentOrFormerTeam: claimValue(entity, "P54"),
      sourceUrl: `https://www.wikidata.org/wiki/${entity.id}`,
      sourceName: "Wikidata",
      sourceLicense: "CC0",
      importedAt: new Date().toISOString(),
      importScope: "south-america-footballers",
      reviewStatus: "needs_manual_review",
    });

    if (rows.length >= limit) {
      break;
    }
  }

  return rows;
}

async function main() {
  const limit = getLimit();
  const countryIds = getCountryIds();
  const outputPath = getOutputPath();
  let rows = [];
  let accessMethod = "Wikidata entity API";

  try {
    rows = await fetchWikidataPlayersViaEntityApi(limit, countryIds);
  } catch (error) {
    console.warn(`Entity API path failed, trying SPARQL fallback: ${error.message}`);
    accessMethod = "Wikidata Query Service SPARQL";
    const data = await fetchWikidataPlayers(limit, countryIds);
    rows = normalizeRows(data.results.bindings);
  }

  const output = {
    source: {
      name: "Wikidata",
      endpoint: accessMethod === "Wikidata entity API" ? entitySearchEndpoint : endpoint,
      accessMethod,
      license: "CC0",
      queryPurpose: "South America footballer identity import spike",
      countryIds,
      importedAt: new Date().toISOString(),
      limit,
    },
    reviewNote:
      "Imported rows are not final scouting data. Check each row for current club accuracy, duplicates, and source confidence before displaying publicly.",
    players: rows,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Imported ${rows.length} players from Wikidata.`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
