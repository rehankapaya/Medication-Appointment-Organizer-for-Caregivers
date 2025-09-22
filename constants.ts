
import type { Caregiver, Patient } from './types';
import { MedicationStatus } from './types';

export const MOCK_CAREGIVER: Caregiver = {
  id: 'cg1',
  name: 'Alex Johnson',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Eleanor Vance',
    age: 78,
    avatarUrl: 'https://picsum.photos/seed/eleanor/200/200',
    personalInfo: {
      dob: '1946-03-15',
      gender: 'Female',
      emergencyContact: 'Sarah Vance (Daughter) - 555-0101',
    },
    medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Arthritis'],
    allergies: ['Penicillin'],
    medications: [
      {
        id: 'm1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        logs: [
          { date: new Date(Date.now() - 86400000).toISOString(), status: MedicationStatus.Taken },
          { date: new Date().toISOString(), status: MedicationStatus.Scheduled },
        ],
      },
      {
        id: 'm2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: 'Ongoing',
        logs: [
          { date: new Date(Date.now() - 86400000).toISOString(), status: MedicationStatus.Taken },
          { date: new Date(Date.now() - 43200000).toISOString(), status: MedicationStatus.Taken },
          { date: new Date().toISOString(), status: MedicationStatus.Scheduled },
        ],
      },
      {
        id: 'm3',
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'As needed for pain',
        duration: 'As needed',
        logs: [],
      }
    ],
    appointments: [
      {
        id: 'a1',
        doctorName: 'Dr. Evelyn Reed',
        specialty: 'Cardiology',
        location: 'City Heart Clinic, 123 Main St',
        dateTime: new Date(Date.now() + 3 * 86400000).toISOString(),
      },
      {
        id: 'a2',
        doctorName: 'Dr. Ben Carter',
        specialty: 'Endocrinology',
        location: 'General Hospital, Room 302',
        dateTime: new Date(Date.now() + 10 * 86400000).toISOString(),
      },
    ],
    healthRecords: [
      { id: 'hr1', name: 'Latest Blood Work', type: 'Lab Report', uploadDate: new Date(Date.now() - 20 * 86400000).toISOString(), fileUrl: '#' },
      { id: 'hr2', name: 'Lisinopril Rx', type: 'Prescription', uploadDate: new Date(Date.now() - 90 * 86400000).toISOString(), fileUrl: '#' },
    ],
    notificationSettings: {
        reminders: {
            medication: true,
            appointment: true,
        },
        escalationAlerts: {
            enabled: true,
            missedDosesThreshold: 3,
        },
        contact: {
            email: 'sarah.vance@example.com',
            phone: '555-0101',
        }
    }
  },
  {
    id: 'p2',
    name: 'Arthur Pendelton',
    age: 82,
    avatarUrl: 'https://picsum.photos/seed/arthur/200/200',
    personalInfo: {
      dob: '1942-07-22',
      gender: 'Male',
      emergencyContact: 'Mark Pendelton (Son) - 555-0102',
    },
    medicalHistory: ['Coronary Artery Disease', 'Asthma'],
    allergies: ['None'],
    medications: [
      {
        id: 'm4',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        logs: [
            { date: new Date(Date.now() - 172800000).toISOString(), status: MedicationStatus.Missed },
            { date: new Date(Date.now() - 86400000).toISOString(), status: MedicationStatus.Missed },
        ],
      },
      {
        id: 'm5',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at night',
        duration: 'Ongoing',
        logs: [{ date: new Date(Date.now() - 86400000).toISOString(), status: MedicationStatus.Taken }],
      },
       {
        id: 'm6',
        name: 'Warfarin',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        logs: [{ date: new Date(Date.now() - 86400000).toISOString(), status: MedicationStatus.Taken }],
      }
    ],
    appointments: [
      {
        id: 'a3',
        doctorName: 'Dr. Helen Cho',
        specialty: 'Pulmonology',
        location: 'Breathe Easy Clinic, 456 Oak Ave',
        dateTime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 10, 0).toISOString()
      },
      {
        id: 'a4',
        doctorName: 'Dr. Marcus Thorne',
        specialty: 'General Checkup',
        location: 'Downtown Medical Center',
        dateTime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 10, 30).toISOString()
      },
    ],
    healthRecords: [
      { id: 'hr3', name: 'Chest X-Ray Results', type: 'Lab Report', uploadDate: new Date(Date.now() - 60 * 86400000).toISOString(), fileUrl: '#' },
    ],
    notificationSettings: {
        reminders: {
            medication: true,
            appointment: false,
        },
        escalationAlerts: {
            enabled: true,
            missedDosesThreshold: 2, // Lower threshold to demo alert
        },
        contact: {
            email: 'mark.pendelton@example.com',
            phone: '555-0102',
        }
    }
  },
];