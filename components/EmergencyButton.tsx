import React, { useState } from 'react';
import type { Patient } from '../types';
import Modal from './Modal';
import { AlertTriangleIcon, PhoneIcon, ShareIcon, ShieldCheckIcon } from './icons/Icons';

interface EmergencyButtonProps {
  patient: Patient;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ patient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const getPhoneNumber = (contact: string): string | null => {
    // Extracts digits from the contact string to form a tel link
    const digits = contact.replace(/\D/g, '');
    return digits.length > 0 ? digits : null;
  };

  const phoneNumber = getPhoneNumber(patient.personalInfo.emergencyContact);
  const telLink = phoneNumber ? `tel:${phoneNumber}` : '#';

  const handleShare = async () => {
    const summary = `
## Health Summary for ${patient.name} ##

Patient: ${patient.name}, Age ${patient.age}
Emergency Contact: ${patient.personalInfo.emergencyContact}

---

### Allergies
${patient.allergies.join(', ') || 'None reported'}

---

### Medical History
${patient.medicalHistory.join(', ')}

---

### Current Medications
${patient.medications.map(m => `- ${m.name} (${m.dosage})`).join('\n')}
    `.trim();

    // Use Web Share API if available
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Health Summary for ${patient.name}`,
                text: summary,
            });
        } catch (error) {
            console.error('Error sharing health summary:', error);
            // This can happen if the user cancels the share. No need to alert.
        }
    } else {
        // Fallback to copying to clipboard
        try {
            await navigator.clipboard.writeText(summary);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2500); // Reset after 2.5 seconds
        } catch (err) {
            console.error('Failed to copy health summary:', err);
            alert('Could not copy summary to clipboard.');
        }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-3 px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
      >
        <AlertTriangleIcon className="w-6 h-6" />
        <span>EMERGENCY</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Emergency Information">
        <div className="p-6 space-y-6 text-lg">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-red-600">{patient.name}</h3>
                <p className="text-slate-500">Immediate Contact & Health Summary</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 flex items-center mb-2"><PhoneIcon className="w-5 h-5 mr-2"/>Emergency Contact</h4>
                <p className="text-red-700">{patient.personalInfo.emergencyContact}</p>
                 {phoneNumber && (
                     <a 
                        href={telLink} 
                        className="mt-3 w-full flex justify-center items-center space-x-3 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <PhoneIcon className="w-6 h-6"/>
                        <span>Call Now</span>
                    </a>
                )}
            </div>
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 flex items-center mb-2"><ShieldCheckIcon className="w-5 h-5 mr-2"/>Key Health Info</h4>
                <div className="space-y-2">
                    <div>
                        <p className="font-semibold text-slate-600">Allergies:</p>
                        <p className="text-slate-800">{patient.allergies.join(', ') || 'None reported'}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-slate-600">Medical History:</p>
                        <p className="text-slate-800">{patient.medicalHistory.join(', ')}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-slate-600">Current Medications:</p>
                        <p className="text-slate-800">{patient.medications.map(m => m.name).join(', ')}</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={handleShare}
                disabled={shareStatus === 'copied'}
                className="w-full flex justify-center items-center space-x-3 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-green-600 disabled:cursor-not-allowed"
            >
                <ShareIcon className="w-6 h-6"/>
                <span>{shareStatus === 'copied' ? 'Summary Copied!' : 'Share Health Summary'}</span>
            </button>
        </div>
      </Modal>
    </>
  );
};

export default EmergencyButton;
