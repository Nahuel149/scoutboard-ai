const providers = [
  {
    id: "wikidata",
    name: "Wikidata",
    envVar: null,
    async check() {
      const query = `
SELECT ?player ?playerLabel WHERE {
  ?player wdt:P106 wd:Q937857.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 3
`;
      const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "ScoutBoardAI/0.1 portfolio research contact: github.com/Nahuel149/scoutboard-ai",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return `${data.results.bindings.length} sample rows`;
    },
  },
  {
    id: "statsbombOpenData",
    name: "StatsBomb Open Data",
    envVar: null,
    async check() {
      const response = await fetch(
        "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json",
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return `${data.length} open competition seasons`;
    },
  },
  {
    id: "footballDataOrg",
    name: "Football-Data.org",
    envVar: "FOOTBALL_DATA_API_TOKEN",
    async check(token) {
      const response = await fetch("https://api.football-data.org/v4/competitions/CL/matches", {
        headers: { "X-Auth-Token": token },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return `${data.matches?.length ?? 0} Champions League matches`;
    },
  },
  {
    id: "apiFootball",
    name: "API-Football",
    envVar: "API_FOOTBALL_KEY",
    async check(token) {
      const response = await fetch("https://v3.football.api-sports.io/leagues?search=Libertadores", {
        headers: { "x-apisports-key": token },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return `${data.results ?? 0} Libertadores league results`;
    },
  },
  {
    id: "sportmonks",
    name: "Sportmonks",
    envVar: "SPORTMONKS_API_TOKEN",
    async check(token) {
      const params = new URLSearchParams({
        api_token: token,
        "filters[search]": "Copa Libertadores",
      });
      const response = await fetch(`https://api.sportmonks.com/v3/football/leagues?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return `${data.data?.length ?? 0} league results`;
    },
  },
];

for (const provider of providers) {
  const token = provider.envVar ? process.env[provider.envVar] : undefined;

  if (provider.envVar && !token) {
    console.log(`${provider.id}: missing ${provider.envVar}`);
    continue;
  }

  try {
    const result = await provider.check(token);
    console.log(`${provider.id}: ready - ${result}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${provider.id}: failed - ${message}`);
  }
}
