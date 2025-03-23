import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const GenericModal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
            <p>{content}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GenericModal;
