import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
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
        <UI text="Back to workspace" /></Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow"><UI text="Video and tracking / 映像・トラッキング / Video y tracking" /></p>
          <h1><T text={pageTitles["/workspace/video-tracking"]} /></h1>
          <p><LocalizedContent en={<>
            Professional platforms use video and tracking, but ScoutBoard AI should only connect
            those modules when licensed sources and display rights are clear.
          </>} ja={<>
            映像やトラッキングデータは、ライセンスと表示範囲が確認できてから接続します。
          </>} es={<>
            El módulo queda preparado, pero no se inventan datos de tracking ni se suben videos sin derechos.
          </>} /></p>
        </div>
        <Link className="primaryAction" href="/workspace/tasks">
          <UI text="See blocked task" /></Link>
      </section>

      <section className="metricGrid">
        <article className="metric alert">
          <LockKeyhole size={20} aria-hidden="true" />
          <span><UI text="Current status" /></span>
          <strong><UI text="Blocked" /></strong>
        </article>
        <article className="metric">
          <Video size={20} aria-hidden="true" />
          <span><UI text="Video files committed" /></span>
          <strong>0</strong>
        </article>
        <article className="metric">
          <Route size={20} aria-hidden="true" />
          <span><UI text="Tracking datasets" /></span>
          <strong>0</strong>
        </article>
        <article className="metric">
          <FileWarning size={20} aria-hidden="true" />
          <span><UI text="Rights review" /></span>
          <strong><UI text="Needed" /></strong>
        </article>
      </section>

      <section className="split">
        <div>
          <div className="sectionHeader">
            <p className="eyebrow"><UI text="Adapter contract" /></p>
            <h2><UI text="What must be true before this module becomes active" /></h2>
            <p>
              <UI text="The portfolio can show the product thinking now, while keeping the actual data boundary conservative and public-safe." /></p>
          </div>
          <div className="workspaceModuleGrid">
            {adapterRequirements.map((item) => (
              <article className="workspaceModule blocked" key={item.title}>
                <span className="pill danger"><UI text="Required" /></span>
                <h3><UI text={item.title} /></h3>
                <p><UI text={item.detail} /></p>
              </article>
            ))}
          </div>
        </div>

        <aside className="qaPanel workspacePanel">
          <p className="eyebrow"><UI text="Safe demo alternative" /></p>
          <h2><UI text="Use event data until licensed media exists." /></h2>
          <p>
            <UI text="StatsBomb Open Data already gives timestamps, locations, event types, and players. That is enough to demonstrate tactical analysis without video rights risk." /></p>
          <div className="profileGrid">
            <span><UI text="Open event source" />{" "}<strong>StatsBomb</strong></span>
            <span><UI text="Video storage" />{" "}<strong><UI text="None" /></strong></span>
            <span><UI text="Tracking storage" />{" "}<strong><UI text="None" /></strong></span>
            <span><UI text="Export rule" />{" "}<strong><UI text="Notes only" /></strong></span>
          </div>
          <Link className="backLink" href="/analytics">
            <UI text="Use event analytics" /></Link>
        </aside>
      </section>

      <section className="qaStory workspaceStory">
        <div>
          <p className="eyebrow"><UI text="Portfolio message" /></p>
          <h2><UI text="Knowing what not to store is part of the product." /></h2>
          <p>
            <UI text="This page makes the boundary explicit: ScoutBoard AI can be ready for enterprise-style data later without pretending that restricted video or tracking data is available now." /></p>
        </div>
        <div className="providerMiniList">
          <div className="providerMiniRow">
            <span><UI text="Commit raw video" /></span>
            <strong><UI text="Blocked" /></strong>
          </div>
          <div className="providerMiniRow">
            <span><UI text="Store tracking files" /></span>
            <strong><UI text="Only if licensed" /></strong>
          </div>
          <div className="providerMiniRow">
            <span><UI text="Write timestamp notes" /></span>
            <strong><UI text="Allowed" /></strong>
          </div>
        </div>
      </section>
    </div>
  );
}
