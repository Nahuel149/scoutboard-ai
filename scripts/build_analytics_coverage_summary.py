import csv
import json
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
IMPORTED_DIR = ROOT / "data" / "imported"
OUTPUT_DIR = ROOT / "data" / "analytics"
CSV_OUTPUT = OUTPUT_DIR / "league_coverage_summary.csv"
JSON_OUTPUT = OUTPUT_DIR / "league_coverage_summary.json"


def load_current_league_files():
    return sorted(IMPORTED_DIR.glob("*-division-current-players.sample.json"))


def clean_text(value):
    if not isinstance(value, str):
        return value

    text = value

    for _ in range(2):
        try:
            repaired = text.encode("latin1").decode("utf-8")
        except UnicodeError:
            break

        if repaired == text:
            break

        text = repaired

    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")


def summarize_file(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    source = data.get("source", {})
    players = data.get("players", [])
    missing_clubs = source.get("clubsWithoutRows", [])

    return {
        "file": path.name,
        "league_season": clean_text(source.get("leagueSeason")),
        "import_scope": players[0].get("importScope") if players else source.get("queryPurpose"),
        "player_rows": len(players),
        "club_count": source.get("clubCount", 0),
        "clubs_with_rows": source.get("clubsWithRows", 0),
        "clubs_without_rows": len(missing_clubs),
        "missing_club_names": "; ".join(clean_text(club.get("name", "")) for club in missing_clubs),
        "source_name": source.get("name"),
        "source_license": source.get("license"),
        "league_source": source.get("leagueSeasonSource"),
        "review_status": "needs_manual_review",
    }


def write_csv(rows):
    if not rows:
        return

    CSV_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys())

    with CSV_OUTPUT.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows):
    JSON_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "summary": {
            "league_files": len(rows),
            "total_player_rows": sum(row["player_rows"] for row in rows),
            "total_clubs": sum(row["club_count"] for row in rows),
            "clubs_with_rows": sum(row["clubs_with_rows"] for row in rows),
            "clubs_without_rows": sum(row["clubs_without_rows"] for row in rows),
        },
        "leagues": rows,
    }
    JSON_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    rows = [summarize_file(path) for path in load_current_league_files()]
    write_csv(rows)
    write_json(rows)

    print(f"Wrote {CSV_OUTPUT}")
    print(f"Wrote {JSON_OUTPUT}")
    print(f"Summarized {len(rows)} league files.")


if __name__ == "__main__":
    main()
