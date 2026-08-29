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
    if (telemetry.driverState === 'CRITICAL') return { text: 'CRITICAL', color: '#ff1744' };
    if (telemetry.driverState === 'WARNING') return { text: 'HIGH', color: '#ffd600' };
    if (telemetry.yawnStatus === 'DETECTED') return { text: 'MEDIUM', color: '#ffd600' };
    return { text: 'LOW', color: '#00e676' };
  };

  const drowsinessLvl = getDrowsinessLevel();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem' }}>
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

        {/* Live Warning / Critical Alarm Banner (Req #2) */}
        {isDriveActive && telemetry.driverState !== 'ALERT' && (
          <div style={{
            background: telemetry.driverState === 'CRITICAL' 
              ? 'linear-gradient(90deg, rgba(255, 23, 68, 0.95), rgba(213, 0, 0, 0.95))' 
              : 'linear-gradient(90deg, rgba(255, 214, 0, 0.95), rgba(245, 158, 11, 0.95))',
            color: telemetry.driverState === 'CRITICAL' ? '#ffffff' : '#090c15',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: telemetry.driverState === 'CRITICAL' ? '0 0 30px rgba(255, 23, 68, 0.8)' : '0 0 20px rgba(255, 214, 0, 0.5)',
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
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Drowsiness Level */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Drowsiness Level</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: drowsinessLvl.color }}>
                {drowsinessLvl.text}
              </div>
            </div>

            {/* Face Detection */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Face Detection</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.faceDetected ? '#00e676' : '#ffd600' }}>
                {telemetry.faceDetected ? 'DETECTED' : 'NOT DETECTED'}
              </div>
            </div>

            {/* Eye Status */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Eye Status</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.eyeStatus === 'CLOSED' ? '#ff1744' : '#00f0ff' }}>
                {telemetry.eyeStatus === 'CLOSED' ? '🔴 CLOSED' : '🟢 OPEN'}
              </div>
            </div>

            {/* Yawning */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Yawning</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.yawnStatus === 'DETECTED' ? '#ffd600' : '#00e676' }}>
                {telemetry.yawnStatus === 'DETECTED' ? '🟡 YAWN DETECTED' : 'NORMAL'}
              </div>
            </div>

            {/* Head Position */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Head Position</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.headStatus === 'ABNORMAL' ? '#ffd600' : '#00e676' }}>
                {telemetry.headStatus === 'ABNORMAL' ? '🟡 TILT / DROP' : 'NORMAL'}
              </div>
            </div>

            {/* Emergency Status */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Emergency Status</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: telemetry.emergencyStatus === 'POSSIBLE_EMERGENCY' ? '#ff1744' : '#00e676' }}>
                {telemetry.emergencyStatus === 'POSSIBLE_EMERGENCY' ? '🚨 EMERGENCY' : 'SAFE'}
              </div>
            </div>
          </div>
        </div>

        {/* Experimental Injury Detection Module Badge (Req #7) */}
        <div className="cockpit-card" style={{
          border: '1px solid rgba(168, 85, 247, 0.3)',
          background: 'rgba(168, 85, 247, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700, fontSize: '0.85rem' }}>
              <Flame size={18} /> Experimental Injury Detection
            </div>
            <span style={{ fontSize: '0.68rem', color: '#e9d5ff', background: 'rgba(168, 85, 247, 0.25)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
              NOT A MEDICAL DIAGNOSIS
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            Requirement #7: Scans visual color anomalies. Clearly labeled non-medical experimental feature.
          </p>
          {(telemetry.experimentalInjuryDetected || isExperimentalInjuryActive) && (
            <div style={{
              marginTop: '0.5rem',
              background: 'rgba(255, 23, 68, 0.2)',
              color: '#ff1744',
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

        {/* Exhibition Emergency Simulation Button (Req #5) */}
        <button
          onClick={onManualEmergencyTrigger}
          style={{
            background: 'linear-gradient(135deg, #ff003c 0%, #990000 100%)',
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
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 30px rgba(255, 0, 60, 0.6)',
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
