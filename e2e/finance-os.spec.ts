import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("dashboard and primary navigation render", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Good morning, Aman." })).toBeVisible();
  for (const label of ["Learn", "Markets", "News Lab", "Career", "Workbench", "My Progress", "AI Mentor"]) {
    await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
});

test("learning completion persists across reload", async ({ page }) => {
  await page.getByRole("button", { name: "Learn", exact: true }).click();
  await page.getByRole("button", { name: /Simple vs compound interest/ }).click();
  await expect(page.getByRole("heading", { name: "Simple vs compound interest" })).toBeVisible();
  await page.getByRole("button", { name: /Mark lesson complete/ }).click();
  await page.reload();
  await page.getByRole("button", { name: "Learn", exact: true }).click();
  await expect(page.getByText("2/3 DONE")).toBeVisible();
});

test("paper trading prevents overselling", async ({ page }) => {
  await page.getByRole("button", { name: "Markets", exact: true }).click();
  await page.getByRole("button", { name: "Simulate buy" }).click();
  await expect(page.getByText(/BUY order simulated/)).toBeVisible();
  await page.getByRole("button", { name: "Sell", exact: true }).click();
  await page.getByRole("spinbutton").fill("2");
  await page.getByRole("button", { name: "Simulate sell" }).click();
  await expect(page.getByText("You cannot sell more units than you hold.")).toBeVisible();
});

test("News Lab review returns transparent rubric feedback", async ({ page }) => {
  await page.getByRole("button", { name: "News Lab", exact: true }).click();
  const analysis = "First, the rate cut could reduce bank funding costs because deposit repricing can lower interest expense. Therefore, net interest margins may improve, although loan yields can reprice too. Borrowers and companies may benefit from cheaper credit. However, if growth weakens, credit risk and defaults could rise. Assuming demand recovers, lending volumes may improve. Evidence from bank margins, bond prices and loan growth would help test this view. In conclusion, the outcome depends on the starting inflation and growth conditions.";
  await page.getByRole("textbox", { name: "Your written analysis" }).fill(analysis);
  await page.getByRole("button", { name: /Review my analysis/ }).click();
  await expect(page.getByText("STRUCTURED REVIEW")).toBeVisible();
  await expect(page.getByText("Causal reasoning")).toBeVisible();
  await expect(page.getByText("What is already present")).toBeVisible();
});

test("DCF workbench calculates a multi-year forecast and rejects bad assumptions", async ({ page }) => {
  await page.getByRole("button", { name: "Workbench", exact: true }).click();
  await expect(page.getByText("Enterprise value")).toBeVisible();
  await page.getByLabel("Terminal growth (%)").fill("15");
  await expect(page.getByRole("alert")).toContainText("Terminal growth must be");
  await page.getByLabel("Terminal growth (%)").fill("4");
  await expect(page.getByText("Enterprise value")).toBeVisible();
});

test("primary screens pass axe WCAG 2.1 A/AA checks", async ({ page }) => {
  const screens = ["Overview", "Learn", "Markets", "News Lab", "Career", "Workbench", "My Progress", "AI Mentor"];
  for (const screen of screens) {
    if (screen !== "Overview") await page.getByRole("button", { name: screen, exact: true }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations, screen + " accessibility violations").toEqual([]);
  }
});

test("mobile navigation is operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("button", { name: "Learn", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Learn", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Learn by understanding." })).toBeVisible();
});
