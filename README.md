# Sokoban Game

A modern implementation of the classic Sokoban puzzle game with a beautiful UI and multiplayer features.

## Project Overview

This project is a full-stack implementation of the Sokoban game, featuring:

- Modern, responsive UI built with React and Tailwind CSS
- Real-time multiplayer functionality
- Level editor and custom level sharing
- User authentication and progress tracking
- Leaderboards

## Project Structure

```
sokoban-game/
├── frontend/           # React + TypeScript frontend application
├── backend/           # Node.js + Express backend server
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sokoban-game.git
cd sokoban-game
```

2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm start

# Start frontend server (from frontend directory)
npm run dev
```

The application will be available at:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
