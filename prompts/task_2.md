# MCP Automation Prompt: SauceDemo Login Test

## Step 1: Create Credentials JSON
Use filesystem MCP server to create a JSON file named `swagLabsCredentials.json` in the root directory with the following content:
[
  { "username": "standard_user", "password": "secret_sauce" },
  { "username": "locked_out_user", "password": "problem_user" },
  { "username": "problem_user", "password": "problem_user" }
]

## Step 2: Automate Login with Playwright
Use Playwright MCP server to do the following:
- Launch the browser
- Go to `https://www.saucedemo.com/`
- Read login credentials from `swagLabsCredentials.json`
- For each username-password pair:
  - Perform login
  - If credentials are valid: assert navigation to `inventory.html`
  - If invalid: assert that user remains on login page and validate the displayed error message

## Step 3: Use Page Object Model (POM)
- Create a `pages` folder in the root directory
- Use POM structure to define separate page classes
- Generate the final script using Playwright MCP in TypeScript
- Save the test script as `tests/login.spec.ts`

## Step 4: Push to GitHub
Use GitHub MCP server to:
- Push the entire project with new changes
- Target the `dev` branch of the `GitHubMcp` repository
