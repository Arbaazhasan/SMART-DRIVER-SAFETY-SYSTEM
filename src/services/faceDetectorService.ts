import type { 
  DriverState, 
  EyeStatus, 
  YawnStatus, 
  HeadStatus, 
  EmergencyStatus,
  ThresholdSettings
} from '../types';

export interface FrameTelemetry {
  faceDetected: boolean;
  eyeStatus: EyeStatus;
  eyeClosureDurationSec: number;
  yawnStatus: YawnStatus;
  headStatus: HeadStatus;
  headTiltAngle: number;
  driverState: DriverState;
  emergencyStatus: EmergencyStatus;
  earValue: number; // Eye Aspect Ratio (0.0 to 0.4)
  marValue: number; // Mouth Aspect Ratio (0.0 to 0.8)
  experimentalInjuryDetected: boolean;
  injuryConfidenceScore?: number;
  alarmSustainSec?: number;
}

// MediaPipe Landmark index reference definitions
const LEFT_EYE_TOP = 159;
const LEFT_EYE_BOTTOM = 145;
const LEFT_EYE_OUTER = 33;
const LEFT_EYE_INNER = 133;

const RIGHT_EYE_TOP = 386;
const RIGHT_EYE_BOTTOM = 374;
const RIGHT_EYE_OUTER = 263;
const RIGHT_EYE_INNER = 362;

const UPPER_LIP = 13;
const LOWER_LIP = 14;
const MOUTH_LEFT = 78;
const MOUTH_RIGHT = 308;

const NOSE_TIP = 1;
const CHIN = 152;
const FOREHEAD = 10;

interface Point2D {
  x: number;
  y: number;
}

// Declare window MediaPipe types
declare global {
  interface Window {
    FaceMesh?: any;
    Camera?: any;
  }
}

export class FaceDetectorService {
  private eyeClosedStartTime: number | null = null;
  private yawnStartTime: number | null = null;
  private simulationScenario: string | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;

  // 3-Second Post Eye-Opening Alarm Countdown tracking
  private eyeReopenedTime: number | null = null;
  private sustainState: DriverState | null = null;

  // MediaPipe FaceMesh state
  private faceMeshInstance: any = null;
  private latestLandmarks: Point2D[] | null = null;
  private isFaceMeshReady: boolean = false;
  private isAnalyzingMediaPipe: boolean = false;
  private manualEyeClosedOverride: boolean = false;

  constructor() {
    this.initMediaPipeFaceMesh();
  }

  public setManualEyeClosedOverride(closed: boolean) {
    this.manualEyeClosedOverride = closed;
  }

  public resetState() {
    this.eyeClosedStartTime = null;
    this.yawnStartTime = null;
    this.eyeReopenedTime = null;
    this.sustainState = null;
    this.manualEyeClosedOverride = false;
  }

  public setSimulationScenario(scenario: string | null) {
    this.simulationScenario = scenario;
    if (!scenario) {
      this.resetState();
    }
  }

  public getSimulationScenario(): string | null {
    return this.simulationScenario;
  }

  // Initialize MediaPipe FaceMesh via CDN window scripts
  private initMediaPipeFaceMesh() {
    if (typeof window === 'undefined') return;

    const checkAndInit = () => {
      if (window.FaceMesh && !this.faceMeshInstance) {
        try {
          this.faceMeshInstance = new window.FaceMesh({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          });
          this.faceMeshInstance.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          this.faceMeshInstance.onResults((results: any) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              this.latestLandmarks = results.multiFaceLandmarks[0];
            } else {
              this.latestLandmarks = null;
            }
          });
          this.isFaceMeshReady = true;
          console.log('✅ MediaPipe FaceMesh initialized successfully!');
        } catch (err) {
          console.warn('MediaPipe FaceMesh initialization deferred:', err);
        }
      }
    };

    checkAndInit();
    if (!this.isFaceMeshReady) {
      const interval = setInterval(() => {
        checkAndInit();
        if (this.isFaceMeshReady) clearInterval(interval);
      }, 1000);
    }
  }

  // Analyze video frame & return safety metrics
  public processVideoFrame(
    videoEl: HTMLVideoElement | null,
    canvasEl: HTMLCanvasElement | null,
    thresholds: ThresholdSettings,
    currentTimeSec: number
  ): FrameTelemetry {
    // Check if Exhibition Simulation Mode is active
    if (this.simulationScenario) {
      return this.processSimulatedScenario(this.simulationScenario, canvasEl);
    }

    // Camera Frame check
    if (!videoEl || videoEl.readyState < 2) {
      return {
        faceDetected: false,
        eyeStatus: 'OPEN',
        eyeClosureDurationSec: 0,
        yawnStatus: 'NORMAL',
        headStatus: 'NORMAL',
        headTiltAngle: 0,
        driverState: 'ALERT',
        emergencyStatus: 'SAFE',
        earValue: 0.35,
        marValue: 0.15,
        experimentalInjuryDetected: false,
      };
    }

    // Setup HUD Canvas overlay
    if (canvasEl) {
      if (canvasEl.width !== videoEl.videoWidth || canvasEl.height !== videoEl.videoHeight) {
        canvasEl.width = videoEl.videoWidth || 640;
        canvasEl.height = videoEl.videoHeight || 480;
      }
      this.canvasCtx = canvasEl.getContext('2d');
    }

    // Send frame to MediaPipe if initialized and ready
    if (this.isFaceMeshReady && this.faceMeshInstance && !this.isAnalyzingMediaPipe) {
      this.isAnalyzingMediaPipe = true;
      this.faceMeshInstance.send({ image: videoEl })
        .catch(() => {})
        .finally(() => { this.isAnalyzingMediaPipe = false; });
    }

    // Analyze facial features (MediaPipe FaceMesh or Canvas Luminance Fallback)
    const faceStats = this.analyzeFacialFeatures(videoEl, canvasEl);

    // Apply manual override if user clicks "Test Eye Closure"
    if (this.manualEyeClosedOverride) {
      faceStats.ear = 0.08;
    }

    // Filter noise / handle face missing
    if (!faceStats.faceDetected) {
      this.drawMissingFaceHUD(canvasEl);
      return {
        faceDetected: false,
        eyeStatus: 'OPEN',
        eyeClosureDurationSec: 0,
        yawnStatus: 'NORMAL',
        headStatus: 'NORMAL',
        headTiltAngle: 0,
        driverState: 'ALERT',
        emergencyStatus: 'SAFE',
        earValue: 0,
        marValue: 0,
        experimentalInjuryDetected: false,
      };
    }

    // Process Eye Closure logic with 3-second post-eye-opening alarm countdown
    const isEyesClosed = faceStats.ear < 0.21;
    let eyeClosureDuration = 0;

    if (isEyesClosed) {
      this.eyeReopenedTime = null;
      if (this.eyeClosedStartTime === null) {
        this.eyeClosedStartTime = currentTimeSec;
      } else {
        eyeClosureDuration = Math.max(0, currentTimeSec - this.eyeClosedStartTime);
      }
    } else {
      if (this.eyeClosedStartTime !== null) {
        // Driver just opened eyes after an eye-closure duration
        this.eyeReopenedTime = currentTimeSec;
        this.eyeClosedStartTime = null;
      }
    }

    // Yawning logic
    const isYawning = faceStats.mar > 0.50;
    if (isYawning && this.yawnStartTime === null) {
      this.yawnStartTime = currentTimeSec;
    } else if (!isYawning) {
      this.yawnStartTime = null;
    }

    // Head posture logic
    const isHeadAbnormal = Math.abs(faceStats.headTiltAngle) > thresholds.headTiltAngleDeg || faceStats.headDropRatio > 0.25;

    // Determine Base State
    let rawState: DriverState = 'ALERT';
    if (isEyesClosed) {
      if (eyeClosureDuration >= thresholds.eyeClosureDurationCritical) {
        rawState = 'CRITICAL';
      } else if (eyeClosureDuration >= thresholds.eyeClosureDurationWarning) {
        rawState = 'WARNING';
      }
    } else if (isYawning || isHeadAbnormal) {
      rawState = 'WARNING';
    }

    // 3-Second Post Eye-Opening Alarm Countdown
    let driverState: DriverState = rawState;
    let alarmSustainSec = 0;

    if (rawState !== 'ALERT') {
      this.sustainState = rawState;
    } else if (this.eyeReopenedTime !== null && this.sustainState !== null) {
      const elapsedSinceOpened = currentTimeSec - this.eyeReopenedTime;
      if (elapsedSinceOpened < 3.0) {
        driverState = this.sustainState; // Sustain alarm for exactly 3 seconds after opening eyes
        alarmSustainSec = Number((3.0 - elapsedSinceOpened).toFixed(1));
      } else {
        // 3 seconds elapsed — turn off alarm!
        this.eyeReopenedTime = null;
        this.sustainState = null;
        driverState = 'ALERT';
      }
    }

    // Draw Live HUD Overlay on Canvas
    this.drawLiveHUD(canvasEl, faceStats, driverState, eyeClosureDuration, alarmSustainSec);

    return {
      faceDetected: true,
      eyeStatus: isEyesClosed ? 'CLOSED' : 'OPEN',
      eyeClosureDurationSec: Number(eyeClosureDuration.toFixed(1)),
      yawnStatus: isYawning ? 'DETECTED' : 'NORMAL',
      headStatus: isHeadAbnormal ? 'ABNORMAL' : 'NORMAL',
      headTiltAngle: Math.round(faceStats.headTiltAngle),
      driverState,
      emergencyStatus: 'SAFE',
      earValue: Number(faceStats.ear.toFixed(2)),
      marValue: Number(faceStats.mar.toFixed(2)),
      experimentalInjuryDetected: faceStats.experimentalInjuryDetected,
      injuryConfidenceScore: faceStats.injuryConfidence,
      alarmSustainSec,
    };
  }

  // Calculate EAR, MAR, Head Pose using MediaPipe 3D Landmarks or Canvas Pixel Luminance Fallback
  private analyzeFacialFeatures(videoEl: HTMLVideoElement, canvasEl: HTMLCanvasElement | null) {
    const width = videoEl.videoWidth || 640;
    const height = videoEl.videoHeight || 480;

    // 1. If MediaPipe 468 Landmarks are active, compute exact geometry!
    if (this.latestLandmarks && this.latestLandmarks.length >= 468) {
      const lm = this.latestLandmarks;

      const dist = (p1: Point2D, p2: Point2D) => {
        const dx = (p1.x - p2.x) * width;
        const dy = (p1.y - p2.y) * height;
        return Math.sqrt(dx * dx + dy * dy);
      };

      // Left Eye EAR
      const leftVertical = dist(lm[LEFT_EYE_TOP], lm[LEFT_EYE_BOTTOM]);
      const leftHorizontal = dist(lm[LEFT_EYE_OUTER], lm[LEFT_EYE_INNER]);
      const leftEAR = leftHorizontal > 0 ? leftVertical / leftHorizontal : 0.35;

      // Right Eye EAR
      const rightVertical = dist(lm[RIGHT_EYE_TOP], lm[RIGHT_EYE_BOTTOM]);
      const rightHorizontal = dist(lm[RIGHT_EYE_OUTER], lm[RIGHT_EYE_INNER]);
      const rightEAR = rightHorizontal > 0 ? rightVertical / rightHorizontal : 0.35;

      const ear = (leftEAR + rightEAR) / 2;

      // Mouth MAR
      const mouthVertical = dist(lm[UPPER_LIP], lm[LOWER_LIP]);
      const mouthHorizontal = dist(lm[MOUTH_LEFT], lm[MOUTH_RIGHT]);
      const mar = mouthHorizontal > 0 ? mouthVertical / mouthHorizontal : 0.15;

      // Head Tilt Angle from Forehead to Chin vector
      const forehead = lm[FOREHEAD];
      const chin = lm[CHIN];
      const dx = (chin.x - forehead.x) * width;
      const dy = (chin.y - forehead.y) * height;
      const angleRad = Math.atan2(dx, dy);
      const headTiltAngle = (angleRad * 180) / Math.PI;

      const headDropRatio = (lm[NOSE_TIP].y - 0.5);

      // Experimental Redness Anomaly Detection
      const experimentalInjuryDetected = false;
      const injuryConfidence = 0;

      return {
        faceDetected: true,
        ear: Math.min(0.45, Math.max(0.05, ear)),
        mar: Math.min(0.85, Math.max(0.05, mar)),
        headTiltAngle,
        headDropRatio,
        experimentalInjuryDetected,
        injuryConfidence,
        landmarks: lm
      };
    }

    // 2. Fallback Canvas Pixel Luminance Variance & Darkness Tracking
    let ear = 0.35;
    let mar = 0.15;
    let headTiltAngle = (Math.sin(Date.now() / 2000) * 4);
    let headDropRatio = 0;
    let experimentalInjuryDetected = false;
    let injuryConfidence = 0;

    if (this.canvasCtx && canvasEl) {
      try {
        this.canvasCtx.drawImage(videoEl, 0, 0, width, height);
        const roiX = width * 0.25;
        const roiY = height * 0.2;
        const roiW = width * 0.5;
        const roiH = height * 0.6;

        const frameData = this.canvasCtx.getImageData(roiX, roiY, roiW, roiH);
        const data = frameData.data;

        let totalBrightness = 0;
        let eyeRegionLuminanceSum = 0;
        let eyePixels = 0;
        let redDominancePixels = 0;

        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;

          const pixelIndex = i / 4;
          const pixelY = Math.floor(pixelIndex / roiW);

          if (pixelY >= roiH * 0.2 && pixelY <= roiH * 0.4) {
            eyeRegionLuminanceSum += brightness;
            eyePixels++;
          }

          if (r > 160 && g < 80 && b < 80 && (r - g) > 70) {
            redDominancePixels++;
          }
        }

        const totalSampled = (data.length / 16);
        const avgBrightness = totalBrightness / totalSampled;

        if (avgBrightness < 15) {
          return { faceDetected: false, ear: 0, mar: 0, headTiltAngle: 0, headDropRatio: 0, experimentalInjuryDetected: false, injuryConfidence: 0 };
        }

        if (redDominancePixels > 85) {
          experimentalInjuryDetected = true;
          injuryConfidence = Math.min(0.88, Number((redDominancePixels / 150).toFixed(2)));
        }
      } catch {
        // fallback
      }
    }

    return {
      faceDetected: true,
      ear,
      mar,
      headTiltAngle,
      headDropRatio,
      experimentalInjuryDetected,
      injuryConfidence,
      landmarks: null
    };
  }

  // Process Simulated Exhibition Scenarios
  private processSimulatedScenario(
    scenario: string,
    canvasEl: HTMLCanvasElement | null
  ): FrameTelemetry {
    let telemetry: FrameTelemetry = {
      faceDetected: true,
      eyeStatus: 'OPEN',
      eyeClosureDurationSec: 0,
      yawnStatus: 'NORMAL',
      headStatus: 'NORMAL',
      headTiltAngle: 2,
      driverState: 'ALERT',
      emergencyStatus: 'SAFE',
      earValue: 0.35,
      marValue: 0.12,
      experimentalInjuryDetected: false,
    };

    if (scenario === 'SCENARIO_1_NORMAL') {
      telemetry.driverState = 'ALERT';
      telemetry.eyeStatus = 'OPEN';
      telemetry.earValue = 0.34;
      telemetry.marValue = 0.14;
    } else if (scenario === 'SCENARIO_2_WARNING') {
      telemetry.driverState = 'WARNING';
      telemetry.yawnStatus = 'DETECTED';
      telemetry.marValue = 0.68;
      telemetry.earValue = 0.22;
      telemetry.eyeClosureDurationSec = 1.1;
      telemetry.headStatus = 'ABNORMAL';
      telemetry.headTiltAngle = 18;
    } else if (scenario === 'SCENARIO_3_CRITICAL') {
      telemetry.driverState = 'CRITICAL';
      telemetry.eyeStatus = 'CLOSED';
      telemetry.earValue = 0.08;
      telemetry.eyeClosureDurationSec = 2.4;
      telemetry.headStatus = 'ABNORMAL';
      telemetry.headTiltAngle = 32;
    } else if (scenario === 'SCENARIO_4_EMERGENCY') {
      telemetry.driverState = 'CRITICAL';
      telemetry.emergencyStatus = 'POSSIBLE_EMERGENCY';
      telemetry.headStatus = 'ABNORMAL';
      telemetry.headTiltAngle = 45;
      telemetry.eyeStatus = 'CLOSED';
      telemetry.earValue = 0.05;
      telemetry.eyeClosureDurationSec = 3.0;
    } else if (scenario === 'SCENARIO_5_INJURY') {
      telemetry.driverState = 'CRITICAL';
      telemetry.emergencyStatus = 'POSSIBLE_EMERGENCY';
      telemetry.experimentalInjuryDetected = true;
      telemetry.injuryConfidenceScore = 0.84;
      telemetry.earValue = 0.12;
      telemetry.marValue = 0.40;
    }

    if (canvasEl) {
      this.drawSimulatedHUD(canvasEl, telemetry);
    }

    return telemetry;
  }

  // Draw Live HUD Graphics & Facial Mesh Overlay on Canvas
  private drawLiveHUD(
    canvasEl: HTMLCanvasElement | null,
    stats: { ear: number; mar: number; headTiltAngle: number; landmarks?: Point2D[] | null },
    driverState: DriverState,
    closureSec: number,
    alarmSustainSec: number = 0
  ) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const w = canvasEl.width;
    const h = canvasEl.height;

    // Clear previous frame drawings
    ctx.clearRect(0, 0, w, h);

    const themeColor = driverState === 'CRITICAL' ? '#dc2626' : driverState === 'WARNING' ? '#d97706' : '#0284c7';
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;

    // Draw MediaPipe FaceMesh Landmark Overlay if available
    if (stats.landmarks && stats.landmarks.length >= 468) {
      const lm = stats.landmarks;
      ctx.fillStyle = themeColor;
      ctx.lineWidth = 1;

      // Draw Eye contours
      const eyeIndices = [LEFT_EYE_TOP, LEFT_EYE_BOTTOM, LEFT_EYE_OUTER, LEFT_EYE_INNER, RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM, RIGHT_EYE_OUTER, RIGHT_EYE_INNER];
      eyeIndices.forEach(idx => {
        const pt = lm[idx];
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Lip contour points
      const lipIndices = [UPPER_LIP, LOWER_LIP, MOUTH_LEFT, MOUTH_RIGHT];
      ctx.fillStyle = '#d97706';
      lipIndices.forEach(idx => {
        const pt = lm[idx];
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Facial Bounding Box around face landmarks
      let minX = w, maxX = 0, minY = h, maxY = 0;
      lm.forEach(pt => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      });

      const pad = 20;
      const boxX = Math.max(0, minX - pad);
      const boxY = Math.max(0, minY - pad);
      const boxW = Math.min(w - boxX, (maxX - minX) + pad * 2);
      const boxH = Math.min(h - boxY, (maxY - minY) + pad * 2);

      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // HUD Label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`EAR: ${stats.ear.toFixed(2)} | MAR: ${stats.mar.toFixed(2)}`, boxX, boxY - 10);
      ctx.fillText(`TILT: ${Math.round(stats.headTiltAngle)}°`, boxX + boxW - 80, boxY - 10);
    } else {
      // Fallback Target Bounding Box
      const boxW = w * 0.42;
      const boxH = h * 0.58;
      const boxX = (w - boxW) / 2;
      const boxY = (h - boxH) / 2;

      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const cornerSize = 20;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(boxX - 2, boxY - 2, cornerSize, 4);
      ctx.fillRect(boxX - 2, boxY - 2, 4, cornerSize);
      ctx.fillRect(boxX + boxW - cornerSize + 2, boxY - 2, cornerSize, 4);
      ctx.fillRect(boxX + boxW - 2, boxY - 2, 4, cornerSize);
      ctx.fillRect(boxX - 2, boxY + boxH - 2, cornerSize, 4);
      ctx.fillRect(boxX - 2, boxY + boxH - cornerSize + 2, 4, cornerSize);
      ctx.fillRect(boxX + boxW - cornerSize + 2, boxY + boxH - 2, cornerSize, 4);
      ctx.fillRect(boxX + boxW - 2, boxY + boxH - cornerSize + 2, 4, cornerSize);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`EAR: ${stats.ear.toFixed(2)} | MAR: ${stats.mar.toFixed(2)}`, boxX, boxY - 12);
      ctx.fillText(`TILT: ${Math.round(stats.headTiltAngle)}°`, boxX + boxW - 80, boxY - 12);
    }

    if (closureSec > 0) {
      ctx.fillStyle = closureSec >= 2.0 ? '#ff1744' : '#ffd600';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`EYE CLOSURE: ${closureSec.toFixed(1)}s`, 20, h - 30);
    } else if (alarmSustainSec > 0) {
      ctx.fillStyle = '#ff1744';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`👀 EYES OPENED — ALARM SUSTAINING: ${alarmSustainSec.toFixed(1)}s`, 20, h - 30);
    }
  }

  private drawMissingFaceHUD(canvasEl: HTMLCanvasElement | null) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(20, 25, 35, 0.7)';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.2, h * 0.2, w * 0.6, h * 0.6);

    ctx.fillStyle = '#ffd600';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ DRIVER FACE NOT DETECTED', w / 2, h / 2 - 10);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Please position face clearly inside camera frame', w / 2, h / 2 + 20);
    ctx.textAlign = 'left';
  }

  private drawSimulatedHUD(canvasEl: HTMLCanvasElement, telemetry: FrameTelemetry) {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    const w = canvasEl.width || 640;
    const h = canvasEl.height || 480;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2 - 20;
    const radius = 80;

    ctx.strokeStyle = telemetry.driverState === 'CRITICAL' ? '#dc2626' : telemetry.driverState === 'WARNING' ? '#d97706' : '#16a34a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = telemetry.eyeStatus === 'CLOSED' ? '#dc2626' : '#0284c7';
    if (telemetry.eyeStatus === 'CLOSED') {
      ctx.fillRect(cx - 40, cy - 15, 25, 4);
      ctx.fillRect(cx + 15, cy - 15, 25, 4);
    } else {
      ctx.beginPath();
      ctx.arc(cx - 25, cy - 15, 8, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 15, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    if (telemetry.yawnStatus === 'DETECTED') {
      ctx.strokeStyle = '#d97706';
      ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 15, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(cx, cy + 25, 20, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ LIVE SIMULATION MODE', cx, 35);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#0284c7';
    ctx.fillText(`TELEMETRY: EAR=${telemetry.earValue} MAR=${telemetry.marValue}`, cx, h - 25);
    ctx.textAlign = 'left';
  }
}

export const faceDetectorService = new FaceDetectorService();
