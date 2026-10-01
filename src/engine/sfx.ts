import { audioContext, noiseBuffer } from "./audio";

/** Tiny synthesized sound effects: no audio files to ship. */

let enabled = true;
export function setSfxEnabled(value: boolean) {
  enabled = value;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number, slideTo?: number) {
  const ctx = audioContext();
  if (!ctx || !enabled) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  pop() {
    tone(520, 0, 0.12, "sine", 0.25, 1100);
  },
  click() {
    tone(880, 0, 0.06, "triangle", 0.12);
  },
  chime() {
    tone(1046.5, 0, 0.35, "sine", 0.15);
    tone(1568, 0.08, 0.45, "sine", 0.12);
  },
  correct() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.3, "triangle", 0.18));
  },
  tryAgain() {
    tone(330, 0, 0.18, "sine", 0.18, 260);
    tone(260, 0.16, 0.25, "sine", 0.15, 220);
  },
  tada() {
    [392, 523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.07, 0.6, "triangle", 0.16));
    tone(1046.5, 0.32, 0.9, "sine", 0.14);
  },
  whoosh() {
    const ctx = audioContext();
    if (!ctx || !enabled) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    const t0 = ctx.currentTime;
    filter.frequency.setValueAtTime(400, t0);
    filter.frequency.exponentialRampToValueAtTime(3000, t0 + 0.35);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + 0.5);
  },
};
