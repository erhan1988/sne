const { expect } = require('@playwright/test');

async function verifyFieldsVisible(fields, { logSuccess, logError, errorMessage } = {}) {
  try {
    for (const { locator, name } of fields) {
      await expect(locator).toBeVisible();
      if (logSuccess) {
        logSuccess(`${name} is visible`);
      }
    }
  } catch (error) {
    if (logError) {
      logError(errorMessage || 'ERROR: UI elements are not visible');
    }
    console.error(error);
    throw error;
  }
}

module.exports = { verifyFieldsVisible };