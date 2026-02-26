
const { expect } = require('@playwright/test');
const { logSuccess, logError } = require('../helpers/logger');
const { verifyFieldsVisible } = require('../helpers/uiValidation');

class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.cartModal = page.locator('div.bg-white.p-8.rounded-2xl.shadow-sm.max-w-md.w-full');
    this.title = this.cartModal.locator('h2.text-2xl.font-bold.text-gray-900.mb-4');
    this.message = this.cartModal.locator('p.text-gray-600.mb-8');
    this.startShoppingButton = this.cartModal.locator('button', { hasText: /start shopping/i });
  }

  async verifyCartIsEmpty() {
    try {
      await expect(this.cartModal).toBeVisible();
      await expect(this.title).toHaveText('Your cart is empty');
      await expect(this.message).toHaveText("Looks like you haven't added any sneakers yet.");
      await expect(this.startShoppingButton).toBeVisible();
      logSuccess('verifyCartIsEmpty: Cart modal and all elements are visible');
    } catch (error) {
      logError('verifyCartIsEmpty: ERROR - Cart modal or elements are not visible');
      throw error;
    }
  }

  async clickStartShoppingAndVerifyRedirect() {
    await this.startShoppingButton.click();
    await this.page.waitForURL('https://sneaker-web-omega.vercel.app/', { timeout: 10000 });
    await expect(this.page).toHaveURL('https://sneaker-web-omega.vercel.app/');
  }

  async addProductAndVerifyCheckout() {
    // Click the first 'Add to cart' button on the page
    const addToCartButton = this.page.locator('button[aria-label="Add to cart"]').first();
    await addToCartButton.click();

    // Wait for redirect to checkout
    await this.page.waitForURL('https://sneaker-web-omega.vercel.app/checkout', { timeout: 10000 });
    await expect(this.page).toHaveURL('https://sneaker-web-omega.vercel.app/checkout');

    // Check for total price section
    await expect(this.page.locator('div.flex.justify-between.text-xl.font-bold.text-gray-900.pt-2.border-t.border-gray-100')).toContainText('Total');
    await expect(this.page.locator('div.flex.justify-between.text-xl.font-bold.text-gray-900.pt-2.border-t.border-gray-100')).toContainText('8,990 МКД');

    // Check for product image
    await expect(this.page.locator('div.w-24.h-24.bg-gray-50.rounded-xl.overflow-hidden.border.border-gray-100.flex-shrink-0 img[alt="Nike Air Max 90"]')).toBeVisible();

    // Check for shipping/payment fields using verifyFieldsVisible
    const fields = [
      { locator: this.page.locator('#name'), name: 'Name field' },
      { locator: this.page.locator('#email'), name: 'Email field' },
      { locator: this.page.locator('#address'), name: 'Address field' },
      { locator: this.page.locator('#city'), name: 'City field' },
      { locator: this.page.locator('#postalCode'), name: 'Postal Code field' },
      { locator: this.page.locator('#cardNumber'), name: 'Card Number field' },
      { locator: this.page.locator('#expiry'), name: 'Expiry field' },
      { locator: this.page.locator('#cvv'), name: 'CVV field' },
    ];
    await verifyFieldsVisible(fields, {
      logSuccess,
      logError,
      errorMessage: 'ERROR: Shipping/payment fields are not visible',
    });

    // Check for Pay button (dynamic price)
    try {
      const payButton = this.page.locator('button[type="submit"]');
      await expect(payButton).toContainText('Pay');
      await expect(payButton).toContainText('МКД');
      logSuccess('Pay button is visible and contains correct text');
    } catch (error) {
      logError('ERROR: Pay button is not visible or does not contain correct text');
      throw error;
    }
  }

    async completeCheckoutAndVerifySuccess() {
    try {
      // Fill checkout fields
      await this.page.locator('#name').fill('erhan');
      await this.page.locator('#email').fill('erhan@yahoo.com');
      await this.page.locator('#address').fill('karadjova bitola 7000');
      await this.page.locator('#city').fill('bitola');
      await this.page.locator('#postalCode').fill('7000');
      await this.page.locator('#cardNumber').fill('4242 4242 4242 4242');
      await this.page.locator('#expiry').fill('12/28');
      await this.page.locator('#cvv').fill('123');

      // Click Pay button
      await this.page.locator('button[type="submit"]').click();

      // Wait for redirect to success page
      await this.page.waitForURL('https://sneaker-web-omega.vercel.app/checkout-success', { timeout: 10000 });
      await expect(this.page).toHaveURL('https://sneaker-web-omega.vercel.app/checkout-success');

      // Verify success popup
      const successPopup = this.page.locator('div.max-w-lg.w-full.text-center');
      await expect(successPopup).toBeVisible();
      await expect(successPopup.locator('h1')).toHaveText('Payment Successful!');
      await expect(successPopup.getByText('Thank you for your purchase. Your order has been confirmed.')).toBeVisible();

      // Verify Continue Shopping button
      const continueBtn = this.page.locator('button', { hasText: /continue shopping/i });
      await expect(continueBtn).toBeVisible();

      // Verify View Order Details button
      const viewOrderBtn = this.page.locator('button', { hasText: /view order details/i });
      await expect(viewOrderBtn).toBeVisible();

      logSuccess('Checkout completed and success popup/buttons verified');
    } catch (error) {
      logError('ERROR: Checkout success popup/buttons not visible or flow failed');
      throw error;
    }
  }
}
  
module.exports = { CartPage };
