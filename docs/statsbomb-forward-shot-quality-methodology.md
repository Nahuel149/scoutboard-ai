# StatsBomb forward shot-quality methodology

## Dataset

This analysis uses StatsBomb Open Data for Copa America 2024:

- Competition ID: `223`
- Season ID: `282`
- Matches analyzed: 32
- Source: https://github.com/statsbomb/open-data

The script fetches match metadata and event JSON files directly from the public
StatsBomb Open Data GitHub repository.

## Scope

Rows are limited to South American national teams:

- Argentina
- Bolivia
- Brazil
- Chile
- Colombia
- Ecuador
- Paraguay
- Peru
- Uruguay
- Venezuela

Rows are also limited to attacking positions at the moment of the shot:

- Center Forward
- Left Center Forward
- Right Center Forward
- Left Wing
- Right Wing
- Secondary Striker

## Metrics

The output ranks forwards by non-penalty xG first, then total xG and shot volume.

Key fields:

- `shots`: total shots by the player
- `open_play_shots`: non-penalty shots
- `penalty_shots`: penalties
- `goals`: goals from those shots
- `xg`: StatsBomb xG
- `non_penalty_xg`: xG excluding penalties
- `avg_xg_per_shot`: total xG divided by shots
- `avg_non_penalty_xg_per_shot`: non-penalty xG divided by open-play shots
- `shot_accuracy`: shots on target divided by shots
- `goal_minus_xg`: goals minus xG
- `avg_shot_distance`: distance from shot location to the center of the goal

## Why this matters

Shot volume alone can be noisy. A forward taking many low-quality shots may look
active but not dangerous. xG helps separate volume from shot quality, and
non-penalty xG keeps penalty takers from dominating the shortlist.

This is still a first pass. A recruitment version should add minutes played,
team possession, opponent strength, role, age, market value, and injury context.

## Run

```powershell
npm run analytics:statsbomb-forward-xg
```

Outputs:

- `data/analytics/copa_america_2024_forward_shot_quality.csv`
- `data/analytics/copa_america_2024_forward_shot_quality.json`

