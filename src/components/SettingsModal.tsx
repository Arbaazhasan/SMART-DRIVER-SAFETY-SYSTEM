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
              background: 'rgba(0, 240, 255, 0.15)',
              color: '#00f0ff',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              <SettingsIcon size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                System & Exhibition Settings
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Configure thresholds, emergency contacts, and audio alarms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#ffffff', padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Drowsiness Thresholds (Req #2) */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00f0ff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={18} /> Drowsiness Detection Thresholds
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
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
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
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
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
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
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
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

        {/* Section 2: Audio & Alarm Buzzer (Req #15) */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00e676', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Volume2 size={18} /> Alarm Audio & Volume Controls
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
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
                background: 'rgba(255, 214, 0, 0.15)',
                border: '1px solid #ffd600',
                color: '#ffd600',
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
                background: 'rgba(255, 23, 68, 0.15)',
                border: '1px solid #ff1744',
                color: '#ff1744',
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
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
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

        {/* Section 3: Emergency Contacts (Req #8) */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffd600', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={18} /> Configurable Emergency Contact Info
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Contact */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Emergency Contact Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
                style={{ width: '100%', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem', borderRadius: '6px', color: '#fff', marginTop: '0.2rem' }}
              />
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>Contact Phone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                style={{ width: '100%', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem', borderRadius: '6px', color: '#fff', marginTop: '0.2rem' }}
              />
            </div>

            {/* Help Hotline */}
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Help / Emergency Number Name</label>
              <input
                type="text"
                value={help.name}
                onChange={e => setHelp({ ...help, name: e.target.value })}
                style={{ width: '100%', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem', borderRadius: '6px', color: '#fff', marginTop: '0.2rem' }}
              />
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>Help Hotline Phone</label>
              <input
                type="text"
                value={help.phone}
                onChange={e => setHelp({ ...help, phone: e.target.value })}
                style={{ width: '100%', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.15)', padding: '0.45rem', borderRadius: '6px', color: '#fff', marginTop: '0.2rem' }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            style={{
              background: saveSuccess ? '#00e676' : 'linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)',
              color: '#090c15',
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
