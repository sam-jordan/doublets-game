# doublets-game

A NYT-Games style web app for playing the word game Doublets.

## **CURRENTLY IN DEVELOPMENT** - Planned features

- Complete backend unit/integration testing
- More logic and component tests for frontend
- Playwright/MSW integration tests for frontend
- More comprehensive error handling
- Fixes/improvements for scripts

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