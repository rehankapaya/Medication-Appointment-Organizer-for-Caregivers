
import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types';
import Modal from './Modal';

export type AppointmentFormData = Omit<Appointment, 'id'>;

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: AppointmentFormData) => void;
  appointmentToEdit: Appointment | null;
}

const initialFormData: AppointmentFormData = {
    doctorName: '',
    specialty: '',
    location: '',
    dateTime: new Date().toISOString(),
};

const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
  <div>
      <label className="block text-lg font-medium text-slate-700 mb-1">{label}</label>
      {children}
  </div>
);

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ isOpen, onClose, onSave, appointmentToEdit }) => {
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);

  // Helper to format ISO string to 'YYYY-MM-DDTHH:mm' for the input
  const formatDateTimeForInput = (isoString: string) => {
    const date = new Date(isoString);
    // Adjust for timezone offset to display local time in the input
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        doctorName: appointmentToEdit.doctorName,
        specialty: appointmentToEdit.specialty,
        location: appointmentToEdit.location,
        dateTime: appointmentToEdit.dateTime,
      });
    } else {
      // Set default time to next hour, on the hour
      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      setFormData({ ...initialFormData, dateTime: nextHour.toISOString() });
    }
  }, [appointmentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // The input value is a local time string, 'YYYY-MM-DDTHH:mm'
    // new Date() will parse it as local time and we convert to ISO string (UTC)
    const newDateTime = new Date(value).toISOString();
    setFormData(prev => ({ ...prev, dateTime: newDateTime }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={appointmentToEdit ? 'Edit Appointment' : 'Add New Appointment'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <FormRow label="Doctor's Name">
             <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Dr. Evelyn Reed" required />
        </FormRow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Specialty">
                <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Cardiology" required />
            </FormRow>
            <FormRow label="Date & Time">
                <input type="datetime-local" name="dateTime" value={formatDateTimeForInput(formData.dateTime)} onChange={handleDateTimeChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
        </div>
        <FormRow label="Location">
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., City Heart Clinic" required />
        </FormRow>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Save Appointment</button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentFormModal;
