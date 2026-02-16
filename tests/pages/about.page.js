const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');

class AboutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: /about sneakerstudio/i });
    this.story = page.getByRole('heading', { name: /our story/i });
    this.meetTheTeam = page.getByRole('heading', { name: /meet the team/i });
    this.teamText = page.getByText(/The sneakerheads behind the scenes making it all happen\./i);
    this.teamImage = page.locator('div.relative.mb-4.mx-auto.w-48.h-48.rounded-full.overflow-hidden.shadow-lg img[alt="Erhan D."]');
  }

  async goto() {
    await this.page.goto('/about');
  }

  async assertUrl() {
    try {
      await expect(this.page).toHaveURL(/\/about$/);
      logSuccess('URL is /about');
    } catch (error) {
      logError('ERROR: URL is not /about');
      console.error(error);
      throw error;
    }
  }

  async assertContent() {
    try {
      await expect(this.title).toBeVisible();
      await expect(this.story).toBeVisible();
      await expect(this.meetTheTeam).toBeVisible();
      await expect(this.teamText).toBeVisible();
      await expect(this.teamImage.first()).toBeVisible();
      logSuccess('About page content is visible');
    } catch (error) {
      logError('ERROR: About page content is missing');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { AboutPage };
