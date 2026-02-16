# SneakerStudio E2E Tests

End-to-end tests for https://sneaker-web-omega.vercel.app/ using Playwright with Page Object Model.

## Requirements

- Node.js (LTS)
- npm

## Install

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

Run only the Header tests:

```bash
npx playwright test -g "Header"
```

## Project structure

- tests/pages: Page Object Model classes
- tests/*.spec.js: Test specs
- tests/helpers: Test helpers (logger)

## Notes

- Screenshots are saved on failure in test-results/.
- Headed mode is enabled in playwright.config.js for visibility.
