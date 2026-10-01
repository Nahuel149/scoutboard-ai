"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Upload, FlaskConical } from "lucide-react";
import { fields, parseCsv, transformCsv, exportCsv, sampleCsv, type ImportField } from "@/lib/csv-import";
import { T, copy, useLanguage } from "../components/language";
import { translateUi } from "@/lib/ui-copy";
const labels = {
  intro: { en: "Check a player CSV before using it in a report. Files stay in this browser.", ja: "レポートに使う前に選手CSVを確認します。ファイルはブラウザー内で処理します。", es: "Revisá el CSV de jugadores antes de usarlo en un reporte. Los archivos se procesan en este navegador." },
  sample: { en: "Load synthetic sample", ja: "サンプルを読み込む", es: "Cargar muestra ficticia" },
  mapping: { en: "Column mapping", ja: "列の対応", es: "Asignación de columnas" },
  accepted: { en: "Accepted rows", ja: "取り込み可能", es: "Filas válidas" },
  rejected: { en: "Rows needing review", ja: "要確認の行", es: "Filas para revisar" },
  clean: { en: "Download clean CSV", ja: "確認済みCSVを保存", es: "Descargar CSV limpio" },
  report: { en: "Download review report", ja: "確認レポートを保存", es: "Descargar revisión" },
  edit: { en: "Edit CSV and review again", ja: "CSVを編集して再確認", es: "Editar CSV y volver a revisar" },
};
function download(text: string, filename: string, type: string) { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export default function ImportPage() {
  const { locale } = useLanguage();
  const [text, setText] = useState(""); const [error, setError] = useState("");
  const [mapping, setMapping] = useState<Record<ImportField, string>>(Object.fromEntries(fields.map(f => [f, f])) as Record<ImportField, string>);
  const result = useMemo(() => { if (!text) return null; try { const parsed = parseCsv(text); return { ...parsed, ...transformCsv(parsed.rows, mapping) }; } catch (e) { return { error: (e as Error).message }; } }, [text, mapping]);
  async function upload(file?: File) { if (!file) return; if (file.size > 2_000_000) { setError("Maximum file size: 2 MB."); return; } try { const decoded = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); setText(decoded); setError(""); } catch { setError("Save the file as UTF-8 CSV and try again."); } }
  const valid = result && !("error" in result) ? result : null;
  return <div className="pageStack toolPage"><div className="sectionHeader"><h1><T text={copy.import} /></h1><p><T text={labels.intro} /></p></div>
    <div className="toolBar"><label className="primaryAction"><Upload size={18} /><T text={copy.import} /><input aria-label={copy.import[locale]} type="file" accept=".csv,text/csv" onChange={e => void upload(e.target.files?.[0])} /></label><button onClick={() => { setText(sampleCsv); setError(""); }}><FlaskConical size={18} /><T text={labels.sample} /></button><Link href="/proof/csv-transformation"><T text={copy.proof} /></Link></div>
    {(error || (result && "error" in result)) && <p role="alert">{translateUi(error || (result && "error" in result ? result.error ?? "" : ""), locale)}</p>}
    {text && <label className="csvEditor"><T text={labels.edit} /><textarea aria-label="CSV" value={text} onChange={e => setText(e.target.value)} rows={7} spellCheck={false} /></label>}
    {valid && <><h2><T text={labels.mapping} /></h2><div className="mappingGrid">{fields.map(field => <label key={field}>{field}<select value={mapping[field]} onChange={e => setMapping({ ...mapping, [field]: e.target.value })}><option value="">—</option>{valid.headers.map(h => <option key={h}>{h}</option>)}</select></label>)}</div>
      <div className="toolBar" aria-live="polite"><strong><T text={labels.accepted} />: {valid.valid.length}</strong><strong><T text={labels.rejected} />: {valid.rejected}</strong><button disabled={!valid.valid.length} onClick={() => download(exportCsv(valid.valid), "players-clean.csv", "text/csv;charset=utf-8")}><Download size={18} /><T text={labels.clean} /></button><button onClick={() => download(`# ${labels.report[locale]}\n\n${labels.accepted[locale]}: ${valid.valid.length}\n${labels.rejected[locale]}: ${valid.rejected}\n\n${valid.issues.map(i => `- ${i.row} / ${i.field}: ${i.code}`).join("\n")}\n\n${copy.source[locale]}: CSV supplied by user.\n`, "csv-review.md", "text/markdown;charset=utf-8")}><Download size={18} /><T text={labels.report} /></button></div>
      <div className="tableShell"><table><thead><tr>{fields.map(f => <th key={f}>{f}</th>)}</tr></thead><tbody>{valid.valid.slice(0, 100).map(row => <tr key={row.id}>{fields.map(f => <td key={f}>{row[f]}</td>)}</tr>)}</tbody></table></div>
      <ul className="issueList">{valid.issues.slice(0, 100).map((i, index) => <li key={index}>{i.row} · {i.field} · {translateUi(i.code, locale)}: {translateUi(i.message, locale)}</li>)}</ul></>}
  </div>;
}
