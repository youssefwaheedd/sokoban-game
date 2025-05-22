import { Direction, CellType } from "../types/game";

export interface DecodedUser {
  id: number;
  email: string;
  username: string;
  role: "ANONYMOUS" | "PLAYER" | "ADMIN";
  iat?: number;
  exp?: number;
}

export interface CellProps {
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface Map {
  id: number;
  name: string;
  description: string | null;
  layout: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    username: string;
  };
}

export interface GameState {
  grid: string[][];
  playerPosition: Position;
  moves: number;
  isComplete: boolean;
  boxesOnTarget: number;
  totalTargets: number;
}

export interface GameContextType {
  gameState: GameState;
  movePlayer: (direction: "up" | "down" | "left" | "right") => void;
  resetLevel: () => void;
  initializeLevel: (map: Map) => void;
  currentMap: Map | null;
}
