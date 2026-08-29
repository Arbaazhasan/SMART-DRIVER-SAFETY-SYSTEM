// Web Audio API Synthesizer for Safety Alarms & Buzzers

class AudioService {
  private audioCtx: AudioContext | null = null;
  private activeLoopInterval: number | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.attachUserInteractionListeners();
  }

  private attachUserInteractionListeners() {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      this.initContext();
      if (this.audioCtx && this.audioCtx.state === 'running') {
        window.removeEventListener('click', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
      }
    };

    window.addEventListener('click', unlockHandler);
    window.addEventListener('keydown', unlockHandler);
    window.addEventListener('touchstart', unlockHandler);
  }

  public initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarm();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playWarningSound(volume = 0.6) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      // Pleasant warning double-beep (800Hz -> 1000Hz)
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, now); // G5
      osc.frequency.setValueAtTime(987, now + 0.12); // B5

      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Warning sound playback error:', e);
    }
  }

  public playCriticalAlarm(volume = 0.85) {
    if (this.isMuted) return;
    this.stopAlarm(); // clear any ongoing
    this.initContext();
    if (!this.audioCtx) return;

    try {
      // Urgent Pulsing Alarm Tone (880Hz alternating with 660Hz square wave)
      let isHigh = true;

      const triggerPulse = () => {
        if (!this.audioCtx || this.isMuted) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(isHigh ? 880 : 660, now);
        isHigh = !isHigh;

        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      };

      triggerPulse();
      this.activeLoopInterval = window.setInterval(triggerPulse, 220);
    } catch (e) {
      console.warn('Critical alarm playback error:', e);
    }
  }

  public playEmergencySiren(volume = 1.0) {
    if (this.isMuted) return;
    this.stopAlarm();
    this.initContext();
    if (!this.audioCtx) return;

    try {
      let pitchShift = 0;
      const triggerSirenStep = () => {
        if (!this.audioCtx || this.isMuted) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        const freq = 600 + Math.sin(pitchShift) * 400; // 200Hz to 1000Hz sweep
        pitchShift += 0.4;

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      };

      triggerSirenStep();
      this.activeLoopInterval = window.setInterval(triggerSirenStep, 100);
    } catch (e) {
      console.warn('Emergency siren playback error:', e);
    }
  }

  public stopAlarm() {
    if (this.activeLoopInterval !== null) {
      clearInterval(this.activeLoopInterval);
      this.activeLoopInterval = null;
    }
  }

  public testSound(type: 'warning' | 'critical' | 'emergency', volume = 0.7) {
    this.initContext();
    if (type === 'warning') {
      this.playWarningSound(volume);
    } else if (type === 'critical') {
      this.playCriticalAlarm(volume);
      setTimeout(() => this.stopAlarm(), 2500);
    } else if (type === 'emergency') {
      this.playEmergencySiren(volume);
      setTimeout(() => this.stopAlarm(), 3000);
    }
  }
}

export const audioService = new AudioService();
