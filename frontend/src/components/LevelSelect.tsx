import React from "react";
import { useGame } from "@/context/GameContext";
import { useMaps } from "@/hooks/useMaps";

export const LevelSelect: React.FC = () => {
  const { gameState, initializeLevel } = useGame();
  const { maps, loading, error } = useMaps();
  const { level } = gameState;

  if (loading) {
    return (
      <div className="bg-dark-purple p-6 rounded-lg border-4 border-light-purple">
        <h2 className="text-2xl text-light-purple font-bold mb-4 text-center">
          Loading Maps...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-purple p-6 rounded-lg border-4 border-light-purple">
        <h2 className="text-2xl text-light-purple font-bold mb-4 text-center">
          Error Loading Maps
        </h2>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-purple p-6 rounded-lg border-4 border-light-purple">
      <h2 className="text-2xl text-light-purple font-bold mb-4 text-center">
        Select Map
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maps.map((map, index) => (
          <button
            key={map.id}
            onClick={() => initializeLevel(index)}
            className={`p-4 rounded-lg transition-colors text-left ${
              level === index
                ? "bg-primary-purple text-white"
                : "bg-light-purple text-dark-purple hover:bg-primary-purple hover:text-white"
            }`}
          >
            <h3 className="font-bold">{map.name}</h3>
            <p className="text-sm mt-1">{map.description}</p>
            <p className="text-xs mt-2">Created by: {map.createdBy.username}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
