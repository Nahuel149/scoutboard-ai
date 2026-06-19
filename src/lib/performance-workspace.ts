import { getProviderStatus } from "./data-providers";
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

export const workspaceModules: WorkspaceModule[] = [
  {
    title: "Provider readiness board",
    status: "ready",
    summary: "Shows which sources are open, keyed, missing configuration, or ready for portfolio use.",
    proof: "Wikidata and StatsBomb Open Data can be checked without secrets; keyed APIs stay server-side.",
    nextAction: "Turn provider status into a full table with cache rules and source links.",
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
