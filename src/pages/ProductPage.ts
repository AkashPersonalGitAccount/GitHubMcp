import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton = '[data-test="add-to-cart-sauce-labs-onesie"]';
  readonly itemQuantity = '[data-test="item-quantity"]';
  readonly itemPrice = '[data-test="inventory-item-price"]';
  readonly finishButton = '[data-test="finish"]';
  readonly backToProductsButton = '[data-test="back-to-products"]';

  constructor(page: Page) {
    this.page = page;
  }

  async addToCart() {
    await this.page.click(this.addToCartButton);
  }

  async verifyItemQuantity(quantity: string) {
    await expect(this.page.locator(this.itemQuantity)).toContainText(quantity);
  }

  async verifyItemPrice(price: string) {
    await expect(this.page.locator(this.itemPrice)).toContainText(price);
  }

  async finish() {
    await this.page.click(this.finishButton);
  }

  async backToProducts() {
    await this.page.click(this.backToProductsButton);
  }
} 