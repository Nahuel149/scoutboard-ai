import { NextResponse } from "next/server";
import { isLocale } from "@/lib/copy";
import { buildLocalizedForwardReport } from "@/lib/localized-reports";
import { buildForwardMatchReport, buildForwardShotQualityReport } from "@/lib/reports";
import {
  forwardShotQualityData,
  topForwardShotQualityPlayers,
} from "@/lib/statsbomb-forward-shot-quality";

export function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") ?? "player";
  const name = url.searchParams.get("player");
  const lang = url.searchParams.get("lang");
  if (kind === "comparison" || isLocale(lang)) {
    const names = kind === "comparison" ? url.searchParams.getAll("players") : [name ?? topForwardShotQualityPlayers[0].player];
    const chosen = forwardShotQualityData.players.filter(p => names.includes(p.player));
    if (!chosen.length || chosen.length > 4 || (kind === "comparison" && chosen.length < 2)) return NextResponse.json({ error: "Select 2–4 known players for comparison." }, { status: 400 });
    return new NextResponse(buildLocalizedForwardReport(chosen, isLocale(lang) ? lang : "en"), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": 'attachment; filename="scoutboard-report.md"' } });
  }
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
