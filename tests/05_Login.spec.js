
const { test } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');

test.describe('Login', () => {
  test('Open Login page and verify', async ({ page }) => {
    test.setTimeout(60000);
    const login = new LoginPage(page);
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

    await test.step('Open Login page', async () => {
      await runStep('Verify Login page open', async () => {
        await login.gotoLogin();
        await login.verifyLoginPageOpen();
      });
    });

    await test.step('Verify Login Page UI Elements', async () => {
      await runStep('Verify Login Page UI Elements', async () => {
        await login.verifyLoginPageUiElements();
      });
    });

    await test.step('Login with Invalid Email', async () => {
      await runStep('Login with invalid email', async () => {
        await login.loginWithInvalidEmail('invalid.email@example.com', 'TestPassword123');
      });
    });

    await test.step('Login with Wrong Password', async () => {
      await runStep('Login with wrong password', async () => {
        await login.loginWithWrongPassword('erhan.demirov@yahoo.com', 'WrongPassword123');
      });
    });

    await test.step('Login with Empty Fields', async () => {
      await runStep('Login with empty fields', async () => {
        await login.loginWithPartialFields({ email: '', password: '' });
      });
    });
    
    await test.step('Login with Email Only', async () => {
      await runStep('Login with email filled and password empty', async () => {
        await login.loginWithPartialFields({ email: 'erhan.demirov@yahoo.com', password: '' });
      });
    });

     await test.step('Login with Password Only', async () => {
      await runStep('Login with password filled and email empty', async () => {
        await login.loginWithPartialFields({ email: '', password: 'TestPassword123' });
      });
    });

    await test.step('Successful Login', async () => {
      await runStep('Login with valid credentials', async () => {
        await login.loginWithValidCredentials('erhan.demirov@yahoo.com', 'TestPassword123');
      });
    });
  });
});
