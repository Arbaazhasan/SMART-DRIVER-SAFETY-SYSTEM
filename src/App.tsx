import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BaselineModal } from './components/BaselineModal';
import { EmergencyModal } from './components/EmergencyModal';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { SettingsModal } from './components/SettingsModal';
import { EventHistoryModal } from './components/EventHistoryModal';
import { PrivacyModal } from './components/PrivacyModal';
import { DisclaimerFooter } from './components/DisclaimerFooter';

import { faceDetectorService } from './services/faceDetectorService';
import type { FrameTelemetry } from './services/faceDetectorService';
import { sessionStore } from './services/sessionStore';
import { audioService } from './services/audioService';
import type { 
  DrivingSession, 
  SafetyEvent, 
  LocationData, 
  BaselineFaceStats 
} from './types';

export const App: React.FC = () => {
  // Drive State
  const [isDriveActive, setIsDriveActive] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<DrivingSession | null>(sessionStore.getActiveSession());

  // Camera & Telemetry
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  const [telemetry, setTelemetry] = useState<FrameTelemetry>({
    faceDetected: true,
    eyeStatus: 'OPEN',
    eyeClosureDurationSec: 0,
    yawnStatus: 'NORMAL',
    headStatus: 'NORMAL',
    headTiltAngle: 0,
    driverState: 'ALERT',
    emergencyStatus: 'SAFE',
    earValue: 0.35,
    marValue: 0.12,
    experimentalInjuryDetected: false,
  });

  // Emergency & Modals State
  const [showBaselineModal, setShowBaselineModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [completedSummary, setCompletedSummary] = useState<DrivingSession | null>(null);

  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [activeEmergencyType, setActiveEmergencyType] = useState<string>('Accident Simulation');
  const [activeEmergencySnapshot, setActiveEmergencySnapshot] = useState<string | undefined>(undefined);

  const [location, setLocation] = useState<LocationData>({ available: false });
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  const previousStateRef = useRef<string>('ALERT');

  // Initialize Real Webcam stream if allowed
  useEffect(() => {
    let active = true;

    async function initWebcam() {
      if (!isCameraActive) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
        if (!active) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch {
        // Fallback when camera hardware is unavailable
      }
    }

    initWebcam();

    // Check Geolocation (Req #9)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ available: true, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setLocation({ available: false })
      );
    }

    return () => { active = false; };
  }, [isCameraActive]);

  // Log Safety Event Helper
  // Log Safety Event Helper
  const logSafetyEvent = useCallback((eventType: string, severity: 'Normal' | 'Warning' | 'Critical', description: string, snapshotImage?: string) => {
    const now = new Date();
    const event: SafetyEvent = {
      id: `EVT-${Date.now()}`,
      sessionId: activeSession?.id || 'DEMO-SESSION',
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateTime: now.toLocaleString(),
      eventType,
      severity,
      description,
      capturedImage: snapshotImage,
    };
    sessionStore.addSafetyEvent(event);
  }, [activeSession]);

  // Main Frame Processing Loop
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const renderLoop = () => {
      const currentTimeSec = (Date.now() - startTime) / 1000;
      const thresholds = sessionStore.getThresholdSettings();

      const newTelemetry = faceDetectorService.processVideoFrame(
        videoRef.current,
        canvasRef.current,
        thresholds,
        currentTimeSec
      );

      setTelemetry(newTelemetry);

      // Sound Alarm & Event Logging logic
      if (newTelemetry.driverState !== previousStateRef.current) {
        previousStateRef.current = newTelemetry.driverState;

        if (newTelemetry.driverState === 'WARNING') {
          audioService.playWarningSound(thresholds.alarmVolume);
          if (isDriveActive) {
            logSafetyEvent('Drowsiness Warning', 'Warning', 'Long eye closure or repeated yawning detected.');
          }
        } else if (newTelemetry.driverState === 'CRITICAL') {
          audioService.playCriticalAlarm(thresholds.alarmVolume);
          if (isDriveActive) {
            logSafetyEvent('Repeated Eye Closure (Critical)', 'Critical', 'Driver eyes closed for ~2 sec repeatedly. Alert buzzer triggered.');
          }
        } else if (newTelemetry.driverState === 'ALERT') {
          audioService.stopAlarm();
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDriveActive, logSafetyEvent]);

  // Session Duration Timer
  useEffect(() => {
    if (!isDriveActive || !activeSession) return;
    const timer = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;
        const updated = { ...prev, durationSec: prev.durationSec + 1 };
        sessionStore.updateActiveSession(updated);
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isDriveActive, activeSession]);

  // Capture Current Video Snapshot
  const captureSnapshot = (): string => {
    if (videoRef.current && canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }
    // Fallback emergency frame
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(0, 0, 640, 480);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 560, 400);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('🚨 EMERGENCY CAMERA CAPTURE', 120, 240);
    }
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Start Baseline Modal
  const handleStartBaselineCheck = () => {
    setShowBaselineModal(true);
  };

  // Complete Baseline -> Start Drive
  const handleCompleteBaseline = (baselineImage: string, stats: BaselineFaceStats) => {
    setShowBaselineModal(false);
    const newSession = sessionStore.createSession(baselineImage, stats);
    setActiveSession(newSession);
    setIsDriveActive(true);
    logSafetyEvent('Drive Session Started', 'Normal', 'Driver baseline calibrated & drive monitoring activated.');
  };

  // End Drive Session
  const handleEndDrive = () => {
    setIsDriveActive(false);
    audioService.stopAlarm();
    faceDetectorService.setSimulationScenario(null);

    const summary = sessionStore.endActiveSession();
    if (summary) {
      setCompletedSummary(summary);
      setShowSummaryModal(true);
    }
    setActiveSession(null);
  };

  // Manual / Simulated Emergency Trigger
  const triggerEmergencyWorkflow = useCallback((type: string) => {
    audioService.playEmergencySiren(sessionStore.getThresholdSettings().alarmVolume);
    const snapshot = captureSnapshot();

    setActiveEmergencyType(type);
    setActiveEmergencySnapshot(snapshot);
    setShowEmergencyModal(true);

    logSafetyEvent(
      type,
      'Critical',
      `Emergency workflow activated: ${type}. Camera snapshot captured.`,
      snapshot
    );
  }, [logSafetyEvent]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <Navbar
        isDriveActive={isDriveActive}
        onStartBaselineCheck={handleStartBaselineCheck}
        onEndDrive={handleEndDrive}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {/* Main Cockpit Layout */}
      <main className="main-content-container" style={{ flex: 1, padding: '1.5rem', maxWidth: '1440px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Central Safety Cockpit Dashboard */}
        <Dashboard
          isDriveActive={isDriveActive}
          telemetry={telemetry}
          videoRef={videoRef}
          canvasRef={canvasRef}
          isCameraActive={isCameraActive}
          onToggleCamera={() => setIsCameraActive(!isCameraActive)}
          onManualEmergencyTrigger={() => triggerEmergencyWorkflow('Manual Emergency Button Pressed')}
          isExperimentalInjuryActive={telemetry.experimentalInjuryDetected}
        />
      </main>

      {/* Scientific Disclaimer Footer */}
      <DisclaimerFooter />

      {/* Modals */}
      {showBaselineModal && (
        <BaselineModal
          onCompleteBaseline={handleCompleteBaseline}
          onCancel={() => setShowBaselineModal(false)}
        />
      )}

      {showEmergencyModal && (
        <EmergencyModal
          emergencyType={activeEmergencyType}
          sessionId={activeSession?.id || 'DEMO-SESSION'}
          timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          capturedImage={activeEmergencySnapshot}
          location={location}
          emergencyContact={sessionStore.getEmergencyContact()}
          helpNumber={sessionStore.getHelpNumber()}
          isInjuryExperimental={activeEmergencyType.includes('Injury')}
          onClose={() => {
            setShowEmergencyModal(false);
            audioService.stopAlarm();
          }}
        />
      )}

      {showSummaryModal && completedSummary && (
        <SessionSummaryModal
          session={completedSummary}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSave={() => {}}
        />
      )}

      {showHistoryModal && (
        <EventHistoryModal
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyModal
          onClose={() => setShowPrivacyModal(false)}
          onDataDeleted={() => {
            setIsDriveActive(false);
            setActiveSession(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
