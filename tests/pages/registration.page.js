const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { verifyFieldsVisible } = require('../helpers/uiValidation');
const { assertFieldsInvalid } = require('../helpers/formValidation');

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

  async submitValidRegistrationAndVerify(data) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.confirmPasswordInput.fill(data.confirmPassword);

      if (data.acceptTerms) {
        await this.termsCheckbox.check();
      }

      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();

      const requiredFields = [
        { locator: this.fullNameInput, name: 'Full Name input' },
        { locator: this.emailInput, name: 'Email input' },
        { locator: this.passwordInput, name: 'Password input' },
        { locator: this.confirmPasswordInput, name: 'Confirm Password input' },
      ];

      for (const { locator, name } of requiredFields) {
        const isValid = await locator.evaluate((el) => el.checkValidity());
        if (!isValid) {
          throw new Error(`${name} is invalid but should be valid with filled data`);
        }
        logSuccess(`${name} is valid with filled data`);
      }

      if (data.acceptTerms) {
        await expect(this.termsCheckbox).toBeChecked();
        logSuccess('Terms checkbox is checked');
      }

      await expect(this.page).toHaveURL(/\/$/);
      logSuccess(`Registration redirects to home: ${this.page.url()}`);

      const firstName = (data.fullName || '').trim().split(/\s+/)[0];
      const header = this.page.getByRole('banner');
      const userButton = header.getByRole('button').filter({ hasText: new RegExp(firstName, 'i') });

      await expect(userButton.first()).toBeVisible();
      logSuccess('User menu button is visible in header');
    } catch (error) {
      logError('ERROR: Valid registration submission failed');
      console.error(error);
      throw error;
    }
  }

  async submitRegistrationExpectDuplicateEmailError(data) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.confirmPasswordInput.fill(data.confirmPassword);

      if (data.acceptTerms) {
        await this.termsCheckbox.check();
      }

      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();

      const errorMessage = this.page.getByText(
        'This email is already registered. Please use a different email or sign in.'
      );

      await expect(errorMessage.first()).toBeVisible();
      logSuccess('Duplicate email error message is visible');
      await this.page.reload();
      await this.verifyRegistrationPageOpen();
      logSuccess('Registration page refreshed after duplicate email error');
    } catch (error) {
      logError('ERROR: Duplicate email validation failed');
      console.error(error);
      throw error;
    }
  }

  async submitRegistrationExpectInvalidEmailFormat(data) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.confirmPasswordInput.fill(data.confirmPassword);

      if (data.acceptTerms) {
        await this.termsCheckbox.check();
      }

      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();

      const invalidFields = [{ locator: this.emailInput, name: 'Email input' }];
      await assertFieldsInvalid(invalidFields, logSuccess);
    } catch (error) {
      logError('ERROR: Invalid email format validation failed');
      console.error(error);
      throw error;
    }
  }

  async submitRegistrationExpectPasswordMismatch(data) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.confirmPasswordInput.fill(data.confirmPassword);

      if (data.acceptTerms) {
        await this.termsCheckbox.check();
      }

      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();

      const invalidFields = [{ locator: this.confirmPasswordInput, name: 'Confirm Password input' }];
      const isConfirmValid = await this.confirmPasswordInput.evaluate((el) => el.checkValidity());

      if (!isConfirmValid) {
        await assertFieldsInvalid(invalidFields, logSuccess);
      } else {
        const mismatchMessage = this.page.getByText(/passwords? do not match|do not match/i);
        try {
          await expect(mismatchMessage.first()).toBeVisible({ timeout: 5000 });
          logSuccess('Password mismatch message is visible');
        } catch (messageError) {
          throw new Error('Password mismatch was not detected');
        }
      }

      await this.page.reload();
      await expect(this.page).toHaveURL(/\/register$/);
      await this.verifyRegistrationPageOpen();
      logSuccess('Registration page refreshed after password mismatch');
    } catch (error) {
      logError('ERROR: Password mismatch validation failed');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { RegistrationPage };