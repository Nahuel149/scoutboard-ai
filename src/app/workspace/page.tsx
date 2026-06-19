import Link from "next/link";
import { ArrowRight, ClipboardCheck, Database, FileText, Radar, ShieldCheck } from "lucide-react";
import { getWorkspaceSnapshot, workspaceModules, type WorkspaceModuleStatus } from "@/lib/performance-workspace";

const statusLabels: Record<WorkspaceModuleStatus, string> = {
  ready: "Ready",
  "in-progress": "In progress",
  planned: "Planned",
  blocked: "Blocked",
};

function formatXg(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export default function WorkspacePage() {
  const snapshot = getWorkspaceSnapshot();

  return (
    <div className="pageStack">
      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow">Performance workspace / 分析デスク / Mesa de rendimiento</p>
          <h1>The control room for ScoutBoard AI.</h1>
          <p>
            A progressive workspace inspired by professional football platforms: data
            readiness, event analytics, watchlists, QA, and report delivery in one place.
          </p>
          <p className="jp">
            データ準備、イベント分析、選手リスト、QA、レポート作成を一つの画面にまとめる作業デスクです。
          </p>
          <p className="es">
            Una mesa de trabajo para unir fuentes, análisis, alertas de datos y reportes sin depender de una sola API.
          </p>
        </div>
        <Link className="primaryAction" href="/analytics">
          Open analytics
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="metricGrid">
        <article className="metric">
          <Database size={20} aria-hidden="true" />
          <span>Providers ready</span>
          <strong>{snapshot.providersReady}/{snapshot.providersTotal}</strong>
        </article>
        <article className="metric">
          <Radar size={20} aria-hidden="true" />
          <span>Modules ready</span>
          <strong>{snapshot.modulesReady}/{snapshot.modulesTotal}</strong>
        </article>
        <article className="metric">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Open QA findings</span>
          <strong>{snapshot.openPlayerIssues}</strong>
        </article>
        <article className="metric">
          <ClipboardCheck size={20} aria-hidden="true" />
          <span>StatsBomb shots</span>
          <strong>{snapshot.statsbombSummary.total_forward_shots}</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow">Build queue / ロードマップ / Lista de avance</p>
            <h2>What we build, in order</h2>
            <p>
              Each module has to prove a real workflow: collect data, check it, analyze it,
              and turn it into a report-ready output.
            </p>
            <p className="es">Cada módulo tiene que demostrar un flujo real: datos, revisión, análisis y entrega.</p>
          </div>

          <div className="workspaceModuleGrid">
            {workspaceModules.map((module) => (
              <article className={`workspaceModule ${module.status}`} key={module.title}>
                <div>
                  <span className={`pill ${module.status === "blocked" ? "danger" : module.status}`}>
                    {statusLabels[module.status]}
                  </span>
                  <h3>{module.title}</h3>
                  <p>{module.summary}</p>
                </div>
                <div className="moduleProof">
                  <strong>Proof</strong>
                  <span>{module.proof}</span>
                </div>
                <div className="moduleProof">
                  <strong>Next</strong>
                  <span>{module.nextAction}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="qaPanel workspacePanel">
          <p className="eyebrow">Current scouting question</p>
          <h2>Which attackers are already producing high-quality shots?</h2>
          <p>
            The first live proof uses Copa America 2024 open events. It is not current,
            but it is reliable and good enough to demonstrate the workflow.
          </p>
          <div className="profileGrid">
            <span>Top forward <strong>{snapshot.topForward.player}</strong></span>
            <span>Team <strong>{snapshot.topForward.team}</strong></span>
            <span>NP xG <strong>{formatXg(snapshot.topForward.non_penalty_xg)}</strong></span>
            <span>Shots <strong>{snapshot.topForward.shots}</strong></span>
          </div>
          <Link className="backLink" href="/analytics">
            See event board
          </Link>
        </aside>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow">Data readiness / Fuente y estado</p>
          <h2>Every source has a job and a limit.</h2>
          <p>
            Open datasets can be committed when attribution and scope are clear. Keyed providers
            stay server-side and should not be bulk-republished without a terms review.
          </p>
          <p className="jp">オープンデータとAPIキー付きデータを分けて扱い、出典と利用範囲を明確にします。</p>
          <p className="es">Separar fuentes abiertas y APIs con key evita depender de una sola fuente y protege el proyecto.</p>
        </div>
        <div className="providerMiniList">
          {snapshot.providerStatuses.map((provider) => (
            <div className="providerMiniRow" key={provider.id}>
              <span>{provider.name}</span>
              <strong>{provider.status === "ready" ? "Ready" : "Needs key"}</strong>
            </div>
          ))}
          <Link className="backLink" href="/workspace/data-readiness">
            Open readiness board
          </Link>
        </div>
      </section>

      <section className="playerCardGrid" aria-label="Workspace quick links">
        <Link className="miniArticleCard tone-3" href="/workspace/league-coverage">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>DB</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Americas database</p>
            <h2>League coverage</h2>
            <p>Review player rows, club coverage, and missing-club tasks before search.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-0" href="/analytics/champions">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>CL</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Football-Data.org</p>
            <h2>Champions ETL</h2>
            <p>Basic fixtures and results demo with server-side token handling.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-1" href="/analytics">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>xG</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">StatsBomb Open Data</p>
            <h2>Shot quality</h2>
            <p>Forward xG and shot-quality board from Copa America 2024.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-2" href="/qa">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>QA</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Data checks</p>
            <h2>Validation room</h2>
            <p>Find missing sources, strange values, and rows that need human review.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-1" href="/workspace/tasks">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>!</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Alerts</p>
            <h2>Task queue</h2>
            <p>Turn missing keys, QA findings, and coverage gaps into visible work.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-2" href="/workspace/video-tracking">
          <div className="miniArticleVisual" aria-hidden="true">
            <span>VT</span>
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Future adapter</p>
            <h2>Video + tracking</h2>
            <p>Show the adapter contract without faking licensed video or tracking data.</p>
          </div>
        </Link>
        <Link className="miniArticleCard tone-3" href="/reports">
          <div className="miniArticleVisual" aria-hidden="true">
            <FileText size={30} aria-hidden="true" />
          </div>
          <div className="miniArticleBody">
            <p className="eyebrow">Report builder</p>
            <h2>Delivery draft</h2>
            <p>Convert checked data into source-backed report drafts.</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
