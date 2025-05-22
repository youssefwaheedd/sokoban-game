/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { CellType, Direction } from "@/constants/types/game";
import {
  GameContextType,
  GameState,
  Position,
  Map,
} from "@/constants/interfaces/game";
import { useParams } from "react-router-dom";
import { useMaps } from "@/hooks/useMaps";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { mapId } = useParams<{ mapId: string }>();
  const { maps, loading, error } = useMaps();
  const [currentMap, setCurrentMap] = useState<Map | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    playerPosition: { x: 0, y: 0 },
    moves: 0,
    isComplete: false,
    boxesOnTarget: 0,
    totalTargets: 0,
  });

  useEffect(() => {
    if (maps && mapId) {
      const map = maps.find((m) => m.id === parseInt(mapId));
      if (map) {
        setCurrentMap(map);
        initializeLevel(map);
      }
    }
  }, [maps, mapId]);

  const initializeLevel = (map: Map) => {
    try {
      // Parse the layout string into a 2D array
      const layout = JSON.parse(map.layout);

      if (!layout.grid || !Array.isArray(layout.grid)) {
        throw new Error("Invalid layout format");
      }

      const grid = layout.grid.map((row) =>
        Array.isArray(row) ? row : row.split("")
      );

      // Find player position and count targets
      let playerPosition: Position = { x: 0, y: 0 };
      let totalTargets = 0;

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === "P") {
            playerPosition = { x, y };
          } else if (cell === "T") {
            totalTargets++;
          }
        });
      });

      setGameState({
        grid,
        playerPosition,
        moves: 0,
        isComplete: false,
        boxesOnTarget: 0,
        totalTargets,
      });
    } catch (error) {
      console.error("Error initializing level:", error);
      setGameState({
        grid: [],
        playerPosition: { x: 0, y: 0 },
        moves: 0,
        isComplete: false,
        boxesOnTarget: 0,
        totalTargets: 0,
      });
    }
  };

  const movePlayer = (direction: "up" | "down" | "left" | "right") => {
    setGameState((prevState) => {
      const { grid, playerPosition, moves } = prevState;
      const newPosition = { ...playerPosition };

      // Calculate new position based on direction
      switch (direction) {
        case "up":
          newPosition.y -= 1;
          break;
        case "down":
          newPosition.y += 1;
          break;
        case "left":
          newPosition.x -= 1;
          break;
        case "right":
          newPosition.x += 1;
          break;
      }

      // Check if new position is valid
      if (
        newPosition.x < 0 ||
        newPosition.x >= grid[0].length ||
        newPosition.y < 0 ||
        newPosition.y >= grid.length ||
        grid[newPosition.y][newPosition.x] === "W" ||
        grid[newPosition.y][newPosition.x] === "T" || // Prevent player from moving onto target
        grid[newPosition.y][newPosition.x] === "*" // Prevent player from moving onto box on target
      ) {
        return prevState;
      }

      // Check if there's a box at the new position
      const currentCell = grid[newPosition.y][newPosition.x];
      if (currentCell === "B") {
        const boxNewPosition = {
          x: newPosition.x + (newPosition.x - playerPosition.x),
          y: newPosition.y + (newPosition.y - playerPosition.y),
        };

        // Check if box can be moved
        if (
          boxNewPosition.x < 0 ||
          boxNewPosition.x >= grid[0].length ||
          boxNewPosition.y < 0 ||
          boxNewPosition.y >= grid.length ||
          grid[boxNewPosition.y][boxNewPosition.x] === "W" ||
          grid[boxNewPosition.y][boxNewPosition.x] === "B" ||
          grid[boxNewPosition.y][boxNewPosition.x] === "*"
        ) {
          return prevState;
        }

        // Move box
        const newGrid = grid.map((row) => [...row]);

        // Check if box is moving to a target
        const isBoxOnTarget = grid[boxNewPosition.y][boxNewPosition.x] === "T";
        newGrid[boxNewPosition.y][boxNewPosition.x] = isBoxOnTarget ? "*" : "B";

        // Update player's position
        newGrid[newPosition.y][newPosition.x] = "P";

        // Update player's old position
        newGrid[playerPosition.y][playerPosition.x] = ".";

        // Count boxes on targets
        const boxesOnTarget = newGrid.reduce(
          (count, row) => count + row.filter((cell) => cell === "*").length,
          0
        );

        const isComplete = boxesOnTarget === prevState.totalTargets;

        return {
          ...prevState,
          grid: newGrid,
          playerPosition: newPosition,
          moves: moves + 1,
          boxesOnTarget,
          isComplete,
        };
      }

      // Move player
      const newGrid = grid.map((row) => [...row]);
      newGrid[newPosition.y][newPosition.x] = "P";
      newGrid[playerPosition.y][playerPosition.x] = ".";

      return {
        ...prevState,
        grid: newGrid,
        playerPosition: newPosition,
        moves: moves + 1,
      };
    });
  };

  const resetLevel = () => {
    if (currentMap) {
      initializeLevel(currentMap);
    }
  };

  if (loading) {
    return (
      <div className="flex p-4 w-full justify-center items-center text-center">
        Loading game...
      </div>
    );
  }

  if (error) {
    return <div>Error loading game: {error}</div>;
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        movePlayer,
        resetLevel,
        initializeLevel,
        currentMap,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
