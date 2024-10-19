import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-sreen w-full h-full text-cyan-800" >
      <div className="flex items-center justify-center">
        <div className="w-80 h-80 border-t-4 border-b-4 border-red-900 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
