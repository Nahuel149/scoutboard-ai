import Link from "next/link";
import { ArrowLeft, FileWarning, LockKeyhole, Route, Video } from "lucide-react";

const adapterRequirements = [
  {
    title: "Licensed video source",
    detail: "No copyrighted match footage should be committed. Store only references, timestamps, and notes unless rights allow more.",
  },
  {
    title: "Tracking/event join key",
    detail: "A future provider needs stable match IDs, team IDs, player IDs, and event timestamps before analytics can be joined.",
  },
  {
    title: "Display and cache rule",
    detail: "The adapter must define what can be cached, shown in screenshots, exported to reports, and deleted.",
  },
  {
    title: "Human QA checkpoint",
    detail: "Any tactical claim from video or tracking needs a manual review step before it appears in a report.",
  },
];

export default function VideoTrackingPage() {
  return (
    <div className="pageStack">
      <Link className="backLink" href="/workspace">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to workspace
      </Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow">Video and tracking / 映像・トラッキング / Video y tracking</p>
          <h1>A real adapter contract, not fake proprietary data.</h1>
          <p>
            Professional platforms use video and tracking, but ScoutBoard AI should only connect
            those modules when licensed sources and display rights are clear.
          </p>
          <p className="jp">
            映像やトラッキングデータは、ライセンスと表示範囲が確認できてから接続します。
          </p>
          <p className="es">
            El módulo queda preparado, pero no se inventan datos de tracking ni se suben videos sin derechos.
          </p>
        </div>
        <Link className="primaryAction" href="/workspace/tasks">
          See blocked task
        </Link>
      </section>

      <section className="metricGrid">
        <article className="metric alert">
          <LockKeyhole size={20} aria-hidden="true" />
          <span>Current status</span>
          <strong>Blocked</strong>
        </article>
        <article className="metric">
          <Video size={20} aria-hidden="true" />
          <span>Video files committed</span>
          <strong>0</strong>
        </article>
        <article className="metric">
          <Route size={20} aria-hidden="true" />
          <span>Tracking datasets</span>
          <strong>0</strong>
        </article>
        <article className="metric">
          <FileWarning size={20} aria-hidden="true" />
          <span>Rights review</span>
          <strong>Needed</strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow">Adapter contract</p>
            <h2>What must be true before this module becomes active</h2>
            <p>
              The portfolio can show the product thinking now, while keeping the actual data
              boundary conservative and public-safe.
            </p>
          </div>
          <div className="workspaceModuleGrid">
            {adapterRequirements.map((item) => (
              <article className="workspaceModule blocked" key={item.title}>
                <span className="pill danger">Required</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="qaPanel workspacePanel">
          <p className="eyebrow">Safe demo alternative</p>
          <h2>Use event data until licensed media exists.</h2>
          <p>
            StatsBomb Open Data already gives timestamps, locations, event types, and players.
            That is enough to demonstrate tactical analysis without video rights risk.
          </p>
          <div className="profileGrid">
            <span>Open event source <strong>StatsBomb</strong></span>
            <span>Video storage <strong>None</strong></span>
            <span>Tracking storage <strong>None</strong></span>
            <span>Export rule <strong>Notes only</strong></span>
          </div>
          <Link className="backLink" href="/analytics">
            Use event analytics
          </Link>
        </aside>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow">Portfolio message</p>
          <h2>Knowing what not to store is part of the product.</h2>
          <p>
            This page makes the boundary explicit: ScoutBoard AI can be ready for enterprise-style
            data later without pretending that restricted video or tracking data is available now.
          </p>
          <p className="es">
            Mostrar límites claros también demuestra criterio técnico y respeto por licencias.
          </p>
        </div>
        <div className="providerMiniList">
          <div className="providerMiniRow">
            <span>Commit raw video</span>
            <strong>Blocked</strong>
          </div>
          <div className="providerMiniRow">
            <span>Store tracking files</span>
            <strong>Only if licensed</strong>
          </div>
          <div className="providerMiniRow">
            <span>Write timestamp notes</span>
            <strong>Allowed</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
