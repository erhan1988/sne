const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { assertFieldsInvalid } = require('../helpers/formValidation');

class ContactPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.contactLink = this.header.getByRole('link', { name: /contact us/i }).or(this.header.getByRole('button', { name: /contact us/i }));
    this.titleHeading = page.locator('h1.text-4xl.font-bold.text-gray-900.mb-4', { hasText: /get in touch/i,});
    this.contactTile = page.locator('h3.text-2xl.font-bold.text-gray-900.mb-6',{ hasText: /contact information/i });
    this.visitUsHeading = page.locator('h4.font-bold.text-gray-900', {hasText: /visit us/i,});
    this.emailUsHeading = page.locator('h4.font-bold.text-gray-900', { hasText: /email us/i,});
    this.callUsHeading = page.locator('h4.font-bold.text-gray-900', {hasText: /call us/i,});
    this.contactEmails = page.locator('p.text-gray-600.mt-1', { hasText: /demirov\.erhan1988@gmail\.com/i,});
    this.contactAddress = page.locator('p.text-gray-600.mt-1', { hasText: /bitola 7000, macedonia/i,});
    this.contactPhone = page.locator('p.text-gray-600.mt-1', { hasText: /\+389 76 835 635/i,});
    this.visitIcon = page.locator('svg.lucide-map-pin[aria-hidden="true"]').first();
    this.mailIcon = page.locator('svg.lucide-mail[aria-hidden="true"]').first();
    this.phoneIcon = page.locator('svg.lucide-phone[aria-hidden="true"]').first();
    this.fullNameInput = page.locator('#input-fullname');
    this.emailInput = page.locator('#input-email');
    this.subjectInput = page.locator('#input-subject');
    this.messageTextarea = page.locator('#input-message');
    this.sendMessageButton = page.locator('#btn-send-message');
    this.messageSentTitle = page.locator('h3.text-2xl.font-bold.text-gray-900.mb-2', {
      hasText: /message sent/i,
    });
    this.sendAnotherButton = page.locator('#btn-send-another');

  }

  async goto() {
    await this.page.goto('/contact');
    logSuccess(`Navigated to ${this.page.url()}`);
  }

  async correctUrl() {
    try {
      await expect(this.page).toHaveURL(/\/contact$/);
      logSuccess(`URL is ${this.page.url()}`);
    } catch (error) {
      logError('ERROR: URL is not /contact');
      console.error(error);
      throw error;
    }
  }

  async checkTitle() {
    try {
      await expect(this.titleHeading).toBeVisible();
      logSuccess('Get in Touch Title is visible');
    } catch (error) {
      logError('ERROR: Get in Touch Title is not visible');
      console.error(error);
      throw error;
    }
  }

  async checkContactInfoSection() {
    try {
      await expect(this.contactTile).toBeVisible();
      logSuccess('Contact Information Title is visible');

      const checks = [
        { locator: this.visitUsHeading, name: 'Visit Us Title' },
        { locator: this.visitIcon, name: 'Visit Us icon' },
        { locator: this.emailUsHeading, name: 'Email Us Title' },
        { locator: this.mailIcon, name: 'Mail icon' },
        { locator: this.phoneIcon, name: 'Phone icon' },
        { locator: this.callUsHeading, name: 'Call Us Title' },
      ];

      for (const { locator, name } of checks) {
        await expect(locator).toBeVisible();
        logSuccess(`${name} is visible`);
      }

      await expect(this.contactEmails).toBeVisible();
      logSuccess('Email Us title is visible and demirov.erhan1988@gmail.com is present');

      await expect(this.contactAddress).toBeVisible();
      logSuccess('Visit Us title is visible and Bitola 7000, Macedonia is present');

      await expect(this.contactPhone).toBeVisible();
      logSuccess('Call Us title is visible and +389 76 835 635 is present');
    } catch (error) {
      logError('ERROR: Contact Information section Title or icons are not visible');
      console.error(error);
      throw error;
    }
  }

  async checkContactFormUiElements() {
    try {
      const fields = [
        { locator: this.fullNameInput, name: 'Full Name input' },
        { locator: this.emailInput, name: 'Email input' },
        { locator: this.subjectInput, name: 'Subject input' },
        { locator: this.messageTextarea, name: 'Message textarea' },
        { locator: this.sendMessageButton, name: 'Send Message button' },
      ];

      for (const { locator, name } of fields) {
        await expect(locator).toBeVisible();
        logSuccess(`${name} is visible`);
      }
    } catch (error) {
      logError('ERROR: Contact form UI elements are not visible');
      console.error(error);
      throw error;
    }
  }

  async submitFormAndValidate({ email } = {}) {
    try {
      if (email) {
        await this.emailInput.fill(email);
      }

      await this.sendMessageButton.click();

      const requiredFields = [
        { locator: this.fullNameInput, name: 'Full Name input' },
        { locator: this.emailInput, name: 'Email input' },
        { locator: this.subjectInput, name: 'Subject input' },
        { locator: this.messageTextarea, name: 'Message textarea' },
      ];

      if (email) {
        const isEmailValid = await this.emailInput.evaluate((el) => el.checkValidity());
        if (!isEmailValid) {
          throw new Error('Email input is invalid but should be valid when filled');
        }
        logSuccess('Email input is valid when filled');

        const invalidFields = requiredFields.filter(
          (field) => field.name !== 'Email input'
        );
        await assertFieldsInvalid(invalidFields, logSuccess);
      } else {
        await assertFieldsInvalid(requiredFields, logSuccess);
      }
    } catch (error) {
      logError('ERROR: Form submit did not trigger validation');
      console.error(error);
      throw error;
    }
  }

  async submitInvalidFormField(data, { invalidField = 'email' } = {}) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.subjectInput.fill(data.subject);
      await this.messageTextarea.fill(data.message);

      await this.sendMessageButton.click();

      const invalidMap = {
        email: {
          locator: this.emailInput,
          name: 'Email input',
          message: 'Email input is invalid with bad format',
          error: 'Email input is valid but should be invalid with bad format',
        },
        subject: {
          locator: this.subjectInput,
          name: 'Subject input',
          message: 'Subject input is invalid when empty',
          error: 'Subject input is valid but should be invalid when empty',
        },
        message: {
          locator: this.messageTextarea,
          name: 'Message textarea',
          message: 'Message textarea is invalid when empty',
          error: 'Message textarea is valid but should be invalid when empty',
        },
      };

      const invalidTarget = invalidMap[invalidField];
      if (!invalidTarget) {
        throw new Error(`Invalid field type: ${invalidField}`);
      }

      const invalidFieldValid = await invalidTarget.locator.evaluate((el) => el.checkValidity());
      if (invalidFieldValid) {
        throw new Error(invalidTarget.error);
      }
      logSuccess(invalidTarget.message);

      const otherFields = [
        { locator: this.fullNameInput, name: 'Full Name input' },
        { locator: this.emailInput, name: 'Email input' },
        { locator: this.subjectInput, name: 'Subject input' },
        { locator: this.messageTextarea, name: 'Message textarea' },
      ].filter((field) => field.name !== invalidTarget.name);

      for (const { locator, name } of otherFields) {
        const isValid = await locator.evaluate((el) => el.checkValidity());
        if (!isValid) {
          throw new Error(`${name} is invalid but should be valid when filled`);
        }
        logSuccess(`${name} is valid when filled`);
      }
    } catch (error) {
      logError('ERROR: Invalid form validation failed');
      console.error(error);
      throw error;
    }
  }

  async submitValidFormAndVerifySuccess(data) {
    try {
      await this.fullNameInput.fill(data.fullName);
      await this.emailInput.fill(data.email);
      await this.subjectInput.fill(data.subject);
      await this.messageTextarea.fill(data.message);

      await this.sendMessageButton.click();

      await expect(this.messageSentTitle).toBeVisible();
      logSuccess('Message Sent title is visible');

      await expect(this.sendAnotherButton).toBeVisible();
      logSuccess('Send Another Message button is visible');
    } catch (error) {
      logError('ERROR: Successful submission message is not visible');
      console.error(error);
      throw error;
    }
  }
}

module.exports = { ContactPage };
