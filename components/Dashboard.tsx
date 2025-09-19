
import React, { useState } from 'react';
import type { Patient } from '../types';
import Overview from './Overview';
import MedicationSchedule from './MedicationSchedule';
import AppointmentCalendar from './AppointmentCalendar';
import HealthRecords from './HealthRecords';
import EmergencyButton from './EmergencyButton';
import { CalendarIcon, ClipboardListIcon, HeartPulseIcon, PaperclipIcon } from './icons/Icons';

interface DashboardProps {
  patient: Patient;
}

type Tab = 'overview' | 'medications' | 'appointments' | 'records';

const Dashboard: React.FC<DashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview patient={patient} />;
      case 'medications':
        return <MedicationSchedule medications={patient.medications} />;
      case 'appointments':
        return <AppointmentCalendar appointments={patient.appointments} />;
      case 'records':
        return <HealthRecords records={patient.healthRecords} />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tabName: Tab, icon: React.ReactNode, label: string}> = ({tabName, icon, label}) => (
    <button
        onClick={() => setActiveTab(tabName)}
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

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">{patient.name}</h1>
          <p className="text-lg text-slate-500">{patient.age} years old &middot; {patient.personalInfo.gender}</p>
        </div>
        <EmergencyButton patient={patient} />
      </header>
      
      <nav className="flex border-b border-slate-200">
        <TabButton tabName="overview" icon={<HeartPulseIcon className="w-6 h-6"/>} label="Overview" />
        <TabButton tabName="medications" icon={<ClipboardListIcon className="w-6 h-6"/>} label="Medications" />
        <TabButton tabName="appointments" icon={<CalendarIcon className="w-6 h-6"/>} label="Appointments" />
        <TabButton tabName="records" icon={<PaperclipIcon className="w-6 h-6"/>} label="Records" />
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
