# ScoutBoard AI - Project Blueprint

## 1. Purpose

Build a football/soccer research and QA dashboard that proves multiple marketable skills in one project:

- Full-stack development
- Data import, validation, and cleanup
- Football research and structured reporting
- AI-assisted content workflow with human verification
- QA/test design and bug-report discipline
- English/Japanese-friendly client deliverables
- Portfolio-ready GitHub documentation

This project should be clean, public-safe, and separate from personal job-search files. It can later become a private or public GitHub repo, but only after checking that no personal documents, CrowdWorks messages, secrets, or copyrighted datasets are committed.

## 2. Working Name

Primary name:

**ScoutBoard AI**

Subtitle:

**Football Research, Data QA, and Report Generator**

Possible repository name:

`scoutboard-ai`

## 3. Why This Project Fits Our Job Strategy

The jobs we applied to repeatedly ask for proof in these areas:

- AI-assisted article writing
- Human rewriting and proofreading
- Research summaries
- Spreadsheet/data collection
- QA checking
- Bug reports and testing
- Small automation
- Frontend/backend implementation
- GitHub or portfolio references

ScoutBoard AI connects all of them through one memorable subject: football.

Instead of saying "I can do research, writing, QA, and coding", the portfolio can show:

- A football player/team dashboard.
- A source-backed research brief.
- A data quality report.
- A QA bug report sample.
- A generated article outline that was manually verified.
- A GitHub repo with tests, README, screenshots, and implementation notes.

## 4. Target Users

### Primary portfolio audience

- CrowdWorks clients hiring for research, writing, AI content, QA, data entry, or small web tools.
- Remote job recruiters checking practical proof.
- Technical hiring managers looking for full-stack/QA ability.

### Product-style audience

- Amateur scouts
- Football analysts
- Sports bloggers
- Fantasy football or career-mode players
- Small agencies preparing player/team reports

## 5. Core Product Idea

ScoutBoard AI imports football data, checks it for quality problems, and turns it into clear research pages and reports.

Example user flow:

1. Import or select sample player/team data.
2. Dashboard shows player/team cards and data completeness.
3. The app flags missing, inconsistent, or suspicious fields.
4. User opens a player/team page.
5. App shows stats, notes, sources, and a research summary.
6. User generates a report draft or article outline.
7. App displays a QA checklist before export.
8. User exports a Markdown/CSV/PDF-style report sample.

## 6. MVP Scope

The MVP should be small enough to finish but strong enough to show.

### Must Have

- Web dashboard with football sample data.
- Player list with filters/search.
- Team list with basic overview.
- Player detail page.
- Data QA page showing validation issues.
- Research report page with source-backed sections.
- Manual "AI workflow" area showing draft, checks, and final version.
- README with screenshots and setup instructions.
- At least basic tests.

### Should Have

- CSV import for player/team data.
- Export report as Markdown.
- English and Japanese labels for key report fields.
- QA checklist for article/report delivery.
- Sample bug report generated from an intentional test issue.

### Nice to Have

- PDF export.
- Charts.
- Saved report history.
- Playwright end-to-end tests.
- Public demo deployment.
- Football news/source collection from manually curated links.

## 7. Recommended Tech Stack

Choose a stack that looks useful for jobs and is realistic to ship quickly.

### Frontend

- Next.js or Vite + React + TypeScript
- Tailwind CSS or simple CSS modules
- Recharts for charts
- React Hook Form if forms become complex

### Backend

For MVP, keep it simple:

- Next.js API routes, or
- FastAPI backend if we want stronger Python proof

Recommended for portfolio value:

- **Frontend:** Next.js + TypeScript
- **Backend/API:** FastAPI + Python
- **Database:** SQLite for local MVP, PostgreSQL later if needed

This combination proves React/TypeScript plus Python/FastAPI, which matches the resume.

### Testing

- Unit tests for validation logic.
- API tests for import/report endpoints.
- Playwright tests for dashboard flows.

### Data

Use safe sample data first.

Avoid scraping copyrighted or terms-restricted sites. Do not reuse proprietary FutBin data unless the license/terms allow it. For MVP, create a small synthetic football dataset or use clearly open datasets with attribution.

Potential safe data strategy:

- Start with manually created sample CSVs.
- Later check open datasets from Kaggle/OpenFootball/StatsBomb open data only after confirming license and attribution requirements.

## 8. Folder Structure

Suggested repo structure:

```text
scoutboard-ai/
  README.md
  docs/
    portfolio-case-study.md
    qa-checklist.md
    sample-client-report.md
    data-source-policy.md
  frontend/
    package.json
    src/
      app/
      components/
      features/
      lib/
      styles/
      tests/
  backend/
    pyproject.toml
    app/
      main.py
      models/
      routers/
      services/
      validators/
      tests/
  data/
    sample/
      players.csv
      teams.csv
      matches.csv
      sources.csv
  reports/
    samples/
      player-report-en.md
      team-report-en.md
      article-outline-ja.md
      data-qa-report.md
  screenshots/
    dashboard.png
    player-detail.png
    data-qa.png
  .gitignore
```

If we want a smaller MVP, use one Next.js app first:

```text
scoutboard-ai/
  README.md
  docs/
  data/sample/
  reports/samples/
  src/
    app/
    components/
    lib/
    tests/
```

## 9. Data Model

### Player

Fields:

- `id`
- `name`
- `age`
- `nationality`
- `position`
- `club`
- `league`
- `preferred_foot`
- `height_cm`
- `market_value_eur`
- `contract_until`
- `appearances`
- `goals`
- `assists`
- `minutes`
- `source_url`
- `source_name`
- `last_checked_at`

### Team

Fields:

- `id`
- `name`
- `country`
- `league`
- `manager`
- `stadium`
- `squad_size`
- `average_age`
- `source_url`
- `source_name`
- `last_checked_at`

### Match

Fields:

- `id`
- `date`
- `home_team`
- `away_team`
- `home_score`
- `away_score`
- `competition`
- `notes`

### Source

Fields:

- `id`
- `title`
- `url`
- `publisher`
- `language`
- `checked_at`
- `reliability_note`
- `linked_entity_type`
- `linked_entity_id`

### DataIssue

Fields:

- `id`
- `entity_type`
- `entity_id`
- `field`
- `severity`
- `issue_type`
- `message`
- `suggested_fix`
- `status`

## 10. Validation Rules

Examples:

- Player age must be between 15 and 45.
- Height must be plausible if present.
- Market value cannot be negative.
- Contract date cannot be impossible.
- Position must match an allowed list.
- Source URL is required for non-synthetic research claims.
- Last checked date is required for external-source data.
- Goals/assists/minutes cannot be negative.
- If `minutes` is 0, goals and assists should usually be 0 unless explicitly explained.
- Nationality and club should not be blank on final reports.

Data QA output should show:

- Issue count by severity.
- Issue count by field.
- Table of issues.
- Suggested fixes.
- Exportable QA report.

## 11. Main Pages

### Dashboard

Purpose:

- Give a fast portfolio screenshot.

Content:

- Total players
- Total teams
- Data completeness score
- Open data issues
- Top players by selected metric
- Recent reports

### Players

Purpose:

- Show data-table, filters, search, and clean UI.

Content:

- Search by name
- Filter by position, nationality, club, league
- Sort by goals, assists, age, market value
- Link to detail page

### Player Detail

Purpose:

- Show research/reporting skill.

Content:

- Basic profile
- Stats
- Source notes
- Data warnings
- Short scouting summary
- Report draft section
- QA checklist before export

### Teams

Purpose:

- Add second entity type and show relational data.

Content:

- Team cards/table
- League/country filters
- Squad summary
- Link to team report

### Data QA

Purpose:

- Directly supports QA/testing/data-check jobs.

Content:

- Validation summary
- Issues by severity
- Issue table
- Suggested fixes
- Export data QA report

### Report Builder

Purpose:

- Directly supports writing/research jobs.

Content:

- Select player/team/topic
- Choose report type:
  - Player scouting note
  - Team overview
  - Article outline
  - Research summary
- Show draft
- Show source list
- Show manual QA checklist
- Export Markdown

### QA Evidence

Purpose:

- Portfolio page showing how we test.

Content:

- Test checklist
- Sample bug report
- Automated test summary
- Known limitations

## 12. Portfolio Deliverables

Create these as static files in `docs/` or `reports/samples/`:

1. `portfolio-case-study.md`
   - Problem
   - Solution
   - Tech stack
   - Screenshots
   - What was tested
   - What was learned

2. `sample-client-report.md`
   - A client-friendly research report.
   - Marked clearly as self-created sample.

3. `data-qa-report.md`
   - Validation issues and fixes.
   - Shows spreadsheet/data-checking proof.

4. `article-outline-ja.md`
   - Japanese article outline.
   - Should be simple, readable, and checked.

5. `qa-checklist.md`
   - Requirements, sources, data, readability, export checks.

6. `bug-report-sample.md`
   - A realistic UI/data issue report.

## 13. README Structure

The final GitHub README should include:

- Project screenshot
- One-sentence summary
- Why it exists
- Feature list
- Tech stack
- Demo or local setup
- Sample reports
- Testing commands
- Data/source policy
- Portfolio note

Example portfolio note:

```text
This is a self-created portfolio project. It demonstrates full-stack development, data validation, QA reporting, and source-backed research workflows using football sample data. It does not include client-confidential material.
```

## 14. GitHub Contribution Plan

Use real commits only. Avoid fake or empty commits.

Suggested commit sequence:

1. `Create ScoutBoard AI project blueprint`
2. `Add sample football data model`
3. `Add data validation rules`
4. `Build dashboard layout`
5. `Add player list filters`
6. `Add player detail page`
7. `Add data QA report view`
8. `Add report builder draft export`
9. `Add sample client reports`
10. `Add tests for validation logic`
11. `Add screenshots and case study`

Each commit should correspond to a real improvement.

Before pushing:

- Check `git status`.
- Check no personal files are included.
- Search for secrets:
  - `rg -n "api[_-]?key|token|secret|password|Bearer|PRIVATE KEY|GITHUB|TELEGRAM" -S .`
- Verify `.gitignore`.
- Push to GitHub.
- Confirm the repo privacy/public choice.

## 15. MVP Milestones

### Milestone 1 - Blueprint and sample data

Output:

- Project folder
- README
- Sample CSVs
- Data/source policy

Done when:

- Another thread can start coding without needing job-search context.

### Milestone 2 - Data validation engine

Output:

- Validation rules
- Data issue objects
- CLI/API function to validate sample data
- Unit tests

Done when:

- Running tests proves the app catches missing/invalid fields.

### Milestone 3 - Dashboard and player pages

Output:

- Dashboard
- Player list
- Player detail
- Basic responsive UI

Done when:

- Screenshots are portfolio-ready.

### Milestone 4 - Report builder

Output:

- Report draft page
- Source list
- Manual QA checklist
- Markdown export

Done when:

- We have one player report and one team/report article sample.

### Milestone 5 - QA proof

Output:

- Data QA page
- Sample bug report
- Test checklist
- Automated tests

Done when:

- The project proves QA ability, not only UI work.

### Milestone 6 - GitHub portfolio polish

Output:

- README screenshots
- Case study
- Setup instructions
- Public-safe repo

Done when:

- The link can be included in proposals and job applications.

## 16. Quality Bar

The project must be:

- Honest: no fake client claims.
- Safe: no personal files, no CrowdWorks messages, no private resumes.
- Useful: every feature should map to a real job category.
- Visible: screenshots and reports should be easy to understand.
- Tested: validation and key flows should have tests.
- International: English first, with selective Japanese sample deliverables.

## 17. What Not To Build First

Avoid in MVP:

- User login
- Paid subscriptions
- Real-time scraping
- Large datasets
- Complex AI API integration
- Advanced scouting models
- Native mobile app
- Overbuilt admin dashboards

Reason:

The immediate goal is portfolio proof, not a full sports-tech business.

## 18. Optional AI Integration Later

If adding AI later, keep it transparent:

- AI suggests draft wording.
- Human checklist verifies sources and claims.
- The final report distinguishes data, source-backed claims, and opinion.
- No AI output should be presented as verified without source checking.

Possible AI features:

- Generate report outline from selected fields.
- Suggest missing source questions.
- Rewrite report in simpler English.
- Produce Japanese outline from English research notes.
- Flag unsupported claims in a draft.

## 19. Example CrowdWorks Portfolio Pitch

Short version:

```text
As a self-created sample, I built ScoutBoard AI, a football research and QA dashboard. It imports sample player/team data, checks missing or inconsistent fields, and produces source-backed research reports with a manual QA checklist. This shows my workflow for research, spreadsheet-style checking, AI-assisted drafting, and final human verification.
```

Japanese short version:

```text
自主制作サンプルとして、サッカーのリサーチ・QAダッシュボード「ScoutBoard AI」を作成しています。選手・チームデータの確認、入力ミスや不足項目のチェック、出典付きレポート作成、納品前チェックリストまでを一つの流れで示すポートフォリオです。
```

## 20. Handoff Prompt For Another Thread

Use this in a new Codex thread:

```text
We are starting the ScoutBoard AI portfolio project from:
C:\Users\nahue\Desktop\job\portfolio-projects\scoutboard-ai-football-research-qa

Read README.md and PROJECT_BLUEPRINT.md first.

Goal: build a public-safe football research and data QA portfolio app that proves full-stack development, research summaries, AI-assisted writing with human verification, spreadsheet/data QA, and testing. Keep it separate from the job-search folder's personal files. Do not upload resumes, CrowdWorks logs/messages, Telegram files, screenshots with personal info, or secrets.

Start with Milestone 1 or propose the smallest technical stack to implement the MVP quickly. Use real commits only and prepare it for GitHub when safe.
```
