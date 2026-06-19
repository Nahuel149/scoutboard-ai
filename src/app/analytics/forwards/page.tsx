import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { forwardShotQualityData } from "@/lib/statsbomb-forward-shot-quality";
import ForwardComparator from "./forward-comparator";

export default function ForwardComparatorPage() {
  return (
    <div className="pageStack">
      <Link className="backLink" href="/analytics"><ArrowLeft size={16} />Back to analytics</Link>
      <section className="detailHero analyticsHero">
        <div>
          <p className="eyebrow">StatsBomb Open Data · Copa America 2024</p>
          <h1>Compare how forwards find their shots.</h1>
          <p>Filter the sample, put two players side by side, and inspect every shot behind the totals.</p>
          <p className="jp">選手を2人選び、シュート位置、xG、出場時間を同じ画面で比較できます。</p>
          <p className="es">Filtrá la muestra y compará dos delanteros con sus remates, xG y minutos a la vista.</p>
        </div>
        <Target size={58} aria-hidden="true" />
      </section>
      <ForwardComparator players={forwardShotQualityData.players} />
      <section className="qaStory">
        <div><p className="eyebrow">Model card / Nota metodológica</p><h2>A screening score, not a transfer prediction.</h2></div>
        <div>
          <p>The score combines non-penalty xG per 90 (40%), shots per 90 (25%), average chance quality (20%), and shot accuracy (15%). Age shifts the result by at most 15%, while small samples are pulled down using minutes played. Copa America has a neutral competition factor of 1.00.</p>
          <p className="jp">このスコアは候補選びの補助であり、移籍後の活躍を予測するものではありません。</p>
          <p className="es">Es una herramienta de preselección. No predice el rendimiento futuro ni reemplaza el análisis en video.</p>
        </div>
      </section>
    </div>
  );
}
