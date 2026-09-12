import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Siren, 
  Flame 
} from 'lucide-react';
import type { FrameTelemetry } from '../services/faceDetectorService';
import { CameraView } from './CameraView';

interface DashboardProps {
  isDriveActive: boolean;
  telemetry: FrameTelemetry;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onManualEmergencyTrigger: () => void;
  isExperimentalInjuryActive: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isDriveActive,
  telemetry,
  videoRef,
  canvasRef,
  isCameraActive,
  onToggleCamera,
  onManualEmergencyTrigger,
  isExperimentalInjuryActive
}) => {
  // Drowsiness level badge mapper
  const getDrowsinessLevel = () => {
    if (telemetry.driverState === 'CRITICAL') return { text: 'CRITICAL', color: '#dc2626' };
    if (telemetry.driverState === 'WARNING') return { text: 'HIGH', color: '#d97706' };
    if (telemetry.yawnStatus === 'DETECTED') return { text: 'MEDIUM', color: '#d97706' };
    return { text: 'LOW', color: '#16a34a' };
  };

  const drowsinessLvl = getDrowsinessLevel();

  return (
    <div className="dashboard-grid">
      {/* Left Main Feed Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Camera HUD Feed */}
        <CameraView
          isDriveActive={isDriveActive}
          telemetry={telemetry}
          videoRef={videoRef}
          canvasRef={canvasRef}
          isCameraActive={isCameraActive}
          onToggleCamera={onToggleCamera}
        />

        {/* Live Warning / Critical Alarm Banner */}
        {isDriveActive && telemetry.driverState !== 'ALERT' && (
          <div style={{
            background: telemetry.driverState === 'CRITICAL' 
              ? 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)' 
              : 'linear-gradient(90deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: telemetry.driverState === 'CRITICAL' ? '0 6px 20px rgba(220, 38, 38, 0.4)' : '0 6px 20px rgba(217, 119, 6, 0.35)',
            animation: 'pulseCritical 1s infinite alternate'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Siren size={32} />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                  {telemetry.driverState === 'CRITICAL' ? '🔴 DROWSINESS DETECTED' : '🟡 DROWSINESS WARNING'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: '2px' }}>
                  {telemetry.alarmSustainSec && telemetry.alarmSustainSec > 0
                    ? `👀 EYES OPENED — ALARM SUSTAINING FOR 5 SECONDS (${telemetry.alarmSustainSec}s)`
                    : 'WAKE UP! PLEASE STOP AND TAKE A BREAK.'}
                </div>
              </div>
            </div>
            {telemetry.eyeClosureDurationSec > 0 ? (
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 800
              }}>
                CLOSURE: {telemetry.eyeClosureDurationSec}s
              </div>
            ) : (telemetry.alarmSustainSec && telemetry.alarmSustainSec > 0) ? (
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid #ffffff',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#ffffff'
              }}>
                SUSTAIN: {telemetry.alarmSustainSec}s
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Right Cockpit Telemetry Dashboard Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Main Status Panel */}
        <div className="cockpit-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
            DRIVER ALERTNESS MONITOR
          </div>

          {/* Primary Driver State Indicator */}
          <div style={{
            padding: '1.2rem',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem'
          }} className={
            telemetry.driverState === 'CRITICAL' ? 'badge-critical' :
            telemetry.driverState === 'WARNING' ? 'badge-warning' : 'badge-safe'
          }>
            {telemetry.driverState === 'ALERT' && <ShieldCheck size={36} />}
            {telemetry.driverState === 'WARNING' && <AlertTriangle size={36} />}
            {telemetry.driverState === 'CRITICAL' && <Siren size={36} />}

            <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.04em' }}>
              {telemetry.driverState === 'ALERT' && '🟢 DRIVER ALERT'}
              {telemetry.driverState === 'WARNING' && '🟡 DROWSINESS WARNING'}
              {telemetry.driverState === 'CRITICAL' && '🔴 DROWSINESS DETECTED'}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              {telemetry.driverState === 'ALERT' ? 'Driver eyes open & normal blinking detected' :
               telemetry.driverState === 'WARNING' ? 'Long closure or repeated yawning detected' :
               'Repeated ~2s eye closure — pull over immediately'}
            </div>
          </div>

          {/* Telemetry Indicator Metrics Grid */}
          <div className="dashboard-metrics-grid">
            {/* Drowsiness Level */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Drowsiness Level</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: drowsinessLvl.color }}>
                {drowsinessLvl.text}
              </div>
            </div>

            {/* Face Detection */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Face Detection</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.faceDetected ? '#16a34a' : '#d97706' }}>
                {telemetry.faceDetected ? 'DETECTED' : 'NOT DETECTED'}
              </div>
            </div>

            {/* Eye Status */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Eye Status</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#0284c7' }}>
                {telemetry.eyeStatus === 'CLOSED' ? '🔴 CLOSED' : '🟢 OPEN'}
              </div>
            </div>

            {/* Yawning */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Yawning</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.yawnStatus === 'DETECTED' ? '#d97706' : '#16a34a' }}>
                {telemetry.yawnStatus === 'DETECTED' ? '🟡 YAWN DETECTED' : 'NORMAL'}
              </div>
            </div>

            {/* Head Position */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Head Position</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.headStatus === 'ABNORMAL' ? '#d97706' : '#16a34a' }}>
                {telemetry.headStatus === 'ABNORMAL' ? '🟡 TILT / DROP' : 'NORMAL'}
              </div>
            </div>

            {/* Emergency Status */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Emergency Status</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.emergencyStatus === 'POSSIBLE_EMERGENCY' ? '#dc2626' : '#16a34a' }}>
                {telemetry.emergencyStatus === 'POSSIBLE_EMERGENCY' ? '🚨 EMERGENCY' : 'SAFE'}
              </div>
            </div>
          </div>
        </div>

        {/* Experimental Injury Detection Module Badge */}
        <div className="cockpit-card" style={{
          border: '1px solid #e9d5ff',
          background: '#faf5ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', fontWeight: 700, fontSize: '0.85rem' }}>
              <Flame size={18} /> Experimental Injury Detection
            </div>
            <span style={{ fontSize: '0.68rem', color: '#7e22ce', background: '#f3e8ff', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
              NOT A MEDICAL DIAGNOSIS
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Scans visual color anomalies. Clearly labeled non-medical experimental feature.
          </p>
          {(telemetry.experimentalInjuryDetected || isExperimentalInjuryActive) && (
            <div style={{
              marginTop: '0.5rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚠️ Visual Abnormality Flagged</span>
              <span>Confidence: {((telemetry.injuryConfidenceScore || 0.84) * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>

        {/* Emergency Simulation Button */}
        <button
          onClick={onManualEmergencyTrigger}
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: '#ffffff',
            padding: '1.25rem',
            borderRadius: '14px',
            fontWeight: 900,
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 6px 24px rgba(220, 38, 38, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Siren size={28} className="pulse" />
          🚨 EMERGENCY BUTTON
        </button>
      </div>
    </div>
  );
};
