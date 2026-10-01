import { API_BASE } from "../lib/api";
import { audioContext } from "./audio";

/**
 * The natural (Gemini) voices for one episode. The server renders lines in
 * story order; this polls until they're all ready, downloading and decoding
 * each clip as it appears.
 */

export const ENVELOPE_RATE = 20;

export interface VoiceClip {
  buffer: AudioBuffer;
  seconds: number;
  /** Loudness 0-1, ENVELOPE_RATE samples per second: drives the talking animation. */
  env: number[];
}

interface ServerClip {
  url: string;
  seconds: number;
  env: number[];
}

interface PackResponse {
  lines: Record<string, ServerClip>;
  pending: number;
  failed: number;
}

export class VoicePack {
  private readonly clips = new Map<string, VoiceClip>();
  private readonly loading = new Set<string>();
  private readonly waiters = new Set<() => void>();
  private listeners = new Set<() => void>();
  private stopped = false;
  /** True once the server has nothing left to render (or gave up). */
  settled = false;
  /** False when the server can't make voices at all: use the device's voices. */
  available = true;

  constructor(
    private readonly seriesId: string,
    private readonly episode: number,
  ) {
    void this.poll();
  }

  get(key: string): VoiceClip | undefined {
    return this.clips.get(key);
  }

  /** Real clip lengths, for timing the episode to the voices. */
  durations(): Record<string, number> {
    return Object.fromEntries([...this.clips].map(([key, clip]) => [key, clip.seconds]));
  }

  get readyCount() {
    return this.clips.size;
  }

  /** Whether a line could still arrive (worth waiting for instead of using the device voice). */
  expecting(key: string) {
    return this.available && !this.clips.has(key) && (!this.settled || this.loading.has(key));
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Resolves with the clip once it's ready, or undefined if it won't come within `ms`. */
  waitFor(key: string, ms: number): Promise<VoiceClip | undefined> {
    const now = this.clips.get(key);
    if (now || !this.expecting(key)) return Promise.resolve(now);
    return new Promise((resolve) => {
      const check = () => {
        const clip = this.clips.get(key);
        if (clip || !this.expecting(key) || this.stopped) finish(clip);
      };
      const finish = (clip: VoiceClip | undefined) => {
        window.clearTimeout(timer);
        this.waiters.delete(check);
        resolve(clip);
      };
      const timer = window.setTimeout(() => finish(undefined), ms);
      this.waiters.add(check);
    });
  }

  stop() {
    this.stopped = true;
    for (const waiter of [...this.waiters]) waiter();
    this.listeners.clear();
  }

  private changed() {
    for (const waiter of [...this.waiters]) waiter();
    for (const listener of this.listeners) listener();
  }

  private async poll() {
    let delay = 800;
    let errors = 0;
    while (!this.stopped) {
      let status: PackResponse;
      try {
        const res = await fetch(`${API_BASE}/api/voices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seriesId: this.seriesId, episode: this.episode }),
        });
        if (!res.ok) {
          // No key on the server, or a show the server doesn't know: device voices it is.
          this.available = false;
          break;
        }
        status = (await res.json()) as PackResponse;
        errors = 0;
      } catch {
        if (++errors >= 3) {
          this.available = false;
          break;
        }
        await sleep(delay);
        continue;
      }
      await Promise.all(Object.entries(status.lines).map(([key, clip]) => this.download(key, clip)));
      if (status.pending === 0) break;
      await sleep(delay);
      delay = Math.min(2500, delay * 1.3);
    }
    this.settled = true;
    this.changed();
  }

  private async download(key: string, clip: ServerClip) {
    if (this.clips.has(key) || this.loading.has(key)) return;
    const ctx = audioContext();
    if (!ctx) return;
    this.loading.add(key);
    try {
      const res = await fetch(API_BASE + clip.url);
      if (!res.ok) throw new Error(String(res.status));
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      if (!this.stopped) {
        this.clips.set(key, { buffer, seconds: clip.seconds, env: clip.env });
        this.changed();
      }
    } catch {
      // That one line will use the device's voice.
    } finally {
      this.loading.delete(key);
    }
  }
}

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms));
}

/** Loudness of a clip `seconds` into it. */
export function loudness(clip: VoiceClip, seconds: number): number {
  const i = seconds * ENVELOPE_RATE;
  const a = clip.env[Math.floor(i)] ?? 0;
  const b = clip.env[Math.floor(i) + 1] ?? 0;
  return a + (b - a) * (i - Math.floor(i));
}
