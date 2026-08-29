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
  GraduationCap
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
    <header style={{
      background: 'rgba(10, 15, 26, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Exhibition Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
        }}>
          <ShieldAlert size={26} color="#090c15" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              SMART DRIVER SAFETY
            </h1>
            <span style={{
              background: 'rgba(0, 240, 255, 0.15)',
              color: '#00f0ff',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <GraduationCap size={12} /> CLASS 11 EXHIBITION
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1px' }}>
            Emergency Response & Fatigue Monitoring System
          </p>
        </div>
      </div>

      {/* Center Session Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isDriveActive ? (
          <button
            onClick={onStartBaselineCheck}
            style={{
              background: 'linear-gradient(135deg, #00e676 0%, #00b0ff 100%)',
              color: '#090c15',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px rgba(0, 230, 118, 0.35)',
              letterSpacing: '0.02em'
            }}
          >
            <Play size={18} fill="#090c15" /> START DRIVE
          </button>
        ) : (
          <button
            onClick={onEndDrive}
            style={{
              background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
              color: '#ffffff',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px rgba(255, 23, 68, 0.4)',
              letterSpacing: '0.02em'
            }}
          >
            <Square size={16} fill="#ffffff" /> END DRIVE
          </button>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#00f0ff',
          border: '1px solid rgba(0, 240, 255, 0.2)'
        }}>
          ⏱️ {timeStr || '10:00:00'}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          style={{
            background: isMuted ? 'rgba(255, 23, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isMuted ? '#ff1744' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isMuted ? '#ff1744' : '#e2e8f0',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={onOpenHistory}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            padding: '0.5rem',
            borderRadius: '8px'
          }}
          title="Privacy & Data Management"
        >
          <Lock size={18} />
        </button>
      </div>
    </header>
  );
};
