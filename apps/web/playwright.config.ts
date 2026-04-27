import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  webServer: [
    {
      command: 'npm --workspace @dogbookx/api run dev',
      url: 'http://127.0.0.1:4100/api/health',
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: 'npm --workspace @dogbookx/web run dev',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
