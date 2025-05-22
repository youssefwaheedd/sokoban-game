import React from "react";

const BoxOnTarget = () => {
  return (
    <div className="w-full h-full bg-light-gray flex items-center justify-center rounded-md">
      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-900 rounded-sm flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 relative">
          <div className="absolute inset-0 bg-emerald-500 opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 bg-emerald-500 opacity-10 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxOnTarget;
