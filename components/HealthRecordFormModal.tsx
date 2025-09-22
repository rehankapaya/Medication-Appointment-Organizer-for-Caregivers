
import React, { useState, useEffect } from 'react';
import type { HealthRecord } from '../types';
import Modal from './Modal';

export type HealthRecordFormData = Omit<HealthRecord, 'id'>;

interface HealthRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HealthRecordFormData) => void;
  healthRecordToEdit: HealthRecord | null;
}

const recordTypes: HealthRecord['type'][] = ['Lab Report', 'Prescription', 'Discharge Summary'];

const initialFormData: HealthRecordFormData = {
    name: '',
    type: 'Lab Report',
    uploadDate: new Date().toISOString().split('T')[0],
    fileUrl: '#',
};

const HealthRecordFormModal: React.FC<HealthRecordFormModalProps> = ({ isOpen, onClose, onSave, healthRecordToEdit }) => {
  const [formData, setFormData] = useState<HealthRecordFormData>(initialFormData);

  useEffect(() => {
    if (healthRecordToEdit) {
      setFormData({
        name: healthRecordToEdit.name,
        type: healthRecordToEdit.type,
        uploadDate: new Date(healthRecordToEdit.uploadDate).toISOString().split('T')[0],
        fileUrl: healthRecordToEdit.fileUrl,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [healthRecordToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // value is "YYYY-MM-DD", convert to ISO string at start of day in local timezone
    const date = new Date(value);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString();
    setFormData(prev => ({ ...prev, [name]: localISOTime }));
  }

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
    <Modal isOpen={isOpen} onClose={onClose} title={healthRecordToEdit ? 'Edit Health Record' : 'Add New Health Record'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <FormRow label="Record Name">
             <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="e.g., Latest Blood Work" required />
        </FormRow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Record Type">
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg bg-white">
                    {recordTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </FormRow>
            <FormRow label="Upload Date">
                <input type="date" name="uploadDate" value={formData.uploadDate.split('T')[0]} onChange={handleDateChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" required />
            </FormRow>
        </div>
        <FormRow label="File URL (mock)">
            <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md text-lg" placeholder="#" />
        </FormRow>
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">Save Record</button>
        </div>
      </form>
    </Modal>
  );
};

export default HealthRecordFormModal;
