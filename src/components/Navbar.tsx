import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Settings, 
  History, 
  Lock,
  Activity
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface NavbarProps {
  isDriveActive: boolean;
  onStartBaselineCheck: () => void;
  onEndDrive: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDriveActive,
  onStartBaselineCheck,
  onEndDrive,
  onOpenSettings,
  onOpenHistory,
  onOpenPrivacy
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
  };

  return (
    <header className="navbar-header">
      {/* Brand & Title */}
      <div className="navbar-brand-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <ShieldAlert size={26} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                SMART DRIVER SAFETY
              </h1>
              <span style={{
                background: '#f0f9ff',
                color: '#0284c7',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid #bae6fd',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Activity size={12} /> LIVE SYSTEM
              </span>
            </div>
            <p className="navbar-subtitle" style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1px' }}>
              Emergency Response & Fatigue Monitoring System
            </p>
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="navbar-controls-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {!isDriveActive ? (
            <button
              onClick={onStartBaselineCheck}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #0284c7 100%)',
                color: '#ffffff',
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                letterSpacing: '0.02em'
              }}
            >
              <Play size={16} fill="#ffffff" /> START DRIVE
            </button>
          ) : (
            <button
              onClick={onEndDrive}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                letterSpacing: '0.02em'
              }}
            >
              <Square size={14} fill="#ffffff" /> END DRIVE
            </button>
          )}

          <div style={{
            background: '#f8fafc',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: '#0284c7',
            border: '1px solid #e2e8f0',
            fontWeight: 600
          }}>
            ⏱️ {timeStr || '10:00:00'}
          </div>
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          style={{
            background: isMuted ? '#fef2f2' : '#f8fafc',
            border: `1px solid ${isMuted ? '#fecaca' : '#e2e8f0'}`,
            color: isMuted ? '#dc2626' : '#334155',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={onOpenHistory}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#334155',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <History size={16} /> Logs
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#334155',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Settings size={16} /> Settings
        </button>

        <button
          onClick={onOpenPrivacy}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#334155',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
          title="Privacy & Data Management"
        >
          <Lock size={18} />
        </button>
      </div>
    </div>
  </header>
  );
};
