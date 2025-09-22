
import React, { useState } from 'react';
import type { Patient, Medication, MedicationStatus, HealthRecord, Appointment, NotificationSettings } from '../types';
import Overview from './Overview';
import MedicationSchedule from './MedicationSchedule';
import AppointmentCalendar from './AppointmentCalendar';
import HealthRecords from './HealthRecords';
import Reports from './Reports';
import Notifications from './Notifications';
import EmergencyButton from './EmergencyButton';
import MedicationFormModal, { type MedicationFormData } from './MedicationFormModal';
import HealthRecordFormModal, { type HealthRecordFormData } from './HealthRecordFormModal';
import AppointmentFormModal, { type AppointmentFormData } from './AppointmentFormModal';
import MedicationLogModal from './MedicationLogModal';
import ConfirmationModal from './ConfirmationModal';
import { CalendarIcon, ClipboardListIcon, HeartPulseIcon, PaperclipIcon, ChartBarIcon, BellIcon } from './icons/Icons';

interface DashboardProps {
  patient: Patient;
  onSaveMedication: (patientId: string, medication: Medication) => void;
  onDeleteMedication: (patientId: string, medicationId: string) => void;
  onMedicationStatusChange: (patientId: string, medId: string, logIndex: number, newStatus: MedicationStatus) => void;
  onSaveHealthRecord: (patientId: string, record: HealthRecord) => void;
  onDeleteHealthRecord: (patientId: string, recordId: string) => void;
  onSaveAppointment: (patientId: string, appointment: Appointment) => void;
  onDeleteAppointment: (patientId: string, appointmentId: string) => void;
  onSaveNotificationSettings: (patientId: string, settings: NotificationSettings) => void;
}

type Tab = 'overview' | 'medications' | 'appointments' | 'records' | 'reports' | 'notifications';

const TabButton: React.FC<{tabName: Tab, activeTab: Tab, icon: React.ReactNode, label: string, onClick: (tabName: Tab) => void}> = ({tabName, activeTab, icon, label, onClick}) => (
    <button
        onClick={() => onClick(tabName)}
        className={`flex items-center space-x-2 px-4 py-3 font-semibold text-lg rounded-t-lg border-b-4 transition-colors duration-200 ${
        activeTab === tabName
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-500 hover:text-blue-500'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  patient, 
  onSaveMedication, 
  onDeleteMedication, 
  onMedicationStatusChange,
  onSaveHealthRecord,
  onDeleteHealthRecord,
  onSaveAppointment,
  onDeleteAppointment,
  onSaveNotificationSettings
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Medication Modal State
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | null>(null);

  // Health Record Modal State
  const [isHealthRecordModalOpen, setIsHealthRecordModalOpen] = useState(false);
  const [healthRecordToEdit, setHealthRecordToEdit] = useState<HealthRecord | null>(null);
  
  // Appointment Modal State
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  
  // Appointment Deletion Modal State
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);


  // Medication Log Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logViewMedication, setLogViewMedication] = useState<Medication | null>(null);

  const handleOpenMedicationModalForCreate = () => {
    setMedicationToEdit(null);
    setIsMedicationModalOpen(true);
  };

  const handleOpenMedicationModalForEdit = (medication: Medication) => {
      setMedicationToEdit(medication);
      setIsMedicationModalOpen(true);
  };

  const handleCloseMedicationModal = () => {
      setIsMedicationModalOpen(false);
      setMedicationToEdit(null);
  };

  const handleSaveMedication = (medicationData: MedicationFormData) => {
    const newMedication: Medication = {
        id: medicationToEdit ? medicationToEdit.id : `m${Date.now()}`,
        logs: medicationToEdit ? medicationToEdit.logs : [],
        ...medicationData,
    };
    onSaveMedication(patient.id, newMedication);
    handleCloseMedicationModal();
  };

  const handleOpenHealthRecordModalForCreate = () => {
    setHealthRecordToEdit(null);
    setIsHealthRecordModalOpen(true);
  };

  const handleOpenHealthRecordModalForEdit = (record: HealthRecord) => {
      setHealthRecordToEdit(record);
      setIsHealthRecordModalOpen(true);
  };

  const handleCloseHealthRecordModal = () => {
      setIsHealthRecordModalOpen(false);
      setHealthRecordToEdit(null);
  };

  const handleSaveHealthRecord = (recordData: HealthRecordFormData) => {
    const newRecord: HealthRecord = {
        id: healthRecordToEdit ? healthRecordToEdit.id : `hr${Date.now()}`,
        ...recordData,
    };
    onSaveHealthRecord(patient.id, newRecord);
    handleCloseHealthRecordModal();
  };

  const handleOpenAppointmentModalForCreate = () => {
    setAppointmentToEdit(null);
    setIsAppointmentModalOpen(true);
  };

  const handleOpenAppointmentModalForEdit = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleCloseAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setAppointmentToEdit(null);
  };

  const handleSaveAppointment = (appointmentData: AppointmentFormData) => {
    const newAppointment: Appointment = {
      id: appointmentToEdit ? appointmentToEdit.id : `a${Date.now()}`,
      ...appointmentData,
    };
    onSaveAppointment(patient.id, newAppointment);
    handleCloseAppointmentModal();
  };

  const handleDeleteAppointmentClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDeleteAppointment = () => {
    if (appointmentToDelete) {
      onDeleteAppointment(patient.id, appointmentToDelete.id);
    }
    setIsConfirmDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };
  
  const handleOpenLogModal = (medication: Medication) => {
    setLogViewMedication(medication);
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setLogViewMedication(null);
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview patient={patient} />;
      case 'medications':
        return <MedicationSchedule 
                  medications={patient.medications}
                  onAdd={handleOpenMedicationModalForCreate}
                  onEdit={handleOpenMedicationModalForEdit}
                  onDelete={(medId) => onDeleteMedication(patient.id, medId)}
                  onStatusChange={(medId, logIndex, newStatus) => onMedicationStatusChange(patient.id, medId, logIndex, newStatus)}
                  onViewLog={handleOpenLogModal}
                />;
      case 'appointments':
        return <AppointmentCalendar 
                  appointments={patient.appointments}
                  onAdd={handleOpenAppointmentModalForCreate}
                  onEdit={handleOpenAppointmentModalForEdit}
                  onDelete={handleDeleteAppointmentClick}
                />;
      case 'records':
        return <HealthRecords 
                records={patient.healthRecords} 
                onAdd={handleOpenHealthRecordModalForCreate}
                onEdit={handleOpenHealthRecordModalForEdit}
                onDelete={(recordId) => onDeleteHealthRecord(patient.id, recordId)}
              />;
      case 'reports':
        return <Reports patient={patient} />;
      case 'notifications':
        return <Notifications patient={patient} onSave={onSaveNotificationSettings} />;
      default:
        return null;
    }
  };
  

  return (
    <>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{patient.name}</h1>
            <p className="text-lg text-slate-500">{patient.age} years old &middot; {patient.personalInfo.gender}</p>
          </div>
          <EmergencyButton patient={patient} />
        </header>
        
        <nav className="flex border-b border-slate-200 flex-wrap">
          <TabButton tabName="overview" activeTab={activeTab} onClick={setActiveTab} icon={<HeartPulseIcon className="w-6 h-6"/>} label="Overview" />
          <TabButton tabName="medications" activeTab={activeTab} onClick={setActiveTab} icon={<ClipboardListIcon className="w-6 h-6"/>} label="Medications" />
          <TabButton tabName="appointments" activeTab={activeTab} onClick={setActiveTab} icon={<CalendarIcon className="w-6 h-6"/>} label="Appointments" />
          <TabButton tabName="records" activeTab={activeTab} onClick={setActiveTab} icon={<PaperclipIcon className="w-6 h-6"/>} label="Records" />
          <TabButton tabName="reports" activeTab={activeTab} onClick={setActiveTab} icon={<ChartBarIcon className="w-6 h-6"/>} label="Reports" />
          <TabButton tabName="notifications" activeTab={activeTab} onClick={setActiveTab} icon={<BellIcon className="w-6 h-6"/>} label="Notifications" />
        </nav>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {renderTabContent()}
        </div>
      </div>
      <MedicationFormModal
        isOpen={isMedicationModalOpen}
        onClose={handleCloseMedicationModal}
        onSave={handleSaveMedication}
        medicationToEdit={medicationToEdit}
      />
      <HealthRecordFormModal
        isOpen={isHealthRecordModalOpen}
        onClose={handleCloseHealthRecordModal}
        onSave={handleSaveHealthRecord}
        healthRecordToEdit={healthRecordToEdit}
      />
      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        onSave={handleSaveAppointment}
        appointmentToEdit={appointmentToEdit}
      />
       <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAppointment}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
      />
      {logViewMedication && (
        <MedicationLogModal
            isOpen={isLogModalOpen}
            onClose={handleCloseLogModal}
            medication={logViewMedication}
        />
      )}
    </>
  );
};

export default Dashboard;
