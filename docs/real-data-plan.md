# Real data plan

Goal: grow ScoutBoard AI into a database of players from the Americas without
copying restricted datasets or scraping sites that do not allow reuse.

## Recommended first source

Use Wikidata as the first real player directory source.

Why:

- Wikidata structured data is CC0.
- It has multilingual names and country links.
- It can cover North, Central, South America, and the Caribbean.
- It is good for identity fields: name, nationality, date of birth, position,
  clubs, identifiers, and source links.

Limits:

- Coverage can be uneven.
- Some clubs and current squads may be stale.
- It is not a reliable source for current scouting stats by itself.

Use it as the identity layer, then add source checks and manual QA.

## Good supplemental sources

StatsBomb Open Data is useful for event-level analysis and portfolio analytics
examples. It is not a complete Americas player database, but it is high-quality
open football data for selected competitions and matches.

Football-Data.co.uk is useful for match results and odds CSVs, including some
Americas competitions such as MLS and Liga MX. It is not a player directory.

API-Football or similar paid APIs may be useful later for broader coverage, but
their terms make clear that the API subscription does not automatically grant
commercial publication rights to every competition's data, logos, or images.
Treat paid APIs as feeds that still need licensing review.

## Sources to avoid as raw imports

- Transfermarkt, FBref, SofaScore, FotMob, Futbin, and similar sites unless their
  terms explicitly allow the planned reuse.
- Club logos, league logos, and player photos unless licensed.
- Scraped squad tables without a terms/license review.

## Practical MVP import order

1. Wikidata identity import for Americas footballers.
2. Manual QA fields: source URL, source name, checked date, confidence note.
3. Small curated sample for Argentina, Brazil, Uruguay, Mexico, USA, Colombia,
   Chile, Peru, Ecuador, Paraguay, Canada, and selected Central America/Caribbean
   nationalities.
4. Optional StatsBomb Open Data demo for event-level match analysis.
5. Paid API evaluation only after deciding whether the app is private portfolio,
   public demo, or commercial product.

## Rule

Every imported row needs provenance: where it came from, when it was checked,
and whether it can be displayed publicly.
