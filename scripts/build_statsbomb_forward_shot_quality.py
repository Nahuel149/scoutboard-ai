import csv
import json
import math
from collections import defaultdict
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "data" / "analytics"
CSV_OUTPUT = OUTPUT_DIR / "copa_america_2024_forward_shot_quality.csv"
JSON_OUTPUT = OUTPUT_DIR / "copa_america_2024_forward_shot_quality.json"
COMPETITION_ID = 223
SEASON_ID = 282
BASE_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data"
USER_AGENT = "ScoutBoardAI/0.1 portfolio data pipeline"

SOUTH_AMERICAN_TEAMS = {
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Paraguay",
    "Peru",
    "Uruguay",
    "Venezuela",
}

FORWARD_POSITIONS = {
    "Center Forward",
    "Left Center Forward",
    "Right Center Forward",
    "Left Wing",
    "Right Wing",
    "Secondary Striker",
}

ON_TARGET_OUTCOMES = {"Goal", "Saved", "Saved to Post", "Saved Off Target"}


def fetch_json(url):
    request = Request(url, headers={"User-Agent": USER_AGENT})

    with urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def fetch_matches():
    return fetch_json(f"{BASE_URL}/matches/{COMPETITION_ID}/{SEASON_ID}.json")


def fetch_events(match_id):
    return fetch_json(f"{BASE_URL}/events/{match_id}.json")


def empty_player_row(player_name, team_name, position_name):
    return {
        "player": player_name,
        "team": team_name,
        "positions": {position_name},
        "shots": 0,
        "goals": 0,
        "shots_on_target": 0,
        "xg": 0.0,
        "non_penalty_xg": 0.0,
        "penalty_xg": 0.0,
        "penalty_shots": 0,
        "open_play_shots": 0,
        "total_distance": 0.0,
        "match_ids": set(),
    }


def shot_distance(location):
    if not location or len(location) < 2:
        return None

    # StatsBomb coordinates are 120x80, with the attacking goal centered at x=120, y=40.
    return math.dist((location[0], location[1]), (120, 40))


def summarize_shots(matches):
    players = {}
    team_totals = defaultdict(lambda: {"shots": 0, "xg": 0.0, "goals": 0})

    for match in matches:
        match_id = match["match_id"]
        events = fetch_events(match_id)

        for event in events:
            if event.get("type", {}).get("name") != "Shot":
                continue

            team_name = event.get("team", {}).get("name")
            player_name = event.get("player", {}).get("name")
            position_name = event.get("position", {}).get("name")

            if team_name not in SOUTH_AMERICAN_TEAMS:
                continue

            if not player_name or position_name not in FORWARD_POSITIONS:
                continue

            shot = event.get("shot", {})
            xg = float(shot.get("statsbomb_xg") or 0.0)
            outcome = shot.get("outcome", {}).get("name")
            shot_type = shot.get("type", {}).get("name")
            is_penalty = shot_type == "Penalty"
            distance = shot_distance(event.get("location"))
            key = (player_name, team_name)

            if key not in players:
                players[key] = empty_player_row(player_name, team_name, position_name)

            row = players[key]
            row["positions"].add(position_name)
            row["shots"] += 1
            row["xg"] += xg
            row["match_ids"].add(match_id)

            if is_penalty:
                row["penalty_shots"] += 1
                row["penalty_xg"] += xg
            else:
                row["open_play_shots"] += 1
                row["non_penalty_xg"] += xg

            if outcome == "Goal":
                row["goals"] += 1

            if outcome in ON_TARGET_OUTCOMES:
                row["shots_on_target"] += 1

            if distance is not None:
                row["total_distance"] += distance

            team_totals[team_name]["shots"] += 1
            team_totals[team_name]["xg"] += xg
            team_totals[team_name]["goals"] += 1 if outcome == "Goal" else 0

    return players, team_totals


def player_output_rows(players):
    rows = []

    for row in players.values():
        shots = row["shots"]
        rows.append(
            {
                "player": row["player"],
                "team": row["team"],
                "positions": "; ".join(sorted(row["positions"])),
                "matches_with_shot": len(row["match_ids"]),
                "shots": shots,
                "open_play_shots": row["open_play_shots"],
                "penalty_shots": row["penalty_shots"],
                "goals": row["goals"],
                "shots_on_target": row["shots_on_target"],
                "xg": round(row["xg"], 3),
                "non_penalty_xg": round(row["non_penalty_xg"], 3),
                "penalty_xg": round(row["penalty_xg"], 3),
                "avg_xg_per_shot": round(row["xg"] / shots, 3) if shots else 0,
                "avg_non_penalty_xg_per_shot": round(row["non_penalty_xg"] / row["open_play_shots"], 3)
                if row["open_play_shots"]
                else 0,
                "shot_accuracy": round(row["shots_on_target"] / shots, 3) if shots else 0,
                "goal_minus_xg": round(row["goals"] - row["xg"], 3),
                "avg_shot_distance": round(row["total_distance"] / shots, 2) if shots else 0,
            }
        )

    return sorted(rows, key=lambda item: (item["non_penalty_xg"], item["xg"], item["shots"]), reverse=True)


def write_csv(rows):
    if not rows:
        return

    with CSV_OUTPUT.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows, team_totals, matches):
    payload = {
        "source": {
            "name": "StatsBomb Open Data",
            "competition": "Copa America 2024",
            "competition_id": COMPETITION_ID,
            "season_id": SEASON_ID,
            "matches_url": f"{BASE_URL}/matches/{COMPETITION_ID}/{SEASON_ID}.json",
            "events_url_template": f"{BASE_URL}/events/{{match_id}}.json",
            "note": "Rows are limited to South American national teams and forward/wing positions.",
        },
        "summary": {
            "matches": len(matches),
            "players": len(rows),
            "teams": len(team_totals),
            "total_forward_shots": sum(row["shots"] for row in rows),
            "total_forward_xg": round(sum(row["xg"] for row in rows), 3),
        },
        "team_totals": [
            {
                "team": team,
                "shots": values["shots"],
                "xg": round(values["xg"], 3),
                "goals": values["goals"],
            }
            for team, values in sorted(team_totals.items())
        ],
        "players": rows,
    }
    JSON_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    matches = fetch_matches()
    players, team_totals = summarize_shots(matches)
    rows = player_output_rows(players)

    write_csv(rows)
    write_json(rows, team_totals, matches)

    print(f"Wrote {CSV_OUTPUT}")
    print(f"Wrote {JSON_OUTPUT}")
    print(f"Analyzed {len(matches)} matches and {len(rows)} South American forwards.")


if __name__ == "__main__":
    main()
