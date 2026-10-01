"use client";
import Link from "next/link";
import { useState } from "react";
import { copy, T, useLanguage } from "../components/language";
export function TeamDirectory({ teams }: { teams: { id: string; name: string; league: string; country: string; count: number }[] }) {
  const [q, setQ] = useState(""); const [country, setCountry] = useState(""); const [league, setLeague] = useState(""); const { locale } = useLanguage();
  const filtered = teams.filter(t => `${t.name} ${t.league}`.toLowerCase().includes(q.toLowerCase()) && (!country || t.country === country) && (!league || t.league === league));
  return <div className="pageStack toolPage"><div className="sectionHeader"><h1><T text={copy.teams} /></h1><p><T text={copy.rosterNote} /></p></div><div className="mappingGrid"><label><T text={copy.search} /><input value={q} onChange={e => setQ(e.target.value)} /></label>{(["country", "league"] as const).map(field => <label key={field}><T text={copy[field]} /><select value={field === "country" ? country : league} onChange={e => (field === "country" ? setCountry : setLeague)(e.target.value)}><option value="">{copy.all[locale]}</option>{[...new Set(teams.map(t => t[field]))].sort().map(v => <option key={v}>{v}</option>)}</select></label>)}</div><p aria-live="polite">{filtered.length} / {teams.length}</p><div className="tableShell"><table><thead><tr><th><T text={copy.club} /></th><th><T text={copy.country} /></th><th><T text={copy.league} /></th><th><T text={copy.players} /></th></tr></thead><tbody>{filtered.map(t => <tr key={t.id}><td><Link href={`/teams/${t.id}`}>{t.name}</Link></td><td>{t.country}</td><td>{t.league}</td><td>{t.count}</td></tr>)}</tbody></table></div>{!filtered.length && <p><T text={copy.empty} /></p>}</div>;
}
