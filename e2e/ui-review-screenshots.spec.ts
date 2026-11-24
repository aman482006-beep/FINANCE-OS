import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const output = path.join(process.cwd(), "test-results", "ui-review-screenshots");
fs.mkdirSync(path.join(output, "desktop"), { recursive: true });
fs.mkdirSync(path.join(output, "mobile"), { recursive: true });

const screens = [
  { name: "overview", nav: null },
  { name: "learn", nav: "Learn" },
  { name: "markets", nav: "Markets" },
  { name: "news-lab", nav: "News Lab" },
  { name: "career", nav: "Career" },
  { name: "workbench", nav: "Workbench" },
  { name: "my-progress", nav: "My Progress" },
  { name: "ai-mentor", nav: "AI Mentor" }
];

test("capture desktop and mobile UI for a visual review", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("./");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  for (const screen of screens) {
    if (screen.nav) await page.getByRole("button", { name: screen.nav, exact: true }).click();
    await page.waitForTimeout(250);
    await expect(page.locator("#main-content")).toBeVisible();
    await page.screenshot({
      path: path.join(output, "desktop", `${screen.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  for (const screen of screens) {
    if (screen.nav) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("button", { name: screen.nav, exact: true }).click();
    }
    await page.waitForTimeout(250);
    await expect(page.locator("#main-content")).toBeVisible();
    await page.screenshot({
      path: path.join(output, "mobile", `${screen.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }
  // Temporary export trigger: the base workflow only uploads screenshots on failure.\n  expect(false, "Temporary diagnostic run: export screenshots for human visual review").toBe(true);\n});\n