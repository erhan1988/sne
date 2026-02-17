const { test } = require('@playwright/test');
const { AboutPage } = require('./pages/about.page');
const { ViewAllPage } = require('./pages/viewall.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');

test.describe('About', () => {
  test('shows About page content', async ({ page }) => {
    const about = new AboutPage(page);
    let stepNum = 0;

    const runStep = async (message, fn) => {
      stepNum += 1;
      const prefix = `${stepNum}.`;
      logInfo(`${prefix} ${message}`);
      setStepPrefix(prefix);
      try {
        await fn();
      } finally {
        clearStepPrefix();
      }
    };

    await test.step('Go to About page', async () => {
      await runStep('Go to About page', async () => {
        await about.goto();
      });
    });

    await test.step('Verify About URL', async () => {
      await runStep('Verify About URL', async () => {
        await about.linkabout();
      });
    });

    await test.step('Verify About content', async () => {
      await runStep('Verify About content', async () => {
        await about.checkContent();
      });
    });

    await test.step('Click Shop Collection and verify View All', async () => {
      await runStep('Click Shop Collection and verify View All', async () => {
        await about.clickShopCollection();
        const viewAll = new ViewAllPage(page);
        await viewAll.assertUrl();
        await viewAll.checkContent();
        await viewAll.verifyLoginRequiredPopup();
      });
    });

  });
});
