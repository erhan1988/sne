const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'https://sneaker-web-omega.vercel.app/',
    headless: false,
    viewport: null,
    launchOptions: {
      slowMo: 2000,
      args: ['--start-maximized'],
    },
    screenshot: 'only-on-failure',
  },
  reporter: [['line', { printSteps: true }]],
});
