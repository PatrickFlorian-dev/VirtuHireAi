import React from "react";
import { ButtonProps } from "../interfaces/generalTypes";

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn ${disabled ? "disabled" : ""}`}>
      {text}
    </button>
  );
};

export default Button;
