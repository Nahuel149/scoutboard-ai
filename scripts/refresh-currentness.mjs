import { readdir, readFile, writeFile } from "node:fs/promises";
const files = (await readdir("data/imported")).filter(f => f.includes("division-current-players") && f.endsWith(".json"));
const players = []; const clubs = new Map();
for (const file of files) { const input = JSON.parse(await readFile(`data/imported/${file}`, "utf8")); players.push(...input.players); for (const club of input.source.clubs ?? []) clubs.set(club.id, club.name); }
const ids = [...new Set([...players.map(p => p.wikidataId), ...clubs.keys()])].filter(id => /^Q\d+$/.test(id));
const output = { source: "Wikidata CC0", checkedAt: new Date().toISOString(), method: "wbgetentities: P569 birth, P570 death, P21 gender, P641 sports, P54 memberships, P856 official website. Absence of death/end claims does not prove active status.", players: {}, clubs: {}, failedIds: [] };
function value(entity, property) { const claims = (entity.claims?.[property] ?? []).filter(c => c.rank !== "deprecated"); return (claims.find(c => c.rank === "preferred") ?? claims[0])?.mainsnak.datavalue?.value; }
for (let offset = 0; offset < ids.length; offset += 50) {
  const batch = ids.slice(offset, offset + 50);
  try {
    const url = new URL("https://www.wikidata.org/w/api.php"); url.search = new URLSearchParams({ action: "wbgetentities", ids: batch.join("|"), props: "claims", format: "json", maxlag: "5" }).toString();
    const response = await fetch(url, { headers: { "User-Agent": "ScoutBoardAI/0.1 (https://github.com/Nahuel149/scoutboard-ai)" }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`); const data = await response.json(); if (data.error) throw new Error(data.error.code);
    for (const id of batch) { const entity = data.entities?.[id]; if (!entity || "missing" in entity) { output.failedIds.push(id); continue; } if (clubs.has(id)) output.clubs[id] = { name: clubs.get(id), website: value(entity, "P856") ?? null }; else output.players[id] = { birth: value(entity, "P569")?.time ?? null, death: value(entity, "P570")?.time ?? null, gender: value(entity, "P21")?.id ?? null, sports: (entity.claims?.P641 ?? []).map(c => c.mainsnak.datavalue?.value?.id).filter(Boolean), latestMemberships: (entity.claims?.P54 ?? []).filter(c => c.rank !== "deprecated" && !c.qualifiers?.P582).map(c => c.mainsnak.datavalue?.value?.id).filter(Boolean) }; }
  } catch (error) { output.failedIds.push(...batch); console.error(`Batch ${offset}: ${error.message}`); }
  if (offset % 500 === 0) console.log(`Reviewed ${Math.min(offset + 50, ids.length)}/${ids.length}`);
  await new Promise(resolve => setTimeout(resolve, 300));
}
await writeFile("data/analytics/currentness-review.json", JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ reviewedPlayers: Object.keys(output.players).length, reviewedClubs: Object.keys(output.clubs).length, deceased: Object.values(output.players).filter(p => p.death).length, failed: output.failedIds.length }));
