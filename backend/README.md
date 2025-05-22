# Sokoban Game Backend

The backend server for the Sokoban game, built with Node.js, Express, and Prisma, providing game state management, user authentication, and real-time multiplayer functionality.

## Tech Stack

- Node.js
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT Authentication
- TypeScript

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── prisma/            # Database schema and migrations
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

# Run Prisma migrations

npx prisma migrate dev

````

3. Create a `.env` file in the root directory and copy from .env.example:


4. Start the development server:

```bash
npm run dev
````

The server will be available at http://localhost:3000
