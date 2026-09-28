# doublets-game

A NYT-Games style web app for playing the word game Doublets.

[www.doublets.app](https://www.doublets.app)

## **CURRENTLY IN DEVELOPMENT** - Planned features

- Complete backend unit/integration testing
- More logic and component tests for frontend
- Playwright/MSW integration tests for frontend
- More comprehensive error handling

## Overview

The aim of this project is to showcase and expand on the knowledge gained from my placement at UoY IT Services.

The backend uses the AWS JavaScript CDK in order to provide:

- An S3 bucket and CloudFront distribution for hosting the app
- Signup and login capabilities via Cognito
- A statistics API using API Gateway, DynamoDB, and a Lambda proxy function

The frontend is written in React and TypeScript and built using Vite; routing is handled via React Router in `frontend/src/main.tsx`, while API calls are made using TanStack Query. Styling is provided by TailwindCSS.

AWS Deployments are performed through GitHub Actions, with OIDC authentication.
Vitest and React Testing Library are used for unit tests throughout.

## Project structure

### Top level

- `backend`: all AWS infrastructure and functions
- `frontend`: all user-facing React components, routing, query handling and logic
- `scripts`: various scripts used for generating and solving puzzles
- `shared`: types and schemas shared between frontend and backend

### backend/stack

The CloudFormation stack deployed to AWS.

### backend/lambda

- `auto-confirm`: a Lambda function handler for auto-confirming users in AWS Cognito
- `stats-api`: an API Gateway Lambda proxy handler for API responses

### frontend/src

- `components`: React components
- `logic`: non-JSX functions
- `pages`: larger whole-page components served during routing
- `static`: static JSON files used by the game

## Commands

**A `.env` file following the example is needed in `frontend/` for running anything locally.**

To build the frontend and compile the backend (this must be done before running tests):

```shell
npm run build
```

To run the tests:

```shell
npm run test
```

To run linting:

```shell
npm run lint
```

To apply automatic lint fixes:

```shell
npm run lint:fix
```

To run the frontend in development mode:

```shell
npm run dev
```

To do so while using browser `localStorage` for caching:

```shell
npm run dev:cache
```

## Scripts

**All scripts require a `five-letter-words.txt` in the `scripts` directory.**

To generate a file of Doublets puzzles at `frontend\src\static\puzzles.json`:

```shell
npm run generate-puzzles
```

To generate a file of valid words for guess validation at `frontend\src\static\allowed-words.json`:

```shell
npm run generate-words
```

For help solving a puzzle:

```shell
npm run solve-puzzle
```

## Tooling

- Linting is performed through [xo](https://github.com/xojs/xo#readme), an opinionated ESLint wrapper
- Formatting is done by [Prettier](https://prettier.io/) and [sort-package-json](https://github.com/keithamus/sort-package-json#readme)
- [Knip](https://knip.dev/) is used to detect unused code
- [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged#readme) allow for checks to be ran as pre-commit hooks.
