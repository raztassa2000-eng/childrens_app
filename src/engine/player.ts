import { buildTimeline, lineAt, sceneAt, type TimedLine, type Timeline } from "../../shared/timeline";
import type { Episode, Series } from "../../shared/types";
import { MusicBox } from "./music";
import { W, hash } from "./paint";
import { renderFrame } from "./render";
import { sfx } from "./sfx";
import { getSpeech } from "./speech";

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
  readonly timeline: Timeline;
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
  ) {
    this.timeline = buildTimeline(series, episode, settings.rate);
    this.ctx = canvas.getContext("2d")!;
    this.music = new MusicBox(hash(series.id));
    this.resize();
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
    this.listeners.clear();
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
      if (this.wall - this.holdStarted < 8) next = Math.max(this.t, speaking.line.end - 0.001);
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
    const speech = getSpeech();
    this.speaking = { line, done: false, token };
    if (!this.settings.narration || !speech.supported) {
      this.speaking.done = true;
      return;
    }
    const index = this.series.cast.findIndex((c) => c.id === line.speaker);
    const member = index >= 0 ? this.series.cast[index] : undefined;
    const isExtra = !member && line.speaker !== "narrator";
    this.music.duck(true);
    void speech
      .speak(line.text, {
        lang: this.series.language,
        style: member?.voice ?? (isExtra ? "child" : "narrator"),
        rate: this.settings.rate,
        slot: member ? index + 1 : isExtra ? 4 : 0,
      })
      .then(() => {
        if (this.speaking?.token !== token) return;
        this.speaking.done = true;
        this.music.duck(false);
      });
  }

  private stopSpeech(rewind: boolean) {
    const speaking = this.speaking;
    this.token++;
    this.speaking = null;
    this.holdStarted = -1;
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
