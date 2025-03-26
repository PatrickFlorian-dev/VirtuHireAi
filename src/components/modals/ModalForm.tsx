import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

type ModalType = "info" | "create" | "edit" | "readonly";

interface ModalFormProps {
  modalType: Exclude<ModalType, "info">; // "create" | "edit" | "readonly"
  initialData: Record<string, unknown>;
  hiddenFields: string[];
  onSubmit: (updatedData: Record<string, unknown>) => void;
}

export const ModalForm = ({ modalType, initialData, hiddenFields, onSubmit }: ModalFormProps): React.ReactElement => {
  const [formState, setFormState] = useState<Record<string, unknown>>(initialData);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  // Infer input type from key and value
  const inferInputType = (key: string, value: unknown): string => {
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
      const lower = key.toLowerCase();
      if (lower.includes("email")) return "email";
      if (lower.includes("phone")) return "tel";
      return "text";
    }
    return "text";
  };

  // For create, all fields must be nonempty (if string) to enable the button.
  // For edit, at least one field must be changed.
  useEffect(() => {
    if (modalType === "create") {
      const valid = Object.entries(formState)
        .filter(([key]) => !hiddenFields.includes(key))
        .every(([, value]) => {
          if (typeof value === "string") return value.trim() !== "";
          return value !== undefined && value !== null;
        });
      setIsValid(valid);
    } else if (modalType === "edit") {
      const changed = Object.keys(formState).some(key => formState[key] !== initialData[key]);
      setHasChanged(changed);
    }
  }, [formState, initialData, modalType, hiddenFields]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(formState).map(([key, value]) => {
        if (hiddenFields.includes(key)) return null;
        return (
          <div key={key} className="mb-3">
            <label htmlFor={key} className="form-label">
              {key}
            </label>
            <input
              type={inferInputType(key, value)}
              className="form-control"
              id={key}
              name={key}
              value={String(formState[key])}
              onChange={modalType === "readonly" ? undefined : handleChange}
              readOnly={modalType === "readonly"}
              required
            />
          </div>
        );
      })}
      {modalType !== "readonly" && (
        <button
          type="submit"
          className="btn btn-primary"
          disabled={modalType === "create" ? !isValid : modalType === "edit" ? !hasChanged : false}
        >
          {modalType === "create" ? "Submit" : "Update"}
        </button>
      )}
    </form>
  );
};
