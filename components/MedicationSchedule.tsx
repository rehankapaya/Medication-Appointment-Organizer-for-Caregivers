
import React, { useState } from 'react';
import type { Medication, MedicationLog } from '../types';
import { MedicationStatus } from '../types';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from './icons/Icons';

interface MedicationScheduleProps {
  medications: Medication[];
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ medications: initialMedications }) => {
  const [medications, setMedications] = useState(initialMedications);

  const handleStatusChange = (medId: string, logIndex: number, newStatus: MedicationStatus) => {
    setMedications(prevMeds => 
      prevMeds.map(med => {
        if (med.id === medId) {
          const newLogs = [...med.logs];
          if (newLogs[logIndex]) {
            newLogs[logIndex].status = newStatus;
          }
          return { ...med, logs: newLogs };
        }
        return med;
      })
    );
  };
  
  const getStatusPill = (status: MedicationStatus) => {
    switch (status) {
      case MedicationStatus.Taken:
        return <span className="flex items-center text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full"><CheckCircleIcon className="w-4 h-4 mr-1"/>Taken</span>;
      case MedicationStatus.Missed:
        return <span className="flex items-center text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full"><XCircleIcon className="w-4 h-4 mr-1"/>Missed</span>;
      case MedicationStatus.Scheduled:
        return <span className="flex items-center text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full"><ClockIcon className="w-4 h-4 mr-1"/>Scheduled</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Medication Adherence</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-lg">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left font-semibold text-slate-600 p-4">Medication</th>
              <th className="text-left font-semibold text-slate-600 p-4">Dosage</th>
              <th className="text-left font-semibold text-slate-600 p-4">Frequency</th>
              <th className="text-left font-semibold text-slate-600 p-4">Recent Status</th>
              <th className="text-left font-semibold text-slate-600 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med) => {
              const latestLog = med.logs.length > 0 ? med.logs[med.logs.length - 1] : null;
              return (
              <tr key={med.id} className="border-b border-slate-200">
                <td className="p-4 font-medium text-slate-800">{med.name}</td>
                <td className="p-4 text-slate-600">{med.dosage}</td>
                <td className="p-4 text-slate-600">{med.frequency}</td>
                <td className="p-4">
                  {latestLog ? getStatusPill(latestLog.status) : <span className="text-slate-400">No logs</span>}
                </td>
                <td className="p-4">
                  {latestLog && latestLog.status === MedicationStatus.Scheduled && (
                     <div className="flex space-x-2">
                        <button 
                            onClick={() => handleStatusChange(med.id, med.logs.length - 1, MedicationStatus.Taken)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold transition-colors"
                        >
                            Mark as Taken
                        </button>
                        <button 
                            onClick={() => handleStatusChange(med.id, med.logs.length - 1, MedicationStatus.Missed)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold transition-colors"
                        >
                            Mark as Missed
                        </button>
                    </div>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicationSchedule;
