/**
 * The episode-script model shared by the AI writer (server), the content
 * library, and the animation engine that renders episodes as video.
 */

export const AGE_GROUPS = ["3-5", "6-8", "9-12"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

/** Painted, animated sets the engine can draw. */
export const BACKGROUNDS = [
  "meadow",
  "park",
  "forest",
  "jungle",
  "farm",
  "pond",
  "beach",
  "underwater",
  "sky",
  "space",
  "night",
  "desert",
  "snow",
  "mountains",
  "rainy",
  "city",
  "home",
  "classroom",
  "lab",
  "stage",
] as const;
export type Background = (typeof BACKGROUNDS)[number];

/** Looping performances an actor can do while on stage. */
export const ACTIONS = [
  "idle",
  "bounce",
  "walk",
  "run",
  "fly",
  "swim",
  "spin",
  "wiggle",
  "jump",
  "grow",
  "sleep",
  "wave",
  "dance",
  "shiver",
  "think",
  "cheer",
] as const;
export type Action = (typeof ACTIONS)[number];

/** How an actor arrives. "auto" keeps returning actors in place and pops new ones in. */
export const ENTRANCES = ["auto", "pop", "left", "right", "top"] as const;
export type Entrance = (typeof ENTRANCES)[number];

export const PROP_PLACES = ["sky", "air", "ground"] as const;
export type PropPlace = (typeof PROP_PLACES)[number];

/** Voice styles map to text-to-speech pitch/rate presets in the player. */
export const VOICES = ["child", "high", "gentle", "deep", "silly", "wise", "robot"] as const;
export type Voice = (typeof VOICES)[number];

export const NARRATOR = "narrator";

export interface CastMember {
  id: string;
  name: string;
  emoji: string;
  role: string;
  voice: Voice;
}

export interface Actor {
  /** A cast member id, or a single emoji for a one-off extra. */
  who: string;
  action: Action;
  enter: Entrance;
}

export interface Prop {
  emoji: string;
  place: PropPlace;
}

export interface Line {
  /** "narrator" or a cast member id. */
  speaker: string;
  text: string;
}

export interface Scene {
  background: Background;
  actors: Actor[];
  props: Prop[];
  /** Big on-screen text, e.g. "2 + 3 = 5". Empty string for none. */
  caption: string;
  lines: Line[];
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface Episode {
  number: number;
  title: string;
  summary: string;
  topic: string;
  scenes: Scene[];
  quiz: QuizQuestion[];
  takeaway: string;
}

export interface Series {
  id: string;
  category: string;
  title: string;
  tagline: string;
  emoji: string;
  age: AgeGroup;
  /** BCP-47 language code of the spoken lines, e.g. "en". */
  language: string;
  cast: CastMember[];
  episodes: Episode[];
  source: "built-in" | "ai";
  createdAt?: string;
}

/** Lightweight listing entry: everything except the episode scripts. */
export interface SeriesSummary extends Omit<Series, "episodes"> {
  episodes: Array<Pick<Episode, "number" | "title" | "summary" | "topic"> & { seconds: number }>;
  /** First scene of episode 1, so cards can render a real video thumbnail. */
  preview: Scene | null;
}
