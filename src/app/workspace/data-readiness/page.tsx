import Link from "next/link";
import { ArrowLeft, Database, KeyRound, ShieldCheck, TableProperties } from "lucide-react";
import { getDataReadinessRows, getWorkspaceSnapshot } from "@/lib/performance-workspace";

export default function DataReadinessPage() {
  const rows = getDataReadinessRows();
  const snapshot = getWorkspaceSnapshot();
  const keyedProviders = rows.filter((row) => row.keyStatus !== "No key needed").length;
  const readyRows = rows.filter((row) => row.state === "ready").length;

  return (
    <div className="pageStack">
      <Link className="backLink" href="/workspace">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to workspace
      </Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow">Data readiness / データ準備 / Estado de fuentes</p>
          <h1>Every provider has a job, a rule, and a limit.</h1>
          <p>
            This board keeps ScoutBoard AI honest: open data can power committed portfolio samples,
            while API data stays server-side until terms and cache rules are clear.
          </p>
          <p className="jp">
            各データソースの用途、APIキー状態、保存ルールを見える形にして、公開できる範囲を明確にします。
          </p>
          <p className="es">
            Esta vista separa fuentes abiertas, APIs con key y reglas de uso para no mezclar datos sin revisar.
          </p>
        </div>
        <Link className="primaryAction" href="/analytics/champions">
          Check Champions demo
        </Link>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Database size={20} aria-hidden="true" />
          <span>Providers</span>
          <strong>{rows.length}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Ready</span>
          <strong>{readyRows}</strong>
        </article>
        <article className="metric">
          <KeyRound size={20} aria-hidden="true" />
          <span>Keyed APIs</span>
          <strong>{keyedProviders}</strong>
        </article>
        <article className="metric">
          <TableProperties size={20} aria-hidden="true" />
          <span>Workspace providers</span>
          <strong>{snapshot.providersReady}/{snapshot.providersTotal}</strong>
        </article>
      </section>

      <section className="tableShell readinessTable">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Type</th>
              <th>Key status</th>
              <th>Portfolio use</th>
              <th>Cache/display rule</th>
              <th>Next action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.provider}>
                <td>
                  <a href={row.homepageUrl} rel="noreferrer" target="_blank">
                    {row.provider}
                  </a>
                  <span className="tableSubline">{row.capabilities}</span>
                </td>
                <td>{row.sourceType}</td>
                <td>
                  <span className={`pill ${row.state === "needs-key" ? "warning" : ""}`}>
                    {row.keyStatus}
                  </span>
                </td>
                <td>{row.portfolioUse}</td>
                <td>
                  {row.cacheRule}
                  <span className="tableSubline">{row.licenseNote}</span>
                </td>
                <td>{row.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow">Operating rule</p>
          <h2>Reliable old data is better than unclear current data.</h2>
          <p>
            For portfolio proof, dated public datasets are acceptable when the date, source, and
            limits are visible. Current APIs become useful after token setup and terms review.
          </p>
          <p className="es">
            Para portafolio, datos viejos pero confiables son válidos si la fuente y la fecha están claras.
          </p>
        </div>
        <div className="providerMiniList">
          <div className="providerMiniRow">
            <span>Commit open-data outputs</span>
            <strong>Allowed</strong>
          </div>
          <div className="providerMiniRow">
            <span>Commit real API keys</span>
            <strong>Never</strong>
          </div>
          <div className="providerMiniRow">
            <span>Bulk republish paid data</span>
            <strong>Blocked</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
