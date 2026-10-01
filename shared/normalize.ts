import {
  ACTIONS,
  BACKGROUNDS,
  ENTRANCES,
  NARRATOR,
  PROP_PLACES,
  VOICES,
  type Actor,
  type AgeGroup,
  type CastMember,
  type Episode,
  type Line,
  type Prop,
  type QuizQuestion,
  type Scene,
  type Series,
  type SeriesSummary,
} from "./types";
import type { GenEpisode, GenSeries } from "./schemas";
import { buildTimeline } from "./timeline";

/**
 * Repairs and sanitizes AI-written scripts so the player can always render
 * them, and strips anything we never want on a kids' screen.
 */

const BLOCKED_EMOJI = new Set(
  [
    "🔫", "🗡", "⚔", "💣", "🧨", "🔪", "🪓", "🏹", "💀", "☠", "⚰", "🪦", "🩸",
    "🍺", "🍻", "🍷", "🥃", "🍸", "🍹", "🍾", "🥂", "🚬", "🎰", "🖕", "💩",
    "🔞", "🍆", "🍑", "💋", "🤬", "🤮", "🧟", "🧛", "😈", "👿", "👹", "👺",
    "☢", "☣",
  ].map(baseEmoji),
);

const FALLBACK_CAST_EMOJI = ["🐻", "🐰", "🦊", "🐼", "🐨", "🐸"];

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

function baseEmoji(value: string): string {
  // Compare without variation selectors and skin tones.
  return value.replace(/[︎️]|\p{Emoji_Modifier}/gu, "");
}

export function isEmoji(grapheme: string): boolean {
  return (
    /\p{Extended_Pictographic}/u.test(grapheme) ||
    /^\p{Regional_Indicator}{2}$/u.test(grapheme) ||
    grapheme.includes("⃣")
  );
}

/** Returns the first allowed emoji in `value`, or `fallback`. */
export function cleanEmoji(value: string | undefined | null, fallback = "⭐"): string {
  if (!value) return fallback;
  for (const { segment } of segmenter.segment(value.trim())) {
    if (isEmoji(segment)) {
      return BLOCKED_EMOJI.has(baseEmoji(segment)) ? fallback : segment;
    }
  }
  return fallback;
}

export function isAllowedEmoji(value: string): boolean {
  const first = cleanEmoji(value, "");
  return first !== "" && first === value.trim();
}

export function slugify(value: string, maxLength = 40): string {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return slug || "x";
}

function clip(value: unknown, max: number): string {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

/** Spoken text: no emoji (TTS reads them aloud), no markdown or [stage directions]. */
export function cleanSpoken(value: unknown, max = 320): string {
  const text = typeof value === "string" ? value : "";
  return clip(
    text
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/[*_#`~]/g, "")
      .replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}|[️‍⃣]|\p{Emoji_Modifier}/gu, ""),
    max,
  );
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Maps every way the model might refer to a cast member to its id. */
function castResolver(cast: CastMember[], aliases: Map<string, string>) {
  const lookup = new Map(aliases);
  for (const member of cast) {
    lookup.set(member.id, member.id);
    lookup.set(member.name.toLowerCase(), member.id);
  }
  return (who: string) => lookup.get(who.trim().toLowerCase());
}

export function normalizeCast(raw: GenSeries["cast"]): { cast: CastMember[]; aliases: Map<string, string> } {
  const cast: CastMember[] = [];
  const aliases = new Map<string, string>();
  for (const [index, member] of raw.slice(0, 5).entries()) {
    const name = clip(member.name, 24) || `Friend ${index + 1}`;
    let id = slugify(member.id || name, 20);
    while (cast.some((c) => c.id === id) || id === NARRATOR) id = `${id}-${index + 1}`;
    cast.push({
      id,
      name,
      emoji: cleanEmoji(member.emoji, FALLBACK_CAST_EMOJI[index % FALLBACK_CAST_EMOJI.length]),
      role: clip(member.role, 160),
      voice: pick(member.voice, VOICES, "child"),
    });
    if (member.id) aliases.set(member.id.trim().toLowerCase(), id);
  }
  if (cast.length === 0) throw new Error("The series has no characters.");
  return { cast, aliases };
}

function normalizeScene(raw: GenEpisode["scenes"][number], resolve: (who: string) => string | undefined): Scene | null {
  const actors: Actor[] = [];
  for (const actor of raw.actors ?? []) {
    if (actors.length >= 3) break;
    const who = resolve(actor.who) ?? (isAllowedEmoji(actor.who) ? actor.who.trim() : undefined);
    if (!who || actors.some((a) => a.who === who)) continue;
    actors.push({ who, action: pick(actor.action, ACTIONS, "idle"), enter: pick(actor.enter, ENTRANCES, "auto") });
  }

  const props: Prop[] = [];
  for (const prop of raw.props ?? []) {
    if (props.length >= 4) break;
    const emoji = cleanEmoji(prop.emoji, "");
    if (emoji) props.push({ emoji, place: pick(prop.place, PROP_PLACES, "sky") });
  }

  const lines: Line[] = [];
  for (const line of raw.lines ?? []) {
    if (lines.length >= 5) break;
    const text = cleanSpoken(line.text);
    if (!text) continue;
    const speakerKey = line.speaker?.trim() ?? "";
    const castId = resolve(speakerKey);
    const extra = actors.find((a) => a.who === speakerKey);
    lines.push({ speaker: castId ?? extra?.who ?? NARRATOR, text });
  }

  if (actors.length === 0 && lines.length === 0) return null;
  return {
    background: pick(raw.background, BACKGROUNDS, "meadow"),
    actors,
    props,
    caption: clip(raw.caption, 28),
    lines,
  };
}

function normalizeQuiz(raw: GenEpisode["quiz"]): QuizQuestion[] {
  const quiz: QuizQuestion[] = [];
  for (const item of raw ?? []) {
    if (quiz.length >= 4) break;
    const answerIndex = Math.round(Number(item.answer));
    const correct = Array.isArray(item.choices) ? item.choices[answerIndex] : undefined;
    if (typeof correct !== "string") continue;
    const choices: string[] = [];
    for (const choice of item.choices) {
      const text = clip(choice, 60);
      if (text && !choices.some((c) => c.toLowerCase() === text.toLowerCase())) choices.push(text);
    }
    const answer = choices.findIndex((c) => c.toLowerCase() === clip(correct, 60).toLowerCase());
    const question = clip(item.question, 160);
    if (!question || answer < 0 || answer >= 4 || choices.length < 2) continue;
    quiz.push({ question, choices: choices.slice(0, 4), answer, explanation: clip(item.explanation, 200) });
  }
  return quiz;
}

export function normalizeEpisode(
  raw: GenEpisode,
  cast: CastMember[],
  number: number,
  aliases: Map<string, string> = new Map(),
): Episode {
  const resolve = castResolver(cast, aliases);
  const scenes = (raw.scenes ?? [])
    .slice(0, 16)
    .map((scene) => normalizeScene(scene, resolve))
    .filter((scene): scene is Scene => scene !== null);
  if (scenes.length < 2) throw new Error("The episode script is too short.");
  return {
    number,
    title: clip(raw.title, 70) || `Episode ${number}`,
    summary: clip(raw.summary, 220),
    topic: clip(raw.topic, 50),
    scenes,
    quiz: normalizeQuiz(raw.quiz),
    takeaway: cleanSpoken(raw.takeaway, 200),
  };
}

export interface SeriesMeta {
  id: string;
  category: string;
  age: AgeGroup;
  language: string;
  fallbackEmoji: string;
  createdAt?: string;
}

export function normalizeSeries(raw: GenSeries, meta: SeriesMeta): Series {
  const { cast, aliases } = normalizeCast(raw.cast ?? []);
  const episodes = (raw.episodes ?? []).slice(0, 8).map((episode, i) => normalizeEpisode(episode, cast, i + 1, aliases));
  if (episodes.length === 0) throw new Error("The series has no episodes.");
  return {
    id: meta.id,
    category: meta.category,
    title: clip(raw.title, 60) || "A New Adventure",
    tagline: clip(raw.tagline, 120),
    emoji: cleanEmoji(raw.emoji, meta.fallbackEmoji),
    age: meta.age,
    language: meta.language,
    cast,
    episodes,
    source: "ai",
    createdAt: meta.createdAt ?? new Date().toISOString(),
  };
}

export function summarize(series: Series): SeriesSummary {
  const { episodes, ...rest } = series;
  return {
    ...rest,
    episodes: episodes.map((e) => ({
      number: e.number,
      title: e.title,
      summary: e.summary,
      topic: e.topic,
      seconds: Math.round(buildTimeline(series, e).duration),
    })),
    preview: episodes[0]?.scenes[0] ?? null,
  };
}

/** Plain-text transcript of an episode, used for safety review and continuity prompts. */
export function transcript(series: Pick<Series, "cast">, episode: Episode): string {
  const names = new Map(series.cast.map((c) => [c.id, c.name]));
  const out: string[] = [`Episode ${episode.number}: ${episode.title}`];
  episode.scenes.forEach((scene, i) => {
    const onStage = scene.actors.map((a) => names.get(a.who) ?? a.who).join(", ");
    out.push(`Scene ${i + 1} [${scene.background}; on stage: ${onStage || "nobody"}${scene.caption ? `; caption: "${scene.caption}"` : ""}]`);
    for (const line of scene.lines) {
      out.push(`  ${line.speaker === NARRATOR ? "Narrator" : names.get(line.speaker) ?? line.speaker}: ${line.text}`);
    }
  });
  episode.quiz.forEach((q, i) => {
    out.push(`Quiz ${i + 1}: ${q.question} Choices: ${q.choices.join(" / ")} (answer: ${q.choices[q.answer]})`);
  });
  out.push(`Takeaway: ${episode.takeaway}`);
  return out.join("\n");
}
