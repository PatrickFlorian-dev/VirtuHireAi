import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean; // ✅ Allow the disabled prop
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn ${disabled ? "disabled" : ""}`}>
      {text}
    </button>
  );
};

export default Button;
