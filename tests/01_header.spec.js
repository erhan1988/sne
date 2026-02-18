const { test } = require('@playwright/test');
const { HeaderPage } = require('./pages/header.page');
//const { ContactPage } = require('./pages/contact.page');
const { logInfo, logSuccess, setStepPrefix, clearStepPrefix } = require('./helpers/logger');

test.describe('Header', () => {
  test('shows logo and Auth links', async ({ page }) => {
    const header = new HeaderPage(page);
  //  const contact = new ContactPage(page);
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

    await test.step('Go to home page', async () => {
      await runStep('Go to home page', async () => {
        await header.goto();
        logSuccess(`Page opened: ${page.url()}`);
      });
    });

    await test.step('Verify logo in header', async () => {
      await runStep('Verify logo in header', async () => {
        await header.logoHeader();
      });
    });

    await test.step('Verify header nav links', async () => {
      await runStep('Verify header nav links', async () => {
        await header.navLinks();
      });
    });

    await test.step('Verify search and cart icons', async () => {
      await runStep('Verify search and cart icons', async () => {
        await header.searchIconAndShoppingCartIcon();
      });
    });

    await test.step('Verify Login and Register buttons', async () => {
      await runStep('Verify Login and Register buttons', async () => {
        await header.authButtonsVisible();
      });
    });

    await test.step('Click Shop link', async () => {
      await runStep('Click Shop link', async () => {
        await header.clickShopLink();
      });
    });

    await test.step('Click About link', async () => {
      await runStep('Click About link', async () => {
        await header.clickNavLink('about');
      });
    });

    await test.step('Click Contact Us link', async () => {
      await runStep('Click Contact Us link', async () => {
        await header.clickNavLink('contact');
      });
    });

    await test.step('Click Login button', async () => {
      await runStep('Click Login button', async () => {
        await header.clickNavLink('login');
      });
    });

    await test.step('Click Register button', async () => {
      await runStep('Click Register button', async () => {
        await header.clickNavLink('register');
      });
    });

    await test.step('Click cart icon and verify login popup', async () => {
      await runStep('Click cart icon and verify login popup', async () => {
        await header.clickCartAndVerifyLoginPopup();
      });
    });

    
  });
});
