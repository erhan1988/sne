const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');

class HeaderPage {
  loginText = 'Login';
  registerText = 'Register';
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.logoText = this.header.getByText('SNEAKERSTUDIO', { exact: true });
    this.logoIcon = this.header.locator('.bg-blue-600.text-white.p-1\\.5.rounded-lg');
    // First try link role; if not found, fall back to button role.
    this.homeLink = this.header.getByRole('link', { name: /^home$/i }).or(this.header.getByRole('button', { name: /^home$/i }));
    this.shopLink = this.header.getByRole('link', { name: /^shop$/i }).or(this.header.getByRole('button', { name: /^shop$/i }));
    this.aboutLink = this.header.getByRole('link', { name: /^about$/i }).or(this.header.getByRole('button', { name: /^about$/i }));
    this.contactLink = this.header.getByRole('link', { name: /contact us/i }).or(this.header.getByRole('button', { name: /contact us/i }));
    this.searchIcon = this.header.locator('svg.lucide.lucide-search');
    this.shoppingCartIcon = this.header.locator('button.text-gray-500.hover\\:text-blue-600.transition-colors.relative svg.lucide.lucide-shopping-bag, button.text-gray-500.hover\\:text-blue-600.transition-colors.relative svg.lucide.lucide-shopping-cart');
    this.shopSection = this.page.locator('#shop');
    this.loginButton = this.header
      .locator('button.text-sm.font-medium.text-gray-700.hover\\:text-blue-600.transition-colors')
      .filter({ hasText: this.loginText });
    this.registerButton = this.header
      .locator('button.text-sm.font-medium.bg-gray-900.text-white.px-4.py-2.rounded-full.hover\\:bg-blue-600.transition-colors')
      .filter({ hasText: this.registerText });
  }

  async goto() {
    await this.page.goto('/');
  }

  async logoHeader() {
    try {
      await expect(this.logoText).toHaveText('SNEAKERSTUDIO');
      await expect(this.logoIcon).toBeVisible();
      await expect(this.logoIcon).toHaveClass(/bg-blue-600/);
      await expect(this.logoIcon).toHaveClass(/text-white/);
      await expect(this.logoIcon).toHaveClass(/p-1\.5/);
      await expect(this.logoIcon).toHaveClass(/rounded-lg/);
      logSuccess('Logo text exists in the Header');
      logSuccess('Logo icon exists in the Header');
    } catch (error) {
      logError('ERROR: Logo is missing or not visible in the Header');
      console.error(error);
      throw error;
    }
  }

  async navLinks() {
    try {
      await expect(this.homeLink).toBeVisible();
      await expect(this.shopLink).toBeVisible();
      await expect(this.aboutLink).toBeVisible();
      await expect(this.contactLink).toBeVisible();
      logSuccess('Home Link exists in the Header');
      logSuccess('Shop Link exists in the Header');
      logSuccess('About Link exists in the Header');
      logSuccess('Contact Us Link exists in the Header');
    } catch (error) {
      logError('ERROR: One or more header nav items are missing');
      console.error(error);
      throw error;
    }
  }

  async searchIconAndShoppingCartIcon() {
    try {
      await expect(this.searchIcon).toBeVisible();
      await expect(this.shoppingCartIcon).toBeVisible();
      logSuccess('Search icon exists in the Header');
      logSuccess('Shopping cart icon exists in the Header');
    } catch (error) {
      logError('ERROR: Search icon or shopping cart icon is missing in the Header');
      console.error(error);
      throw error;
    }
  }

  async authButtonsVisible() {
    try {
      await expect(this.loginButton).toBeVisible();
      await expect(this.loginButton).toBeEnabled();
      await expect(this.loginButton).toHaveText(this.loginText);
      logSuccess('Login button exists in the Header');

      await expect(this.registerButton).toBeVisible();
      await expect(this.registerButton).toBeEnabled();
      await expect(this.registerButton).toHaveText(this.registerText);
      logSuccess('Register button exists in the Header');
    } catch (error) {
      logError('ERROR: Login or Register button is missing or disabled in the Header');
      console.error(error);
      throw error;
    }
  }

    async clickShopLink() {
    try {
      await this.shopLink.click();
      const shopSectionHeading = this.page.getByRole('heading', { name: /shop our collection/i });
      await expect(shopSectionHeading).toBeVisible();
      await expect(this.shopSection).toBeVisible();
      const shopCards = this.shopSection.locator('.group');
      await expect(shopCards.first()).toBeVisible();
      logSuccess('Shop link navigates to Shop Our Collection section and cards are visible');
    } catch (error) {
      logError('ERROR: Shop section or cards are not visible');
      console.error(error);
      throw error;
    }
  }

   async clickAboutLink() {
    try {
      await this.aboutLink.click();
      await expect(this.page).toHaveURL(/\/about$/);
      logSuccess('About link navigates to /about');
    } catch (error) {
      logError('ERROR: About link did not navigate to /about');
      console.error(error);
      throw error;
    }
  }


}

module.exports = { HeaderPage };
