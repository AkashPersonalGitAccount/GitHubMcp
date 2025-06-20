# MCP Automation Prompt: SauceDemo Login Test (Instructions Only)

## Step 1: Create Credentials JSON
- Create a JSON file named `swagLabsCredentials.json` in the root directory with the required username and password pairs for SauceDemo.

## Step 2: Page Object Model (POM) Setup
- Create a `pages` folder in the root directory.
- Implement a `LoginPage` class in this folder to encapsulate all login page interactions (such as navigation, login, error message retrieval, and maximizing the browser window for all browsers).

## Step 3: Playwright Test Script
- Create a test file in the `tests` folder (e.g., `login.spec.ts`).
- The test should:
  - Read credentials from `swagLabsCredentials.json`.
  - For each credential pair, perform a login attempt.
  - Print the credentials being used for each attempt.
  - Maximize the browser window for all browsers before performing login.
  - Assert successful navigation for valid credentials and check for error messages for invalid credentials.

## Step 4: Push to GitHub
- Commit all new and changed files.
- Push the changes to the `dev` branch of the `GitHubMcp` repository.

---

**Summary:**
- Use Playwright with TypeScript and the Page Object Model.
- Automate login tests for SauceDemo using credentials from a JSON file.
- Validate both successful and failed login scenarios.
- Push all changes to the `dev` branch on GitHub. 