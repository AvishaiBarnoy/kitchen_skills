import React from 'react';

/**
 * Loading spinner component with game-like theme
 * @param {string} size - Size of the spinner (sm, md, lg)
 * @param {string} message - Optional loading message
 */
const LoadingSpinner = React.memo(function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg 
          className="text-purple-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      {message && (
        <p className={`mt-2 text-gray-300 ${textSizeClasses[size]} animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );
});

export default LoadingSpinner;