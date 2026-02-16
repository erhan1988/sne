const { test } = require('@playwright/test');
const { AboutPage } = require('./pages/about.page');
const { ViewAllPage } = require('./pages/viewall.page');

test.describe('About', () => {
  test('shows About page content', async ({ page }) => {
    const about = new AboutPage(page);

    await test.step('Go to About page', async () => {
      await about.goto();
    });

    await test.step('Verify About URL', async () => {
      await about.linkabout();
    });

    await test.step('Verify About content', async () => {
      await about.checkContent();
    });

    await test.step('Click Shop Collection and verify View All', async () => {
      await about.clickShopCollection();
      const viewAll = new ViewAllPage(page);
      await viewAll.assertUrl();
      await viewAll.checkContent();
    });
  });
});
