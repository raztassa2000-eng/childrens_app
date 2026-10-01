import { audioContext, noiseBuffer } from "./audio";
import { rng } from "./paint";

/**
 * A procedural, cheerful theme tune. Each series gets its own melody from a
 * seed, so every show has a recognizable song. Ducks under narration.
 */

const MAJOR_PENTATONIC = [0, 2, 4, 7, 9];
// I - V - vi - IV, as semitone offsets of each chord root.
const PROGRESSION = [0, 7, 9, 5];

export class MusicBox {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private readonly tempo: number;
  private readonly root: number;
  private readonly melody: number[];
  private noise: AudioBuffer | null = null;
  private volume = 0.16;
  private ducked = false;

  constructor(seed: number) {
    const r = rng(seed);
    this.tempo = 96 + Math.floor(r() * 28);
    this.root = 57 + Math.floor(r() * 7); // A3..D#4
    // 32-step melody (2 bars of 16th notes), -1 = rest.
    this.melody = [];
    let degree = 2;
    for (let i = 0; i < 32; i++) {
      if (i % 4 !== 0 && r() < 0.45) {
        this.melody.push(-1);
        continue;
      }
      degree = Math.max(0, Math.min(9, degree + Math.floor(r() * 5) - 2));
      this.melody.push(degree);
    }
  }

  get playing() {
    return this.timer !== null;
  }

  start() {
    if (this.timer !== null) return;
    this.ctx = audioContext();
    if (!this.ctx) return;
    if (!this.master) {
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.noise = noiseBuffer(this.ctx, 0.2);
    }
    this.master.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.master.gain.exponentialRampToValueAtTime(this.targetVolume(), this.ctx.currentTime + 0.6);
    this.nextTime = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 40);
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    if (this.ctx && this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.applyVolume();
  }

  duck(on: boolean) {
    if (this.ducked === on) return;
    this.ducked = on;
    this.applyVolume();
  }

  private targetVolume() {
    return Math.max(0.0001, this.volume * (this.ducked ? 0.35 : 1));
  }

  private applyVolume() {
    if (!this.ctx || !this.master || this.timer === null) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(this.targetVolume(), this.ctx.currentTime, 0.25);
  }

  private schedule() {
    if (!this.ctx || !this.master) return;
    const sixteenth = 60 / this.tempo / 4;
    while (this.nextTime < this.ctx.currentTime + 0.2) {
      this.playStep(this.step, this.nextTime, sixteenth);
      this.nextTime += sixteenth;
      this.step = (this.step + 1) % 64;
    }
  }

  private playStep(step: number, time: number, sixteenth: number) {
    const bar = Math.floor(step / 16) % 4;
    const chordRoot = this.root + PROGRESSION[bar];
    const beat = step % 16;

    if (beat % 8 === 0) this.note(midi(chordRoot - 12), time, sixteenth * 7, "sine", 0.5);
    if (beat % 8 === 4) this.note(midi(chordRoot - 5), time, sixteenth * 3, "sine", 0.32);
    if (beat % 4 === 2) this.hat(time);
    if (beat === 0) this.kick(time);

    const degree = this.melody[step % 32];
    if (degree >= 0) {
      const octave = Math.floor(degree / 5);
      const pitch = this.root + 12 + octave * 12 + MAJOR_PENTATONIC[degree % 5];
      this.note(midi(pitch), time, sixteenth * 1.8, "triangle", 0.28);
    }
  }

  private note(freq: number, time: number, duration: number, type: OscillatorType, volume: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain).connect(this.master!);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private hat(time: number) {
    if (!this.noise) return;
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    src.connect(filter).connect(gain).connect(this.master!);
    src.start(time);
    src.stop(time + 0.06);
  }

  private kick(time: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc.connect(gain).connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.2);
  }
}

function midi(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}
