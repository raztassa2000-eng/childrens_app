import { NARRATOR, type Episode, type Series } from "./types";

/**
 * Turns an episode script into a timed "video" timeline. Scene length is driven
 * by how long the lines take to say, so every episode paces itself naturally.
 */

export const INTRO_SECONDS = 4.5;
const SCENE_LEAD = 0.9;
const LINE_GAP = 0.35;
const SCENE_TAIL = 1.1;
const MIN_SCENE = 4;
const OUTRO_TAIL = 2.5;
const MIN_OUTRO = 5;

export type Segment = "intro" | "scene" | "outro";

export interface TimedLine {
  key: string;
  segment: Segment;
  sceneIndex: number;
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface TimedScene {
  index: number;
  start: number;
  end: number;
}

export interface Timeline {
  introEnd: number;
  scenes: TimedScene[];
  outroStart: number;
  duration: number;
  lines: TimedLine[];
}

/** Ends a title with `mark` unless it already ends with punctuation ("Why Do Things Fall?" stays as is). */
function withMark(text: string, mark: string): string {
  const trimmed = text.trim();
  return /[.!?…。！？]$/.test(trimmed) ? trimmed : trimmed + mark;
}

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;

/** Rough seconds a friendly narrator needs to say `text` at speech `rate`. */
export function speechSeconds(text: string, rate = 1): number {
  const cjkChars = text.match(CJK)?.length ?? 0;
  const words = text.replace(CJK, " ").split(/\s+/).filter(Boolean).length + cjkChars / 1.7;
  return Math.max(1.1, words / (2.6 * rate) + 0.3);
}

export function buildTimeline(series: Pick<Series, "title">, episode: Episode, rate = 1): Timeline {
  const lines: TimedLine[] = [];

  const introText = `${withMark(series.title, "!")} ${withMark(episode.title, ".")}`;
  const introLineEnd = 0.8 + speechSeconds(introText, rate);
  lines.push({ key: "intro", segment: "intro", sceneIndex: -1, speaker: NARRATOR, text: introText, start: 0.8, end: introLineEnd });
  const introEnd = Math.max(INTRO_SECONDS, introLineEnd + 0.8);

  let t = introEnd;
  const scenes: TimedScene[] = episode.scenes.map((scene, index) => {
    const start = t;
    let cursor = start + SCENE_LEAD;
    scene.lines.forEach((line, lineIndex) => {
      const end = cursor + speechSeconds(line.text, rate);
      lines.push({ key: `${index}.${lineIndex}`, segment: "scene", sceneIndex: index, speaker: line.speaker, text: line.text, start: cursor, end });
      cursor = end + LINE_GAP;
    });
    const end = Math.max(start + MIN_SCENE, cursor - LINE_GAP + SCENE_TAIL);
    t = end;
    return { index, start, end };
  });

  const outroStart = t;
  let duration = outroStart + MIN_OUTRO;
  if (episode.takeaway) {
    const start = outroStart + 1;
    const end = start + speechSeconds(episode.takeaway, rate);
    lines.push({ key: "outro", segment: "outro", sceneIndex: -2, speaker: NARRATOR, text: episode.takeaway, start, end });
    duration = Math.max(duration, end + OUTRO_TAIL);
  }

  return { introEnd, scenes, outroStart, duration, lines };
}

/** Index of the scene playing at time `t` (-1 during the intro, scenes.length during the outro). */
export function sceneAt(timeline: Timeline, t: number): number {
  if (t < timeline.introEnd) return -1;
  for (const scene of timeline.scenes) {
    if (t < scene.end) return scene.index;
  }
  return timeline.scenes.length;
}

export function lineAt(timeline: Timeline, t: number): TimedLine | null {
  for (const line of timeline.lines) {
    if (t >= line.start && t < line.end) return line;
  }
  return null;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
