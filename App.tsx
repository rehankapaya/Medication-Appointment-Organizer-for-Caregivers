
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientFormModal from './components/PatientFormModal';
import { MOCK_CAREGIVER, MOCK_PATIENTS } from './constants';
import type { Patient } from './types';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients.length > 0 ? patients[0] : null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleOpenModalForCreate = () => {
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient profile?')) {
        setPatients(prev => {
            const newPatients = prev.filter(p => p.id !== patientId);
            // If the selected patient is deleted, select the first one in the new list or null
            if (selectedPatient?.id === patientId) {
                setSelectedPatient(newPatients.length > 0 ? newPatients[0] : null!);
            }
            return newPatients;
        });
    }
  };

  const handleSavePatient = (patientData: Patient) => {
    if (patientToEdit) {
      // Update existing patient
      setPatients(prev => prev.map(p => p.id === patientData.id ? patientData : p));
      if (selectedPatient?.id === patientData.id) {
        setSelectedPatient(patientData);
      }
    } else {
      // Add new patient
      const newPatient = { ...patientData, id: `p${Date.now()}` };
      setPatients(prev => [...prev, newPatient]);
      setSelectedPatient(newPatient); // Automatically select the new patient
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar
        caregiver={MOCK_CAREGIVER}
        patients={patients}
        selectedPatient={selectedPatient!}
        onSelectPatient={handleSelectPatient}
        onAddPatientClick={handleOpenModalForCreate}
        onEditPatientClick={handleOpenModalForEdit}
        onDeletePatient={handleDeletePatient}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {selectedPatient ? (
          <Dashboard key={selectedPatient.id} patient={selectedPatient} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-700">No Patient Selected</h1>
              <p className="text-slate-500 mt-2">Please add or select a patient from the sidebar.</p>
            </div>
          </div>
        )}
      </main>
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
      />
    </div>
  );
};

export default App;
