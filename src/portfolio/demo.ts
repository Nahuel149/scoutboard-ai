import { copy, isLocale, type Locale } from "../lib/copy";
import { fields, parseCsv, sampleCsv, transformCsv, exportCsv, type ImportField } from "../lib/csv-import";
import { forwardShotQualityData as data, topForwardShotQualityPlayers } from "../lib/statsbomb-forward-shot-quality";
import { buildLocalizedForwardReport } from "../lib/localized-reports";
const main = document.querySelector<HTMLElement>("#main")!;
const navigation = document.querySelector<HTMLElement>("#navigation")!;
const language = document.querySelector<HTMLSelectElement>("#language")!;
let locale: Locale = "en"; try { const saved = localStorage.getItem("scoutboard-language"); if (isLocale(saved)) locale = saved; } catch {}
let section = "proof"; let csv = sampleCsv; let selected = topForwardShotQualityPlayers.slice(0, 2).map(p => p.player);
const text = (en: string, ja: string, es: string) => ({ en, ja, es })[locale];
const escape = (value: unknown) => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function download(value: string, name: string) { const url = URL.createObjectURL(new Blob([value], { type: name.endsWith("csv") ? "text/csv;charset=utf-8" : "text/markdown;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
language.value = locale;
language.onchange = () => { if (isLocale(language.value)) { locale = language.value; try { localStorage.setItem("scoutboard-language", locale); } catch {} render(); } };
async function render() {
  document.documentElement.lang = locale;
  navigation.replaceChildren();
  for (const [key, label] of [["proof", copy.proof], ["import", copy.import], ["teams", copy.teams], ["compare", copy.compare]] as const) { const b = document.createElement("button"); b.textContent = label[locale]; b.setAttribute("aria-pressed", String(section === key)); b.onclick = () => { section = key; void render(); }; navigation.append(b); }
  if (section === "proof") {
    main.innerHTML = `<h1>${copy.proof[locale]}</h1><p>${text("A self-created football research project. Try CSV checks, explore imported club coverage and compare forward shot quality from Copa América 2024.", "サッカーのデータを使った自主制作です。CSV確認、クラブの収録状況、コパ・アメリカ2024のFW比較を試せます。", "Proyecto propio de análisis de fútbol. Probá la revisión CSV, explorá los clubes importados y compará la calidad de remate de la Copa América 2024.")}</p><p>${text("This public sample runs in your browser. The full Next.js app includes provider setup, research tasks and reports.", "この公開サンプルはブラウザーで動作します。Next.js版にはデータ提供元の設定、リサーチタスク、レポート機能もあります。", "Esta muestra pública funciona en el navegador. La app Next.js completa también incluye configuración de fuentes, tareas de investigación y reportes.")}</p><h2>${text("Reviewed screens", "画面サンプル", "Capturas revisadas")}</h2><div class="captures"><img src="screenshots/csv-import.png" alt="CSV import"><img src="screenshots/forward-comparison.png" alt="Forward comparison"></div><h2>${text("Before/after text review", "文章の修正前・修正後", "Revisión de texto: antes y después")}</h2><a href="before-after.md" download>${copy.download[locale]} Markdown</a><pre id="correction"></pre>`;
    const response = await fetch("before-after.md"); const body = await response.text(); if (section === "proof") document.querySelector("#correction")!.textContent = body;
  }
  if (section === "import") {
    main.innerHTML = `<h1>${copy.import[locale]}</h1><p>${text("Synthetic sample. Edit the CSV or upload a UTF-8 file (maximum 2 MB). Files stay in this browser.", "架空データのサンプルです。CSVを編集するか、UTF-8のファイルを読み込んでください（最大2MB）。処理はブラウザー内で行います。", "Muestra ficticia. Editá el CSV o cargá un archivo UTF-8 (máximo 2 MB). Los archivos se procesan en este navegador.")}</p><input id="file" type="file" accept=".csv" aria-label="CSV"><label for="csv">CSV</label><textarea id="csv" rows="8"></textarea><div class="bar"><button id="review">${text("Review CSV", "CSVを確認", "Revisar CSV")}</button><button id="sample">${text("Reset sample", "サンプルに戻す", "Restablecer muestra")}</button></div><div id="reviewResult" aria-live="polite"></div>`;
    const editor = document.querySelector<HTMLTextAreaElement>("#csv")!; editor.value = csv;
    function review() { csv = editor.value; const target = document.querySelector<HTMLElement>("#reviewResult")!; try { const parsed = parseCsv(csv); const mapping = Object.fromEntries(fields.map(f => [f, f])) as Record<ImportField, string>; const result = transformCsv(parsed.rows, mapping); target.innerHTML = `<p>${text("Accepted", "取り込み可能", "Válidas")}: ${result.valid.length} · ${text("Needs review", "要確認", "Para revisar")}: ${result.rejected}</p><button id="download" ${result.valid.length ? "" : "disabled"}>${copy.download[locale]} CSV</button><ul>${result.issues.slice(0, 100).map(i => `<li>${i.row} · ${i.field} · ${i.code}</li>`).join("")}</ul>`; document.querySelector<HTMLButtonElement>("#download")!.onclick = () => download(exportCsv(result.valid), "players-clean.csv"); } catch (e) { target.textContent = (e as Error).message; } }
    document.querySelector<HTMLButtonElement>("#review")!.onclick = review;
    document.querySelector<HTMLButtonElement>("#sample")!.onclick = () => { editor.value = sampleCsv; review(); };
    document.querySelector<HTMLInputElement>("#file")!.onchange = async e => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const target = document.querySelector<HTMLElement>("#reviewResult")!; try { if (file.size > 2_000_000) throw new Error("Maximum: 2 MB"); editor.value = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); review(); } catch { target.textContent = text("Use a UTF-8 CSV smaller than 2 MB.", "2MB以下のUTF-8 CSVを使用してください。", "Usá un CSV UTF-8 de menos de 2 MB."); } }; review();
  }
  if (section === "teams") {
    main.innerHTML = `<h1>${copy.teams[locale]}</h1><p>${copy.rosterNote[locale]}</p><label>${copy.search[locale]} <input id="search"></label><div class="scroll"><table><thead><tr><th>${copy.club[locale]}</th><th>${copy.league[locale]}</th><th>${copy.players[locale]}</th><th>${copy.date[locale]}</th><th>${copy.source[locale]}</th></tr></thead><tbody id="teams"></tbody></table></div>`;
    const response = await fetch("teams.json"); const teams = await response.json() as { club: string; league: string; count: number; source: string; imported: string }[]; if (section !== "teams") return;
    const filter = document.querySelector<HTMLInputElement>("#search")!;
    function rows() { document.querySelector("#teams")!.innerHTML = teams.filter(t => `${t.club} ${t.league}`.toLowerCase().includes(filter.value.toLowerCase())).map(t => `<tr><td>${escape(t.club)}</td><td>${escape(t.league)}</td><td>${t.count}</td><td>${escape(t.imported)}</td><td>${/^https:\/\/www.wikidata.org\//.test(t.source) ? `<a href="${escape(t.source)}" target="_blank" rel="noreferrer">Wikidata</a>` : "Wikidata"}</td></tr>`).join(""); } filter.oninput = rows; rows();
  }
  if (section === "compare") {
    main.innerHTML = `<h1>${copy.compare[locale]}</h1><p>${copy.compareNote[locale]}</p><fieldset><legend>${text("Select 2–4 players", "2〜4選手を選択", "Elegí de 2 a 4 jugadores")}</legend>${data.players.map((p, i) => `<label><input type="checkbox" data-index="${i}" ${selected.includes(p.player) ? "checked" : ""} ${!selected.includes(p.player) && selected.length >= 4 ? "disabled" : ""}>${escape(p.player)}</label>`).join("")}</fieldset><div class="scroll" id="comparison"></div><button id="report" ${selected.length < 2 ? "disabled" : ""}>${copy.download[locale]} Markdown</button>`;
    const players = data.players.filter(p => selected.includes(p.player));
    document.querySelector("#comparison")!.innerHTML = `<table><thead><tr><th>${copy.players[locale]}</th><th>${copy.minutes[locale]}</th><th>${copy.shots[locale]}</th><th>${copy.goals[locale]}</th><th>xG</th><th>${text("Non-penalty xG", "PKを除くxG", "xG sin penales")}</th><th>xG / ${copy.shots[locale]}</th></tr></thead><tbody>${players.map(p => `<tr><td>${escape(p.player)}</td><td>${p.minutes}</td><td>${p.shots}</td><td>${p.goals}</td><td>${p.xg.toFixed(2)}</td><td>${p.non_penalty_xg.toFixed(2)}</td><td>${p.avg_xg_per_shot.toFixed(3)}</td></tr>`).join("")}</tbody></table>`;
    for (const input of document.querySelectorAll<HTMLInputElement>("[data-index]")) input.onchange = () => { const name = data.players[Number(input.dataset.index)].player; selected = input.checked ? [...selected, name] : selected.filter(n => n !== name); void render(); };
    document.querySelector<HTMLButtonElement>("#report")!.onclick = () => download(buildLocalizedForwardReport(players, locale), "forward-comparison.md");
  }
}
void render();
