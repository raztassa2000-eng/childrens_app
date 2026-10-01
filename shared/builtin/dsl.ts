import type {
  Action,
  Actor,
  AgeGroup,
  Background,
  CastMember,
  Entrance,
  Episode,
  Prop,
  PropPlace,
  QuizQuestion,
  Scene,
  Series,
  Voice,
} from "../types";

/**
 * A compact, type-checked way to write the built-in starter series.
 *   actors: "leo:wave" or "leo:walk:left"  (who:action[:entrance])
 *   props:  "☀️ sky"                       (emoji place)
 *   lines:  ["leo", "Hello!"] or N("Narrator says hi.")
 */

type ActorSpec = `${string}:${Action}` | `${string}:${Action}:${Entrance}`;
type PropSpec = `${string} ${PropPlace}`;
type LineSpec = readonly [speaker: string, text: string];

export const N = (text: string): LineSpec => ["narrator", text];

export function cast(id: string, name: string, emoji: string, voice: Voice, role: string): CastMember {
  return { id, name, emoji, voice, role };
}

function actor(spec: ActorSpec): Actor {
  const [who, action, enter = "auto"] = spec.split(":");
  return { who, action: action as Action, enter: enter as Entrance };
}

function prop(spec: PropSpec): Prop {
  const space = spec.lastIndexOf(" ");
  return { emoji: spec.slice(0, space), place: spec.slice(space + 1) as PropPlace };
}

export function sc(
  background: Background,
  actors: ActorSpec[],
  props: PropSpec[],
  lines: LineSpec[],
  caption = "",
): Scene {
  return {
    background,
    actors: actors.map(actor),
    props: props.map(prop),
    caption,
    lines: lines.map(([speaker, text]) => ({ speaker, text })),
  };
}

export function q(question: string, choices: string[], answer: number, explanation: string): QuizQuestion {
  return { question, choices, answer, explanation };
}

type EpisodeDraft = Omit<Episode, "number">;

export function ep(
  title: string,
  topic: string,
  summary: string,
  scenes: Scene[],
  quiz: QuizQuestion[],
  takeaway: string,
): EpisodeDraft {
  return { title, topic, summary, scenes, quiz, takeaway };
}

export function series(def: {
  id: string;
  category: string;
  age: AgeGroup;
  title: string;
  tagline: string;
  emoji: string;
  cast: CastMember[];
  episodes: EpisodeDraft[];
}): Series {
  return {
    ...def,
    language: "en",
    source: "built-in",
    episodes: def.episodes.map((episode, i) => ({ number: i + 1, ...episode })),
  };
}
