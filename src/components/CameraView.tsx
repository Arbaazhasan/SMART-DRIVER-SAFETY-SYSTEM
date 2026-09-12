import React, { useEffect } from 'react';
import { Camera, CameraOff, AlertTriangle, Eye, Activity, EyeOff } from 'lucide-react';
import type { FrameTelemetry } from '../services/faceDetectorService';
import { faceDetectorService } from '../services/faceDetectorService';

interface CameraViewProps {
  isDriveActive: boolean;
  telemetry: FrameTelemetry;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  onToggleCamera: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  isDriveActive,
  telemetry,
  videoRef,
  canvasRef,
  isCameraActive,
  onToggleCamera
}) => {
  // Listen for Spacebar key to simulate closing eyes during webcam testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          faceDetectorService.setManualEyeClosedOverride(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        faceDetectorService.setManualEyeClosedOverride(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="cockpit-card hud-scanline hud-camera-container" style={{
      position: 'relative',
      height: '100%',
      minHeight: '380px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden'
    }}>
      {/* Top HUD Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isDriveActive ? '#16a34a' : '#94a3b8',
            boxShadow: isDriveActive ? '0 0 10px rgba(22, 163, 74, 0.4)' : 'none'
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: '#0f172a' }}>
            IN-CAR CAM HUD FEED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Manual Eye Closure Test Button */}
          {isDriveActive && (
            <button
              onMouseDown={() => faceDetectorService.setManualEyeClosedOverride(true)}
              onMouseUp={() => faceDetectorService.setManualEyeClosedOverride(false)}
              onTouchStart={() => faceDetectorService.setManualEyeClosedOverride(true)}
              onTouchEnd={() => faceDetectorService.setManualEyeClosedOverride(false)}
              style={{
                background: telemetry.eyeStatus === 'CLOSED' ? '#fef2f2' : '#f8fafc',
                border: `1px solid ${telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#cbd5e1'}`,
                color: telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#d97706',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
              title="Hold this button or hold Spacebar to simulate closing eyes"
            >
              <EyeOff size={14} /> Hold to Close Eyes (Spacebar)
            </button>
          )}

          <button
            onClick={onToggleCamera}
            style={{
              background: isCameraActive ? '#f0f9ff' : '#f8fafc',
              border: `1px solid ${isCameraActive ? '#bae6fd' : '#cbd5e1'}`,
              color: isCameraActive ? '#0284c7' : '#64748b',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {isCameraActive ? <Camera size={14} /> : <CameraOff size={14} />}
            {isCameraActive ? 'CAM ACTIVE' : 'CAM OFF'}
          </button>
        </div>
      </div>

      {/* Video Stream + HUD Canvas Overlay */}
      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                transform: 'scaleX(-1)'
              }}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <CameraOff size={48} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Webcam Feed Offline / Simulated</p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Simulation Mode can run telemetry without webcam hardware
            </p>
          </div>
        )}

        {/* Warning Banner when Driver Face Not Detected */}
        {isDriveActive && !telemetry.faceDetected && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            padding: '0.5rem 1.25rem',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
            zIndex: 30
          }}>
            <AlertTriangle size={18} /> ⚠️ DRIVER FACE NOT DETECTED — PLEASE ADJUST POSITION
          </div>
        )}

        {/* Live EAR / MAR Telemetry Overlay Bar at bottom */}
        {isCameraActive && telemetry.faceDetected && (
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
            borderRadius: '8px',
            padding: '0.4rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: '#0284c7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={14} color={telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#0284c7'} />
              <span style={{ color: telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#0284c7', fontWeight: 800 }}>
                EAR: {telemetry.earValue.toFixed(2)} ({telemetry.eyeStatus})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={14} color="#d97706" />
              <span style={{ color: '#d97706', fontWeight: 700 }}>MAR: {telemetry.marValue.toFixed(2)} ({telemetry.yawnStatus})</span>
            </div>
            <div>
              <span style={{ color: '#475569', fontWeight: 700 }}>TILT: {telemetry.headTiltAngle}°</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
