"use client";
import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { forwardShotQualityData as data, topForwardShotQualityPlayers } from "@/lib/statsbomb-forward-shot-quality";
import { T, copy, useLanguage } from "../../components/language";
export default function ComparePage() {
  const { locale } = useLanguage(); const [names, setNames] = useState(topForwardShotQualityPlayers.slice(0, 2).map(p => p.player));
  const selected = data.players.filter(p => names.includes(p.player));
  const metrics = [
    { key: "minutes", label: copy.minutes }, { key: "shots", label: copy.shots }, { key: "goals", label: copy.goals },
    { key: "xg", label: { en: "Total xG", ja: "合計xG", es: "xG total" } },
    { key: "non_penalty_xg", label: { en: "Non-penalty xG", ja: "PKを除くxG", es: "xG sin penales" } },
    { key: "avg_xg_per_shot", label: { en: "xG per shot", ja: "シュートあたりxG", es: "xG por remate" } },
    { key: "goal_minus_xg", label: { en: "Goals minus xG", ja: "得点 − xG", es: "Goles menos xG" } },
  ] as const;
  return <div className="pageStack toolPage"><div className="sectionHeader"><h1><T text={copy.compare} /></h1><p><T text={copy.compareNote} /></p></div><Link href="/analytics/forwards">Copa América 2024</Link>
    <fieldset className="comparePicker"><legend>{({ en: "Select 2–4 players", ja: "2〜4選手を選択", es: "Elegí de 2 a 4 jugadores" })[locale]}</legend>{data.players.map(p => <label key={p.player}><input type="checkbox" checked={names.includes(p.player)} disabled={!names.includes(p.player) && names.length >= 4} onChange={e => setNames(e.target.checked ? [...names, p.player] : names.filter(n => n !== p.player))} />{p.player} <small>{p.team}</small></label>)}</fieldset>
    {selected.length >= 2 ? <><div className="tableShell"><table><caption>{data.summary.matches} {({ en: "tournament matches", ja: "大会の試合", es: "partidos del torneo" })[locale]} · {data.source.competition}</caption><thead><tr><th></th>{selected.map(p => <th key={p.player}>{p.player}<small className="block">{p.team} · {p.matches_with_shot} {({ en: "matches with a shot", ja: "シュートを記録した試合", es: "partidos con remates" })[locale]}</small></th>)}</tr></thead><tbody>{metrics.map(m => <tr key={m.key}><th><T text={m.label} /></th>{selected.map(p => <td key={p.player}>{Number(p[m.key]).toFixed(m.key === "minutes" || m.key === "shots" || m.key === "goals" ? 0 : 3)}</td>)}</tr>)}</tbody></table></div>
      <figure className="comparisonChart"><figcaption><T text={metrics[4].label} /></figcaption>{selected.map(p => <div key={p.player}><span>{p.player}</span><meter min={0} max={Math.max(...selected.map(p => p.non_penalty_xg), 1)} value={p.non_penalty_xg} aria-label={`${p.player} non-penalty xG`} /><strong>{p.non_penalty_xg.toFixed(2)}</strong></div>)}</figure>
      <a className="primaryAction" href={`/reports/export?kind=comparison&lang=${locale}&${selected.map(p => `players=${encodeURIComponent(p.player)}`).join("&")}`}><Download size={18} /><T text={copy.download} /> Markdown</a></> : <p role="status">{({ en: "Choose at least two players.", ja: "2選手以上を選択してください。", es: "Elegí al menos dos jugadores." })[locale]}</p>}
      <p><T text={copy.source} />: <a href="https://github.com/hudl/open-data">StatsBomb Open Data</a> · <a href={data.source.matches_url}>Match JSON</a></p>
  </div>;
}
