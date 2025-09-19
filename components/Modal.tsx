
import React from 'react';
import { XIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <XIcon className="w-6 h-6 text-slate-600" />
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
