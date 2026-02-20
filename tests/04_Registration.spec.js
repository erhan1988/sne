const { test } = require('@playwright/test');
const { RegistrationPage } = require('./pages/registration.page');
const { HeaderPage } = require('./pages/header.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');
const {
  getValidRegistrationData,
  invalid_registration_email,
  getInvalidPasswordMismatchData,
} = require('./helpers/testData');

test.describe('Registration', () => {
  test('verify registration page UI elements', async ({ page }) => {
    test.setTimeout(120000);
    const registration = new RegistrationPage(page);
    const header = new HeaderPage(page);
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

    const validRegistrationData = getValidRegistrationData();

    await test.step('Verify Registration With Valid Data', async () => {
      await runStep('Verify Registration With Valid Data', async () => {
        await registration.submitValidRegistrationAndVerify(validRegistrationData);
      });
    });

    await test.step('Logout and return to Registration page', async () => {
      await runStep('Logout and return to Registration page', async () => {
        await header.logoutUser(validRegistrationData.fullName);
        await registration.gotgoRegistration();
        await registration.verifyRegistrationPageOpen();
      });
    });

    await test.step('Verify duplicate email validation', async () => {
      await runStep('Verify duplicate email validation', async () => {
        await registration.submitRegistrationExpectDuplicateEmailError(validRegistrationData);
      });
    });

    await test.step('Verify invalid email format', async () => {
      await runStep('Verify invalid email format', async () => {
        await registration.submitRegistrationExpectInvalidEmailFormat(invalid_registration_email);
      });
    });

    await test.step('Verify password mismatch validation', async () => {
      await runStep('Verify password mismatch validation', async () => {
        const invalidPasswordMismatchData = getInvalidPasswordMismatchData();
        await registration.submitRegistrationExpectPasswordMismatch(invalidPasswordMismatchData);
      });
    });
  });
});