// DynamicFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from "@headlessui/react";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'phone' | 'textarea';
  hidden?: boolean;
}

export interface DynamicFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'update';
  tableName: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>, mode: 'create' | 'update') => void;
}

const DynamicFormModal: React.FC<DynamicFormModalProps> = ({
  isOpen,
  mode,
  tableName,
  fields,
  initialData = {},
  onClose,
  onSubmit,
}) => {
  // Use Record<string, unknown> for form data
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const defaultData: Record<string, unknown> = {};
    fields.forEach((field) => {
      // You may cast here if you know the expected type (e.g., string)
      defaultData[field.name] = initialData[field.name] ?? '';
    });
    setFormData(defaultData);
  }, [fields, initialData]);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, mode);
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" 
            enterFrom="opacity-0" 
            enterTo="opacity-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100" 
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" 
            enterFrom="opacity-0 scale-95" 
            enterTo="opacity-100 scale-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100 scale-100" 
            leaveTo="opacity-0 scale-95">
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {mode === 'create' ? `Create New ${tableName}` : `Update ${tableName}`}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {fields.map((field) => {
                  if (field.hidden) return null;
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          value={formData[field.name] as string}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                      ) : (
                        <input
                          id={field.name}
                          type={field.type}
                          value={formData[field.name] as string}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                      )}
                    </div>
                  );
                })}
                <div className="mt-4 flex justify-end space-x-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    {mode === 'create' ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DynamicFormModal;
