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
              background: '#f0f9ff',
              color: '#0284c7',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid #bae6fd'
            }}>
              <Award size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Driving Session Summary
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', fontFamily: 'monospace' }}>
                ID: {session.id} | {session.startTime} - {session.endTime || 'Now'}
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

        {/* Primary Status Banner */}
        <div style={{
          background: session.criticalDrowsinessEvents > 0 || session.emergencyEvents > 0
            ? '#fef2f2'
            : session.drowsinessWarnings > 1
            ? '#fffbeb'
            : '#f0fdf4',
          border: `1px solid ${
            session.criticalDrowsinessEvents > 0 || session.emergencyEvents > 0
              ? '#fecaca'
              : session.drowsinessWarnings > 1
              ? '#fde68a'
              : '#bbf7d0'
          }`,
          color: session.criticalDrowsinessEvents > 0 || session.emergencyEvents > 0
            ? '#dc2626'
            : session.drowsinessWarnings > 1
            ? '#d97706'
            : '#16a34a',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
            OVERALL SAFETY ASSESSMENT
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '0.2rem' }}>
            {session.statusRecommendation}
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="#0284c7" /> Total Duration
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
              {formatDuration(session.durationSec)}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={14} color="#d97706" /> Drowsiness Warnings
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>
              {session.drowsinessWarnings}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Activity size={14} color="#dc2626" /> Critical Drowsiness Events
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
              {session.criticalDrowsinessEvents}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Siren size={14} color="#9333ea" /> Emergency Events
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#9333ea', marginTop: '0.2rem' }}>
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
            background: '#f8fafc',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem'
          }}>
            <img
              src={session.baselineImage}
              alt="Baseline Thumbnail"
              style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Driver Baseline Registered</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Baseline EAR: {session.baselineFaceStats?.eyeOpennessRatio || 0.35} | Captured at drive start
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
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
