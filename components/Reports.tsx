
import React, { useState, useMemo } from 'react';
import type { Patient } from '../types';
import { MedicationStatus } from '../types';
import { CalendarIcon, PillIcon } from './icons/Icons';

interface ReportsProps {
  patient: Patient;
}

type AdherencePeriod = 'weekly' | 'monthly';

const AdherenceBar: React.FC<{ percentage: number }> = ({ percentage }) => {
  const bgColor = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
      <div className="w-full bg-slate-200 rounded-full h-4">
          <div className={`${bgColor} h-4 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
  );
};

const Reports: React.FC<ReportsProps> = ({ patient }) => {
  const [adherencePeriod, setAdherencePeriod] = useState<AdherencePeriod>('weekly');

  const adherenceData = useMemo(() => {
    const days = adherencePeriod === 'weekly' ? 7 : 30;
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    let totalTaken = 0;
    let totalMissed = 0;

    const medicationStats = patient.medications.map(med => {
      const relevantLogs = med.logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= now && log.status !== MedicationStatus.Scheduled;
      });

      const taken = relevantLogs.filter(l => l.status === MedicationStatus.Taken).length;
      const missed = relevantLogs.filter(l => l.status === MedicationStatus.Missed).length;
      
      totalTaken += taken;
      totalMissed += missed;

      const totalDoses = taken + missed;
      const adherence = totalDoses > 0 ? Math.round((taken / totalDoses) * 100) : 100;

      return {
        id: med.id,
        name: med.name,
        taken,
        missed,
        adherence,
      };
    });
    
    const overallTotal = totalTaken + totalMissed;
    const overallAdherence = overallTotal > 0 ? Math.round((totalTaken / overallTotal) * 100) : 100;

    return { medicationStats, overallAdherence };

  }, [patient.medications, adherencePeriod]);

  const pastAppointments = useMemo(() => {
    return patient.appointments
      .filter(app => new Date(app.dateTime) < new Date())
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [patient.appointments]);
  
  return (
    <div className="space-y-8">
      {/* Medication Adherence Report */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <PillIcon className="w-6 h-6 mr-2 text-blue-500"/>
                Medication Adherence
            </h2>
            <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
                <button 
                    onClick={() => setAdherencePeriod('weekly')} 
                    className={`px-4 py-1 text-lg font-semibold rounded-md transition-colors ${adherencePeriod === 'weekly' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}
                >
                    Last 7 Days
                </button>
                <button 
                    onClick={() => setAdherencePeriod('monthly')}
                     className={`px-4 py-1 text-lg font-semibold rounded-md transition-colors ${adherencePeriod === 'monthly' ? 'bg-white text-blue-600 shadow' : 'text-slate-600 hover:bg-slate-300'}`}
                >
                    Last 30 Days
                </button>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-4xl font-bold text-blue-600">{adherenceData.overallAdherence}%</p>
                <p className="text-lg text-blue-800 font-semibold">Overall Adherence</p>
            </div>
             <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-4xl font-bold text-green-600">{adherenceData.medicationStats.reduce((sum, med) => sum + med.taken, 0)}</p>
                <p className="text-lg text-green-800 font-semibold">Doses Taken</p>
            </div>
             <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-4xl font-bold text-red-600">{adherenceData.medicationStats.reduce((sum, med) => sum + med.missed, 0)}</p>
                <p className="text-lg text-red-800 font-semibold">Doses Missed</p>
            </div>
             <div className="bg-slate-100 p-4 rounded-lg">
                <p className="text-4xl font-bold text-slate-600">{adherenceData.medicationStats.length}</p>
                <p className="text-lg text-slate-800 font-semibold">Medications</p>
            </div>
        </div>
        
        <div className="space-y-4">
            {adherenceData.medicationStats.map(med => (
                <div key={med.id} className="grid grid-cols-5 items-center gap-4 text-lg">
                    <p className="col-span-2 font-semibold text-slate-700">{med.name}</p>
                    <div className="col-span-2">
                        <AdherenceBar percentage={med.adherence} />
                    </div>
                    <p className="text-right font-bold text-slate-800">{med.adherence}%</p>
                </div>
            ))}
        </div>
      </div>

      {/* Appointment History */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-4">
            <CalendarIcon className="w-6 h-6 mr-2 text-blue-500"/>
            Appointment History
        </h2>
        {pastAppointments.length > 0 ? (
            <ul className="space-y-3">
            {pastAppointments.map(app => (
                <li key={app.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-slate-800">{new Date(app.dateTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-slate-600">Dr. {app.doctorName} <span className="text-sm">({app.specialty})</span></p>
                    </div>
                    <p className="text-slate-500">{app.location}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-slate-500 text-center py-4 text-lg">No past appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
