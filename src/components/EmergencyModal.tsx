import React, { useState } from 'react';
import { 
  Siren, 
  Camera, 
  MapPin, 
  PhoneCall, 
  X, 
  Flame 
} from 'lucide-react';
import type { EmergencyContact, HelpNumber, LocationData } from '../types';

interface EmergencyModalProps {
  emergencyType: string;
  sessionId: string;
  timestamp: string;
  capturedImage?: string;
  location: LocationData;
  emergencyContact: EmergencyContact;
  helpNumber: HelpNumber;
  isInjuryExperimental?: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  emergencyType,
  sessionId,
  timestamp,
  capturedImage,
  location,
  emergencyContact,
  helpNumber,
  isInjuryExperimental = false,
  onClose
}) => {
  const [callSimulationState, setCallSimulationState] = useState<string | null>(null);

  const handleSimulateCall = (targetName: string, phone: string) => {
    setCallSimulationState(`Dialing ${targetName} (${phone})...`);
    setTimeout(() => {
      setCallSimulationState(`Connected to ${targetName}! Emergency message transmitted.`);
    }, 2000);
    setTimeout(() => {
      setCallSimulationState(null);
    }, 5000);
  };

  const emergencyMessage = `Emergency alert: A possible vehicle emergency has been detected. The driver safety system detected an abnormal event (${emergencyType}). Session: ${sessionId}. Date/Time: ${new Date().toLocaleDateString()} ${timestamp}. Location: ${location.available ? `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}` : 'Location unavailable'}. Captured camera frame attached. Please check on the driver immediately.`;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{
        border: '2px solid #dc2626',
        boxShadow: '0 10px 40px rgba(220, 38, 38, 0.25)',
        maxWidth: '720px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
          margin: '-1.75rem -1.75rem 1.25rem -1.75rem',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Siren size={32} className="pulse" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                🚨 POSSIBLE EMERGENCY DETECTED
              </h2>
              <p style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                Automated Driver Assistance & Snapshot System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: 'none',
              color: '#ffffff',
              padding: '0.4rem',
              borderRadius: '50%'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Experimental Disclaimer Badge if triggered by injury module */}
        {isInjuryExperimental && (
          <div style={{
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            color: '#9333ea',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Flame size={18} color="#9333ea" />
            <span>
              <strong>Experimental Feature Active:</strong> Possible Injury Detection algorithm flagged visual anomaly. Clearly labeled: <em>Not a Medical Diagnosis</em>.
            </span>
          </div>
        )}

        {/* Image & Telemetry Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Captured Snapshot View */}
          <div style={{
            position: 'relative',
            height: '220px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#f1f5f9',
            border: '1px solid #fecaca'
          }}>
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Emergency Snapshot"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                <Camera size={36} color="#dc2626" />
                <span style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#1e293b' }}>📸 Emergency Snapshot Captured</span>
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: '#dc2626',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #fecaca'
            }}>
              <span>📸 SNAPSHOT ATTACHED</span>
              <span>{timestamp}</span>
            </div>
          </div>

          {/* Incident Telemetry Info */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Emergency Event Type</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                {emergencyType}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.75rem' }}>Session ID</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0284c7', fontFamily: 'monospace' }}>
                {sessionId}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.75rem' }}>Location</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: location.available ? '#16a34a' : '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} />
                {location.available ? `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}` : '📍 Location unavailable'}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
              ⏰ Time: {timestamp}
            </div>
          </div>
        </div>

        {/* Pre-formatted SOS Message Box */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.3rem' }}>
            ✉️ GENERATED EMERGENCY MESSAGE
          </div>
          <p style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: '1.4' }}>
            "{emergencyMessage}"
          </p>
        </div>

        {/* Active Call Simulation Banner */}
        {callSimulationState && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <PhoneCall size={18} className="pulse" />
            <span>{callSimulationState}</span>
          </div>
        )}

        {/* Emergency Contacts & Calling System */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          {/* Emergency Contact */}
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Emergency Contact</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{emergencyContact.name}</div>
            <div style={{ fontSize: '0.82rem', color: '#0284c7', fontFamily: 'monospace' }}>{emergencyContact.phone}</div>

            <a
              href={`tel:${emergencyContact.phone}`}
              style={{
                marginTop: '0.6rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#16a34a',
                color: '#ffffff',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={14} /> CALL CONTACT
            </a>
          </div>

          {/* Help Number */}
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Help / Hotline Number</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{helpNumber.name}</div>
            <div style={{ fontSize: '0.82rem', color: '#0284c7', fontFamily: 'monospace' }}>{helpNumber.phone}</div>

            <a
              href={`tel:${helpNumber.phone}`}
              style={{
                marginTop: '0.6rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#0284c7',
                color: '#ffffff',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={14} /> CALL HELP
            </a>
          </div>
        </div>

        {/* Call Simulator Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => handleSimulateCall(emergencyContact.name, emergencyContact.phone)}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <PhoneCall size={16} /> ⚡ SIMULATE EMERGENCY CALL
          </button>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              color: '#64748b',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};
