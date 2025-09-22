
import React, { useState, useEffect } from 'react';
import type { Patient, AISuggestions } from '../types';
import { MedicationStatus } from '../types';
import { getAIConflictSuggestions } from '../services/geminiService';
import { AlertTriangleIcon, BrainCircuitIcon, CalendarClockIcon, CheckCircleIcon, PillIcon } from './icons/Icons';

interface OverviewProps {
  patient: Patient;
}

const Alerts: React.FC<{ patient: Patient }> = ({ patient }) => {
  if (!patient.notificationSettings?.escalationAlerts?.enabled) {
    return null;
  }
  
  const threshold = patient.notificationSettings.escalationAlerts.missedDosesThreshold;
  const escalationAlerts: string[] = [];

  patient.medications.forEach(med => {
    // Get logs sorted by most recent first
    const sortedLogs = [...med.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Check only if there are enough logs to meet the threshold
    if (sortedLogs.length < threshold) return;

    const recentLogs = sortedLogs.slice(0, threshold);
    const allMissed = recentLogs.every(log => log.status === MedicationStatus.Missed);

    if (allMissed) {
      escalationAlerts.push(`${med.name} has been missed ${threshold} times in a row.`);
    }
  });

  if (escalationAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg mb-6" role="alert">
      <p className="font-bold text-xl flex items-center"><AlertTriangleIcon className="w-6 h-6 mr-2"/>Escalation Alert</p>
      <ul className="list-disc pl-6 mt-2 space-y-1 text-lg">
        {escalationAlerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
};


const AISuggestionsPanel: React.FC<{ patient: Patient }> = ({ patient }) => {
    const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            const result = await getAIConflictSuggestions(patient);
            setSuggestions(result);
            setIsLoading(false);
        };

        fetchSuggestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patient.id]);

    const hasConflicts = suggestions && (suggestions.appointmentConflicts.length > 0 || suggestions.medicationConflicts.length > 0);

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4"><BrainCircuitIcon className="w-6 h-6 mr-2 text-blue-500" />AI Insights</h3>
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2 text-slate-500">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span>Analyzing for potential conflicts...</span>
                </div>
            ) : !suggestions ? (
                 <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                    <AlertTriangleIcon className="w-5 h-5"/>
                    <p>AI suggestions are disabled. API key might be missing.</p>
                </div>
            ) : !hasConflicts ? (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5"/>
                    <p>No potential conflicts detected.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {suggestions.appointmentConflicts.map((conflict, index) => (
                        <div key={`apt-${index}`} className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                            <p className="font-semibold text-amber-800">Appointment Alert</p>
                            <p className="text-amber-700">{conflict.description}</p>
                        </div>
                    ))}
                    {suggestions.medicationConflicts.map((conflict, index) => (
                        <div key={`med-${index}`} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                            <p className="font-semibold text-red-800">Medication Alert</p>
                            <p className="text-red-700">{conflict.description}</p>
                        </div>
                    ))}
                    <p className="text-xs text-slate-500 italic mt-2">Disclaimer: AI suggestions are for informational purposes only and are not a substitute for professional medical advice.</p>
                </div>
            )}
        </div>
    );
};


const Overview: React.FC<OverviewProps> = ({ patient }) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingAppointments = patient.appointments
    .filter(app => new Date(app.dateTime) >= todayStart)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const todaysAppointments = upcomingAppointments.filter(app => new Date(app.dateTime).toDateString() === now.toDateString());
  const nextAppointment = upcomingAppointments[0];
  
  return (
    <div className="space-y-6">
      <Alerts patient={patient} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <AISuggestionsPanel patient={patient} />
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4"><PillIcon className="w-6 h-6 mr-2 text-blue-500"/>Today's Medications</h3>
                  <ul className="space-y-3">
                  {patient.medications.map(med => (
                      <li key={med.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                          <div>
                              <p className="font-bold text-lg text-slate-700">{med.name}</p>
                              <p className="text-slate-500">{med.dosage} &middot; {med.frequency}</p>
                          </div>
                          <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">Scheduled</span>
                      </li>
                  ))}
                  </ul>
              </div>
          </div>
          <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4">
                      <CalendarClockIcon className="w-6 h-6 mr-2 text-blue-500"/>
                      {todaysAppointments.length > 0 ? "Today's & Upcoming Appointments" : "Next Appointment"}
                  </h3>
                  {todaysAppointments.length > 0 ? (
                      <ul className="space-y-3">
                      {todaysAppointments.map(app => {
                          const appTime = new Date(app.dateTime);
                          const isSoon = appTime > now && (appTime.getTime() - now.getTime()) < 60 * 60 * 1000;
                          return (
                              <li key={app.id} className={`p-3 rounded-md border-l-4 ${isSoon ? 'border-amber-400 bg-amber-50' : 'border-blue-500 bg-white'}`}>
                                  <div className="flex justify-between items-start">
                                      <p className="text-lg font-bold text-slate-800">{appTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      {isSoon && <span className="px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-200 rounded-full">SOON</span>}
                                  </div>
                                  <p className="text-slate-700 font-semibold">with Dr. {app.doctorName}</p>
                                  <p className="text-slate-500">{app.specialty}</p>
                              </li>
                          )
                      })}
                      </ul>
                  ) : nextAppointment ? (
                      <div className="space-y-2">
                          <p className="text-2xl font-bold text-blue-600">{new Date(nextAppointment.dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                          <p className="text-lg text-slate-600">{new Date(nextAppointment.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-slate-700 font-semibold">with Dr. {nextAppointment.doctorName}</p>
                          <p className="text-slate-500">{nextAppointment.specialty}</p>
                          <p className="text-slate-500">{nextAppointment.location}</p>
                      </div>
                  ) : <p className="text-slate-500">No upcoming appointments.</p>}
              </div>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Info</h3>
                  <div className="space-y-2 text-lg">
                      <div>
                          <h4 className="font-semibold text-slate-600">Allergies</h4>
                          <p className="text-slate-800">{patient.allergies.join(', ') || 'None reported'}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-slate-600">Medical History</h4>
                          <p className="text-slate-800">{patient.medicalHistory.join(', ')}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Overview;