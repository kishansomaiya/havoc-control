# jupiter-csg-frontend-redux-playwright-ui-tests

UI Test Automation Framework using Playwright.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Generating tests](#generating-tests)
- [Show report](#show-report)
- [Linting and Formatting](#linting-and-formatting)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](http://nodejs.org) v.18+
- [Docker](https://www.docker.com) v.27+
- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
- macOS 13 Ventura, or macOS 14 Sonoma.
- Debian 11, Debian 12, Ubuntu 20.04 or Ubuntu 22.04, Ubuntu 24.04, on x86-64 and arm64 architecture.
- [PNPM](https://pnpm.io/) v.8+

## Installation

1. Clone the repository:

   ```bash
   git clone https://gitlab.com/jupiterintel/jupiter-csg-frontend-redux.git
   ```

   - navigate to the clonned folder
     ```bash
     cd jupiter-csg-frontend-redux
     ```

2. Install [Docker](https://www.docker.com)

   - If you have a `Homebrew` installed, run the next command:
     ```bash
     brew install --cask docker
     ```
   - check installation by checking the `version`:
     ```bash
     docker --version
     ```

3. Add environment variables to `.env` file:

   - navigate to `/frontend`
   - if the `.env.example` file exists, rename it to `.env`.
     - if not, create the `.env` file;
   - set the `.env` file with the variables
     - Ask your team members to share the environment variables with you.

4. Being in `/frontend` folder, install the `project dependencies` using `npm`:
   ```bash
   npm install
   ```
5. Navigate to `jupiter-csg-frontend-redux/tests/ui/`
6. Install [PNPM](https://pnpm.io/)

   - If you already have `Node.js` installed, you likely have npm installed as well. You can use `npm` to install `pnpm` globally:
     - Open a `terminal` or command prompt.
     - Run the following command:
       ```bash
       npm install -g pnpm
       ```

7. Install the `project dependencies` using `pnpm`:

   ```bash
   pnpm install
   ```

8. Install [Playwright](https://playwright.dev/) and its `browsers`:

   ```bash
   pnpm exec playwright install --with-deps
   ```

9. Install specific browsers(in our case it's `MS Edge`):

   ```bash
   pnpm playwright install msedge
   ```

10. Create `.env` file in the `jupiter-csg-frontend-redux/tests/ui/` folder

- you can use the `.env.example` by copying it (_Note that `.env` file is ignored in `git`_).
- Ask your team members to share the `environment variables` with you and set the file with data
  - `NOTE:` you can fing a test user credentials in [Bitwarden](https://vault.bitwarden.com/#/vault?collectionId=2890992a-5ed9-4803-8857-b12e01418206&itemId=a20ecce0-e4fc-477c-a59c-b1b000c6c67d)

## Running Tests

All tests locates in `tests/ui/tests/` folder.

### Running Tests locally

1.  Start application:
    - navigate to root project folder:
      ```bash
      jupiter-csg-frontend-redux
      ```
    - run command:
      ```bash
      docker compose up
      ```
      OR (it depends on Docker version which is installed on your machine)
      ```bash
      docker-compose up
      ```
2.  Run tests:
    - ### Console:
      ```bash
      pnpm run test
      ```
    - ### CI:
      ```bash
      pnpm run test:ci
      ```
    - ### UI:
      ```bash
      pnpm run test:ui
      ```
    - ### Console in headed mode(This will give you the ability to visually see how Playwright interacts with the website):
      ```bash
      pnpm run test:headed
      ```
      dev:
      ```bash
      pnpm run test:dev:headed
      ```
      staging:
      ```bash
      pnpm run test:stg:headed
      ```

### Running tests on DEV/STG environment:

- ### Running on "DEV" env in Console:

  ```bash
  pnpm run test:dev
  ```

- ### Running on "STG" env in Console:

  ```bash
  pnpm run test:stg
  ```

- ### Running on "DEV" env in UI mode:

  ```bash
  pnpm run test:dev:ui
  ```

- ### Running on "STG" env in UI mode:
  ```bash
  pnpm run test:stg:ui
  ```

## Generating tests

- Run and perform actions in the browser. Playwright will generate the code for the user interactions. See https://playwright.dev/docs/codegen-intro#running-codegen
  local:
  ```bash
  pnpm run test:record
  ```
  dev:
  ```bash
  pnpm run test:dev:record
  ```
  staging:
  ```bash
  pnpm run test:stg:record
  ```

## Show report

The [HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter) shows you a full report of your tests allowing you to filter the report by browsers, passed tests, failed tests, skipped tests and flaky tests. By default, the HTML report is opened automatically if some of the tests failed, otherwise you can open it with the following command.

- Show report:

  ```bash
  pnpm run test:report
  ```

- Report placed at:

  ```bash
  tests/ui/playwright-report
  ```

- Test results (screenshots, videos and traces) are placed at
  ```bash
  tests/ui/test-results
  ```

## Linting and Formatting

- To lint the codebase:

  ```bash
  pnpm run lint
  ```

- To format the codebase:
  ```bash
  pnpm run format
  ```
