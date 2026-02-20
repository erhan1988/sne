const { test } = require('@playwright/test');
const { RegistrationPage } = require('./pages/registration.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');

test.describe('Registration', () => {
  test('verify registration page UI elements', async ({ page }) => {
    const registration = new RegistrationPage(page);
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

    await test.step('Open Registration page ', async () => {
      await runStep('Verify Registration page open', async () => {
        await registration.gotgoRegistration();
        await registration.verifyRegistrationPageOpen();
      });
    });

    await test.step('Verify Registration Page UI Elements', async () => {
      await runStep('Verify Registration Page UI Elements', async () => {
        await registration.verifyRegistrationPageUiElements();
      });
    });
  });
});