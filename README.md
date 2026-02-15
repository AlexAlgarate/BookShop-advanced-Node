# BookShop API

A RESTful API for a book e-commerce platform built with Node.js, TypeScript and Clean Architecture.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Testing**: Jest with mongodb-memory-server
- **Monitoring**: Sentry
- **Email**: Mailtrap
- **Scheduler**: node-cron

## Architecture

The project follows Clean Architecture principles with three distinct layers:

```bash
src/
├── domain/           # Business logic layer
│   ├── entities/     # Core business entities
│   ├── repositories/ # Repository interfaces
│   ├── services/     # Domain services
│   ├── types/        # Type definitions
│   └── use-cases/    # Business use cases
├── infrastructure/  # External services layer
│   ├── database/     # MongoDB connection
│   ├── models/       # Mongoose models
│   ├── monitoring/   # Sentry integration (Sentry)
│   ├── repositories/ # Repository implementations
│   └── services/     # External service implementations (bcrypt, dotenv, mailtrap)
└── ui/               # Interface layer
    ├── controllers/  # Request handlers
    ├── cron/         # Scheduled jobs
    ├── factories/    # Dependency injection factories
    ├── middlewares/  # Express middlewares
    ├── routes/       # API routes
    └── validators/   # Request validation
```

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example` or the required variables:

```env
# Environment (local, staging, production)
NODE_ENV=local

# MongoDB
MONGO_URI=mongodb://localhost:27017/bookshop

# API
API_PORT=3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Sentry (optional)
SENTRY_DSN=

# Mailtrap (optional)
MAILTRAP_API_KEY=
MAILTRAP_INBOX_ID=
```

### Running the Application

```bash
# Development
npm start

# Staging
npm run start:staging

# Production
npm run start:prod
```

### Running Tests

```bash
npm run test:e2e
```

### Linting & Formatting

```bash
# Lint
npm run lint

# Format
npm run format
```

## API Endpoints

### Authentication

| Method | Endpoint                 | Description         | Auth Required |
| ------ | ------------------------ | ------------------- | ------------- |
| POST   | `/authentication/signup` | Register a new user | No            |
| POST   | `/authentication/signin` | Login user          | No            |

### Books

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/books`         | List all books  | No            |
| POST   | `/books`         | Create a book   | Yes           |
| PUT    | `/books/:id`     | Update a book   | Yes           |
| DELETE | `/books/:id`     | Delete a book   | Yes           |
| POST   | `/books/:id/buy` | Purchase a book | Yes           |

### User Books

| Method | Endpoint    | Description                | Auth Required |
| ------ | ----------- | -------------------------- | ------------- |
| GET    | `/me/books` | Get user's purchased books | Yes           |

## Features

- User registration and authentication with JWT
- Full CRUD operations for books
- Book purchase functionality
- Scheduled price reduction suggestions (weekly cron job)
- Error handling with custom domain errors
- Input validation with Zod
- Comprehensive test suite
