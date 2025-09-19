
import React, { useState, useEffect } from 'react';
import type { Patient, AISuggestions } from '../types';
import { getAIConflictSuggestions } from '../services/geminiService';
import { AlertTriangleIcon, BrainCircuitIcon, CalendarClockIcon, CheckCircleIcon, PillIcon } from './icons/Icons';

interface OverviewProps {
  patient: Patient;
}

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
  const nextAppointment = [...patient.appointments].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
  
  return (
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
                <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4"><CalendarClockIcon className="w-6 h-6 mr-2 text-blue-500"/>Next Appointment</h3>
                {nextAppointment ? (
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
  );
};

export default Overview;
