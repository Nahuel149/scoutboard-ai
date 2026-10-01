"use client";
import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { forwardShotQualityData } from "@/lib/statsbomb-forward-shot-quality";
import { buildLocalizedForwardReport } from "@/lib/localized-reports";
import { T, copy, useLanguage } from "../components/language";
export function LocalizedReportBuilder() {
  const { locale } = useLanguage(); const [name, setName] = useState(forwardShotQualityData.players[0].player);
  const player = forwardShotQualityData.players.find(p => p.player === name)!;
  const params = `player=${encodeURIComponent(name)}&lang=${locale}`;
  return <section className="pageStack toolPage"><h2><T text={{ en: "Tournament player report", ja: "大会の選手レポート", es: "Reporte de jugador del torneo" }} /></h2><label><T text={copy.players} /><select value={name} onChange={e => setName(e.target.value)}>{forwardShotQualityData.players.map(p => <option key={p.player}>{p.player}</option>)}</select></label><div className="toolBar"><a className="primaryAction" href={`/reports/export?${params}`}><Download size={18} /><T text={copy.download} /> Markdown</a><a href={`/reports/print?${params}`}><Printer size={18} /><T text={{ en: "Print / PDF", ja: "印刷 / PDF", es: "Imprimir / PDF" }} /></a></div><pre className="csvSample">{buildLocalizedForwardReport([player], locale)}</pre></section>;
}
