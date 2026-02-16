const { test } = require('@playwright/test');
const { HeaderPage } = require('./pages/header.page');

test.describe('Header', () => {
  test('shows logo and Auth links', async ({ page }) => {
    const header = new HeaderPage(page);

    await header.goto();
    await header.logoHeader();
    await header.navLinks();
    await header.searchIconAndShoppingCartIcon();
    await header.authButtonsVisible();
    await header.clickShopLink();
    await header.clickAboutLink();
  });
});
