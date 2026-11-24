import { defineConfig, devices } from "@playwright/test";
const pagesBase = process.env.GITHUB_PAGES === "true" ? "/FINANCE-OS/" : "/";
const previewUrl = "http://127.0.0.1:4173" + pagesBase;
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: previewUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
