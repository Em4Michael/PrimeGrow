import React from "react";

// Define ButtonProps interface
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean; // Define the disabled prop here
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; // Define type prop here
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick, type = "button", disabled = false }) => {
  return (
    <button 
      className={className} 
      onClick={onClick} 
      type={type} 
      disabled={disabled} // Pass the disabled prop to the button element
    >
      {children}
    </button>
  );
};

export default Button;
