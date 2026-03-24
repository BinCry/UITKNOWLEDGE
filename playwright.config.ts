import { defineConfig, devices } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 1,
  webServer: {
    command:
      process.platform === "win32"
        ? "\"C:\\Program Files\\nodejs\\npm.cmd\" run dev"
        : "npm run dev",
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: baseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
