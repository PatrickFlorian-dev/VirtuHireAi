import React, { ChangeEvent } from 'react';
import '../../assets/css/forms/floatingLabel.css';

interface FloatingLabelInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
}

export const FloatingLabelInput = ({
  id,
  name,
  label,
  value,
  onChange,
  readOnly = false,
  type = "text",
}: FloatingLabelInputProps): React.ReactElement => {
  return (
    <div className="floating-label-input">
      <input
        id={id}
        name={name}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder=" "  /* use an empty placeholder to trigger :placeholder-shown */
        required
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};