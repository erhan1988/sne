const { test } = require('@playwright/test');
const { HeaderPage } = require('./pages/header.page');
const { ContactPage } = require('./pages/contact.page');
const { logInfo, setStepPrefix, clearStepPrefix } = require('./helpers/logger');
const { test_email, invalid_contact_form, missing_subject_form, missing_message_form, valid_contact_form } = require('./helpers/testData');

test.describe('Contact Us', () => {
  test('opens Contact Us and verifies content', async ({ page }) => {
    const contact = new ContactPage(page);
    let stepNum = 0;

    const runStep = async (message, fn) => {
      stepNum += 1;
      const prefix = `${stepNum}.`;
      logInfo(`${prefix} ${message}`);
      setStepPrefix(prefix);
      try {
        await fn();
      } finally {
        clearStepPrefix();
      }
    };

    await test.step('Go to Contact Us page', async () => {
      await runStep('Go to Contact Us page', async () => {
        await contact.goto();
      });
    });

    await test.step('Verify Contact Us URL and Title', async () => {
      await runStep('Verify Contact Us URL and Title', async () => {
        await contact.correctUrl();
        await contact.checkTitle();
      });
    });

    await test.step('Verify Contact Information section', async () => {
      await runStep('Verify Contact Information section', async () => {
        await contact.checkContactInfoSection();
      });
    });

    await test.step('Verify Contact Form UI Elements', async () => {
      await runStep('Verify Contact Form UI Elements', async () => {
        await contact.checkContactFormUiElements();
      });
    });

    await test.step('Submit form with empty fields', async () => {
      await runStep('Submit form with empty fields', async () => {
        await contact.submitFormAndValidate();
      });
    });

    await test.step('Submit form with only Email filled', async () => {
      await runStep('Submit form with only Email filled', async () => {
        await contact.submitFormAndValidate({ email: test_email });
      });
    });

    await test.step('Submit form with invalid Email format', async () => {
      await runStep('Submit form with invalid Email format', async () => {
        await contact.submitInvalidFormField(invalid_contact_form);
      });
    });

    await test.step('Submit form with missing Subject', async () => {
      await runStep('Submit form with missing Subject', async () => {
        await contact.submitInvalidFormField(missing_subject_form, {
          invalidField: 'subject',
        });
      });
    });

    await test.step('Submit form with missing Message', async () => {
      await runStep('Submit form with missing Message', async () => {
        await contact.submitInvalidFormField(missing_message_form, {
          invalidField: 'message',
        });
      });
    });

    await test.step('Submit form with valid data', async () => {
      await runStep('Submit form with valid data', async () => {
        await contact.submitValidFormAndVerifySuccess(valid_contact_form);
      });
    });
  });
});
