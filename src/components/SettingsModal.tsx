import React, { useState } from 'react';
import { Settings as SettingsIcon, Volume2, Phone, Bell, Save, X } from 'lucide-react';
import type { ThresholdSettings, EmergencyContact, HelpNumber } from '../types';
import { sessionStore } from '../services/sessionStore';
import { audioService } from '../services/audioService';

interface SettingsModalProps {
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [thresholds, setThresholds] = useState<ThresholdSettings>(sessionStore.getThresholdSettings());
  const [contact, setContact] = useState<EmergencyContact>(sessionStore.getEmergencyContact());
  const [help, setHelp] = useState<HelpNumber>(sessionStore.getHelpNumber());
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleTestAlarm = (type: 'warning' | 'critical' | 'emergency') => {
    audioService.testSound(type, thresholds.alarmVolume);
  };

  const handleSaveAll = () => {
    sessionStore.saveThresholdSettings(thresholds);
    sessionStore.saveEmergencyContact(contact);
    sessionStore.saveHelpNumber(help);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onSave();
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#f0f9ff',
              color: '#0284c7',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid #bae6fd'
            }}>
              <SettingsIcon size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                System & Simulation Settings
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Configure thresholds, emergency contacts, and audio alarms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', color: '#64748b', padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Drowsiness Thresholds */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={18} /> Drowsiness Detection Thresholds
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Warning Eye Closure (Sec): {thresholds.eyeClosureDurationWarning}s
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={thresholds.eyeClosureDurationWarning}
                onChange={e => setThresholds({ ...thresholds, eyeClosureDurationWarning: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Critical Eye Closure (Sec): {thresholds.eyeClosureDurationCritical}s
              </label>
              <input
                type="range"
                min="1.5"
                max="4.0"
                step="0.1"
                value={thresholds.eyeClosureDurationCritical}
                onChange={e => setThresholds({ ...thresholds, eyeClosureDurationCritical: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Repeated Closure Count: {thresholds.repeatedClosureCount} times
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={thresholds.repeatedClosureCount}
                onChange={e => setThresholds({ ...thresholds, repeatedClosureCount: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Head Tilt Threshold: {thresholds.headTiltAngleDeg}°
              </label>
              <input
                type="range"
                min="15"
                max="45"
                step="5"
                value={thresholds.headTiltAngleDeg}
                onChange={e => setThresholds({ ...thresholds, headTiltAngleDeg: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Audio & Alarm Buzzer */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#16a34a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Volume2 size={18} /> Alarm Audio & Volume Controls
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                Alarm Volume: {Math.round(thresholds.alarmVolume * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={thresholds.alarmVolume}
                onChange={e => setThresholds({ ...thresholds, alarmVolume: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Test Sound Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => handleTestAlarm('warning')}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#d97706',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              Test Warning Chime
            </button>

            <button
              onClick={() => handleTestAlarm('critical')}
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              Test Critical Buzzer
            </button>

            <button
              onClick={() => handleTestAlarm('emergency')}
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#0284c7',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              Test Emergency Siren
            </button>
          </div>
        </div>

        {/* Section 3: Emergency Contacts */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#d97706', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={18} /> Configurable Emergency Contact Info
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Contact */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Emergency Contact Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.45rem', borderRadius: '6px', color: '#0f172a', marginTop: '0.2rem' }}
              />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>Contact Phone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.45rem', borderRadius: '6px', color: '#0f172a', marginTop: '0.2rem' }}
              />
            </div>

            {/* Help Hotline */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Help / Emergency Number Name</label>
              <input
                type="text"
                value={help.name}
                onChange={e => setHelp({ ...help, name: e.target.value })}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.45rem', borderRadius: '6px', color: '#0f172a', marginTop: '0.2rem' }}
              />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', display: 'block' }}>Help Hotline Phone</label>
              <input
                type="text"
                value={help.phone}
                onChange={e => setHelp({ ...help, phone: e.target.value })}
                style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.45rem', borderRadius: '6px', color: '#0f172a', marginTop: '0.2rem' }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', color: '#64748b', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            style={{
              background: saveSuccess ? '#16a34a' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '0.65rem 1.4rem',
              borderRadius: '8px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={16} /> {saveSuccess ? 'SAVED!' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>
    </div>
  );
};
