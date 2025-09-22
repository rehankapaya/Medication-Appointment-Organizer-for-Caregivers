
import React from 'react';
import type { Medication, MedicationLog } from '../types';
import { MedicationStatus } from '../types';
import Modal from './Modal';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from './icons/Icons';

interface MedicationLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication;
}

const MedicationLogModal: React.FC<MedicationLogModalProps> = ({ isOpen, onClose, medication }) => {
  if (!isOpen) return null;

  const getStatusPill = (status: MedicationStatus) => {
    switch (status) {
      case MedicationStatus.Taken:
        return <span className="flex items-center text-sm font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full"><CheckCircleIcon className="w-4 h-4 mr-1.5"/>Taken</span>;
      case MedicationStatus.Missed:
        return <span className="flex items-center text-sm font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full"><XCircleIcon className="w-4 h-4 mr-1.5"/>Missed</span>;
      case MedicationStatus.Scheduled:
        return <span className="flex items-center text-sm font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full"><ClockIcon className="w-4 h-4 mr-1.5"/>Scheduled</span>;
    }
  };

  const sortedLogs = [...medication.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log for ${medication.name}`}>
        <div className="p-6">
            {sortedLogs.length > 0 ? (
                <div className="max-h-96 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                        {sortedLogs.map((log, index) => (
                            <li key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-medium text-lg text-slate-700">
                                    {new Date(log.date).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    })}
                                </p>
                                {getStatusPill(log.status)}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-slate-500 py-8 text-lg">No logs found for this medication.</p>
            )}
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end">
             <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2 bg-white text-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </Modal>
  );
};

export default MedicationLogModal;
