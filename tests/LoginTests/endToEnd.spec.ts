import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductPage } from '../../src/pages/ProductPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { ENV } from '../../environment/env';

test.describe('Sauce Demo E2E Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test('Positive: Complete end-to-end order flow with valid credentials', async ({ page }) => {
    // Login
    await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);

    // Add product to cart and verify
    await productPage.addToCart();
    await cartPage.goToCart();
    await cartPage.verifyCartBadge('1');

    // Checkout process
    await cartPage.checkout();
    await checkoutPage.fillCheckoutInfo(ENV.FIRST_NAME, ENV.LAST_NAME, ENV.POSTAL_CODE);
    await checkoutPage.continue();

    // Verify order details
    await productPage.verifyItemQuantity('1');
    await productPage.verifyItemPrice(ENV.PRODUCT_PRICE);
    
    // Complete order
    await productPage.finish();
    
    // Verify successful order completion
    const thankYouHeader = await page.locator('.complete-header');
    await expect(thankYouHeader).toHaveText('Thank you for your order!');
    
    await productPage.backToProducts();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Negative: Login with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toContain('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Negative: Checkout without items in cart', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/);

    // Go to cart without adding any items
    await cartPage.goToCart();

    // Verify cart is empty
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
    await expect(page.locator('[data-test="shopping_cart_badge"]')).not.toBeVisible();

    // Try to checkout with empty cart
    await cartPage.checkout();

    // Verify error message about empty cart
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Cart is empty');

    // Verify we're still on the cart page
    await expect(page).toHaveURL(/.*cart.html/);

    // Add a product and verify checkout is now possible
    await productPage.backToProducts();
    await productPage.addToCart();
    await cartPage.goToCart();
    await expect(cartItems).toHaveCount(1);
    await cartPage.checkout();
    
    // Verify we can now proceed to checkout information
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('Negative: Checkout with missing required fields', async ({ page }) => {
    // Login and add item to cart
    await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
    await productPage.addToCart();
    await cartPage.goToCart();
    await cartPage.checkout();

    // Try to continue without filling required fields
    await checkoutPage.continue();
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('First Name is required');

    // Fill only first name and try
    await checkoutPage.fillCheckoutInfo(ENV.FIRST_NAME, '', '');
    await checkoutPage.continue();
    await expect(errorMessage).toContainText('Last Name is required');

    // Fill first and last name but no postal code
    await checkoutPage.fillCheckoutInfo(ENV.FIRST_NAME, ENV.LAST_NAME, '');
    await checkoutPage.continue();
    await expect(errorMessage).toContainText('Postal Code is required');
  });

  test('Verify cart badge updates correctly', async ({ page }) => {
    await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
    
    // Initially cart should be empty
    await expect(page.locator('[data-test="shopping_cart_badge"]')).not.toBeVisible();
    
    // Add item and verify badge shows 1
    await productPage.addToCart();
    await cartPage.verifyCartBadge('1');
    
    // Remove item and verify badge disappears
    await page.click('[data-test="remove-sauce-labs-onesie"]');
    await expect(page.locator('[data-test="shopping_cart_badge"]')).not.toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    try {
      // Clean up: If logged in, log out
      const menuButton = page.locator('#react-burger-menu-btn');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.locator('#logout_sidebar_link').click();
      }
    } catch (error) {
      console.log('Cleanup failed:', error);
    }
  });
}); 