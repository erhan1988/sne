const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');

exports.FooterPage = class FooterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.footer = page.locator('footer.bg-gray-900');
    this.brand = this.footer.locator('span.font-bold');
    this.description = this.footer.locator('p.text-gray-400');
    this.socialLinks = this.footer.locator('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"]');
    this.quickLinks = this.footer.locator('h3:text("Quick Links") ~ ul button');
    this.customerCare = this.footer.locator('h3:text("Customer Care") ~ ul button');
    this.contactUsHeader = this.footer.locator('h3:text("Contact Us")');
    this.address = this.footer.locator('svg.lucide-map-pin ~ span');
    this.phone = this.footer.locator('svg.lucide-phone ~ span');
    this.email = this.footer.locator('svg.lucide-mail ~ span');
    this.copyright = this.footer.locator('p.text-gray-500');
  }

  async expectFooterVisible() {
    try {
      await expect(this.footer).toBeVisible();
      console.log('Footer is visible: SUCCESS');
    } catch (error) {
      console.error('Footer is visible: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-visible-error.png', fullPage: true });
      throw error;
    }
  }

  async expectBrand() {
    try {
      await expect(this.brand).toContainText('SNEAKER');
      await expect(this.brand).toContainText('STUDIO');
      console.log('Brand is correct: SUCCESS');
    } catch (error) {
      console.error('Brand is correct: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-brand-error.png', fullPage: true });
      throw error;
    }
  }

  async expectDescription() {
    try {
      await expect(this.description).toContainText('Your premier destination');
      console.log('Description is present: SUCCESS');
    } catch (error) {
      console.error('Description is present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-description-error.png', fullPage: true });
      throw error;
    }
  }

  async expectSocialLinks() {
    try {
      await expect(this.socialLinks.nth(0)).toHaveAttribute('href', /facebook/);
      await expect(this.socialLinks.nth(1)).toHaveAttribute('href', /instagram/);
      await expect(this.socialLinks.nth(2)).toHaveAttribute('href', /twitter/);
      console.log('Social links are present: SUCCESS');
    } catch (error) {
      console.error('Social links are present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-sociallinks-error.png', fullPage: true });
      throw error;
    }
  }

  async expectQuickLinks() {
    try {
      await expect(this.quickLinks.nth(0)).toHaveText(/About Us/i);
      await expect(this.quickLinks.nth(1)).toHaveText(/Contact/i);
      console.log('Quick links are present: SUCCESS');
    } catch (error) {
      console.error('Quick links are present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-quicklinks-error.png', fullPage: true });
      throw error;
    }
  }

  async expectCustomerCare() {
    try {
      await expect(this.customerCare.nth(0)).toHaveText(/Shop Collection/i);
      await expect(this.customerCare.nth(1)).toHaveText(/Privacy Policy/i);
      console.log('Customer care links are present: SUCCESS');
    } catch (error) {
      console.error('Customer care links are present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-customercare-error.png', fullPage: true });
      throw error;
    }
  }

  async expectContactUs() {
    try {
      await expect(this.contactUsHeader).toBeVisible();
      await expect(this.address).toContainText('Sneaker Street');
      await expect(this.phone).toContainText('+389 76 835 635');
      await expect(this.email).toContainText('demirov.erhan1988@gmail.com');
      console.log('Contact Us section is present: SUCCESS');
    } catch (error) {
      console.error('Contact Us section is present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-contactus-error.png', fullPage: true });
      throw error;
    }
  }

  async expectCopyright() {
    try {
      await expect(this.copyright).toContainText('© 2026 Sneaker Studio');
      console.log('Copyright is present: SUCCESS');
    } catch (error) {
      console.error('Copyright is present: ERROR', error);
      await this.page.screenshot({ path: 'test-results/footer-copyright-error.png', fullPage: true });
      throw error;
    }
  }

  async checkPrivacyPolicyLinkAndContent() {
    try {
      // Click Privacy Policy link in Customer Care section
      await this.customerCare.nth(1).click();
      await this.page.waitForURL('https://sneaker-web-omega.vercel.app/privacy');
      await expect(this.page).toHaveURL('https://sneaker-web-omega.vercel.app/privacy');
      // Check for required texts
      await expect(this.page.locator('h1.text-4xl.font-bold.mb-2')).toHaveText('Privacy Policy');
      await expect(this.page.locator('p.text-gray-700.mb-6')).toHaveText('This Privacy Policy describes how we collect, use, and protect your information when you use our website.');
      await expect(this.page.locator('p.text-gray-500.mb-8')).toHaveText('Last updated: 11 February 2026');
      logSuccess('Privacy Policy link and content: SUCCESS');
    } catch (error) {
      logError('Privacy Policy link and content: ERROR');
      await this.page.screenshot({ path: 'test-results/footer-privacy-error.png', fullPage: true });
      throw error;
    }
  }
};
