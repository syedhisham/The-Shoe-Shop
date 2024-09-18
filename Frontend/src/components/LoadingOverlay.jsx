import React from "react";

const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-black border-solid rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
          Loading...
        </div>
      </div>
      <p className="mt-2 text-white text-lg">Please wait...</p>
    </div>
  </div>
);

export default LoadingOverlay;
