const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('./logger');

const defaultTriggerSelector =
  'button.inline-flex.items-center.justify-center.bg-blue-600.text-white.hover\\:bg-blue-700';
const cancelSelector =
  'button.flex-1.px-4.py-3.rounded-lg.font-medium.text-gray-700.bg-gray-100.hover\\:bg-gray-200.transition-colors';
const goToLoginSelector =
  'button.flex-1.px-4.py-3.rounded-lg.font-medium.text-white.bg-blue-600.hover\\:bg-blue-700.transition-colors';

async function verifyLoginRequiredPopupCancel(page, triggerLocator) {
  const trigger = (triggerLocator ?? page.locator(defaultTriggerSelector)).first();
  const heading = page.getByRole('heading', { name: /login required/i });
  const cancelButton = page.locator(cancelSelector);
  const goToLoginButton = page.locator(goToLoginSelector);

  try {
    logSuccess('Clicking Add to Cart as guest user');
    await trigger.click();
    logSuccess('Add to Cart clicked, waiting for Login Required popup');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/login required/i);
    await expect(cancelButton).toBeVisible();
    await expect(goToLoginButton).toBeVisible();
    logSuccess('Login Required popup is visible');
    logSuccess('Login Required title is visible');
    logSuccess('Cancel button is visible');
    logSuccess('Go to Login button is visible');

    await cancelButton.click();
    await expect(heading).toBeHidden();
    logSuccess('Clicked Cancel');
    logSuccess('Login Required popup is closed');
  } catch (error) {
    logError('ERROR: Login Required popup did not behave as expected');
    console.error(error);
    throw error;
  }
}

module.exports = {
  verifyLoginRequiredPopupCancel,
};
