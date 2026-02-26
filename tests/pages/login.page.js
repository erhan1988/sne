
const { assertFieldsInvalid } = require('../helpers/formValidation');
const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { verifyFieldsVisible } = require('../helpers/uiValidation');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: /^sign in$/i });
    this.registerNowButton = page.locator('button.font-medium.text-blue-600', { hasText: /register now/i });
  }

  async gotoLogin() {
    await this.page.goto('/login');
    logSuccess(`Navigated to ${this.page.url()}`);
  }

  async verifyLoginPageOpen() {
    try {
      await expect(this.page).toHaveURL(/\/login$/);
      logSuccess(`Login page opened: ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: Login page did not open');
      await this.page.screenshot({ path: 'test-results/login-pageopen-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }

  async verifyLoginPageUiElements() {
    const fields = [
      { locator: this.emailInput, name: 'Email input' },
      { locator: this.passwordInput, name: 'Password input' },
      { locator: this.submitButton, name: 'Sign in button' },
      { locator: this.registerNowButton, name: 'Register now button' },
    ];
    await verifyFieldsVisible(fields, {
      logSuccess,
      logError,
      errorMessage: 'ERROR: Login page UI elements are not visible',
    });
  }

  async loginExpectError(email, password, errorRegex, successLog, errorLog) {
    try {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
      const errorMessage = this.page.getByText(errorRegex);
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      logSuccess(successLog);
      // Reload the page for a clean state
      await this.page.reload();
    } catch (error) {
      logError(errorLog);
      await this.page.screenshot({ path: 'test-results/login-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }

  async loginWithInvalidEmail(email, password) {
    return this.loginExpectError(
      email,
      password,
      /invalid email|email is not valid|incorrect email|user not found/i,
      'Invalid email error message is visible',
      'ERROR: Login with invalid email did not show expected error'
    );
  }

  async loginWithWrongPassword(email, password) {
    return this.loginExpectError(
      email,
      password,
      /invalid email|email is not valid|incorrect email|user not found/i,
      'Invalid email error message is visible',
      'ERROR: Login with invalid email did not show expected error'
    );
  }

    async loginWithPartialFields({ email = '', password = '' }) {
    try {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
      // Check which fields are empty and should be invalid
      const invalidFields = [];
      if (!email) invalidFields.push({ locator: this.emailInput, name: 'Email input' });
      if (!password) invalidFields.push({ locator: this.passwordInput, name: 'Password input' });
      if (invalidFields.length > 0) {
        await assertFieldsInvalid(invalidFields, logSuccess);
      }
    } catch (error) {
      logError('ERROR: Login with partial fields did not show expected validation');
      await this.page.screenshot({ path: 'test-results/login-partialfields-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }
  async loginWithValidCredentials(email, password) {
    try {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
      // Wait for user menu button or dashboard element as a sign of successful login
      const userMenuButton = this.page.locator('button.flex.items-center.gap-2');
      await expect(userMenuButton.first()).toBeVisible({ timeout: 10000 });
      logSuccess('Successfully logged in and user menu is visible');
    } catch (error) {
      logError('ERROR: Login with valid credentials failed');
      await this.page.screenshot({ path: 'test-results/login-valid-error.png', fullPage: true });
      console.error(error);
      throw error;
    }
  }
}

module.exports = { LoginPage };
