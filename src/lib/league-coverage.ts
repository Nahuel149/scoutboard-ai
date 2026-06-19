import leagueCoverageSummary from "../../data/analytics/league_coverage_summary.json";

export type LeagueCoverageItem = {
  file: string;
  league_season: string;
  import_scope: string;
  player_rows: number;
  club_count: number;
  clubs_with_rows: number;
  clubs_without_rows: number;
  missing_club_names: string;
  source_name: string;
  source_license: string;
  league_source: string;
  review_status: string;
};

export type LeagueCoverageSummary = {
  summary: {
    league_files: number;
    total_player_rows: number;
    total_clubs: number;
    clubs_with_rows: number;
    clubs_without_rows: number;
  };
  leagues: LeagueCoverageItem[];
};

export const leagueCoverage = leagueCoverageSummary as LeagueCoverageSummary;

export const leagueCoverageRows = [...leagueCoverage.leagues].sort(
  (a, b) => b.player_rows - a.player_rows,
);

export const leaguesNeedingClubReview = leagueCoverageRows.filter(
  (league) => league.clubs_without_rows > 0,
);

export const strongestCoverageLeagues = leagueCoverageRows.filter(
  (league) => league.clubs_without_rows === 0,
);
