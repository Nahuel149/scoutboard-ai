import csv
import json
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "data" / "analytics"
JSON_OUTPUT = OUTPUT_DIR / "statsbomb_competitions.json"
CSV_OUTPUT = OUTPUT_DIR / "statsbomb_competitions.csv"
COMPETITIONS_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json"
USER_AGENT = "ScoutBoardAI/0.1 portfolio data pipeline"


def fetch_competitions():
    request = Request(COMPETITIONS_URL, headers={"User-Agent": USER_AGENT})

    with urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def write_json(competitions):
    payload = {
        "source": {
            "name": "StatsBomb Open Data",
            "url": COMPETITIONS_URL,
            "note": "Competition index only. Event and match data should be fetched in later ETL steps.",
        },
        "competition_count": len(competitions),
        "competitions": competitions,
    }
    JSON_OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_csv(competitions):
    rows = [
        {
            "competition_id": item.get("competition_id"),
            "season_id": item.get("season_id"),
            "country_name": item.get("country_name"),
            "competition_name": item.get("competition_name"),
            "competition_gender": item.get("competition_gender"),
            "season_name": item.get("season_name"),
            "match_available": item.get("match_available"),
            "match_updated": item.get("match_updated"),
        }
        for item in competitions
    ]

    with CSV_OUTPUT.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    competitions = fetch_competitions()
    write_json(competitions)
    write_csv(competitions)

    print(f"Wrote {JSON_OUTPUT}")
    print(f"Wrote {CSV_OUTPUT}")
    print(f"Fetched {len(competitions)} StatsBomb competition-season rows.")


if __name__ == "__main__":
    main()
