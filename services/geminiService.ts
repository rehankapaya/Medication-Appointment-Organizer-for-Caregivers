
import { GoogleGenAI, Type } from "@google/genai";
import type { Patient, AISuggestions } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateContentPrompt = (patient: Patient): string => {
  const patientMedications = patient.medications.map(m => `- ${m.name} (${m.dosage})`).join('\n');
  const patientAppointments = patient.appointments.map(a => `- Dr. ${a.doctorName} (${a.specialty}) on ${new Date(a.dateTime).toLocaleString()}`).join('\n');

  return `
    Analyze the following patient data for potential scheduling conflicts and common medication interactions. The patient's name is ${patient.name}.

    Current Medications:
    ${patientMedications}

    Upcoming Appointments:
    ${patientAppointments}

    Tasks:
    1. Identify any appointments that are scheduled too close together or overlap.
    2. Identify common, well-known potential interactions between the listed medications. Provide a brief, non-technical explanation for each. THIS IS NOT MEDICAL ADVICE. It is a general information check. For example, mention potential increased bleeding risk with Aspirin and Warfarin.
    3. Return the results in the specified JSON format. If no conflicts are found, return empty arrays.
  `;
};


export const getAIConflictSuggestions = async (patient: Patient): Promise<AISuggestions | null> => {
  if (!API_KEY) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generateContentPrompt(patient),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appointmentConflicts: {
              type: Type.ARRAY,
              description: "List of scheduling conflicts between appointments.",
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  appointmentIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            medicationConflicts: {
              type: Type.ARRAY,
              description: "List of potential medication interactions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  medicationIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AISuggestions;

  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return {
        appointmentConflicts: [],
        medicationConflicts: [{
            description: "Could not fetch AI suggestions. Please check your connection or API key.",
            medicationIds: []
        }]
    };
  }
};
