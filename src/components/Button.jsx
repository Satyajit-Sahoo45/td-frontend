import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
