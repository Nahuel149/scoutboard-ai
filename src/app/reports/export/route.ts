import { NextResponse } from "next/server";
import { buildForwardMatchReport, buildForwardShotQualityReport } from "@/lib/reports";
import {
  forwardShotQualityData,
  topForwardShotQualityPlayers,
} from "@/lib/statsbomb-forward-shot-quality";

export function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "player";
  const name = url.searchParams.get("player");
  const selected =
    forwardShotQualityData.players.find((player) => player.player === name) ??
    topForwardShotQualityPlayers[0];
  const markdown =
    kind === "match"
      ? buildForwardMatchReport(topForwardShotQualityPlayers)
      : buildForwardShotQualityReport(selected);
  const filename =
    kind === "match"
      ? "copa-america-forward-report.md"
      : `${selected.player.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
