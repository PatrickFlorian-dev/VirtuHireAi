import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "react-modal";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCheckCircle, faTimesCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "../../assets/css/modal/modal.css";
import { ModalForm } from "./ModalForm";

Modal.setAppElement("#root");

type ModalSize = "small" | "regular" | "large";
type FontName = "home" | "check-circle" | "times-circle" | "circle-info";
type ModalType = "info" | "create" | "edit" | "readonly";

export interface ModalData {
  title?: string;
  message?: string;
  allowCloseOutsideOfModal?: boolean;
  modalSize?: ModalSize;
  fontName?: FontName;
  tableName?: string;
  modalType: ModalType;
  formData?: Record<string, unknown>;
  hiddenFields?: string[];
  removedFields?: string[];
  onSubmit?: (updatedData: Record<string, unknown>) => void;
}

interface ModalContextType {
  openModal: (data: ModalData) => void;
}

const iconMap: Record<FontName, IconDefinition> = {
  home: faHome,
  "check-circle": faCheckCircle,
  "times-circle": faTimesCircle,
  "circle-info": faCircleInfo,
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const openModal = (data: ModalData): void => {
    setModalData(data);
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setModalData(null);
    }, 300);
  };

  // Determine modal size CSS class
  const modalSizeClass = modalData?.modalSize
    ? `modal-${modalData.modalSize}`
    : "modal-small";

  // Helper function to remove keys from an object
  const removeFields = (data: Record<string, unknown>, removedFields: string[]): Record<string, unknown> => {
    const newData = { ...data };
    for (const field of removedFields) {
      delete newData[field];
    }
    return newData;
  };

  // Process and render form content if the modal is not "info"
  const renderFormContent = (): React.ReactElement| null => {
    if (!modalData || !modalData.formData) return null;
    // Remove keys specified in removedFields
    const initialData: Record<string, unknown> = modalData.removedFields
      ? removeFields(modalData.formData, modalData.removedFields)
      : { ...modalData.formData };
    return (
      <ModalForm
        modalType={modalData.modalType as Exclude<ModalType, "info">}
        initialData={initialData}
        hiddenFields={modalData.hiddenFields || []}
        onSubmit={(updatedData: Record<string, unknown>) => {
          if (modalData.onSubmit) {
            modalData.onSubmit(updatedData);
          }
          closeModal();
        }}
      />
    );
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        shouldCloseOnOverlayClick={modalData?.allowCloseOutsideOfModal ?? true}
        shouldCloseOnEsc={modalData?.allowCloseOutsideOfModal ?? true}
        onRequestClose={modalData?.allowCloseOutsideOfModal ? closeModal : undefined}
        contentLabel="Global Modal"
        className={`custom-modal ${modalSizeClass} ${isClosing ? "closing" : ""}`}
        overlayClassName="custom-overlay"
      >
        {/* Render Icon if provided */}
        {modalData?.fontName && (
          <div className="modal-icon">
            <FontAwesomeIcon icon={iconMap[modalData.fontName]} />
          </div>
        )}
        <Container className="custom-modal-container">
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <h2>{modalData?.title || "Default Title"}</h2>
              {modalData?.modalType === "info" ? (
                <>
                  <p>{modalData?.message || "No content available"}</p>
                  <button className="btn btn-primary" onClick={closeModal}>
                    Close
                  </button>
                </>
              ) : (
                // Render the form for create, edit, or readonly
                renderFormContent()
              )}
            </Col>
          </Row>
        </Container>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
