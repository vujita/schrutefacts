import { defineConfig, devices } from "@playwright/test";

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Local docker postgres defaults so e2e never accidentally hits the Neon prod
// DB referenced in apps/web/.env. test:all exports these too.
const env = {
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://postgres:password@127.0.0.1:5432/schrutefacts",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "test-secret-not-for-runtime-0123456789",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? BASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? BASE_URL,
  NODE_ENV: "test",
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env,
  },
});
