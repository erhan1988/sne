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
    this.shopCollectionButton = page.locator('button, a').filter({ hasText: /shop collection/i });
  }

  async goto() {
    await this.page.goto('/about');
  }

  async linkabout() {
    try {
      await expect(this.page).toHaveURL(/\/about$/);
      logSuccess(`URL is ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: URL is not /about');
      console.error(error);
      throw error;
    }
  }

  async checkContent() {
    try {
      const elements = [
        { name: 'title', locator: this.title },
        { name: 'story', locator: this.story },
        { name: 'meet the team', locator: this.meetTheTeam },
        { name: 'team text', locator: this.teamText },
        { name: 'profile image', locator: this.teamImage.first() },
        { name: 'shop collection button', locator: this.shopCollectionButton },
      ];

      for (const { name, locator } of elements) {
        try {
          const target = locator.first();
          if (name === 'shop collection button') {
            await target.scrollIntoViewIfNeeded();
          }
          await expect(target).toBeVisible();
        } catch (error) {
          logError(`ERROR: About page content missing: ${name}`);
          console.error(error);
          throw error;
        }
      }

      logSuccess('About page content is visible: title, story, meet the team, profile image, shop collection button');
    } catch (error) {
      logError('ERROR: About page content is missing');
      console.error(error);
      throw error;
    }
  }

  async clickShopCollection() {
    try {
      const target = this.shopCollectionButton.first();
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeVisible();
      await target.click();
      await expect(this.page).toHaveURL(/\/viewall$/);
      logSuccess('Shop Collection button navigates to /viewall');
    } catch (error) {
      logError('ERROR: Shop Collection button did not navigate to /viewall');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { AboutPage };
