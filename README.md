# BookShop API

A RESTful API for a book e-commerce platform built with Node.js, TypeScript and Clean Architecture.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Package Manager**: pnpm
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Dependency Injection**: Custom DI Container
- **Validation**: Zod
- **Testing**: Jest with mongodb-memory-server
- **Monitoring**: Sentry
- **Email**: Mailtrap
- **Scheduler**: node-cron

## Architecture

The project follows Clean Architecture principles with three distinct layers:

```bash
src/
├── di/                  # Dependency injection container
├── domain/              # Business logic layer
│   ├── entities/        # Core business entities
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Domain services
│   ├── types/           # Type definitions
│   └── use-cases/       # Business use cases
├── infrastructure/      # External services layer
│   ├── database/        # MongoDB connection
│   ├── models/          # Mongoose models
│   ├── monitoring/       # Sentry integration
│   ├── repositories/    # Repository implementations
│   └── services/        # External service implementations (bcrypt, dotenv, mailtrap)
└── ui/                  # Interface layer
    ├── controllers/     # Request handlers
    ├── cron/           # Scheduled jobs
    ├── factories/       # Dependency injection factories
    ├── middlewares/     # Express middlewares
    ├── routes/          # API routes
    └── validators/      # Request validation
```

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB (local or Atlas)
- pnpm

### Installation

```bash
pnpm install
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
JWT_EXPIRES_IN=15m

# Sentry (optional)
SENTRY_DSN=

# Mailtrap (optional)
MAILTRAP_API_KEY=
MAILTRAP_INBOX_ID=
```

### Running the Application

```bash
# Development
pnpm start

# Staging
pnpm start:staging

# Production
pnpm start:prod
```

### Running Tests

```bash
pnpm test:e2e
```

### Linting & Formatting

```bash
# Lint
pnpm lint

# Format
pnpm format
```

## Security Features

- JWT authentication with algorithm validation (`HS256`)
- Bcrypt password hashing (14 rounds in production)
- Rate limiting on authentication endpoints (5 requests/15 min)
- Password strength validation (min 8 chars, uppercase, lowercase, numbers)
- Input validation with Zod
- Error handling with custom domain errors

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
- Dependency injection container
- Input validation with Zod
- Comprehensive test suite
