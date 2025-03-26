import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FloatingLabelInput } from '../forms/FloatingLabelInput';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';

export type ModalType = "info" | "create" | "edit" | "readonly";

interface ValidationRule {
  type: "required" | "minLength";
  value?: number;
  message: string;
}

interface ModalFormProps {
  modalType: ModalType;
  initialData: Record<string, unknown>;
  hiddenFields: string[];
  disabledFields: string[];
  validationRules?: Record<string, ValidationRule[]>;
  onSubmit: (updatedData: Record<string, unknown>) => void;
}

export const ModalForm = ({
  modalType,
  initialData,
  hiddenFields,
  disabledFields,
  validationRules = {},
  onSubmit,
}: ModalFormProps): React.ReactElement => {

  const [formState, setFormState] = useState<Record<string, unknown>>(initialData);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    for (const key in formState) {
      if (!validationRules[key]) continue;
      const rules = validationRules[key];
      for (const rule of rules) {
        const value = formState[key];
        if (rule.type === "required" && (!value || String(value).trim() === "")) {
          newErrors[key] = rule.message;
          break;
        }
        if (rule.type === "minLength" && String(value || "").length < (rule.value || 0)) {
          newErrors[key] = rule.message;
          break;
        }
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    if (modalType === "edit") {
      const editableKeys = Object.keys(formState).filter(key => !disabledFields.includes(key));
      const changed = editableKeys.some(key => formState[key] !== initialData[key]);
      setHasChanged(changed);
    }
  }, [formState, validationRules, modalType, disabledFields, initialData]);

  useEffect(() => {
      if (modalType === "edit") {
        setHasChanged(false);
      }
      if (modalType === "create") {
        setIsValid(false);
      }
  }, [modalType, initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value.trim() === "" ? null : value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouchedFields(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formState);
  };

  const visibleFields = Object.entries(formState).filter(([key]) => !hiddenFields.includes(key));

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Row>
        {visibleFields.map(([key, value]) => {
          const lowerKey = key.toLowerCase();
          const isDateTimeField = 
            lowerKey.includes("date") || 
            lowerKey.includes("time") || 
            (typeof value === 'string' && !isNaN(Date.parse(value)));

          return (
            <Col md={4} key={key}>
              {isDateTimeField ? (
                <div className="mb-3">
                  <label>{key}</label>
                  <DateTimePicker
                    value={value ? new Date(value as string) : new Date()} // Default to current date if empty
                    onChange={(date: Date | null) => {
                      setFormState(prev => ({ ...prev, [key]: date ? date.toISOString() : "" }));
                      setTouchedFields(prev => ({ ...prev, [key]: true }));
                    }}
                    disabled={disabledFields.includes(key)}
                    format="MM-dd-yyyy : hh:mmaaaa"  // Show both date and time
                    className="form-control"
                  />
                  {touchedFields[key] && errors[key] && (
                    <div className="text-danger">{errors[key]}</div>
                  )}
                </div>
              ) : (
                <FloatingLabelInput
                  id={key}
                  name={key}
                  label={key}
                  error={touchedFields[key] && errors[key]}
                  type={inferInputType(key, value)}
                  value={value === null ? "" : String(value)}
                  onChange={modalType === "readonly" ? () => {} : handleChange}
                  onBlur={handleBlur}
                  readOnly={modalType === "readonly"}
                  disabled={disabledFields.includes(key)}
                />
              )}
            </Col>
          );
        })}
        </Row>
        {modalType !== "readonly" && (
          <Row>
            <Col className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={modalType === "create" ? !isValid : modalType === "edit" ? !hasChanged : false}
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
