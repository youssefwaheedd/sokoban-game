import React from "react";
import { useGame } from "@/context/GameContext";
import { RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface Map {
  id: number;
  name: string;
}

const GameControls = () => {
  const { gameState, resetLevel } = useGame();
  const { moves, totalTargets, boxesOnTarget } = gameState;
  const { mapId } = useParams();
  const [mapName, setMapName] = useState<string>("");

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/maps/${mapId}`, {
          credentials: "include",
        });
        const map = await response.json();
        setMapName(map.name);
      } catch (error) {
        console.error("Failed to fetch map:", error);
      }
    };

    if (mapId) {
      fetchMap();
    }
  }, [mapId]);

  return (
    <div className="w-full mb-6 bg-dark-purple border-2 border-light-purple rounded-lg p-4 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
          <h2 className="text-xl font-bold text-light-purple">{mapName}</h2>
          <div className="flex mt-2">
            <div className="bg-dark-gray rounded-l-md px-3 py-1">Moves</div>
            <div className="bg-gray-700 rounded-r-md px-3 py-1 font-mono">
              {moves}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-target-green mr-2"></div>
            <span className="text-light-purple">
              {boxesOnTarget}/{totalTargets}
            </span>
          </div>
          <button
            onClick={resetLevel}
            className="flex items-center gap-2 mt-2 px-4 py-2 bg-dark-gray hover:bg-gray-700 rounded-md transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
