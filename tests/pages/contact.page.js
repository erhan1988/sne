const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');

class ContactPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.contactLink = this.header
      .getByRole('link', { name: /contact us/i })
      .or(this.header.getByRole('button', { name: /contact us/i }));
    this.heading = page.getByRole('heading', { name: /contact us/i });
  }

  async goto() {
    await this.page.goto('/contact');
  }

  async assertUrl() {
    try {
      await expect(this.page).toHaveURL(/\/contact$/);
      logSuccess(`URL is ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: URL is not /contact');
      console.error(error);
      throw error;
    }
  }

  async checkContent() {
    try {
      await expect(this.heading).toBeVisible();
      logSuccess('Contact Us heading is visible');
    } catch (error) {
      logError('ERROR: Contact Us heading is not visible');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { ContactPage };
