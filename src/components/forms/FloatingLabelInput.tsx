import React, { ChangeEvent } from 'react';
import '../../assets/css/forms/floatingLabel.css';

interface FloatingLabelInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  type?: string;
  error?: string | false;
}

export const FloatingLabelInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  readOnly = false,
  disabled = false,
  type = "text",
  error
}: FloatingLabelInputProps): React.ReactElement => {
  return (
    <div className={`floating-label-input ${error ? "has-error" : ""}`}>
      <input
        id={id}
        name={name}
        type={type}
        className={`form-control ${error ? "border-danger" : ""}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        placeholder=" "
        required
      />
      <label htmlFor={id}>{label}</label>
      {error && <div className="text-danger small">{error}</div>}
    </div>
  );
};
