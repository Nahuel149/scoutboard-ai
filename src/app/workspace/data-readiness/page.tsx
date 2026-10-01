import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
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
        <UI text="Back to workspace" /></Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow"><UI text="Data readiness / データ準備 / Estado de fuentes" /></p>
          <h1><T text={pageTitles["/workspace/data-readiness"]} /></h1>
          <p><LocalizedContent en={<>
            This board keeps ScoutBoard AI honest: open data can power committed portfolio samples,
            while API data stays server-side until terms and cache rules are clear.
          </>} ja={<>
            各データソースの用途、APIキー状態、保存ルールを見える形にして、公開できる範囲を明確にします。
          </>} es={<>
            Esta vista separa fuentes abiertas, APIs con key y reglas de uso para no mezclar datos sin revisar.
          </>} /></p>
        </div>
        <Link className="primaryAction" href="/analytics/champions">
          <UI text="Check Champions demo" /></Link>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Database size={20} aria-hidden="true" />
          <span><UI text="Providers" /></span>
          <strong>{rows.length}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span><UI text="Ready" /></span>
          <strong>{readyRows}</strong>
        </article>
        <article className="metric">
          <KeyRound size={20} aria-hidden="true" />
          <span><UI text="Keyed APIs" /></span>
          <strong>{keyedProviders}</strong>
        </article>
        <article className="metric">
          <TableProperties size={20} aria-hidden="true" />
          <span><UI text="Workspace providers" /></span>
          <strong>{snapshot.providersReady}/{snapshot.providersTotal}</strong>
        </article>
      </section>

      <section className="tableShell readinessTable">
        <table>
          <thead>
            <tr>
              <th><UI text="Provider" /></th>
              <th><UI text="Type" /></th>
              <th><UI text="Key status" /></th>
              <th><UI text="Portfolio use" /></th>
              <th><UI text="Cache/display rule" /></th>
              <th><UI text="Next action" /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.provider}>
                <td>
                  <a href={row.homepageUrl} rel="noreferrer" target="_blank">
                    {row.provider}
                  </a>
                  <span className="tableSubline"><UI text={row.capabilities} /></span>
                </td>
                <td><UI text={row.sourceType} /></td>
                <td>
                  <span className={`pill ${row.state === "needs-key" ? "warning" : ""}`}>
                    <UI text={row.keyStatus} />
                  </span>
                </td>
                <td><UI text={row.portfolioUse} /></td>
                <td>
                  <UI text={row.cacheRule} />
                  <span className="tableSubline"><UI text={row.licenseNote} /></span>
                </td>
                <td><UI text={row.nextAction} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow"><UI text="Operating rule" /></p>
          <h2><UI text="Reliable old data is better than unclear current data." /></h2>
          <p>
            <UI text="For portfolio proof, dated public datasets are acceptable when the date, source, and limits are visible. Current APIs become useful after token setup and terms review." /></p>
        </div>
        <div className="providerMiniList">
          <div className="providerMiniRow">
            <span><UI text="Commit open-data outputs" /></span>
            <strong><UI text="Allowed" /></strong>
          </div>
          <div className="providerMiniRow">
            <span><UI text="Commit real API keys" /></span>
            <strong><UI text="Never" /></strong>
          </div>
          <div className="providerMiniRow">
            <span><UI text="Bulk republish paid data" /></span>
            <strong><UI text="Blocked" /></strong>
          </div>
        </div>
      </section>
    </div>
  );
}
