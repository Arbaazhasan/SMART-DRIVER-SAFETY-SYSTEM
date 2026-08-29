export type DriverState = 'ALERT' | 'WARNING' | 'CRITICAL';
export type EyeStatus = 'OPEN' | 'CLOSED';
export type YawnStatus = 'NORMAL' | 'DETECTED';
export type HeadStatus = 'NORMAL' | 'ABNORMAL';
export type EmergencyStatus = 'SAFE' | 'POSSIBLE_EMERGENCY';
export type FaceVisibility = 'DETECTED' | 'NOT_DETECTED';

export type SeverityLevel = 'Normal' | 'Warning' | 'Critical';

export interface SafetyEvent {
  id: string;
  sessionId: string;
  timestamp: string;
  dateTime: string;
  eventType: string;
  severity: SeverityLevel;
  description: string;
  capturedImage?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
}

export interface HelpNumber {
  name: string;
  phone: string;
}

export interface ThresholdSettings {
  eyeClosureDurationWarning: number; // in seconds, e.g. 1.0
  eyeClosureDurationCritical: number; // in seconds, e.g. 2.0
  repeatedClosureCount: number; // e.g. 2 times in window
  monitoringWindowSec: number; // time window to check repeated closures, e.g. 15s
  yawnDurationSec: number; // seconds of mouth open for yawn
  headTiltAngleDeg: number; // degrees for head drop/tilt
  alarmVolume: number; // 0 to 1
  soundEnabled: boolean;
}

export interface BaselineFaceStats {
  eyeOpennessRatio: number;
  headCenterX: number;
  headCenterY: number;
  capturedAt: string;
}

export interface DrivingSession {
  id: string;
  startTime: string;
  endTime?: string;
  durationSec: number;
  baselineImage?: string;
  baselineFaceStats?: BaselineFaceStats;
  drowsinessWarnings: number;
  criticalDrowsinessEvents: number;
  yawningEvents: number;
  emergencyEvents: number;
  statusRecommendation: string;
  events: SafetyEvent[];
}

export type ExhibitionScenario = 
  | 'SCENARIO_1_NORMAL'
  | 'SCENARIO_2_WARNING'
  | 'SCENARIO_3_CRITICAL'
  | 'SCENARIO_4_EMERGENCY'
  | 'SCENARIO_5_INJURY';

export interface LocationData {
  available: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
}
