import json
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "analytics" / "copa_america_2024_forward_shot_quality.json"
API_URL = "https://www.wikidata.org/w/api.php"
USER_AGENT = "ScoutBoardAI/0.1 portfolio data pipeline"


def fetch_json(url):
    for attempt in range(5):
        request = Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urlopen(request, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                time.sleep(0.65)
                return result
        except HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(3 * (attempt + 1))


def find_player(name):
    query = urlencode(
        {
            "action": "wbsearchentities",
            "search": name,
            "language": "en",
            "uselang": "en",
            "type": "item",
            "limit": 5,
            "format": "json",
        }
    )
    results = fetch_json(f"{API_URL}?{query}").get("search", [])
    candidates = [
        item
        for item in results
        if any(term in (item.get("description") or "").lower() for term in ("football", "soccer"))
    ]

    for item in candidates:
        entity_id = item["id"]
        entity = fetch_json(
            f"https://www.wikidata.org/wiki/Special:EntityData/{entity_id}.json"
        ).get("entities", {}).get(entity_id, {})
        claims = entity.get("claims", {})
        dates = claims.get("P569", [])
        if not dates:
            continue
        value = dates[0].get("mainsnak", {}).get("datavalue", {}).get("value", {})
        raw_date = value.get("time", "")
        if len(raw_date) >= 11:
            return {
                "birth_date": raw_date[1:11],
                "age_source_url": f"https://www.wikidata.org/wiki/{entity_id}",
                "age_match_status": "name_match_needs_review",
            }
    return {
        "birth_date": None,
        "age_source_url": None,
        "age_match_status": "not_found",
    }


def main():
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    matched = 0
    for index, player in enumerate(payload["players"], start=1):
        metadata = find_player(player["player"])
        player.update(metadata)
        matched += 1 if metadata["birth_date"] else 0
        print(f"[{index}/{len(payload['players'])}] {player['player']}: {metadata['birth_date']}")
        time.sleep(0.1)

    payload["source"]["age_enrichment"] = {
        "name": "Wikidata",
        "method": "Name search with football-description guard",
        "review_note": "Name matches require manual review before recruitment use.",
    }
    DATA_FILE.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Matched {matched}/{len(payload['players'])} player birth dates.")


if __name__ == "__main__":
    main()
