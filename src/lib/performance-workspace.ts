import { getProviderStatus } from "./data-providers";
import { leaguesNeedingClubReview } from "./league-coverage";
import { forwardShotQualityData, topForwardShotQualityPlayers } from "./statsbomb-forward-shot-quality";
import { players } from "./sample-data";
import { validatePlayers } from "./validation";

export type WorkspaceModuleStatus = "ready" | "in-progress" | "planned" | "blocked";

export type WorkspaceModule = {
  title: string;
  status: WorkspaceModuleStatus;
  summary: string;
  proof: string;
  nextAction: string;
};

export type DataReadinessRow = {
  provider: string;
  homepageUrl: string;
  sourceType: string;
  keyStatus: string;
  portfolioUse: string;
  cacheRule: string;
  licenseNote: string;
  capabilities: string;
  nextAction: string;
  state: "ready" | "needs-key";
};

export type WorkspaceTaskSeverity = "critical" | "warning" | "info";

export type WorkspaceTask = {
  id: string;
  severity: WorkspaceTaskSeverity;
  area: string;
  title: string;
  detail: string;
  nextAction: string;
  href: string;
};

export const workspaceModules: WorkspaceModule[] = [
  {
    title: "Provider readiness board",
    status: "ready",
    summary: "Shows which sources are open, keyed, missing configuration, or ready for portfolio use.",
    proof: "Wikidata and StatsBomb Open Data can be checked without secrets; keyed APIs stay server-side.",
    nextAction: "Keep provider rules visible while wiring import jobs and cache policy.",
  },
  {
    title: "Event analytics room",
    status: "in-progress",
    summary: "Uses StatsBomb Open Data to analyze Copa America 2024 forward shot quality.",
    proof: `${forwardShotQualityData.summary.players} forwards, ${forwardShotQualityData.summary.total_forward_shots} shots, ${forwardShotQualityData.summary.matches} matches.`,
    nextAction: "Add shot maps and player comparison filters.",
  },
  {
    title: "Current competition context",
    status: "in-progress",
    summary: "Uses Football-Data.org for Champions League fixtures and match status when a local token exists.",
    proof: "The /analytics/champions route is dynamic and shows a clear token setup state.",
    nextAction: "Add team form and competition summary cards once the token is configured.",
  },
  {
    title: "Americas player watchlist",
    status: "planned",
    summary: "Turns imported player data into a searchable scouting board for the Americas.",
    proof: "Wikidata imports and league coverage summaries already exist under data/imported and data/analytics.",
    nextAction: "Build a league coverage page and wire imported JSON into search.",
  },
  {
    title: "Report room",
    status: "in-progress",
    summary: "Turns checked data and analytics into English, Japanese, and Latin American Spanish report drafts.",
    proof: "Report builder and manual QA checklist already exist.",
    nextAction: "Connect the report draft to StatsBomb and Football-Data.org insights.",
  },
  {
    title: "Video and tracking adapter",
    status: "blocked",
    summary: "Reserved for licensed video/tracking providers. Nothing proprietary should be faked or committed.",
    proof: "Open event data can stand in for tactical analysis until licensed media is available.",
    nextAction: "Add a placeholder adapter spec, not a fake video dataset.",
  },
];

export function getWorkspaceSnapshot() {
  const providerStatuses = getProviderStatus();
  const playerIssues = validatePlayers(players);
  const topForward = topForwardShotQualityPlayers[0];

  return {
    providersReady: providerStatuses.filter((provider) => provider.status === "ready").length,
    providersTotal: providerStatuses.length,
    modulesReady: workspaceModules.filter((module) => module.status === "ready").length,
    modulesTotal: workspaceModules.length,
    openPlayerIssues: playerIssues.length,
    topForward,
    statsbombSummary: forwardShotQualityData.summary,
    providerStatuses,
  };
}

export function getDataReadinessRows(): DataReadinessRow[] {
  return getProviderStatus().map((provider) => {
    const sourceType =
      provider.access === "open"
        ? "Open data"
        : provider.access === "free-tier-key"
          ? "Free tier API"
          : "Trial or paid API";
    const keyStatus = provider.envVar
      ? provider.status === "ready"
        ? `${provider.envVar} configured`
        : `${provider.envVar} missing`
      : "No key needed";
    const nextAction =
      provider.status === "ready"
        ? provider.access === "open"
          ? "Use for committed public-safe samples with source notes."
          : "Use server-side only; review terms before storing samples."
        : "Add the token in .env.local before enabling live requests.";

    return {
      provider: provider.name,
      homepageUrl: provider.homepageUrl,
      sourceType,
      keyStatus,
      portfolioUse: provider.portfolioUse,
      cacheRule: provider.cacheRule,
      licenseNote: provider.licenseNote,
      capabilities: provider.capabilities.join(", "),
      nextAction,
      state: provider.status === "ready" ? "ready" : "needs-key",
    };
  });
}

export function getWorkspaceTasks(): WorkspaceTask[] {
  const providerStatuses = getProviderStatus();
  const missingProviders = providerStatuses.filter((provider) => provider.status === "missing-key");
  const playerIssues = validatePlayers(players);
  const topForward = topForwardShotQualityPlayers[0];
  const tasks: WorkspaceTask[] = [];

  for (const provider of missingProviders) {
    tasks.push({
      id: `provider-${provider.id}`,
      severity: provider.access === "paid-or-trial-key" ? "info" : "warning",
      area: "Data providers",
      title: `${provider.name} key is not configured`,
      detail: `${provider.envVar} is missing. Live requests for this provider stay disabled.`,
      nextAction: "Add the key locally in .env.local only after terms are reviewed.",
      href: "/workspace/data-readiness",
    });
  }

  for (const league of leaguesNeedingClubReview.slice(0, 6)) {
    tasks.push({
      id: `coverage-${league.file}`,
      severity: league.clubs_without_rows >= 3 ? "warning" : "info",
      area: "League coverage",
      title: `${league.league_season} has missing club rows`,
      detail: `${league.clubs_without_rows} clubs need manual review before player search is treated as complete.`,
      nextAction: "Check missing club names and decide whether Wikidata labels or club IDs need adjustment.",
      href: "/workspace/league-coverage",
    });
  }

  if (playerIssues.length > 0) {
    tasks.push({
      id: "sample-player-qa",
      severity: "critical",
      area: "Data QA",
      title: "Sample player data still contains open QA findings",
      detail: `${playerIssues.length} findings are visible in the QA page. Some are intentional demo issues.`,
      nextAction: "Keep flawed rows marked as demo data and prevent them from final report exports.",
      href: "/qa",
    });
  }

  tasks.push({
    id: "top-forward-report",
    severity: "info",
    area: "Analytics to report",
    title: `${topForward.player} is ready for a scouting note`,
    detail: `${topForward.non_penalty_xg.toFixed(2)} non-penalty xG from ${topForward.shots} shots in the StatsBomb sample.`,
    nextAction: "Connect the report builder to analytics rows so this can become a sourced note.",
    href: "/analytics",
  });

  tasks.push({
    id: "video-tracking-placeholder",
    severity: "info",
    area: "Future adapters",
    title: "Video and tracking data require licensed sources",
    detail: "Do not fake proprietary tracking or match video. Keep this as an explicit adapter placeholder.",
    nextAction: "Document the contract for a future licensed video/tracking adapter.",
    href: "/workspace",
  });

  return tasks.sort((a, b) => {
    const rank: Record<WorkspaceTaskSeverity, number> = { critical: 0, warning: 1, info: 2 };
    return rank[a.severity] - rank[b.severity];
  });
}
