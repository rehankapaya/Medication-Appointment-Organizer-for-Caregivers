
import React, { useState, useEffect } from 'react';
import type { Patient, NotificationSettings } from '../types';
import { CheckCircleIcon } from './icons/Icons';

interface NotificationsProps {
  patient: Patient;
  onSave: (patientId: string, settings: NotificationSettings) => void;
}

const FormCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
    <label className="block text-lg font-medium text-slate-700">{label}</label>
    <div className="md:col-span-2">{children}</div>
  </div>
);

const ToggleSwitch: React.FC<{name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-14 h-8 bg-slate-300 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

const Notifications: React.FC<NotificationsProps> = ({ patient, onSave }) => {
  const [settings, setSettings] = useState<NotificationSettings>(patient.notificationSettings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Ensure local state updates if the patient context changes
    setSettings(patient.notificationSettings);
  }, [patient]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, contact: { ...prev.contact, [name]: value } }));
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, reminders: { ...prev.reminders, [name]: checked } }));
  };
  
  const handleEscalationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === 'checkbox';
      const checked = (e.target as HTMLInputElement).checked;

      setSettings(prev => ({
          ...prev,
          escalationAlerts: {
              ...prev.escalationAlerts,
              [name]: isCheckbox ? checked : parseInt(value, 10),
          }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(patient.id, settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <FormCard title="Contact Information">
          <p className="text-slate-600 text-lg -mt-2">Set the email and phone number for receiving alerts and reminders.</p>
          <FormRow label="Email Address">
              <input 
                type="email" 
                name="email"
                value={settings.contact.email}
                onChange={handleContactChange}
                className="w-full p-2 border border-slate-300 rounded-md text-lg"
                placeholder="example@email.com"
              />
          </FormRow>
           <FormRow label="Phone Number">
              <input 
                type="tel"
                name="phone"
                value={settings.contact.phone}
                onChange={handleContactChange}
                className="w-full p-2 border border-slate-300 rounded-md text-lg"
                placeholder="555-123-4567"
              />
          </FormRow>
      </FormCard>
      
      <FormCard title="Reminder Settings">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-lg font-semibold text-slate-800">Medication Reminders</span>
            <ToggleSwitch name="medication" checked={settings.reminders.medication} onChange={handleReminderChange}/>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-lg font-semibold text-slate-800">Appointment Reminders</span>
            <ToggleSwitch name="appointment" checked={settings.reminders.appointment} onChange={handleReminderChange}/>
        </div>
         <p className="text-sm text-slate-500 pt-2">Note: Actual push, email, or SMS notifications require a backend service. This interface demonstrates the settings UI.</p>
      </FormCard>
      
      <FormCard title="Escalation Alerts">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-lg font-semibold text-slate-800">Enable Escalation Alerts</span>
            <ToggleSwitch name="enabled" checked={settings.escalationAlerts.enabled} onChange={handleEscalationChange}/>
        </div>
        {settings.escalationAlerts.enabled && (
             <FormRow label="Alert after consecutive missed doses:">
                <select 
                    name="missedDosesThreshold"
                    value={settings.escalationAlerts.missedDosesThreshold}
                    onChange={handleEscalationChange}
                    className="w-full p-2 border border-slate-300 rounded-md text-lg bg-white"
                >
                    <option value="2">2 doses</option>
                    <option value="3">3 doses</option>
                    <option value="4">4 doses</option>
                    <option value="5">5 doses</option>
                </select>
          </FormRow>
        )}
      </FormCard>

      <div className="flex justify-end items-center pt-4">
        {isSaved && (
            <div className="flex items-center space-x-2 text-green-600 mr-4 transition-opacity duration-300">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="text-lg font-semibold">Settings Saved!</span>
            </div>
        )}
        <button type="submit" className="px-8 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 transition-colors">
            Save Settings
        </button>
      </div>
    </form>
  );
};

export default Notifications;
