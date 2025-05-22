import React from "react";

const Player = () => {
  return (
    <div className="w-full h-full bg-light-gray flex items-center justify-center rounded-md">
      <div className="w-9 h-9 bg-gradient-to-br from-primary-purple to-purple-800 rounded-full border-2 border-light-purple flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform relative">
        {/* Face */}
        <div className="w-6 h-6 bg-white rounded-full relative">
          {/* Eyes */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-white rounded-full opacity-50"></div>
          </div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-white rounded-full opacity-50"></div>
          </div>
          {/* Blush */}
          <div className="absolute top-2 -left-1 w-1.5 h-1 bg-pink-300 rounded-full opacity-50"></div>
          <div className="absolute top-2 -right-1 w-1.5 h-1 bg-pink-300 rounded-full opacity-50"></div>
          {/* Smile */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 border-b-2 border-black rounded-full"></div>
        </div>
        {/* Body */}
        <div className="absolute -bottom-1 w-6 h-3 bg-gradient-to-b from-primary-purple to-purple-900 rounded-b-full"></div>
        {/* Arms */}
        <div className="absolute -left-1 top-1/2 w-2 h-4 bg-gradient-to-r from-primary-purple to-purple-900 rounded-l-full transform -rotate-12"></div>
        <div className="absolute -right-1 top-1/2 w-2 h-4 bg-gradient-to-l from-primary-purple to-purple-900 rounded-r-full transform rotate-12"></div>
        {/* Legs */}
        <div className="absolute -bottom-2 left-1 w-2 h-3 bg-gradient-to-b from-primary-purple to-purple-900 rounded-b-full transform -rotate-12"></div>
        <div className="absolute -bottom-2 right-1 w-2 h-3 bg-gradient-to-b from-primary-purple to-purple-900 rounded-b-full transform rotate-12"></div>
        {/* Hat */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary-purple rounded-t-full"></div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-purple rounded-full"></div>
      </div>
    </div>
  );
};

export default Player;
