import React from 'react';

export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizes = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent ${sizes[size]}`} />
    </div>
  );
}
