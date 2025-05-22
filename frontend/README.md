# Sokoban Game Frontend

The frontend of the Sokoban game is built with React, TypeScript, and Tailwind CSS, providing a modern and responsive user interface.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── public/            # Public static files
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8080

## Development Guidelines

### Component Structure

- Use functional components with TypeScript
- Implement proper prop typing
- Follow the atomic design pattern
- Use Tailwind CSS for styling
- Implement responsive design
