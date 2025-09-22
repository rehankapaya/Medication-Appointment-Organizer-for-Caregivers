
import React from 'react';
import type { Medication } from '../types';
import { MedicationStatus } from '../types';
import { CheckCircleIcon, ClockIcon, HistoryIcon, PencilIcon, PlusCircleIcon, TrashIcon, XCircleIcon } from './icons/Icons';

interface MedicationScheduleProps {
  medications: Medication[];
  onAdd: () => void;
  onEdit: (medication: Medication) => void;
  onDelete: (medicationId: string) => void;
  onStatusChange: (medId: string, logIndex: number, newStatus: MedicationStatus) => void;
  onViewLog: (medication: Medication) => void;
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ medications, onAdd, onEdit, onDelete, onStatusChange, onViewLog }) => {

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
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Medication Adherence</h2>
        <button
            onClick={onAdd}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add Medication</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-lg">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left font-semibold text-slate-600 p-4">Medication</th>
              <th className="text-left font-semibold text-slate-600 p-4">Dosage</th>
              <th className="text-left font-semibold text-slate-600 p-4">Frequency</th>
              <th className="text-left font-semibold text-slate-600 p-4">Recent Status</th>
              <th className="text-right font-semibold text-slate-600 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med) => {
              const latestLog = med.logs.length > 0 ? [...med.logs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
              const latestLogIndex = latestLog ? med.logs.findIndex(l => l.date === latestLog.date) : -1;

              return (
              <tr key={med.id} className="border-b border-slate-200">
                <td className="p-4 font-medium text-slate-800">{med.name}</td>
                <td className="p-4 text-slate-600">{med.dosage}</td>
                <td className="p-4 text-slate-600">{med.frequency}</td>
                <td className="p-4">
                  {latestLog ? getStatusPill(latestLog.status) : <span className="text-slate-400">No logs</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    {latestLog && latestLog.status === MedicationStatus.Scheduled && (
                      <>
                        <button 
                            onClick={() => onStatusChange(med.id, latestLogIndex, MedicationStatus.Taken)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-semibold transition-colors"
                        >
                            Mark as Taken
                        </button>
                        <button 
                            onClick={() => onStatusChange(med.id, latestLogIndex, MedicationStatus.Missed)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-semibold transition-colors"
                        >
                            Mark as Missed
                        </button>
                      </>
                    )}
                     <button
                        onClick={() => onViewLog(med)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200"
                        aria-label={`View log for ${med.name}`}
                    >
                        <HistoryIcon className="w-5 h-5 text-slate-600"/>
                    </button>
                    <button
                        onClick={() => onEdit(med)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200"
                        aria-label={`Edit ${med.name}`}
                    >
                        <PencilIcon className="w-5 h-5 text-slate-600"/>
                    </button>
                    <button
                        onClick={() => onDelete(med.id)}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-red-400 text-slate-600 hover:text-white"
                        aria-label={`Delete ${med.name}`}
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
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
