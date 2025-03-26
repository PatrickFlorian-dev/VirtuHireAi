import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FloatingLabelInput } from '../forms/FloatingLabelInput';

export type ModalType = "info" | "create" | "edit" | "readonly";

interface ModalFormProps {
  modalType: ModalType;
  initialData: Record<string, unknown>;
  hiddenFields: string[];
  disabledFields: string[]; // NEW: keys to ignore for changes
  onSubmit: (updatedData: Record<string, unknown>) => void;
}

export const ModalForm = ({
  modalType,
  initialData,
  hiddenFields,
  disabledFields,
  onSubmit,
}: ModalFormProps): React.ReactElement => {
  // Always call hooks unconditionally
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

  // For create, all visible fields must be nonempty (if string) to enable the button.
  // For edit, at least one editable (non-disabled) field must be changed.
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
      const editableKeys = Object.keys(formState).filter(
        (key) => !disabledFields.includes(key)
      );
      const changed = editableKeys.some(key => formState[key] !== initialData[key]);
      setHasChanged(changed);
    }
  }, [formState, initialData, modalType, hiddenFields, disabledFields]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    // If the input is cleared, update state with null; otherwise, update with the new value.
    setFormState(prev => ({ ...prev, [name]: value.trim() === "" ? null : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  // Filter out hidden fields for the form-based modal
  const visibleFields = Object.entries(formState).filter(([key]) => !hiddenFields.includes(key));

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Row>
          {visibleFields.map(([key, value]) => (
            <Col md={4} key={key}>
              <FloatingLabelInput
                id={key}
                name={key}
                label={key}
                type={inferInputType(key, value)}
                // If the value is null, display an empty string
                value={value === null ? "" : String(value)}
                onChange={modalType === "readonly" ? () => {} : handleChange}
                readOnly={modalType === "readonly"}
                // You might want to pass disabled status to the input as well if needed
                disabled={disabledFields.includes(key)}
              />
            </Col>
          ))}
        </Row>
        {modalType !== "readonly" && (
          <Row>
            <Col className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  modalType === "create" ? !isValid : modalType === "edit" ? !hasChanged : false
                }
              >
                {modalType === "create" ? "Submit" : "Update"}
              </button>
            </Col>
          </Row>
        )}
      </Container>
    </form>
  );
};
