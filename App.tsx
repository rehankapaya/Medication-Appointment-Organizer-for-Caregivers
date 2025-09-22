
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientFormModal from './components/PatientFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import { MOCK_CAREGIVER, MOCK_PATIENTS } from './constants';
import type { Patient, Medication, MedicationStatus, HealthRecord, Appointment, NotificationSettings } from './types';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients.length > 0 ? patients[0] : null);
  
  // Patient form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);


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
    setPatientToDelete(patientId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!patientToDelete) return;

    setPatients(prev => {
        const newPatients = prev.filter(p => p.id !== patientToDelete);
        // If the selected patient is deleted, select the first one in the new list or null
        if (selectedPatient?.id === patientToDelete) {
            setSelectedPatient(newPatients.length > 0 ? newPatients[0] : null!);
        }
        return newPatients;
    });

    setIsConfirmModalOpen(false);
    setPatientToDelete(null);
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

  const handleSaveMedication = (patientId: string, medication: Medication) => {
    setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
            const existingMedIndex = p.medications.findIndex(m => m.id === medication.id);
            let newMedications;
            if (existingMedIndex > -1) {
                newMedications = [...p.medications];
                newMedications[existingMedIndex] = medication;
            } else {
                newMedications = [...p.medications, medication];
            }
            const updatedPatient = { ...p, medications: newMedications };

            if (selectedPatient?.id === patientId) {
                setSelectedPatient(updatedPatient);
            }
            return updatedPatient;
        }
        return p;
    }));
  };

  const handleDeleteMedication = (patientId: string, medicationId: string) => {
      if (!window.confirm('Are you sure you want to delete this medication?')) return;

      setPatients(prev => prev.map(p => {
          if (p.id === patientId) {
              const newMedications = p.medications.filter(m => m.id !== medicationId);
              const updatedPatient = { ...p, medications: newMedications };
              
              if (selectedPatient?.id === patientId) {
                  setSelectedPatient(updatedPatient);
              }
              
              return updatedPatient;
          }
          return p;
      }));
  };

  const handleMedicationStatusChange = (patientId: string, medId: string, logIndex: number, newStatus: MedicationStatus) => {
      setPatients(prev => prev.map(p => {
          if (p.id === patientId) {
              const newMedications = p.medications.map(med => {
                  if (med.id === medId) {
                      const newLogs = [...med.logs];
                      if (newLogs[logIndex]) {
                          newLogs[logIndex].status = newStatus;
                      }
                      return { ...med, logs: newLogs };
                  }
                  return med;
              });

              const updatedPatient = { ...p, medications: newMedications };
              
              if (selectedPatient?.id === patientId) {
                  setSelectedPatient(updatedPatient);
              }

              return updatedPatient;
          }
          return p;
      }));
  };

  const handleSaveHealthRecord = (patientId: string, record: HealthRecord) => {
    setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
            const existingRecordIndex = p.healthRecords.findIndex(r => r.id === record.id);
            let newRecords;
            if (existingRecordIndex > -1) {
                newRecords = [...p.healthRecords];
                newRecords[existingRecordIndex] = record;
            } else {
                newRecords = [...p.healthRecords, record];
            }
            const updatedPatient = { ...p, healthRecords: newRecords };

            if (selectedPatient?.id === patientId) {
                setSelectedPatient(updatedPatient);
            }
            return updatedPatient;
        }
        return p;
    }));
  };

  const handleDeleteHealthRecord = (patientId: string, recordId: string) => {
      if (!window.confirm('Are you sure you want to delete this health record?')) return;

      setPatients(prev => prev.map(p => {
          if (p.id === patientId) {
              const newRecords = p.healthRecords.filter(r => r.id !== recordId);
              const updatedPatient = { ...p, healthRecords: newRecords };
              
              if (selectedPatient?.id === patientId) {
                  setSelectedPatient(updatedPatient);
              }
              
              return updatedPatient;
          }
          return p;
      }));
  };

  const handleSaveAppointment = (patientId: string, appointment: Appointment) => {
    setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
            const existingAppointmentIndex = p.appointments.findIndex(a => a.id === appointment.id);
            let newAppointments;
            if (existingAppointmentIndex > -1) {
                newAppointments = [...p.appointments];
                newAppointments[existingAppointmentIndex] = appointment;
            } else {
                newAppointments = [...p.appointments, appointment];
            }
            const updatedPatient = { ...p, appointments: newAppointments };

            if (selectedPatient?.id === patientId) {
                setSelectedPatient(updatedPatient);
            }
            return updatedPatient;
        }
        return p;
    }));
  };

  const handleDeleteAppointment = (patientId: string, appointmentId: string) => {
    setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
            const newAppointments = p.appointments.filter(a => a.id !== appointmentId);
            const updatedPatient = { ...p, appointments: newAppointments };
            
            if (selectedPatient?.id === patientId) {
                setSelectedPatient(updatedPatient);
            }
            
            return updatedPatient;
        }
        return p;
    }));
  };
  
  const handleSaveNotificationSettings = (patientId: string, settings: NotificationSettings) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedPatient = { ...p, notificationSettings: settings };
         if (selectedPatient?.id === patientId) {
            setSelectedPatient(updatedPatient);
        }
        return updatedPatient;
      }
      return p;
    }));
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
          <Dashboard 
            key={selectedPatient.id} 
            patient={selectedPatient}
            onSaveMedication={handleSaveMedication}
            onDeleteMedication={handleDeleteMedication}
            onMedicationStatusChange={handleMedicationStatusChange}
            onSaveHealthRecord={handleSaveHealthRecord}
            onDeleteHealthRecord={handleDeleteHealthRecord}
            onSaveAppointment={handleSaveAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onSaveNotificationSettings={handleSaveNotificationSettings}
          />
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
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Patient Profile"
        message="Are you sure you want to delete this patient profile? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default App;