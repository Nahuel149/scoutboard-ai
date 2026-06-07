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

const argentinaFirstDivision2026Clubs = [
  { id: "Q971490", name: "Club Atlético Aldosivi" },
  { id: "Q220621", name: "Asociación Atlética Argentinos Juniors" },
  { id: "Q757470", name: "Club Atlético Tucumán" },
  { id: "Q692646", name: "Club Atlético Banfield" },
  { id: "Q2469894", name: "Club Atlético Barracas Central" },
  { id: "Q59962", name: "Club Atlético Belgrano" },
  { id: "Q170703", name: "Club Atlético Boca Juniors" },
  { id: "Q5060684", name: "Club Atlético Central Córdoba" },
  { id: "Q1024338", name: "Club Social y Deportivo Defensa y Justicia" },
  { id: "Q4382304", name: "Club Deportivo Riestra" },
  { id: "Q214940", name: "Club Estudiantes de La Plata" },
  { id: "Q8206935", name: "Asociación Atlética Estudiantes" },
  { id: "Q18640", name: "Club de Gimnasia y Esgrima La Plata" },
  { id: "Q2707037", name: "Club Atlético Gimnasia y Esgrima" },
  { id: "Q327172", name: "Club Atlético Huracán" },
  { id: "Q214978", name: "Club Atlético Independiente" },
  { id: "Q2454482", name: "Club Sportivo Independiente Rivadavia" },
  { id: "Q1421829", name: "Instituto Atlético Central Córdoba" },
  { id: "Q324589", name: "Club Atlético Lanús" },
  { id: "Q221882", name: "Club Atlético Newell's Old Boys" },
  { id: "Q151907", name: "Club Atlético Platense" },
  { id: "Q276533", name: "Racing Club" },
  { id: "Q15799", name: "Club Atlético River Plate" },
  { id: "Q318307", name: "Club Atlético Rosario Central" },
  { id: "Q218282", name: "Club Atlético San Lorenzo de Almagro" },
  { id: "Q519966", name: "Club Atlético Sarmiento" },
  { id: "Q1022939", name: "Club Atlético Talleres" },
  { id: "Q80886", name: "Club Atlético Tigre" },
  { id: "Q80899", name: "Club Atlético Unión" },
  { id: "Q215163", name: "Club Atlético Vélez Sarsfield" },
];

const brazilFirstDivision2026Clubs = [
  { id: "Q506832", name: "Club Athletico Paranaense" },
  { id: "Q270995", name: "Clube Atlético Mineiro" },
  { id: "Q198032", name: "Esporte Clube Bahia" },
  { id: "Q80958", name: "Botafogo de Futebol e Regatas" },
  { id: "Q2536715", name: "Associação Chapecoense de Futebol" },
  { id: "Q35933", name: "Sport Club Corinthians Paulista" },
  { id: "Q478317", name: "Coritiba Foot Ball Club" },
  { id: "Q188277", name: "Cruzeiro Esporte Clube" },
  { id: "Q17479", name: "Clube de Regatas do Flamengo" },
  { id: "Q80987", name: "Fluminense Football Club" },
  { id: "Q221695", name: "Grêmio Foot-Ball Porto Alegrense" },
  { id: "Q80845", name: "Sport Club Internacional" },
  { id: "Q2622870", name: "Mirassol Futebol Clube" },
  { id: "Q80964", name: "Sociedade Esportiva Palmeiras" },
  { id: "Q541744", name: "Red Bull Bragantino" },
  { id: "Q2552872", name: "Clube do Remo" },
  { id: "Q80955", name: "Santos Futebol Clube" },
  { id: "Q38568", name: "São Paulo Futebol Clube" },
  { id: "Q5014111", name: "Club de Regatas Vasco da Gama" },
  { id: "Q274465", name: "Esporte Clube Vitória" },
];

const chileFirstDivision2026Clubs = [
  { id: "Q758689", name: "Audax Italiano" },
  { id: "Q642669", name: "Cobresal" },
  { id: "Q207373", name: "Club Social y Deportivo Colo Colo" },
  { id: "Q2407595", name: "Coquimbo Unido" },
  { id: "Q2317166", name: "Club Deportes Concepción" },
  { id: "Q642098", name: "Club Deportes La Serena" },
  { id: "Q105144613", name: "Club de Deportes Limache" },
  { id: "Q1103684", name: "Everton de Viña del Mar" },
  { id: "Q1023191", name: "Club Deportivo Huachipato" },
  { id: "Q2317539", name: "Club Deportivo Ñublense" },
  { id: "Q719722", name: "O'Higgins F.C." },
  { id: "Q719719", name: "Club Deportivo Palestino" },
  { id: "Q719383", name: "Unión La Calera" },
  { id: "Q427446", name: "Club Deportivo Universidad Católica" },
  { id: "Q737753", name: "Club Universidad de Chile" },
  { id: "Q721560", name: "Club Deportivo Universidad de Concepción" },
];

const currentLeagueScopes = {
  "argentina-first-division-current": {
    clubs: argentinaFirstDivision2026Clubs,
    importScope: "argentina-first-division-current-players",
    leagueSeason: "Liga Profesional 2026",
    leagueSeasonSource: "https://www.ligaprofesional.ar/clubes",
    queryPurpose: "Argentina Primera División current squad import spike",
    outputLabel: "current Argentina first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "brazil-first-division-current": {
    clubs: brazilFirstDivision2026Clubs,
    importScope: "brazil-first-division-current-players",
    leagueSeason: "Campeonato Brasileiro Série A 2026",
    leagueSeasonSource: "https://www.cbf.com.br/futebol-brasileiro/times/campeonato-brasileiro/serie-a/2026",
    queryPurpose: "Brazil Série A current squad import spike",
    outputLabel: "current Brazil first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "chile-first-division-current": {
    clubs: chileFirstDivision2026Clubs,
    importScope: "chile-first-division-current-players",
    leagueSeason: "Liga de Primera 2026",
    leagueSeasonSource: "https://www.campeonatochileno.cl/competition/liga-de-primera/",
    queryPurpose: "Chile Liga de Primera current squad import spike",
    outputLabel: "current Chile first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
};

function getLimit() {
  const raw = process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1];
  const value = raw ? Number.parseInt(raw, 10) : defaultLimit;

  if (!Number.isFinite(value) || value < 1 || value > 2000) {
    throw new Error("Use --limit with a number between 1 and 2000.");
  }

  return value;
}

function getOutputPath() {
  const raw = process.argv.find((arg) => arg.startsWith("--out="))?.split("=")[1];
  return resolve(raw ?? "data/imported/south-america-players.sample.json");
}

function getScope() {
  return process.argv.find((arg) => arg.startsWith("--scope="))?.split("=")[1] ?? "south-america-country";
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

function normalizeCurrentLeagueEntity(entity, club, importScope) {
  const positionId = claimValue(entity, "P413");

  return {
    id: `wikidata-${entity.id}`,
    wikidataId: entity.id,
    name: label(entity, "en") ?? label(entity, "es") ?? label(entity, "ja") ?? entity.id,
    nameEs: label(entity, "es"),
    nameJa: label(entity, "ja"),
    description: description(entity, "en") ?? description(entity, "es") ?? description(entity, "ja") ?? null,
    descriptionEs: description(entity, "es"),
    descriptionJa: description(entity, "ja"),
    nationality: claimValue(entity, "P27"),
    birthDate: claimValue(entity, "P569"),
    position: positionId,
    positionName: null,
    positionNameEs: null,
    positionNameJa: null,
    currentClub: club.id,
    currentClubName: club.name,
    currentClubNameEs: club.name,
    currentClubNameJa: null,
    sourceUrl: `https://www.wikidata.org/wiki/${entity.id}`,
    sourceName: "Wikidata",
    sourceLicense: "CC0",
    importedAt: new Date().toISOString(),
    importScope,
    currentnessRule: "P54 club membership statement without P582 end-time qualifier",
    reviewStatus: "needs_manual_review",
  };
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

async function fetchCurrentLeaguePlayers(limit, leagueConfig) {
  const rows = [];
  const seen = new Set();

  for (const club of leagueConfig.clubs) {
    if (rows.length >= limit) {
      break;
    }

    const candidateIds = await fetchCurrentClubPlayerCandidateIds(club.id, Math.min(150, limit - rows.length));
    const entities = await fetchEntities(candidateIds);

    for (const entity of entities) {
      if (
        !hasClaim(entity, "P106", "Q937857") ||
        !hasCurrentTeamClaim(entity, club.id) ||
        !hasPlausibleActiveBirthDate(entity, leagueConfig.oldestPlausibleBirthDate)
      ) {
        continue;
      }

      const row = normalizeCurrentLeagueEntity(entity, club, leagueConfig.importScope);
      const dedupeKey = `${row.wikidataId}-${row.currentClub}`;

      if (seen.has(dedupeKey)) {
        continue;
      }

      seen.add(dedupeKey);
      rows.push(row);
    }
  }

  return rows;
}

async function fetchCurrentClubPlayerCandidateIds(clubId, limit) {
  const query = `
SELECT ?player WHERE {
  ?player wdt:P54 wd:${clubId};
          wdt:P106 wd:Q937857.
}
ORDER BY ?player
LIMIT ${limit}
`;
  const params = new URLSearchParams({
    query,
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
    throw new Error(`Wikidata player candidate request failed for ${clubId}: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  const data = await response.json();

  return (
    data.results?.bindings
      ?.map((binding) => value(binding, "player")?.split("/").pop())
      .filter(Boolean) ?? []
  );
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

function hasCurrentTeamClaim(entity, clubId) {
  return (
    entity.claims?.P54?.some((claim) => {
      const teamId = claim.mainsnak?.datavalue?.value?.id;
      const hasEndTime = Boolean(claim.qualifiers?.P582?.length);

      return teamId === clubId && !hasEndTime;
    }) ?? false
  );
}

function hasPlausibleActiveBirthDate(entity, oldestPlausibleBirthDate) {
  const birthDate = claimValue(entity, "P569");

  if (!birthDate) {
    return true;
  }

  return birthDate >= oldestPlausibleBirthDate;
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
  const scope = getScope();
  const countryIds = getCountryIds();
  const outputPath = getOutputPath();
  let rows = [];
  let accessMethod = "Wikidata entity API";

  const currentLeagueConfig = currentLeagueScopes[scope];

  if (currentLeagueConfig) {
    rows = await fetchCurrentLeaguePlayers(limit, currentLeagueConfig);
    const clubsWithRows = new Set(rows.map((row) => row.currentClub));
    const clubsWithoutRows = currentLeagueConfig.clubs.filter((club) => !clubsWithRows.has(club.id));

    const output = {
      source: {
        name: "Wikidata",
        endpoint,
        accessMethod: "Wikidata Query Service SPARQL",
        license: "CC0",
        queryPurpose: currentLeagueConfig.queryPurpose,
        leagueSeasonSource: currentLeagueConfig.leagueSeasonSource,
        leagueSeason: currentLeagueConfig.leagueSeason,
        clubCount: currentLeagueConfig.clubs.length,
        clubs: currentLeagueConfig.clubs,
        clubsWithRows: clubsWithRows.size,
        clubsWithoutRows,
        currentnessRule: "P54 club membership statement without P582 end-time qualifier",
        oldestPlausibleBirthDate: currentLeagueConfig.oldestPlausibleBirthDate,
        importedAt: new Date().toISOString(),
        limit,
      },
      reviewNote:
        "Rows are intended to represent current first-division squad members, based on Wikidata team membership statements with no end date and a conservative birth-date guard. Squads and Wikidata claims can lag real transfers, so every row needs manual review before public display.",
      players: rows,
    };

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

    console.log(`Imported ${rows.length} ${currentLeagueConfig.outputLabel} from Wikidata.`);
    console.log(`Wrote ${outputPath}`);
    return;
  }

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
