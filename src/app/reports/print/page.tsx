import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buildForwardMatchReport, buildForwardShotQualityReport } from "@/lib/reports";
import {
  forwardShotQualityData,
  topForwardShotQualityPlayers,
} from "@/lib/statsbomb-forward-shot-quality";
import PrintButton from "./print-button";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const item = params[key];
  return Array.isArray(item) ? item[0] ?? "" : item ?? "";
}

export default async function PrintableReportPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const kind = value(params, "kind") || "player";
  const name = value(params, "player");
  const selected =
    forwardShotQualityData.players.find((player) => player.player === name) ??
    topForwardShotQualityPlayers[0];
  const report =
    kind === "match"
      ? buildForwardMatchReport(topForwardShotQualityPlayers)
      : buildForwardShotQualityReport(selected);

  return (
    <div className="printShell">
      <div className="printToolbar">
        <Link className="backLink" href="/reports">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to reports
        </Link>
        <PrintButton />
      </div>
      <article className="printPaper">
        <pre>{report}</pre>
      </article>
    </div>
  );
}
