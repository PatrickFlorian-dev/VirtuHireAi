import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FloatingLabelInput } from '../forms/FloatingLabelInput';

export type ModalType = "info" | "create" | "edit" | "readonly";

interface ModalFormProps {
  modalType: ModalType;
  initialData: Record<string, unknown>;
  hiddenFields: string[];
  onSubmit: (updatedData: Record<string, unknown>) => void;
}

export const ModalForm = ({
  modalType,
  initialData,
  hiddenFields,
  onSubmit,
}: ModalFormProps): React.ReactElement => {
  // Always call hooks unconditionally
  const [formState, setFormState] = useState<Record<string, unknown>>(initialData);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  // For "info" mode, we won't use formState, but we must still call the hooks.
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
    // If the input is cleared, update state with null; otherwise, update with the new value.
    setFormState(prev => ({ ...prev, [name]: value.trim() === "" ? null : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  // Filter out hidden fields for the form-based modal
  const visibleFields = Object.entries(formState).filter(([key]) => !hiddenFields.includes(key));

  // Conditionally render based on modalType
  return modalType === "info" ? (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <h2>{String(initialData.title)}</h2>
          <p>{String(initialData.message)}</p>
        </Col>
      </Row>
    </Container>
  ) : (
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
