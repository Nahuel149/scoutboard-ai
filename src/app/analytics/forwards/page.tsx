import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
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
          <h1><T text={pageTitles["/analytics/forwards"]} /></h1>
          <p><LocalizedContent en={<>Filter the sample, put two players side by side, and inspect every shot behind the totals.</>} ja={<>選手を2人選び、シュート位置、xG、出場時間を同じ画面で比較できます。</>} es={<>Filtrá la muestra y compará dos delanteros con sus remates, xG y minutos a la vista.</>} /></p>
        </div>
        <Target size={58} aria-hidden="true" />
      </section>
      <ForwardComparator players={forwardShotQualityData.players} />
      <section className="qaStory">
        <div><p className="eyebrow">Model card / Nota metodológica</p><h2>A screening score, not a transfer prediction.</h2></div>
        <div>
          <p><LocalizedContent en={<>The score combines non-penalty xG per 90 (40%), shots per 90 (25%), average chance quality (20%), and shot accuracy (15%). Age shifts the result by at most 15%, while small samples are pulled down using minutes played. Copa America has a neutral competition factor of 1.00.</>} ja={<>このスコアは候補選びの補助であり、移籍後の活躍を予測するものではありません。</>} es={<>Es una herramienta de preselección. No predice el rendimiento futuro ni reemplaza el análisis en video.</>} /></p>
        </div>
      </section>
    </div>
  );
}
