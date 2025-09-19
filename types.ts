
export interface Caregiver {
  id: string;
  name: string;
  avatarUrl: string;
}

export enum MedicationStatus {
  Taken = 'Taken',
  Missed = 'Missed',
  Scheduled = 'Scheduled',
}

export interface MedicationLog {
  date: string; // ISO string format
  status: MedicationStatus;
}

export interface Medication {
  id: string;

  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  logs: MedicationLog[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  location: string;
  dateTime: string; // ISO string format
}

export interface HealthRecord {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary';
  uploadDate: string; // ISO string format
  fileUrl: string; // a mock url
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  personalInfo: {
    dob: string;
    gender: string;
    emergencyContact: string;
  };
  medicalHistory: string[];
  allergies: string[];
  medications: Medication[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
}

export interface AppointmentConflict {
  description: string;
  appointmentIds: string[];
}

export interface MedicationConflict {
    description: string;
    medicationIds: string[];
}

export interface AISuggestions {
  appointmentConflicts: AppointmentConflict[];
  medicationConflicts: MedicationConflict[];
}
