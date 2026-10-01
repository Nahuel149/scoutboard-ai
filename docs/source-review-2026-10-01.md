# Sources checked on 2026-10-01

## Current-roster review

The metadata refresh uses Wikidata's entity API, with 50 IDs per request,
maxlag detection and 30-second request timeouts. Failed batches are recorded
for a later rerun. Run `node scripts/refresh-currentness.mjs`
to refresh `data/analytics/currentness-review.json`. No API key is required.
The output covers 6,757 player IDs and 290 club IDs; 247 clubs have website links.

The review overlay excludes 214 imported membership rows: 80 deceased-player
rows, 70 outside the men's sample category, 55 memberships no longer present
among non-ended claims, 7 outside the under-51 scouting scope, 1 different sport
and 1 contradicted affiliation. Exclusion is a dataset policy, not a retirement
judgment. Missing death/end claims never prove an active player.

Manual evidence in `data/reviewed/club-evidence.json` confirms four memberships
already present in the imported samples. Evidence is tied to exact player/club
IDs and expires after 30 days. There are 7,077 unverified membership rows.

- Boca first-team source: <https://www.bocajuniors.com.ar/futbol-masculino>.
- Palmeiras first-team source: <https://www.palmeiras.com.br/elenco/>. Its loaned
  players section must not be treated as the active first-team squad.
- Flamengo source: <https://www.flamengo.com.br/futebol/elenco/>. Only part of the
  roster was readable; no complete-roster verification is claimed.
- River source: <https://www.riverplate.com/>. The roster was not accessible in
  the text retrieval used; no player confirmations were added from that page.

Official club pages are cited as evidence, not copied as commercial datasets.
Wikidata metadata checks and club-source confirmations are different processes.

- StatsBomb Open Data now redirects to <https://github.com/hudl/open-data>.
  The README requests StatsBomb attribution and its logo when publishing analysis.
  The app and public sample include both. The underlying license remains separate
  from this app's code; see the provider's LICENSE.pdf.
- Wikidata structured data is CC0: <https://www.wikidata.org/wiki/Wikidata:Data_access>.
  Source links and import dates remain visible even though attribution is not required.
- Copa América 2024 is the scope of the existing event dataset. No current-season
  player ranking or full current roster is inferred from this sample.
- Club pages group imported membership claims. Import date is not an independent
  verification date. Transfers and missing records require a club-source review.
- CSV samples are fictional. User uploads stay in the browser and are not sent
  to a server. Spreadsheet formula prefixes are escaped on CSV export.
- GitHub API currently reports Nahuel149/scoutboard-ai as PUBLIC. Earlier notes
  calling it private are historical; no visibility change was made in this build.
