const { test } = require('@playwright/test');
const { HeaderPage } = require('./pages/header.page');
const { ContactPage } = require('./pages/contact.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');

test.describe('Contact Us', () => {
  test('opens Contact Us and verifies content', async ({ page }) => {
    const contact = new ContactPage(page);
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

    await test.step('Go to Contact Us page', async () => {
      await runStep('Go to Contact Us page', async () => {
        await contact.goto();
      });
    });

    await test.step('Verify Contact Us URL and content', async () => {
      await runStep('Verify Contact Us URL and content', async () => {
        await contact.assertUrl();
        await contact.checkContent();
      });
    });
  });
});
