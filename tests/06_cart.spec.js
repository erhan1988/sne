const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { HeaderPage } = require('./pages/header.page');
const { CartPage } = require('./pages/cart.page');

test.describe('Cart Modal - Empty State', () => {
  test('After login, clicking cart icon shows empty cart modal and redirects to Checkout Page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);

    await test.step('Login with valid credentials', async () => {
      await loginPage.gotoLogin();
      await loginPage.loginWithValidCredentials('erhan.demirov@yahoo.com', '123123');
    });

    await test.step('Wait for user menu/profile button to ensure login is complete and stable', async () => {
      const userMenuButton = page.locator('button.flex.items-center.gap-2');
      await userMenuButton.first().waitFor({ state: 'visible', timeout: 40000 });
      await expect(userMenuButton.first()).toBeEnabled({ timeout: 20000 });
      await page.waitForTimeout(3000);
    });

    await test.step('Click cart icon in header', async () => {
      await headerPage.shoppingCartButton.click();
    });

    await test.step('Verify empty cart modal', async () => {
      await cartPage.verifyCartIsEmpty();
    });

    await test.step('Click Start Shopping and verify redirect', async () => {
      await cartPage.clickStartShoppingAndVerifyRedirect();
    });

    await test.step('Add product to cart and verify checkout page', async () => {
      await cartPage.addProductAndVerifyCheckout();
    });

    await test.step('Complete checkout and verify success popup', async () => {
      await cartPage.completeCheckoutAndVerifySuccess();
    });
  });
});