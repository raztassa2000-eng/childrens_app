import type { Series } from "../types";

/**
 * A translation of a built-in series. Only the words change: scenes, actors,
 * props and timing stay identical to the original, so every language gets
 * the same animation.
 *   scenes: one entry per scene: [caption, ...spoken lines in the same order]
 *   quiz:   [question, choices (same order, same correct answer), explanation]
 */
export interface SeriesText {
  title: string;
  tagline: string;
  cast: Record<string, [name: string, role: string]>;
  episodes: Array<{
    title: string;
    topic: string;
    summary: string;
    takeaway: string;
    scenes: string[][];
    quiz: Array<[question: string, choices: string[], explanation: string]>;
  }>;
}

export function localize(base: Series, language: string, text: SeriesText): Series {
  const where = `${base.id} (${language})`;
  if (text.episodes.length !== base.episodes.length) throw new Error(`${where}: expected ${base.episodes.length} episodes`);
  return {
    ...base,
    id: `${base.id}-${language}`,
    language,
    title: text.title,
    tagline: text.tagline,
    cast: base.cast.map((member) => {
      const t = text.cast[member.id];
      if (!t) throw new Error(`${where}: missing cast member ${member.id}`);
      return { ...member, name: t[0], role: t[1] };
    }),
    episodes: base.episodes.map((episode, e) => {
      const t = text.episodes[e];
      const at = `${where} episode ${e + 1}`;
      if (t.scenes.length !== episode.scenes.length) throw new Error(`${at}: expected ${episode.scenes.length} scenes, got ${t.scenes.length}`);
      if (t.quiz.length !== episode.quiz.length) throw new Error(`${at}: expected ${episode.quiz.length} quiz questions`);
      return {
        ...episode,
        title: t.title,
        topic: t.topic,
        summary: t.summary,
        takeaway: t.takeaway,
        scenes: episode.scenes.map((scene, s) => {
          const [caption, ...lines] = t.scenes[s];
          if (lines.length !== scene.lines.length) {
            throw new Error(`${at} scene ${s + 1}: expected ${scene.lines.length} lines, got ${lines.length}`);
          }
          if (Boolean(caption) !== Boolean(scene.caption)) throw new Error(`${at} scene ${s + 1}: caption mismatch`);
          return { ...scene, caption, lines: scene.lines.map((line, l) => ({ ...line, text: lines[l] })) };
        }),
        quiz: episode.quiz.map((q, i) => {
          const [question, choices, explanation] = t.quiz[i];
          if (choices.length !== q.choices.length) throw new Error(`${at} quiz ${i + 1}: wrong number of choices`);
          return { ...q, question, choices, explanation };
        }),
      };
    }),
  };
}
