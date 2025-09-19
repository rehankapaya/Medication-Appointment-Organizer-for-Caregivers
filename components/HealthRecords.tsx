
import React from 'react';
import type { HealthRecord } from '../types';
import { DownloadIcon } from './icons/Icons';

interface HealthRecordsProps {
  records: HealthRecord[];
}

const HealthRecords: React.FC<HealthRecordsProps> = ({ records }) => {
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
      <h2 className="text-2xl font-bold text-slate-800">Health Records</h2>
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
            <a href={record.fileUrl} download className="p-2 rounded-full hover:bg-slate-200 transition-colors">
              <DownloadIcon className="w-6 h-6 text-slate-600" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecords;
