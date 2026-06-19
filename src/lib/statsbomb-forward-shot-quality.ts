import statsbombForwardShotQuality from "../../data/analytics/copa_america_2024_forward_shot_quality.json";

export type ForwardShotQualityPlayer = {
  player: string;
  team: string;
  positions: string;
  matches_with_shot: number;
  minutes: number;
  shots: number;
  open_play_shots: number;
  penalty_shots: number;
  goals: number;
  shots_on_target: number;
  xg: number;
  non_penalty_xg: number;
  penalty_xg: number;
  avg_xg_per_shot: number;
  avg_non_penalty_xg_per_shot: number;
  shot_accuracy: number;
  goal_minus_xg: number;
  avg_shot_distance: number;
  birth_date: string | null;
  age_source_url: string | null;
  age_match_status: "name_match_needs_review" | "not_found";
  shots_detail: Array<{
    match_id: number;
    x: number | null;
    y: number | null;
    xg: number;
    outcome: string;
    play_pattern: string;
    body_part: string;
    is_penalty: boolean;
  }>;
};

export type ForwardShotQualityTeam = {
  team: string;
  shots: number;
  xg: number;
  goals: number;
};

export type ForwardShotQualityData = {
  source: {
    name: string;
    competition: string;
    competition_id: number;
    season_id: number;
    matches_url: string;
    events_url_template: string;
    note: string;
    age_enrichment?: {
      name: string;
      method: string;
      review_note: string;
    };
  };
  summary: {
    matches: number;
    players: number;
    teams: number;
    total_forward_shots: number;
    total_forward_xg: number;
  };
  team_totals: ForwardShotQualityTeam[];
  players: ForwardShotQualityPlayer[];
};

export const forwardShotQualityData = statsbombForwardShotQuality as ForwardShotQualityData;

export const topForwardShotQualityPlayers = [...forwardShotQualityData.players]
  .sort((a, b) => b.non_penalty_xg - a.non_penalty_xg || b.xg - a.xg || b.shots - a.shots)
  .slice(0, 12);

export const topForwardShotQualityTeams = [...forwardShotQualityData.team_totals]
  .sort((a, b) => b.xg - a.xg)
  .slice(0, 8);
