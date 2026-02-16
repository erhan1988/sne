const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'https://sneaker-web-omega.vercel.app/',
    headless: false,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 500,
    },
    screenshot: 'only-on-failure',
  },
  reporter: [['list']],
});
