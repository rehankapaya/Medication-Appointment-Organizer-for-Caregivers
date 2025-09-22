
import React, { useState } from 'react';
import type { Appointment } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, PlusCircleIcon, TrashIcon } from './icons/Icons';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAdd: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments, onAdd, onEdit, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const appointmentsByDate = appointments.reduce((acc, app) => {
    const date = new Date(app.dateTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(app);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  const isToday = (date: Date) => new Date().toDateString() === date.toDateString();
  const isSelected = (date: Date) => selectedDate?.toDateString() === date.toDateString();
  
  const selectedAppointments = selectedDate ? appointmentsByDate[selectedDate.toDateString()] || [] : [];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAdd}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Add Appointment</span>
          </button>
          <div className="flex space-x-1">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <ChevronRightIcon className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-slate-600 p-2 bg-slate-50 text-lg">
                    {day}
                </div>
                ))}
                {days.map((d, i) => {
                const dayAppointments = appointmentsByDate[d.toDateString()] || [];
                const isCurrentMonth = d.getMonth() === currentDate.getMonth();

                return (
                    <div 
                        key={i} 
                        className={`relative p-2 bg-white min-h-[90px] transition-colors ${!isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'hover:bg-blue-50 cursor-pointer'} ${isSelected(d) ? 'ring-2 ring-blue-500 z-10' : ''}`}
                        onClick={() => isCurrentMonth && setSelectedDate(d)}
                    >
                    <div className={`flex justify-center items-center w-8 h-8 rounded-full text-lg ${isToday(d) ? 'bg-blue-500 text-white' : ''}`}>
                        {d.getDate()}
                    </div>
                    {dayAppointments.length > 0 && isCurrentMonth && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    </div>
                );
                })}
            </div>
        </div>
        <div className="lg:w-1/3 p-4 bg-slate-50 rounded-lg border border-slate-200 h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
                {selectedDate 
                    ? `Schedule for ${selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}` 
                    : 'Select a Day'
                }
            </h3>
            {selectedDate ? (
                selectedAppointments.length > 0 ? (
                    <ul className="space-y-3">
                        {selectedAppointments
                            .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                            .map(app => (
                            <li key={app.id} className="group relative p-3 bg-white rounded-md shadow-sm border-l-4 border-blue-500">
                                <p className="font-bold text-slate-800 text-lg">{new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="text-slate-600 font-semibold">Dr. {app.doctorName}</p>
                                <p className="text-slate-500">{app.specialty}</p>
                                <p className="text-sm text-slate-500 mt-1">{app.location}</p>
                                <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(app)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200" aria-label={`Edit appointment`}>
                                        <PencilIcon className="w-4 h-4 text-slate-600"/>
                                    </button>
                                    <button onClick={() => onDelete(app)} className="p-1.5 rounded-full bg-slate-100 hover:bg-red-400 text-slate-600 hover:text-white" aria-label={`Delete appointment`}>
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 mt-4 text-center py-4">No appointments scheduled for this day.</p>
                )
            ) : (
                <p className="text-slate-500 mt-4 text-center py-4">Click on a day in the calendar to view appointment details.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
