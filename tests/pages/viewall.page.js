const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { verifyLoginRequiredPopupCancel } = require('../helpers/loginRequiredPopup');

class ViewAllPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1.text-4xl.md\\:text-5xl.font-bold.text-gray-900.mb-4');
    this.backToHome = page.locator('a:has-text("Back to Home"), button:has-text("Back to Home")');
    this.loginRequiredTriggerButton = page.getByRole('button', { name: /add to cart/i }).first();
    this.productCards = page.locator('.group');
  }

  async assertUrl() {
    try {
      await expect(this.page).toHaveURL(/\/viewall$/);
      logSuccess(`URL is ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: URL is not /viewall');
      await this.page.screenshot({ path: 'test-results/viewall-url-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }

  async checkContent() {
    try {
      await expect(this.heading).toBeVisible();
      await expect(this.backToHome).toBeVisible();
      await expect(this.productCards.first()).toBeVisible();
      logSuccess('View All page content is visible: Title, (link)->Back to Home, and product cards');
    } catch (error) {
      logError('ERROR: View All page content is missing');
      await this.page.screenshot({ path: 'test-results/viewall-content-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }

  async verifyLoginRequiredPopup() {
    try {
      await verifyLoginRequiredPopupCancel(this.page, this.loginRequiredTriggerButton);
    } catch (error) {
      logError('ERROR: Login Required popup did not appear from Add to Cart button');
      await this.page.screenshot({ path: 'test-results/viewall-loginpopup-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }
}

module.exports = { ViewAllPage };
