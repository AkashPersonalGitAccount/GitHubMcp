import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('swagLabsCredentials.json', 'utf-8'));

test.describe('SauceDemo Login', () => {
  for (const { username, password } of credentials) {
    test(`Login attempt for user: ${username}`, async ({ page, browserName }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.maximize(browserName);
      console.log(`Attempting login with username: ${username}, password: ${password}`);
      await loginPage.login(username, password);

      if (username === 'standard_user' && password === 'secret_sauce') {
        await expect(page).toHaveURL(/.*inventory.html/);
      } else {
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        const error = await loginPage.getErrorMessage();
        expect(error).toBeTruthy();
      }
    });
  }
}); 