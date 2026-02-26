// 07_footer.spec.js
const { test } = require('@playwright/test');
const { FooterPage } = require('./pages/footer.page');

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all main footer elements', async ({ page }) => {
    const footer = new FooterPage(page);
    await test.step('Footer is visible', async () => {
      await footer.expectFooterVisible();
    });
    await test.step('Brand is correct', async () => {
      await footer.expectBrand();
    });
    await test.step('Description is present', async () => {
      await footer.expectDescription();
    });
    await test.step('Social links are present', async () => {
      await footer.expectSocialLinks();
    });
    await test.step('Quick links are present', async () => {
      await footer.expectQuickLinks();
    });
    await test.step('Customer care links are present', async () => {
      await footer.expectCustomerCare();
    });
    await test.step('Contact Us section is present', async () => {
      await footer.expectContactUs();
    });
    await test.step('Copyright is present', async () => {
      await footer.expectCopyright();
    });

    await test.step('Privacy Policy link redirects and content is correct', async () => {
      await footer.checkPrivacyPolicyLinkAndContent();
    });
  });
});
