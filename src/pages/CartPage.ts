import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink = '[data-test="shopping-cart-link"]';
  readonly cartBadge = '[data-test="shopping-cart-badge"]';
  readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goToCart() {
    await this.page.click(this.cartLink);
  }

  async verifyCartBadge(count: string) {
    await expect(this.page.locator(this.cartBadge)).toContainText(count);
  }

  async checkout() {
    await this.page.click(this.checkoutButton);
  }
} 