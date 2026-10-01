import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAmericanWatchlist } from "@/lib/american-watchlist";
import { buildTeamDirectory } from "@/lib/team-directory";
import { T } from "../../components/language";
import { copy } from "@/lib/copy";
export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const team = buildTeamDirectory(await loadAmericanWatchlist()).find(t => t.id === id); if (!team) notFound();
  return <div className="pageStack toolPage"><Link href="/teams"><T text={copy.teams} /></Link><div className="sectionHeader"><h1>{team.name}</h1><p>{team.country} · {team.league}</p><p><T text={copy.rosterNote} /></p></div><div className="tableShell"><table><thead><tr><th><T text={copy.players} /></th><th><T text={copy.position} /></th><th><T text={copy.date} /></th><th><T text={copy.source} /></th></tr></thead><tbody>{team.players.map(p => <tr key={p.id}><td>{p.name}{p.nameJa && <small lang="ja"> / {p.nameJa}</small>}</td><td>{p.position}</td><td>{p.importedAt || "—"}</td><td><a href={p.sourceUrl} target="_blank" rel="noreferrer">{p.sourceName} ({p.sourceLicense})</a><small> · {p.confidence}</small></td></tr>)}</tbody></table></div></div>;
}
