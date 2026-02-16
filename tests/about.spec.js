const { test } = require('@playwright/test');
const { AboutPage } = require('./pages/about.page');

test.describe('About', () => {
  test('shows About page content', async ({ page }) => {
    const about = new AboutPage(page);

    await about.goto();
    await about.assertUrl();
    await about.assertContent();
  });
});
