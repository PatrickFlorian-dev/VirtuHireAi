import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "react-modal";
import { Container, Row, Col } from "react-bootstrap";
import "../../assets/css/modal/modal.css";

Modal.setAppElement("#root");

interface ModalData {
  title?: string;
  message?: string;
  allowCloseOutsideOfModal?: boolean; // New option
}

interface ModalContextType {
  openModal: (data: ModalData) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = (data: ModalData) => {
    setModalData(data);
    setIsClosing(false); // Reset closing animation
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setModalData(null);
    }, 300); // Wait for animation to complete
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        shouldCloseOnOverlayClick={modalData?.allowCloseOutsideOfModal ?? true} // Dynamically allow/disallow closing
        shouldCloseOnEsc={modalData?.allowCloseOutsideOfModal ?? true} // Escape key behavior
        onRequestClose={modalData?.allowCloseOutsideOfModal ? closeModal : undefined} // Prevent closing if set to false
        contentLabel="Global Modal"
        className={`custom-modal ${isClosing ? "closing" : ""}`}
        overlayClassName="custom-overlay"
      >
        <Container className="custom-modal-container">
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <h2>{modalData?.title || "Default Title"}</h2>
              <p>{modalData?.message || "No content available"}</p>
              <button className="btn btn-primary" onClick={closeModal}>
                Close
              </button>
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
