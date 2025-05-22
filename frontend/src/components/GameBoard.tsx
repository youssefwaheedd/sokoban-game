import React, { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import Cell from "@/components/Cell";
import GameControls from "@/components/GameControls";
import ManualMovement from "./ManualMovement";
import { useNavigate } from "react-router-dom";

interface GameBoardProps {
  onGameComplete: (steps: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onGameComplete }) => {
  const { gameState, movePlayer } = useGame();
  const { grid, isComplete, moves } = gameState;
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer("up");
          break;
        case "ArrowDown":
          movePlayer("down");
          break;
        case "ArrowLeft":
          movePlayer("left");
          break;
        case "ArrowRight":
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePlayer]);

  useEffect(() => {
    if (isComplete) {
      onGameComplete(moves);
    }
  }, [isComplete, moves, onGameComplete]);

  if (!grid || grid.length === 0) {
    return (
      <div className="flex w-full justify-center tex-center items-center">
        Loading game board...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <GameControls />

      <div className="relative">
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-70 rounded-lg">
            <div className="bg-dark-purple border-4 border-light-purple p-6 rounded-lg text-center">
              <h2 className="text-2xl text-light-purple font-bold mb-4">
                Level Complete!
              </h2>
              <p className="text-white mb-4">
                Great job! You've completed this level.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-primary-purple text-white rounded hover:bg-purple-700 transition-colors"
              >
                Browse More Levels
              </button>
            </div>
          </div>
        )}

        <div className="grid-parent relative border-4 border-dark-gray rounded-lg overflow-hidden shadow-2xl">
          <div
            className="game-grid"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${grid.length}, 48px)`,
              gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 48px)`,
              gap: "0px",
            }}
          >
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                {Array.isArray(row) ? (
                  row.map((cell, x) => (
                    <Cell key={`${x}-${y}`} type={cell} position={{ x, y }} />
                  ))
                ) : (
                  <div>Invalid row data</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
        <ManualMovement />
      </div>
    </div>
  );
};

export default GameBoard;
