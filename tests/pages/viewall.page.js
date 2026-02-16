const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');

class ViewAllPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /shop collection|view all|shop our collection/i });
    this.productCards = page.locator('.group');
  }

  async assertUrl() {
    try {
      await expect(this.page).toHaveURL(/\/viewall$/);
      logSuccess('URL is /viewall');
    } catch (error) {
      logError('ERROR: URL is not /viewall');
      console.error(error);
      throw error;
    }
  }

  async checkContent() {
    try {
      await expect(this.heading).toBeVisible();
      await expect(this.productCards.first()).toBeVisible();
      logSuccess('View All page content is visible: heading and product cards');
    } catch (error) {
      logError('ERROR: View All page content is missing');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { ViewAllPage };
