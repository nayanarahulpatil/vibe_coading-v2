import { defineConfig, devices } from '@playwright/test';

const PORT = 5176;
const API_PORT = 3001;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start --prefix server',
      url: `http://localhost:${API_PORT}/health`,
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        PORT: String(API_PORT),
        DB_PATH: 'data/test_playwright.db',
        CLIENT_ORIGIN: `http://localhost:${PORT}`,
        JWT_SECRET: 'playwright-test-secret',
        DISABLE_RATE_LIMIT: 'true',
      },
    },
    {
      command: `npm run dev -- --port ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
