import React from "react";
import { useGame } from "@/context/GameContext";

const ManualMovement = () => {
  const { movePlayer } = useGame();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => movePlayer("up")}
        className="w-16 h-16 bg-dark-gray text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        ↑
      </button>
      <button
        onClick={() => movePlayer("left")}
        className="w-16 h-16 bg-dark-gray text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        ←
      </button>
      <button
        onClick={() => movePlayer("down")}
        className="w-16 h-16 bg-dark-gray text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        ↓
      </button>
      <button
        onClick={() => movePlayer("right")}
        className="w-16 h-16 bg-dark-gray text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        →
      </button>
    </div>
  );
};

export default ManualMovement;
