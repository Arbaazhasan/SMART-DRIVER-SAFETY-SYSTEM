import React from 'react';
import type { DrivingSession } from '../types';
import { Award, Clock, AlertTriangle, Activity, Siren, X } from 'lucide-react';

interface SessionSummaryModalProps {
  session: DrivingSession;
  onClose: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({ session, onClose }) => {
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
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
              <Award size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Driving Session Summary
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                ID: {session.id} | {session.startTime} - {session.endTime || 'Now'}
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

        {/* Primary Status Banner */}
        <div style={{
          background: session.criticalDrowsinessEvents > 0 || session.emergencyEvents > 0
            ? 'rgba(255, 23, 68, 0.15)'
            : session.drowsinessWarnings > 1
            ? 'rgba(255, 214, 0, 0.15)'
            : 'rgba(0, 230, 118, 0.15)',
          border: `1px solid ${
            session.criticalDrowsinessEvents > 0 || session.emergencyEvents > 0
              ? '#ff1744'
              : session.drowsinessWarnings > 1
              ? '#ffd600'
              : '#00e676'
          }`,
          color: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
            OVERALL SAFETY ASSESSMENT
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '0.2rem' }}>
            {session.statusRecommendation}
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="#00f0ff" /> Total Duration
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00f0ff', marginTop: '0.2rem' }}>
              {formatDuration(session.durationSec)}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={14} color="#ffd600" /> Drowsiness Warnings
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffd600', marginTop: '0.2rem' }}>
              {session.drowsinessWarnings}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Activity size={14} color="#ff1744" /> Critical Drowsiness Events
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ff1744', marginTop: '0.2rem' }}>
              {session.criticalDrowsinessEvents}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Siren size={14} color="#a855f7" /> Emergency Events
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#a855f7', marginTop: '0.2rem' }}>
              {session.emergencyEvents}
            </div>
          </div>
        </div>

        {/* Baseline Photo Thumbnail */}
        {session.baselineImage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(10, 15, 26, 0.7)',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1.25rem'
          }}>
            <img
              src={session.baselineImage}
              alt="Baseline Thumbnail"
              style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Driver Baseline Registered</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Baseline EAR: {session.baselineFaceStats?.eyeOpennessRatio || 0.35} | Captured at drive start
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)',
              color: '#090c15',
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.88rem'
            }}
          >
            CLOSE SUMMARY
          </button>
        </div>
      </div>
    </div>
  );
};
