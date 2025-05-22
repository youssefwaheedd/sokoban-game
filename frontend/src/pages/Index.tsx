import React, { useState } from "react";
import GameBoard from "@/components/GameBoard";
import { GameProvider } from "@/context/GameContext";
import { LevelSelect } from "@/components/LevelSelect";

const Index = () => {
  const [showLevelSelect, setShowLevelSelect] = useState(true);

  return (
    <div className="min-h-screen bg-dark-purple flex flex-col items-center justify-center p-4">
      <div className="pixel-container max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-light-purple pixel-text">
          Sokoban Game
        </h1>
        <GameProvider>
          {showLevelSelect ? <LevelSelect /> : <GameBoard />}
          {showLevelSelect && (
            <button
              onClick={() => setShowLevelSelect(!showLevelSelect)}
              className="mt-5 w-full px-4 py-2 bg-primary-purple text-white rounded hover:bg-purple-700 transition-colors rounded-lg"
            >
              Start Game
            </button>
          )}
        </GameProvider>
      </div>
    </div>
  );
};

export default Index;
