import { test, expect } from "@playwright/test";
test("CSV preview, review and clean download", async ({ page }) => {
  await page.goto("/import"); await page.getByRole("button", { name: "Load synthetic sample" }).click();
  await expect(page.getByText("Accepted rows: 2")).toBeVisible(); await expect(page.getByText("Rows needing review: 2")).toBeVisible();
  const event = page.waitForEvent("download"); await page.getByRole("button", { name: "Download clean CSV" }).click(); expect((await event).suggestedFilename()).toBe("players-clean.csv");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "docs/screenshots/csv-import.png", fullPage: true });
});
test("language persists through navigation and reports use that language", async ({ page }) => {
  await page.goto("/import"); await page.getByRole("radio", { name: "日本語" }).check(); await expect(page.getByRole("heading", { name: "CSVを取り込む" })).toBeVisible();
  await page.getByRole("link", { name: "FWを比較" }).click(); await expect(page.getByRole("heading", { name: "FWを比較" })).toBeVisible();
  const href = await page.getByRole("link", { name: "ダウンロード Markdown" }).getAttribute("href"); const response = await page.request.get(href!); expect(await response.text()).toContain("PKを除くxG");
  await page.getByRole("radio", { name: "Español" }).check(); await page.reload(); await expect(page.getByRole("heading", { name: "Comparar delanteros" })).toBeVisible();
});
test("comparison respects four-player limit and small selection state", async ({ page }) => {
  await page.goto("/analytics/compare"); const choices = page.locator('.comparePicker input[type="checkbox"]');
  for (const input of await choices.all()) if (await input.isChecked()) await input.uncheck();
  await expect(page.getByRole("status")).toHaveText("Choose at least two players."); for (let i = 0; i < 4; i++) await choices.nth(i).check(); await expect(choices.nth(4)).toBeDisabled();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "docs/screenshots/forward-comparison.png", fullPage: true });
});
test("team filters, club source details and mobile layouts", async ({ page }) => {
  await page.goto("/teams"); await page.locator("tbody a").first().click(); await expect(page.locator("tbody a").first()).toHaveAttribute("href", /wikidata/);
  await page.goto("/teams"); await page.screenshot({ path: "docs/screenshots/team-directory.png", fullPage: true });
  for (const route of ["/import", "/teams", "/analytics/compare", "/proof"]) { await page.setViewportSize({ width: 390, height: 844 }); await page.goto(route); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  await page.screenshot({ path: "docs/screenshots/proof-mobile.png", fullPage: true });
});
test("public portfolio sample: CSV, teams, comparison and language", async ({ page }) => {
  await page.goto("http://127.0.0.1:3101");
  await expect(page.locator("#correction")).toContainText("Self-created");
  await expect(page.locator(".captures img").first()).toBeVisible();
  expect(await page.locator(".captures img").first().evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Import CSV" }).click(); await expect(page.locator("#reviewResult")).toContainText("Accepted: 2");
  await page.getByRole("button", { name: "Teams", exact: true }).click(); await expect(page.locator("tbody tr").first()).toBeVisible();
  await page.locator("#search").fill("no-club-with-this-name"); await expect(page.locator("tbody tr")).toHaveCount(0);
  await page.getByRole("button", { name: "Compare forwards" }).click(); await expect(page.locator("tbody tr")).toHaveCount(2);
  await page.locator("#language").selectOption("ja"); await expect(page.getByRole("heading", { name: "FWを比較" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "制作事例" }).click(); await page.screenshot({ path: "docs/screenshots/public-portfolio-mobile.png", fullPage: true });
});

test("current watchlist is evidence-gated and historical records stay in review", async ({ page }) => {
  await page.goto("/players/watchlist");
  await expect(page.getByRole("heading", { name: "Leandro Brey" })).toBeVisible();
  await expect(page.getByText("Ernesto Imparato", { exact: true })).toHaveCount(0);
  await page.goto("/workspace/roster-review?status=excluded&q=Ernesto%20Imparato");
  await expect(page.locator("tbody")).toContainText("Ernesto Imparato");
  await expect(page.locator("tbody a").first()).toHaveAttribute("href", /wikidata/);
  await page.getByRole("radio", { name: "Español" }).check();
  await expect(page.getByRole("heading", { name: "Revisión de planteles" })).toBeVisible();
  await page.getByRole("radio", { name: "日本語" }).check();
  await expect(page.getByRole("heading", { name: "所属情報の確認" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "docs/screenshots/roster-review-mobile.png", fullPage: true });
});

test("public roster review exposes verified sources and honest coverage", async ({ page }) => {
  await page.goto("http://127.0.0.1:3101");
  await page.getByRole("button", { name: "Roster review" }).click();
  await expect(page.locator("main")).toContainText("Confirmed memberships: 4");
  await expect(page.locator("main")).toContainText("Excluded records: 214");
  await expect(page.locator("tbody a").first()).toHaveAttribute("href", "https://www.bocajuniors.com.ar/futbol-masculino");
});
