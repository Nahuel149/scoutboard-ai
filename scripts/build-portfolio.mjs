import { build } from "esbuild";
import { mkdir, readFile, writeFile, cp, readdir } from "node:fs/promises";
const output = ".portfolio-site";
await mkdir(output, { recursive: true });
await build({ entryPoints: ["src/portfolio/demo.ts"], bundle: true, minify: true, outfile: `${output}/demo.js`, platform: "browser" });
const teams = new Map();
const reviewData = JSON.parse(await readFile("data/analytics/currentness-review.json", "utf8"));
const compiledReview = await build({ entryPoints: ["src/lib/roster-review.ts"], bundle: true, write: false, platform: "node", format: "esm" });
const { reviewMembership } = await import(`data:text/javascript;base64,${Buffer.from(compiledReview.outputFiles[0].text).toString("base64")}`);
const summary = { checkedAt: reviewData.checkedAt, confirmed: 0, unverified: 0, excluded: 0, reasons: {}, memberships: [] };
for (const name of await readdir("data/imported")) {
  if (!name.includes("division-current-players") || !name.endsWith(".json")) continue;
  const file = JSON.parse(await readFile(`data/imported/${name}`, "utf8"));
  const league = file.source.leagueSeason ?? name;
  for (const player of file.players) {
    const review = reviewMembership(player.wikidataId, player.currentClub, player.birthDate ?? null, reviewData.players[player.wikidataId], reviewData.checkedAt.slice(0, 10), new Date().toISOString().slice(0, 10));
    summary[review.status]++;
    summary.reasons[review.reason] = (summary.reasons[review.reason] ?? 0) + 1;
    if (review.status === "confirmed") summary.memberships.push({ name: player.name, club: player.currentClubName, url: review.sourceUrl, checkedAt: review.checkedAt });
    if (review.status === "excluded") continue;
    if (!player.currentClubName) continue;
    const key = JSON.stringify([league, player.currentClubName]);
    if (!teams.has(key)) teams.set(key, { club: player.currentClubName, league, count: 0, source: player.sourceUrl ?? "", imported: player.importedAt ?? "", officialWebsite: reviewData.clubs[player.currentClub]?.website ?? "", confirmed: 0 });
    teams.get(key).count++;
    if (review.status === "confirmed") teams.get(key).confirmed++;
  }
}
await writeFile(`${output}/teams.json`, JSON.stringify([...teams.values()]));
await writeFile(`${output}/roster-review.json`, JSON.stringify(summary));
await cp("reports/samples/before-after-correction.md", `${output}/before-after.md`);
await cp("docs/screenshots", `${output}/screenshots`, { recursive: true });
await writeFile(`${output}/.nojekyll`, "");
await writeFile(`${output}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ScoutBoard AI · Portfolio</title><meta name="description" content="Football data checks, club coverage and forward shot-quality comparisons. Self-created portfolio by Nahuel149."><link rel="stylesheet" href="style.css"><body><header><strong>ScoutBoard AI</strong><select id="language" aria-label="Language"><option value="en">English</option><option value="ja">日本語</option><option value="es">Español</option></select><a href="https://github.com/Nahuel149/scoutboard-ai">GitHub</a></header><nav id="navigation"></nav><main id="main"></main><footer><img src="https://raw.githubusercontent.com/hudl/open-data/master/img/SB%20-%20Icon%20Lockup%20-%20Colour%20positive.png" alt="StatsBomb" width="140"><p>Event data: <a href="https://github.com/hudl/open-data">StatsBomb Open Data</a> · Profiles: <a href="https://www.wikidata.org/wiki/Wikidata:Data_access">Wikidata CC0</a></p></footer><script type="module" src="demo.js"></script></body></html>`);
await writeFile(`${output}/style.css`, `*{box-sizing:border-box}body{margin:0;color:#151515;background:#fafafa;font:16px/1.6 Arial,"Yu Gothic",sans-serif}header{display:flex;align-items:center;gap:20px;padding:20px 5%;border-bottom:4px solid #ef4425;background:#fff}header strong{font-size:26px;margin-right:auto}nav{display:flex;flex-wrap:wrap;gap:12px;padding:14px 5%;border-bottom:1px solid #bbb}main{max-width:1120px;margin:auto;padding:32px 22px;min-height:60vh}h1{font-size:34px;line-height:1.25}h2{font-size:24px}p{max-width:75ch}button,select,input,textarea{font:inherit;border:1px solid #777;border-radius:4px;padding:8px;background:#fff;color:#151515}button{cursor:pointer}button:disabled{opacity:.5}button[aria-pressed=true]{background:#276b8f;color:#fff}textarea{display:block;width:100%;font:14px/1.5 Consolas,monospace}table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}th,td{text-align:left;padding:12px;border-bottom:1px solid #ccc;overflow-wrap:anywhere}th{background:#edf3f6}.scroll{overflow:auto}fieldset{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;border:1px solid #aaa;max-height:300px;overflow:auto}fieldset label{font-size:14px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.6 Consolas,monospace;background:#fff;padding:20px;border:1px solid #ccc}.bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:18px 0}.captures{display:grid;grid-template-columns:1fr 1fr;gap:20px}.captures img{width:100%;border:1px solid #aaa}footer{padding:24px 5%;border-top:1px solid #bbb;background:#fff}footer img{height:auto}a{color:#174f72}:focus-visible{outline:3px solid #276b8f;outline-offset:3px}@media(max-width:600px){header{flex-wrap:wrap;gap:10px}h1{font-size:27px}.captures{grid-template-columns:1fr}main{padding:22px 14px}th,td{min-width:100px}}`);
console.log(`Built public portfolio with ${teams.size} imported club groups.`);
