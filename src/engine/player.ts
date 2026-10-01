import { buildTimeline, lineAt, sceneAt, type TimedLine, type Timeline } from "../../shared/timeline";
import type { Episode, Series } from "../../shared/types";
import { MusicBox } from "./music";
import { W, hash } from "./paint";
import { renderFrame } from "./render";
import { sfx } from "./sfx";
import { audioContext } from "./audio";
import { getSpeech } from "./speech";
import { loudness, type VoiceClip, type VoicePack } from "./voicePack";

export interface PlayerSettings {
  narration: boolean;
  music: boolean;
  captions: boolean;
  /** Speech rate multiplier; also stretches the timeline to match. */
  rate: number;
}

export type PlayerStatus = "paused" | "playing" | "ended";

/**
 * Plays an episode script like a video: a timeline clock drives the canvas
 * renderer, triggers narration line by line, and waits for the voice when a
 * line runs long so words and pictures never drift apart.
 */
export class EpisodePlayer {
  timeline: Timeline;
  t = 0;
  status: PlayerStatus = "paused";
  onEnded: (() => void) | null = null;
  /** Called with seconds of real playback, for screen-time tracking. */
  onWatched: ((seconds: number) => void) | null = null;

  private readonly ctx: CanvasRenderingContext2D;
  private readonly music: MusicBox;
  private wall = 0;
  private raf = 0;
  private last = 0;
  private pixelRatio = 1;
  private textScale = 1;
  /** Phones held upright show the words under the video instead of inside it. */
  textMode: "canvas" | "outside" = "canvas";
  private spoken = new Set<string>();
  private speaking: { line: TimedLine; done: boolean; token: number } | null = null;
  /** The natural-voice clip playing right now, for lip-sync. */
  private clip: { clip: VoiceClip; source: AudioBufferSourceNode; startedAt: number } | null = null;
  private unsubscribeVoices: (() => void) | null = null;
  /** True while the story pauses for a natural voice that's still being made. */
  waitingForVoice = false;
  private token = 0;
  private holdStarted = -1;
  private lastScene = -1;
  private listeners = new Set<() => void>();
  private destroyed = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly series: Series,
    private readonly episode: Episode,
    private readonly colors: [string, string],
    private settings: PlayerSettings,
    private readonly voices: VoicePack | null = null,
  ) {
    this.timeline = buildTimeline(series, episode, settings.rate, voices?.durations());
    this.unsubscribeVoices = voices?.subscribe(() => this.retime()) ?? null;
    this.ctx = canvas.getContext("2d")!;
    this.music = new MusicBox(hash(series.id));
    this.resize();
  }

  /**
   * Re-times the episode to the real voice lengths as they arrive, keeping the
   * playhead at the same moment of the story.
   */
  private retime() {
    if (this.destroyed || !this.voices) return;
    const old = this.timeline;
    const next = buildTimeline(this.series, this.episode, this.settings.rate, this.voices.durations());
    const anchors = (tl: Timeline) => [
      0,
      tl.introEnd,
      ...tl.lines.flatMap((l) => [l.start, l.end]),
      ...tl.scenes.flatMap((s) => [s.start, s.end]),
      tl.outroStart,
      tl.duration,
    ];
    const from = anchors(old);
    const to = anchors(next);
    const order = from.map((_, i) => i).sort((a, b) => from[a] - from[b] || to[a] - to[b]);
    let mapped = (this.t / old.duration) * next.duration;
    for (let k = 0; k < order.length - 1; k++) {
      const a = order[k];
      const b = order[k + 1];
      if (this.t >= from[a] && this.t <= from[b]) {
        const span = from[b] - from[a];
        mapped = span > 0 ? to[a] + ((this.t - from[a]) / span) * (to[b] - to[a]) : to[b];
        break;
      }
    }
    this.timeline = next;
    this.t = Math.min(Math.max(0, mapped), next.duration - 0.05);
    if (this.speaking) {
      const line = next.lines.find((l) => l.key === this.speaking!.line.key);
      if (line) this.speaking.line = line;
    }
    this.emit();
  }

  get duration() {
    return this.timeline.duration;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) listener();
  }

  play() {
    if (this.destroyed || this.status === "playing") return;
    if (this.status === "ended") this.seek(0);
    this.status = "playing";
    if (this.settings.music) this.music.start();
    this.last = 0;
    if (!this.raf) this.raf = requestAnimationFrame(this.loop);
    this.emit();
  }

  pause() {
    if (this.status !== "playing") return;
    this.status = "paused";
    this.stopSpeech(true);
    this.music.stop();
    this.draw();
    this.emit();
  }

  toggle() {
    if (this.status === "playing") this.pause();
    else this.play();
  }

  seek(t: number) {
    this.stopSpeech(false);
    let target = Math.min(Math.max(0, t), this.timeline.duration - 0.05);
    // Land on the start of a sentence so narration is never cut in half.
    const current = lineAt(this.timeline, target);
    if (current) target = current.start;
    this.t = target;
    this.spoken = new Set(this.timeline.lines.filter((l) => l.start < target).map((l) => l.key));
    this.lastScene = sceneAt(this.timeline, target);
    if (this.status === "ended") this.status = "paused";
    this.draw();
    this.emit();
  }

  /** Jumps to the previous/next scene boundary. */
  skip(direction: -1 | 1) {
    const marks = [0, ...this.timeline.scenes.map((s) => s.start), this.timeline.outroStart];
    const now = this.t;
    const target =
      direction > 0 ? marks.find((m) => m > now + 0.5) : [...marks].reverse().find((m) => m < now - 1.5);
    if (target !== undefined) this.seek(target);
    else if (direction < 0) this.seek(0);
  }

  update(settings: Partial<PlayerSettings>) {
    this.settings = { ...this.settings, ...settings };
    if (settings.narration === false) this.stopSpeech(false);
    if (settings.music === false) this.music.stop();
    if (settings.music === true && this.status === "playing") this.music.start();
    this.draw();
    this.emit();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width || 960;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, Math.round(cssWidth * dpr));
    const height = Math.round((width * 9) / 16);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.pixelRatio = width / W;
    // Keep in-video words at least ~15 CSS pixels tall.
    this.textScale = Math.min(2, Math.max(1, 640 / cssWidth));
    const mode = cssWidth < 560 ? "outside" : "canvas";
    if (mode !== this.textMode) {
      this.textMode = mode;
      this.emit();
    }
    this.draw();
  }

  destroy() {
    this.destroyed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.stopSpeech(false);
    this.music.stop();
    this.unsubscribeVoices?.();
    this.listeners.clear();
  }

  /** How loud the current natural-voice clip is right now (null with device voices). */
  private talkLevel(): number | null {
    const playing = this.clip;
    const ctx = playing && audioContext();
    if (!playing || !ctx) return null;
    return loudness(playing.clip, Math.max(0, (ctx.currentTime - playing.startedAt) * this.settings.rate));
  }

  activeLine(): TimedLine | null {
    if (this.speaking && !this.speaking.done) return this.speaking.line;
    return lineAt(this.timeline, this.t);
  }

  draw() {
    if (this.destroyed) return;
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    renderFrame(this.ctx, {
      series: this.series,
      episode: this.episode,
      timeline: this.timeline,
      t: this.t,
      wall: this.wall,
      activeLine: this.activeLine(),
      showText: this.settings.captions,
      colors: this.colors,
      pixelRatio: this.pixelRatio,
      textScale: this.textScale,
      textMode: this.textMode,
      talkLevel: this.talkLevel(),
    });
  }

  private loop = (now: number) => {
    this.raf = 0;
    if (this.destroyed) return;
    const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0;
    this.last = now;
    if (this.status === "playing") {
      this.wall += dt;
      this.advance(dt);
      this.onWatched?.(dt);
    }
    this.draw();
    if (this.status === "playing") this.raf = requestAnimationFrame(this.loop);
  };

  private advance(dt: number) {
    let next = this.t + dt;
    const speaking = this.speaking;
    if (speaking && !speaking.done && next >= speaking.line.end) {
      // The voice is still talking: hold the timeline while characters keep moving.
      if (this.holdStarted < 0) this.holdStarted = this.wall;
      if (this.wall - this.holdStarted < 12) next = Math.max(this.t, speaking.line.end - 0.001);
    } else {
      this.holdStarted = -1;
    }
    this.t = Math.min(next, this.timeline.duration);
    this.triggerLines();
    this.sceneEffects();
    if (this.t >= this.timeline.duration) this.finish();
    this.emit();
  }

  private triggerLines() {
    for (const line of this.timeline.lines) {
      if (line.start > this.t) break;
      if (this.spoken.has(line.key)) continue;
      this.spoken.add(line.key);
      if (this.t < line.end) this.say(line);
    }
  }

  private say(line: TimedLine) {
    const token = ++this.token;
    this.speaking = { line, done: false, token };
    const device = getSpeech();
    const voices = this.voices?.available ? this.voices : null;
    if (!this.settings.narration || (!device.supported && !voices)) {
      this.speaking.done = true;
      return;
    }
    const current = () => this.speaking?.token === token;
    const finish = () => {
      if (!current()) return;
      this.speaking!.done = true;
      this.clip = null;
      this.music.duck(false);
    };
    this.music.duck(true);
    void (async () => {
      // Natural voice if there is (or soon will be) one; the timeline holds while we wait.
      let clip = voices?.get(line.key);
      if (!clip && voices?.expecting(line.key)) {
        this.waitingForVoice = true;
        this.emit();
        clip = await voices.waitFor(line.key, 10000);
        this.waitingForVoice = false;
        this.emit();
      }
      if (!current()) return;
      if (clip && this.playClip(clip, finish)) return;
      await this.deviceSay(line);
      finish();
    })();
  }

  private playClip(clip: VoiceClip, onDone: () => void): boolean {
    const ctx = audioContext();
    if (!ctx) return false;
    const source = ctx.createBufferSource();
    source.buffer = clip.buffer;
    source.playbackRate.value = this.settings.rate;
    source.connect(ctx.destination);
    source.onended = () => {
      if (this.clip?.source === source) onDone();
    };
    this.clip = { clip, source, startedAt: ctx.currentTime };
    source.start();
    return true;
  }

  private deviceSay(line: TimedLine): Promise<void> {
    const speech = getSpeech();
    if (!speech.supported) return Promise.resolve();
    const index = this.series.cast.findIndex((c) => c.id === line.speaker);
    const member = index >= 0 ? this.series.cast[index] : undefined;
    const isExtra = !member && line.speaker !== "narrator";
    return speech.speak(line.text, {
      lang: this.series.language,
      style: member?.voice ?? (isExtra ? "child" : "narrator"),
      rate: this.settings.rate,
      slot: member ? index + 1 : isExtra ? 4 : 0,
    });
  }

  private stopSpeech(rewind: boolean) {
    const speaking = this.speaking;
    this.token++;
    this.speaking = null;
    this.holdStarted = -1;
    this.waitingForVoice = false;
    const clip = this.clip;
    this.clip = null;
    try {
      clip?.source.stop();
    } catch {
      // Already finished.
    }
    getSpeech().cancel();
    this.music.duck(false);
    if (rewind && speaking && !speaking.done && this.t >= speaking.line.start) {
      this.t = speaking.line.start;
      this.spoken.delete(speaking.line.key);
    }
  }

  private sceneEffects() {
    const scene = sceneAt(this.timeline, this.t);
    if (scene === this.lastScene) return;
    const previous = this.lastScene;
    this.lastScene = scene;
    if (scene === this.timeline.scenes.length) sfx.chime();
    else if (scene === 0 || (scene > 0 && previous >= 0 && this.episode.scenes[scene].background !== this.episode.scenes[previous]?.background)) sfx.whoosh();
  }

  private finish() {
    this.t = this.timeline.duration;
    this.status = "ended";
    this.music.stop();
    this.stopSpeech(false);
    this.draw();
    this.emit();
    this.onEnded?.();
  }
}
