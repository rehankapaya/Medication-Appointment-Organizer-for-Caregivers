import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patientToEdit: Patient | null;
}

const initialFormData = {
    name: '',
    age: 0,
    avatarUrl: 'https://picsum.photos/seed/newpatient/200/200',
    personalInfo: {
      dob: '',
      gender: '',
      emergencyContact: '',
    },
    medicalHistory: [],
    allergies: [],
    // FIX: Add default notificationSettings to match the Patient type.
    notificationSettings: {
        reminders: {
            medication: true,
            appointment: true,
        },
        escalationAlerts: {
            enabled: true,
            missedDosesThreshold: 3,
        },
        contact: {
            email: '',
            phone: '',
        }
    }
};

const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
  <div>
      <label className="block text-lg font-medium text-slate-700 mb-1">{label}</label>
      {children}
  </div>
);

const PatientFormModal: React.FC<PatientFormModalProps> = ({ isOpen, onClose, onSave, patientToEdit }) => {
  const [formData, setFormData] = useState<Omit<Patient, 'id' | 'medications' | 'appointments' | 'healthRecords'>>(initialFormData);

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        age: patientToEdit.age,
        avatarUrl: patientToEdit.avatarUrl,
        personalInfo: patientToEdit.personalInfo,
        medicalHistory: patientToEdit.medicalHistory,
        allergies: patientToEdit.allergies,
        // FIX: Add notificationSettings when editing a patient.
        notificationSettings: patientToEdit.notificationSettings,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [patientToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData.personalInfo) {
      setFormData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [name]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
    }
  };

  const handleArrayChange = (field: 'medicalHistory' | 'allergies', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()).filter(Boolean) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData: Patient = {
      ...(patientToEdit || { 
          id: `p${Date.now()}`, 
          medications: [], 
          appointments: [],
          healthRecords: [],
          notificationSettings: initialFormData.notificationSettings, // Ensure new patient gets settings
      }),
      ...formData,
    };
    onSave(patientData);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={patientToEdit ? 'Edit Patient Profile' : 'Add New Patient'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Full Name">
                 <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
            <FormRow label="Age">
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
            <FormRow label="Date of Birth">
                <input type="date" name="dob" value={formData.personalInfo.dob} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
            <FormRow label="Gender">
                <input type="text" name="gender" value={formData.personalInfo.gender} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
        </div>
        <FormRow label="Emergency Contact">
            <input type="text" name="emergencyContact" value={formData.personalInfo.emergencyContact} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Jane Doe (Daughter) - 555-1234" required />
        </FormRow>
        <FormRow label="Medical History (comma-separated)">
            <textarea name="medicalHistory" value={formData.medicalHistory.join(', ')} onChange={(e) => handleArrayChange('medicalHistory', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-lg" rows={3}></textarea>
        </FormRow>
        <FormRow label="Allergies (comma-separated)">
            <textarea name="allergies" value={formData.allergies.join(', ')} onChange={(e) => handleArrayChange('allergies', e.target.value)} className="w-full p-2 border border-slate-300 rounded-md text-lg" rows={2}></textarea>
        </FormRow>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Save Patient</button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientFormModal;
