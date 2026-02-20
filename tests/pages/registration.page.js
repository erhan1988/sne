const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { verifyFieldsVisible } = require('../helpers/uiValidation');

class RegistrationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.titleHeading = page.locator('h2.text-3xl.font-bold.text-gray-900', { hasText: /create account/i });
    this.fullNameInput = page.locator('#name');
    this.emailInput = page.locator('#reg-email');
    this.passwordInput = page.locator('#reg-password');
    this.confirmPasswordInput = page.locator('#confirm-password');
    this.termsCheckbox = page.locator('#terms');
    this.submitButton = page.getByRole('button', { name: /^create account$/i });
    this.signInButton = page.getByRole('button', { name: /^sign in$/i });
  }

  async gotgoRegistration() {
    await this.page.goto('/register');
    logSuccess(`Navigated to ${this.page.url()}`);
  }

  async verifyRegistrationPageOpen() {
    try {
      await expect(this.page).toHaveURL(/\/register$/);
      logSuccess(`Registration page opened: ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: Registration page did not open');
      console.error(error);
      throw error;
    }
  }

  async verifyRegistrationPageUiElements() {
    const fields = [
      { locator: this.titleHeading, name: 'Create Account title' },
      { locator: this.fullNameInput, name: 'Full Name input' },
      { locator: this.emailInput, name: 'Email input' },
      { locator: this.passwordInput, name: 'Password input' },
      { locator: this.confirmPasswordInput, name: 'Confirm Password input' },
      { locator: this.termsCheckbox, name: 'Terms checkbox' },
      { locator: this.submitButton, name: 'Create Account submit button' },
      { locator: this.signInButton, name: 'Sign in link button' },
    ];

    await verifyFieldsVisible(fields, {
      logSuccess,
      logError,
      errorMessage: 'ERROR: Registration page UI elements are not visible',
    });
  }
}

module.exports = { RegistrationPage };