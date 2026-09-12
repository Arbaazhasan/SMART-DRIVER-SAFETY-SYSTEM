import type { 
  DrivingSession, 
  SafetyEvent, 
  EmergencyContact, 
  HelpNumber, 
  ThresholdSettings,
  BaselineFaceStats
} from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'sds_driving_sessions',
  ACTIVE_SESSION: 'sds_active_session',
  EVENTS: 'sds_safety_events',
  EMERGENCY_CONTACT: 'sds_emergency_contact',
  HELP_NUMBER: 'sds_help_number',
  THRESHOLDS: 'sds_threshold_settings',
  BASELINE: 'sds_driver_baseline',
};

const DEFAULT_EMERGENCY_CONTACT: EmergencyContact = {
  name: 'Emergency Contact Person',
  phone: '+1 (555) 019-2834',
  email: 'guardian@driversafety.app',
};

const DEFAULT_HELP_NUMBER: HelpNumber = {
  name: 'Highway Emergency Hotline',
  phone: '1-800-SAFE-DRIVE',
};

export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  eyeClosureDurationWarning: 1.0,
  eyeClosureDurationCritical: 2.0,
  repeatedClosureCount: 2,
  monitoringWindowSec: 15,
  yawnDurationSec: 2.5,
  headTiltAngleDeg: 25,
  alarmVolume: 0.8,
  soundEnabled: true,
};

class SessionStore {
  // Emergency Contacts
  public getEmergencyContact(): EmergencyContact {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACT);
    return raw ? JSON.parse(raw) : DEFAULT_EMERGENCY_CONTACT;
  }

  public saveEmergencyContact(contact: EmergencyContact): void {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACT, JSON.stringify(contact));
  }

  // Help Number
  public getHelpNumber(): HelpNumber {
    const raw = localStorage.getItem(STORAGE_KEYS.HELP_NUMBER);
    return raw ? JSON.parse(raw) : DEFAULT_HELP_NUMBER;
  }

  public saveHelpNumber(help: HelpNumber): void {
    localStorage.setItem(STORAGE_KEYS.HELP_NUMBER, JSON.stringify(help));
  }

  // Threshold Settings
  public getThresholdSettings(): ThresholdSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);
    return raw ? { ...DEFAULT_THRESHOLDS, ...JSON.parse(raw) } : DEFAULT_THRESHOLDS;
  }

  public saveThresholdSettings(settings: ThresholdSettings): void {
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(settings));
  }

  // Baseline Check
  public getBaselineStats(): { image: string; stats: BaselineFaceStats } | null {
    const raw = localStorage.getItem(STORAGE_KEYS.BASELINE);
    return raw ? JSON.parse(raw) : null;
  }

  public saveBaselineStats(image: string, stats: BaselineFaceStats): void {
    localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify({ image, stats }));
  }

  // Sessions
  public getAllSessions(): DrivingSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getActiveSession(): DrivingSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  }

  public createSession(baselineImage?: string, baselineFaceStats?: BaselineFaceStats): DrivingSession {
    const now = new Date();
    const sessionId = `SES-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newSession: DrivingSession = {
      id: sessionId,
      startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      durationSec: 0,
      baselineImage,
      baselineFaceStats,
      drowsinessWarnings: 0,
      criticalDrowsinessEvents: 0,
      yawningEvents: 0,
      emergencyEvents: 0,
      statusRecommendation: '🟢 Driver alert & optimal posture',
      events: [],
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(newSession));
    return newSession;
  }

  public updateActiveSession(session: DrivingSession): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }

  public endActiveSession(statusRecommendation?: string): DrivingSession | null {
    const active = this.getActiveSession();
    if (!active) return null;

    const now = new Date();
    active.endTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    if (statusRecommendation) {
      active.statusRecommendation = statusRecommendation;
    } else if (active.criticalDrowsinessEvents > 0 || active.emergencyEvents > 0) {
      active.statusRecommendation = '🔴 CRITICAL: Driver experienced severe fatigue or emergency event';
    } else if (active.drowsinessWarnings > 1) {
      active.statusRecommendation = '⚠️ WARNING: Driver showed repeated signs of fatigue';
    } else {
      active.statusRecommendation = '🟢 SAFE: Normal driving session completed';
    }

    const sessions = this.getAllSessions();
    sessions.unshift(active); // prepend latest
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);

    return active;
  }

  // Events Log
  public addSafetyEvent(event: SafetyEvent): void {
    const events = this.getAllEvents();
    events.unshift(event);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

    // Also attach to active session if matching
    const active = this.getActiveSession();
    if (active && active.id === event.sessionId) {
      active.events.unshift(event);
      if (event.severity === 'Warning') active.drowsinessWarnings += 1;
      if (event.severity === 'Critical' && event.eventType.includes('Drowsiness')) active.criticalDrowsinessEvents += 1;
      if (event.eventType.includes('Yawn')) active.yawningEvents += 1;
      if (event.eventType.includes('Emergency') || event.eventType.includes('Injury')) active.emergencyEvents += 1;
      this.updateActiveSession(active);
    }
  }

  public getAllEvents(): SafetyEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  // Data Deletion (Privacy #17)
  public deleteAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.BASELINE);
  }
}

export const sessionStore = new SessionStore();
