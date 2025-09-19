
import React, { useState } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';
import { AlertTriangleIcon, PhoneIcon, ShareIcon, ShieldCheckIcon } from './icons/Icons';

interface EmergencyButtonProps {
  patient: Patient;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ patient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-3 px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
      >
        <AlertTriangleIcon className="w-6 h-6" />
        <span>EMERGENCY</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Emergency Information">
        <div className="p-6 space-y-6 text-lg">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-red-600">{patient.name}</h3>
                <p className="text-slate-500">Immediate Contact & Health Summary</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 flex items-center mb-2"><PhoneIcon className="w-5 h-5 mr-2"/>Emergency Contact</h4>
                <p className="text-red-700">{patient.personalInfo.emergencyContact}</p>
            </div>
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 flex items-center mb-2"><ShieldCheckIcon className="w-5 h-5 mr-2"/>Key Health Info</h4>
                <div className="space-y-2">
                    <div>
                        <p className="font-semibold text-slate-600">Allergies:</p>
                        <p className="text-slate-800">{patient.allergies.join(', ') || 'None reported'}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-slate-600">Medical History:</p>
                        <p className="text-slate-800">{patient.medicalHistory.join(', ')}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-slate-600">Current Medications:</p>
                        <p className="text-slate-800">{patient.medications.map(m => m.name).join(', ')}</p>
                    </div>
                </div>
            </div>
            <button className="w-full flex justify-center items-center space-x-3 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                <ShareIcon className="w-6 h-6"/>
                <span>Share Health Summary</span>
            </button>
        </div>
      </Modal>
    </>
  );
};

export default EmergencyButton;
