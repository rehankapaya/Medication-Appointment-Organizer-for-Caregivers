
import React, { useState, useEffect } from 'react';
import type { Medication } from '../types';
import Modal from './Modal';

export type MedicationFormData = Omit<Medication, 'id' | 'logs'>;

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: MedicationFormData) => void;
  medicationToEdit: Medication | null;
}

const initialFormData: MedicationFormData = {
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
};

const MedicationFormModal: React.FC<MedicationFormModalProps> = ({ isOpen, onClose, onSave, medicationToEdit }) => {
  const [formData, setFormData] = useState<MedicationFormData>(initialFormData);

  useEffect(() => {
    if (medicationToEdit) {
      setFormData({
        name: medicationToEdit.name,
        dosage: medicationToEdit.dosage,
        frequency: medicationToEdit.frequency,
        duration: medicationToEdit.duration,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [medicationToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const FormRow: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-lg font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={medicationToEdit ? 'Edit Medication' : 'Add New Medication'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <FormRow label="Medication Name">
             <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Lisinopril" required />
        </FormRow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Dosage">
                <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., 10mg" required />
            </FormRow>
            <FormRow label="Frequency">
                <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Once daily" required />
            </FormRow>
        </div>
        <FormRow label="Duration">
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Ongoing, 14 days" required />
        </FormRow>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Save Medication</button>
        </div>
      </form>
    </Modal>
  );
};

export default MedicationFormModal;
