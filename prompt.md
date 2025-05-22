# My Sokoban Game Development Journey with AI

This is a collection of prompts I used while building the frontend of my Sokoban game with ChatGPT. The backend was all me though!

## Initial Setup & Project Structure

First, I needed to set up the project and figure out what tech stack to use. Here's what I asked:

```
Hey! I want to build a Sokoban game with React and TypeScript. Can you help me set up the project structure and recommend a modern tech stack? I want something that's easy to work with but also looks professional.
```

The AI suggested using Vite (which is super fast btw), Tailwind CSS for styling, and shadcn/ui for components.

## Game Board Implementation

This was tricky! I needed help with the core game logic:

```
I'm trying to implement the game board for Sokoban. I need a way to represent the board state where:
- 'W' represents walls
- 'P' is the player
- 'B' are boxes
- 'T' are target spots
- '*' is box on target
- ' ' is empty space

Can you help me create a React component that renders this and handles the basic movement?
```

The AI came up with a nice grid-based solution using CSS Grid.

## Player Movement & Collision Detection

This part was a bit of a headache:

```
The player movement is kinda buggy. Sometimes the player can walk through walls or push multiple boxes. Can you help me fix the collision detection and box pushing logic?
```

After some back and forth, we got the movement working smoothly. The AI suggested using a state machine approach which made the code much cleaner.

## Level Editor

This was a fun feature to add:

```
I want to add a map editor where users can create their own levels. They should be able to:
- Place/remove walls, boxes, and targets
- Save the map as a string
- Test the map they created
- Share it with others

Any ideas on how to implement this?
```

The AI helped me create a template fro the admin. It's not perfect, but it works!

## UI/UX Design

I'm not a designer, so I needed help with the UI:

```
The game looks kinda basic right now. Can you suggest a modern, clean design with:
- A nice color scheme
- Smooth animations
- Responsive layout
- Clear game controls
- Level selection screen
- Score display
```

## Game State Management

This was getting messy:

```
My game state is all over the place! I need help organizing:
- Current map
- Player position
- Box positions
- Move counter
- Timer
- Level completion status


## Map Selection & Progress

```

I want to add a level selection screen that:

- Shows all available levels
- Displays completion status
- Shows leaderboard for each map
- Supports both mouse and keyboard navigation

```

The AI helped me create a responsive grid of level cards with completion indicators and score displays. It even added some nice hover effects!


_Note: The backend was built from scratch by me, no AI help there! I wanted to challenge myself and learn more about Node.js and Express. The frontend was where I needed the most help, especially with the game logic and UI design._
```
