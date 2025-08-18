// src/components/ui/button.jsx
import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
