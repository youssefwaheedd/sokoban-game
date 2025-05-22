import React from "react";

const Box = () => {
  return (
    <div className="w-full h-full bg-light-gray flex items-center justify-center rounded-md">
      <div className="w-10 h-10 bg-wood border-2 border-amber-800 rounded-sm flex items-center justify-center">
        <div className="w-8 h-1 bg-amber-900"></div>
        <div className="w-1 h-8 bg-amber-900"></div>
      </div>
    </div>
  );
};

export default Box;
