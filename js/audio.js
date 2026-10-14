/**
 * MCU: THE SACRED TIMELINE
 * Ambient Procedural Audio Engine (Web Audio API)
 *
 * Generates an ethereal, cinematic TVA ambient timeline drone and interface sound effects
 * entirely procedurally without any external audio asset dependencies.
 * Default state: MUTED (per browser autoplay policies and user preference).
 */

class TimelineAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.droneGain = null;
    this.filterNode = null;
    this.oscillators = [];
    this.lfo = null;
    this.noiseNode = null;
    this.initialized = false;

    // Listeners for toggle buttons
    this.onStateChangeCallbacks = [];
  }

  init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported in this browser.');
        return;
      }
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Drone sub-bus
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      // Low pass filter to give that deep cosmic / TVA temporal chamber resonance
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(3.5, this.ctx.currentTime);

      this.droneGain.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);

      // LFO for subtle breathing filter movement (0.1 Hz)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      this.lfo.start();

      // Dual base oscillators (A1 = 55Hz, E2 = 82.4Hz, A2 = 110Hz harmonic drone)
      const dronePitches = [55.0, 55.4, 82.41, 110.0];
      dronePitches.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(idx === 0 ? 0.3 : 0.15, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.droneGain);
        osc.start();
        this.oscillators.push(osc);
      });

      // Subtle pink/cosmic noise bed for temporal wind
      this._initNoiseBed();

      this.initialized = true;
    } catch (e) {
      console.error('Failed to initialize AudioContext:', e);
    }
  }

  _initNoiseBed() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  toggle() {
    if (!this.initialized) {
      this.init();
    }
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    if (this.isPlaying) {
      // Fade out
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      this.isPlaying = false;
    } else {
      // Fade in
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 2.0);
      this.isPlaying = true;
    }

    this._notifyState();
    return this.isPlaying;
  }

  /**
   * Modulate drone frequency slightly based on timeline scroll velocity
   */
  updateScrollVelocity(velocity) {
    if (!this.isPlaying || !this.filterNode || !this.ctx) return;
    const clampedVel = Math.min(Math.abs(velocity || 0), 80);
    const targetFreq = 140 + clampedVel * 2.2;
    this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.2);
  }

  /**
   * Sci-fi holographic chirp when opening modal or selecting timeline nodes
   */
  playChirp(high = false) {
    if (!this.initialized || !this.isPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = high ? 1320 : 880;
      const endFreq = high ? 2640 : 1760;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  /**
   * Sound effect for the Thanos Infinity Snap easter egg
   */
  playSnapSound() {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    try {
      const now = this.ctx.currentTime;

      // 1. Sharp metallic snap click
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1400, now);
      snapOsc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

      snapGain.gain.setValueAtTime(0.5, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.25);

      // 2. Cosmic sub-bass implosion
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now + 0.05);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 1.8);

      subGain.gain.setValueAtTime(0.8, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now + 0.05);
      subOsc.stop(now + 2.6);
    } catch (_) {}
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  _notifyState() {
    this.onStateChangeCallbacks.forEach(cb => cb(this.isPlaying));
  }
}

// Global instance export
window.TimelineAudio = new TimelineAudioEngine();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TimelineAudioEngine, TimelineAudio: window.TimelineAudio };
}
