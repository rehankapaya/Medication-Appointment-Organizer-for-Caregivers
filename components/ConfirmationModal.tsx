
import React from 'react';
import Modal from './Modal';
import { AlertTriangleIcon } from './icons/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-1">
            <p className="text-xl text-slate-700">{message}</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse space-x-4 space-x-reverse">
          <button
            type="button"
            className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2 bg-red-600 text-lg font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2 bg-white text-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
    </Modal>
  );
};

export default ConfirmationModal;
