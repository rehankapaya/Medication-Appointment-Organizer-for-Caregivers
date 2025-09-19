
import React from 'react';
import type { Caregiver, Patient } from '../types';
import { UserIcon, UsersIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface SidebarProps {
  caregiver: Caregiver;
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onAddPatientClick: () => void;
  onEditPatientClick: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  caregiver,
  patients,
  selectedPatient,
  onSelectPatient,
  onAddPatientClick,
  onEditPatientClick,
  onDeletePatient,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <img src={caregiver.avatarUrl} alt={caregiver.name} className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-sm text-slate-500">Caregiver</p>
            <h2 className="text-lg font-bold text-slate-800">{caregiver.name}</h2>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
          <UsersIcon className="w-5 h-5 mr-2" />
          My Patients
        </h3>
        <ul className="space-y-2">
          {patients.map((patient) => (
            <li key={patient.id} className="relative group">
              <button
                onClick={() => onSelectPatient(patient)}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  selectedPatient?.id === patient.id
                    ? 'bg-blue-500 text-white shadow'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full" />
                <span className="font-medium text-lg flex-1 truncate">{patient.name}</span>
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onEditPatientClick(patient); }}
                    className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300"
                >
                    <PencilIcon className="w-4 h-4 text-slate-600"/>
                </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); onDeletePatient(patient.id); }}
                    className="p-1.5 rounded-full bg-slate-200 hover:bg-red-400 text-slate-600 hover:text-white"
                >
                    <TrashIcon className="w-4 h-4"/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t border-slate-200">
        <button
          onClick={onAddPatientClick}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span>New Patient</span>
        </button>
        <p className="text-xs text-slate-400 mt-4 text-center">Caregiver's Companion v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
