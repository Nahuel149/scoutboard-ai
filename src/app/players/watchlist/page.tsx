import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Search, ShieldCheck } from "lucide-react";
import { loadAmericanWatchlist } from "@/lib/american-watchlist";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const item = params[key];
  return Array.isArray(item) ? item[0] ?? "" : item ?? "";
}

export default async function WatchlistPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = value(params, "q").trim().toLowerCase();
  const country = value(params, "country");
  const league = value(params, "league");
  const club = value(params, "club");
  const position = value(params, "position");
  const status = value(params, "status") || "confirmed";
  const requestedPage = Math.max(1, Number(value(params, "page")) || 1);
  const all = await loadAmericanWatchlist();
  const countries = [...new Set(all.map((player) => player.country))].sort();
  const leagues = [...new Set(all.map((player) => player.league))].sort();
  const clubs = [...new Set(all.map((player) => player.club))].sort();
  const positions = [...new Set(all.map((player) => player.position))].sort();
  const filtered = all.filter((player) => {
    const haystack = `${player.name} ${player.nameJa ?? ""} ${player.club}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!country || player.country === country) &&
      (!league || player.league === league) && (!club || player.club === club) &&
      (!position || player.position === position) && (status === "all" || player.review.status === status);
  });
  const pageSize = 40;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="pageStack">
      <Link className="backLink" href="/players"><ArrowLeft size={16} /><UI text="Back to players" /></Link>
      <section className="detailHero workspaceHero">
        <div><p className="eyebrow"><UI text="Americas player watchlist / 選手候補 / Lista de seguimiento" /></p><h1><T text={pageTitles["/players/watchlist"]} /></h1><p><LocalizedContent en={<>{all.length.toLocaleString()} roster records from American leagues, with uncertainty kept visible.</>} ja={<>南北アメリカの選手データを検索し、出典と欠損項目を同時に確認できます。</>} es={<>Buscá por país, liga, club o posición. Cada fila muestra qué sabemos y qué falta revisar.</>} /></p></div>
        <Search size={58} aria-hidden="true" />
      </section>

      <form className="watchlistFilters" method="get">
        <label><UI text="Review" /><select name="status" defaultValue={status}><option value="confirmed"><UI text="Confirmed memberships" /></option><option value="all"><UI text="All candidates" /></option><option value="unverified"><UI text="Unverified claims" /></option></select></label>
        <label><UI text="Search" /><input name="q" defaultValue={value(params, "q")} placeholder="Player or club" /></label>
        <label><UI text="Country" /><select name="country" defaultValue={country}><option value=""><UI text="All countries" /></option>{countries.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><UI text="League" /><select name="league" defaultValue={league}><option value=""><UI text="All leagues" /></option>{leagues.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><UI text="Club" /><select name="club" defaultValue={club}><option value=""><UI text="All clubs" /></option>{clubs.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><UI text="Position" /><select name="position" defaultValue={position}><option value=""><UI text="All positions" /></option>{positions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className="primaryAction" type="submit"><Search size={17} /><UI text="Apply" /></button>
      </form>
      <p><UI text="Current squads are shown only when a club source confirms the membership. Other claims remain in the review queue." /> <Link href="/workspace/roster-review"><UI text="Roster review" /></Link></p>

      <div className="watchlistSummary"><strong>{filtered.length.toLocaleString()} {" "}<UI text="records" /></strong><span><UI text="Page" />{" "}{Math.min(page, totalPages)} {" "}<UI text="of" />{" "}{totalPages}</span><span><ShieldCheck size={16} /><UI text="Medium means roster claim found, not club-confirmed." /></span></div>

      <section className="watchlistGrid">
        {rows.map((player) => (
          <article className="watchlistCard" key={player.id}>
            <div className="watchlistCardHead"><div><p className="eyebrow">{player.country} · <UI text={player.position} /></p><h2>{player.name}</h2>{player.nameJa && <p className="jp">{player.nameJa}</p>}</div><span className={`pill ${player.confidence === "low" ? "danger" : "warning"}`}><UI text={player.confidence} /> {" "}<UI text="confidence" /></span></div>
            <dl><div><dt><UI text="Club" /></dt><dd>{player.club}</dd></div><div><dt><UI text="League" /></dt><dd>{player.league}</dd></div><div><dt><UI text="Birth date" /></dt><dd><UI text={player.birthDate ?? "Not recorded"} /></dd></div><div><dt><UI text="Status" /></dt><dd><UI text={player.review.status} /></dd></div></dl>
            {player.missingFields.length > 0 && <div className="missingAlert"><AlertTriangle size={17} /><span><UI text="Missing:" />{" "}<UI text={player.missingFields.join(", ")} /></span></div>}
            <p className="dataFootnote"><UI text={player.review.status} /> · <UI text={player.review.reason} /> · {player.review.checkedAt ?? "—"}</p>
            {player.review.sourceUrl && <a className="sourceLink" href={player.review.sourceUrl} target="_blank" rel="noreferrer"><UI text="Review source" /></a>}
            {player.sourceUrl && <a className="sourceLink" href={player.sourceUrl} target="_blank" rel="noreferrer"><UI text="Open" />{" "}{player.sourceName} {" "}<UI text="source (" />{player.sourceLicense})</a>}
          </article>
        ))}
      </section>
      {rows.length === 0 && <p className="emptyState"><UI text="No records match these filters." /></p>}
      <nav className="pagination" aria-label="Watchlist pages">
        {page > 1 && <Link className="backLink" href={{ query: { ...params, page: page - 1 } }}><UI text="Previous" /></Link>}
        {page < totalPages && <Link className="primaryAction" href={{ query: { ...params, page: page + 1 } }}><UI text="Next" /></Link>}
      </nav>
    </div>
  );
}
