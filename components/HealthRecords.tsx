
import React from 'react';
import type { HealthRecord } from '../types';
import { DownloadIcon, PencilIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';

interface HealthRecordsProps {
  records: HealthRecord[];
  onAdd: () => void;
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const HealthRecords: React.FC<HealthRecordsProps> = ({ records, onAdd, onEdit, onDelete }) => {
  const getFileTypeColor = (type: HealthRecord['type']) => {
    switch (type) {
      case 'Prescription': return 'bg-purple-100 text-purple-700';
      case 'Lab Report': return 'bg-cyan-100 text-cyan-700';
      case 'Discharge Summary': return 'bg-lime-100 text-lime-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Health Records</h2>
        <button
            onClick={onAdd}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add Record</span>
        </button>
      </div>
      <ul className="space-y-3">
        {records.map(record => (
          <li key={record.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-4">
               <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getFileTypeColor(record.type)}`}>{record.type}</span>
              <div>
                <p className="font-bold text-lg text-slate-800">{record.name}</p>
                <p className="text-slate-500 text-sm">Uploaded on {new Date(record.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                <a href={record.fileUrl} download className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label={`Download ${record.name}`}>
                    <DownloadIcon className="w-5 h-5 text-slate-600" />
                </a>
                <button
                    onClick={() => onEdit(record)}
                    className="p-2 rounded-full hover:bg-slate-200"
                    aria-label={`Edit ${record.name}`}
                >
                    <PencilIcon className="w-5 h-5 text-slate-600"/>
                </button>
                <button
                    onClick={() => onDelete(record.id)}
                    className="p-2 rounded-full hover:bg-red-400 text-slate-600 hover:text-white"
                    aria-label={`Delete ${record.name}`}
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecords;
