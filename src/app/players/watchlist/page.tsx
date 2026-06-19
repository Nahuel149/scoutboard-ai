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
  const page = Math.max(1, Number(value(params, "page")) || 1);
  const all = await loadAmericanWatchlist();
  const countries = [...new Set(all.map((player) => player.country))].sort();
  const leagues = [...new Set(all.map((player) => player.league))].sort();
  const clubs = [...new Set(all.map((player) => player.club))].sort();
  const positions = [...new Set(all.map((player) => player.position))].sort();
  const filtered = all.filter((player) => {
    const haystack = `${player.name} ${player.nameJa ?? ""} ${player.club}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!country || player.country === country) &&
      (!league || player.league === league) && (!club || player.club === club) &&
      (!position || player.position === position);
  });
  const pageSize = 40;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="pageStack">
      <Link className="backLink" href="/players"><ArrowLeft size={16} />Back to players</Link>
      <section className="detailHero workspaceHero">
        <div><p className="eyebrow">Americas player watchlist / 選手候補 / Lista de seguimiento</p><h1>Find the record, then check the source.</h1><p>{all.length.toLocaleString()} roster records from American leagues, with uncertainty kept visible.</p><p className="jp">南北アメリカの選手データを検索し、出典と欠損項目を同時に確認できます。</p><p className="es">Buscá por país, liga, club o posición. Cada fila muestra qué sabemos y qué falta revisar.</p></div>
        <Search size={58} aria-hidden="true" />
      </section>

      <form className="watchlistFilters" method="get">
        <label>Search<input name="q" defaultValue={value(params, "q")} placeholder="Player or club" /></label>
        <label>Country<select name="country" defaultValue={country}><option value="">All countries</option>{countries.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>League<select name="league" defaultValue={league}><option value="">All leagues</option>{leagues.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Club<select name="club" defaultValue={club}><option value="">All clubs</option>{clubs.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Position<select name="position" defaultValue={position}><option value="">All positions</option>{positions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className="primaryAction" type="submit"><Search size={17} />Apply</button>
      </form>

      <div className="watchlistSummary"><strong>{filtered.length.toLocaleString()} records</strong><span>Page {Math.min(page, totalPages)} of {totalPages}</span><span><ShieldCheck size={16} />Medium means roster claim found, not club-confirmed.</span></div>

      <section className="watchlistGrid">
        {rows.map((player) => (
          <article className="watchlistCard" key={player.id}>
            <div className="watchlistCardHead"><div><p className="eyebrow">{player.country} · {player.position}</p><h2>{player.name}</h2>{player.nameJa && <p className="jp">{player.nameJa}</p>}</div><span className={`pill ${player.confidence === "low" ? "danger" : "warning"}`}>{player.confidence} confidence</span></div>
            <dl><div><dt>Club</dt><dd>{player.club}</dd></div><div><dt>League</dt><dd>{player.league}</dd></div><div><dt>Birth date</dt><dd>{player.birthDate ?? "Not recorded"}</dd></div><div><dt>Status</dt><dd>Current claim, manual review pending</dd></div></dl>
            {player.missingFields.length > 0 && <div className="missingAlert"><AlertTriangle size={17} /><span>Missing: {player.missingFields.join(", ")}</span></div>}
            <p className="dataFootnote">{player.note}</p>
            {player.sourceUrl && <a className="sourceLink" href={player.sourceUrl} target="_blank" rel="noreferrer">Open {player.sourceName} source ({player.sourceLicense})</a>}
          </article>
        ))}
      </section>
      {rows.length === 0 && <p className="emptyState">No records match these filters.</p>}
      <nav className="pagination" aria-label="Watchlist pages">
        {page > 1 && <Link className="backLink" href={{ query: { ...params, page: page - 1 } }}>Previous</Link>}
        {page < totalPages && <Link className="primaryAction" href={{ query: { ...params, page: page + 1 } }}>Next</Link>}
      </nav>
    </div>
  );
}
