// Comprehensive Web Audio procedural sound & Indian music synthesizer
// Works 100% self-contained without needing external network assets

class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private voiceVolume: number = 0.9;
  private voiceEnabled: boolean = true;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private customVoiceAudioUrl: string | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();

        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);

        this.sfxGain.connect(this.ctx.destination);
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(sfx: number, music: number, voice: number) {
    this.sfxVolume = sfx;
    this.musicVolume = music;
    this.voiceVolume = voice;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : sfx, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : music, this.ctx.currentTime);
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public setCustomVoiceAudio(dataUrl: string | null) {
    this.customVoiceAudioUrl = dataUrl;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolumes(this.sfxVolume, this.musicVolume, this.voiceVolume);
    return this.isMuted;
  }

  // --- SFX GENERATORS ---

  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    // Sparkling Indian brass chime
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.22);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playSlide() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Filtered noise for stone/sand friction
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    whiteNoise.start(now);
  }

  public playPowerup() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const now = this.ctx!.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  public playShieldBreak() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.6 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playCrash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Heavy bass impact
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    oscGain.gain.setValueAtTime(0.7 * this.sfxVolume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.4);

    // Stone rubble noise
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);
  }

  public playChaserRoar() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(700, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    gain.gain.setValueAtTime(0.5 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // --- STAGE CUES & VOICE LINES ---
  public playStageComplete() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Regal Indian fanfare (Sitar/Santoor motif in Raag Bilawal)
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const now = this.ctx!.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.6);
    });

    // Voice announcement: "Stage Complete! Shabaash!"
    if (this.voiceEnabled) {
      this.speakVoice('Shabaash Sajid! Stage complete!', 'hi-IN');
    }
  }

  public playStageUncomplete() {
    this.initContext();
    // Play crash sound
    this.playCrash();

    // Voice line: User requested audio / dialogue for stage uncomplete
    if (this.voiceEnabled) {
      if (this.customVoiceAudioUrl) {
        try {
          const audio = new Audio(this.customVoiceAudioUrl);
          audio.volume = this.voiceVolume;
          audio.play().catch(() => {});
          return;
        } catch {
          // fallback
        }
      }
      // Speak the prompt line in Hindi: "Uth jaa! Bhaag!"
      this.speakVoice('Uth jaa! Bhaag!', 'hi-IN');
    }
  }

  private speakVoice(text: string, lang = 'hi-IN') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.voiceVolume;
      utterance.rate = 1.15;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN')) || voices[0];
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignored if speech synthesis fails in browser
    }
  }

  // --- PROCEDURAL INDIAN BACKGROUND MUSIC ---
  // Indian rhythmic percussion (Dholak/Tabla simulation) + Drone Tanpura
  public startMusic(stageIndex: number = 0, speedFactor: number = 1) {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    let beat = 0;
    const baseIntervalMs = Math.max(120, 240 / (1 + (speedFactor - 1) * 0.4));

    const scales = [
      // Stage 1: Ancient Temple (Bhairav - mystical)
      [220, 233.08, 277.18, 293.66, 329.63, 349.23, 415.30, 440],
      // Stage 2: Jungle (Charukeshi - adventurous)
      [220, 246.94, 277.18, 293.66, 329.63, 349.23, 392.00, 440],
      // Stage 3: Desert (Marwa - eerie heat)
      [220, 233.08, 277.18, 311.13, 329.63, 369.99, 415.30, 440],
      // Stage 4: Mountain (Bhoopali - uplifting pentatonic)
      [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37],
      // Stage 5: Royal Fort (Darbari - majestic royal)
      [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440],
      // Stage 6: Night Jungle (Kafi - mystical nocturnal)
      [220, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00, 440],
      // Stage 7: Cursed Temple (Todi - dark ominous)
      [220, 233.08, 261.63, 311.13, 329.63, 349.23, 415.30, 440],
    ];

    const currentScale = scales[stageIndex % scales.length];

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      // 1. Dholak / Tabla Bass "Ghe" on beats 0, 4, 6
      if (beat % 8 === 0 || beat % 8 === 4 || beat % 8 === 6) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(beat % 8 === 0 ? 82.4 : 95.0, now);
        bassOsc.frequency.exponentialRampToValueAtTime(45.0, now + 0.16);

        bassGain.gain.setValueAtTime(0.4 * this.musicVolume, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.16);
      }

      // 2. Tabla Treble "Ta / Tin" on beats 2, 5, 7
      if (beat % 8 === 2 || beat % 8 === 5 || beat % 8 === 7) {
        const trebleOsc = this.ctx.createOscillator();
        const trebleGain = this.ctx.createGain();
        trebleOsc.type = 'triangle';
        trebleOsc.frequency.setValueAtTime(330, now);
        trebleOsc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

        trebleGain.gain.setValueAtTime(0.2 * this.musicVolume, now);
        trebleGain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);

        trebleOsc.connect(trebleGain);
        trebleGain.connect(this.musicGain);
        trebleOsc.start(now);
        trebleOsc.stop(now + 0.08);
      }

      // 3. Indian Melodic Sitar pluck every 4 beats
      if (beat % 4 === 0) {
        const noteIndex = Math.floor(Math.random() * currentScale.length);
        const freq = currentScale[noteIndex];

        const sitarOsc = this.ctx.createOscillator();
        const sitarFilter = this.ctx.createBiquadFilter();
        const sitarGain = this.ctx.createGain();

        sitarOsc.type = 'sawtooth';
        sitarOsc.frequency.setValueAtTime(freq, now);

        sitarFilter.type = 'bandpass';
        sitarFilter.frequency.setValueAtTime(freq * 1.5, now);
        sitarFilter.Q.setValueAtTime(3.0, now);

        sitarGain.gain.setValueAtTime(0.18 * this.musicVolume, now);
        sitarGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        sitarOsc.connect(sitarFilter);
        sitarFilter.connect(sitarGain);
        sitarGain.connect(this.musicGain);

        sitarOsc.start(now);
        sitarOsc.stop(now + 0.35);
      }

      beat = (beat + 1) % 16;
    }, baseIntervalMs);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundManager = new SoundManager();
