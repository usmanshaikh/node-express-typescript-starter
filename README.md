## Node Express TypeScript Starter
Node Express TypeScript Starter is a boilerplate for building scalable applications with Node.js and Express. It includes essential packages like Axios, Mongoose, JWT, and testing support using Jest and Supertest. The project is also configured with ESLint and Prettier for consistent code quality.

## Project Structure

```
├── src
│   ├── config          # Configuration for environment variables and app settings
│   ├── controllers     # Request handlers (controllers) that handle business logic
│   ├── middlewares     # Custom Express middlewares for authentication, error handling, etc.
│   ├── models          # Database models and schemas (e.g., Mongoose models for MongoDB)
│   ├── routes          # Route definitions, each file maps to a route
│   ├── services        # Service layer for business logic and reusable functionality
│   ├── utils           # Utility functions and helpers
│   ├── validations     # Request validation schemas using Joi or similar library
│   └── app.ts          # Main Express app configuration
└── server.ts           # Server startup file
```

## Folder Descriptions

- **`config/`**: Contains configuration files for environment variables and application settings.
- **`controllers/`**: Contains the logic for handling HTTP requests and responses.
- **`middlewares/`**: Holds custom middleware for tasks like authentication and error handling.
- **`models/`**: Defines database schemas and models.
- **`routes/`**: Organizes the different routes/endpoints for the API.
- **`services/`**: Contains the service layer where most of the business logic resides.
- **`utils/`**: A collection of helper functions and utilities.
- **`validations/`**: Defines validation schemas for incoming request data using libraries like Joi.

## Scripts

- **`watch`**: 
  ```bash
  npx concurrently -k -p "[{name}]" -n "TypeScript,Node" -c "yellow.bold,cyan.bold,green.bold" "npm run watch-ts" "npm run watch-node"
  ```
  Runs both TypeScript and Node watchers concurrently, allowing for live reload during development.

- **`start`**: 
  ```bash
  npm run build && npm run serve
  ```
  This command first builds the project and then starts the server.

- **`serve`**: 
  ```bash
  node -r dotenv/config build/server.js
  ```
  Runs the compiled server file using Node.js, loading environment variables from the `.env` file.

- **`build`**: 
  ```bash
  npm run clean && npm run build-ts
  ```
  Cleans the previous build artifacts and then compiles TypeScript files into JavaScript.

- **`watch-node`**: 
  ```bash
  nodemon -r dotenv/config build/server.js
  ```
  Uses Nodemon to automatically restart the Node server when changes are detected in the build directory.

- **`clean`**: 
  ```bash
  rimraf ./build
  ```
  Deletes the `build` directory, ensuring a clean slate for new builds.

- **`build-ts`**: 
  ```bash
  tsc
  ```
  Compiles TypeScript files into JavaScript according to the `tsconfig.json` settings.

- **`watch-ts`**: 
  ```bash
  tsc -w
  ```
  Watches for changes in TypeScript files and recompiles them automatically.

- **`check`**: 
  ```bash
  tsc --noEmit
  ```
  Runs TypeScript's type checker without emitting any output files.

- **`eslint`**: 
  ```bash
  eslint . --ext .js,.ts
  ```
  Lints the project files using ESLint, checking both JavaScript and TypeScript files.

- **`upgrade`**: 
  ```bash
  npm update --save-dev && npm update --save
  ```
  Updates all dependencies to the latest versions, including both regular and dev dependencies.

- **`upgrade-latest`**: 
  ```bash
  npx npm-check-updates -u && npm install
  ```
  Uses `npm-check-updates` to update package versions in `package.json` and installs the latest versions.

- **`test`**: 
  ```bash
  jest --forceExit --detectOpenHandles --coverage --verbose
  ```
  Runs the Jest test suite with options to force exit after tests and collect coverage information.