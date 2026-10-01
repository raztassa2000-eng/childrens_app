import { z } from "zod";
import {
  ACTIONS,
  AGE_GROUPS,
  BACKGROUNDS,
  ENTRANCES,
  PROP_PLACES,
  VOICES,
  type Series,
} from "./types";

// ---------------------------------------------------------------------------
// Schemas for AI structured output. These are deliberately lenient (limits live
// in descriptions, not hard constraints) so a slightly-off answer is repaired
// by normalize.ts instead of failing the whole generation.
// ---------------------------------------------------------------------------

const GenActorSchema = z.object({
  who: z.string().describe("A cast member id, or a single emoji for a one-off extra character (e.g. 🐝)."),
  action: z.enum(ACTIONS),
  enter: z
    .enum(ENTRANCES)
    .describe("How the actor arrives. 'auto' = stays in place if already on stage, otherwise pops in."),
});

const GenPropSchema = z.object({
  emoji: z.string().describe("Exactly one emoji."),
  place: z.enum(PROP_PLACES),
});

const GenLineSchema = z.object({
  speaker: z.string().describe("'narrator' or a cast member id."),
  text: z.string().describe("Words spoken aloud. No emoji, no stage directions."),
});

const GenSceneSchema = z.object({
  background: z.enum(BACKGROUNDS),
  actors: z.array(GenActorSchema).describe("1 to 3 actors on stage."),
  props: z.array(GenPropSchema).describe("0 to 4 decorative emoji props."),
  caption: z
    .string()
    .describe("Optional big on-screen text, at most 24 characters (e.g. '2 + 3 = 5', 'Gravity!'). Empty string for none."),
  lines: z.array(GenLineSchema).describe("1 to 4 lines spoken in order."),
});

const GenQuizSchema = z.object({
  question: z.string(),
  choices: z.array(z.string()).describe("Exactly 3 short answer choices."),
  answer: z.number().describe("0-based index of the correct choice."),
  explanation: z.string().describe("One friendly sentence explaining the right answer."),
});

export const GenEpisodeSchema = z.object({
  title: z.string(),
  summary: z.string().describe("One sentence for parents describing what the episode teaches."),
  topic: z.string().describe("The sub-topic this episode teaches, 2 to 5 words."),
  scenes: z.array(GenSceneSchema),
  quiz: z.array(GenQuizSchema),
  takeaway: z.string().describe("One short sentence: what we learned today."),
});
export type GenEpisode = z.infer<typeof GenEpisodeSchema>;

const GenCastSchema = z.object({
  id: z.string().describe("Short lowercase ASCII id, e.g. 'leo'."),
  name: z.string(),
  emoji: z.string().describe("Exactly one emoji that shows this character."),
  role: z.string().describe("One sentence personality description."),
  voice: z.enum(VOICES),
});

export const GenSeriesSchema = z.object({
  title: z.string(),
  tagline: z.string().describe("A catchy one-line hook for kids."),
  emoji: z.string().describe("One emoji for the series cover."),
  cast: z.array(GenCastSchema).describe("2 to 4 recurring characters."),
  episodes: z.array(GenEpisodeSchema),
});
export type GenSeries = z.infer<typeof GenSeriesSchema>;

export const SafetyReviewSchema = z.object({
  safe: z.boolean(),
  concerns: z.array(z.string()).describe("Specific problems found. Empty when safe."),
});
export type SafetyReview = z.infer<typeof SafetyReviewSchema>;

// ---------------------------------------------------------------------------
// Strict schema for series stored on disk (seeded or generated).
// ---------------------------------------------------------------------------

const SceneSchema = z.object({
  background: z.enum(BACKGROUNDS),
  actors: z.array(z.object({ who: z.string().min(1), action: z.enum(ACTIONS), enter: z.enum(ENTRANCES) })).max(4),
  props: z.array(z.object({ emoji: z.string().min(1), place: z.enum(PROP_PLACES) })).max(6),
  caption: z.string().max(40),
  lines: z.array(z.object({ speaker: z.string().min(1), text: z.string().min(1) })),
});

export const SeriesSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+\.[a-z0-9-]+$/),
  category: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string(),
  emoji: z.string().min(1),
  age: z.enum(AGE_GROUPS),
  language: z.string().min(2),
  cast: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        emoji: z.string().min(1),
        role: z.string(),
        voice: z.enum(VOICES),
      }),
    )
    .min(1),
  episodes: z
    .array(
      z.object({
        number: z.number().int().positive(),
        title: z.string().min(1),
        summary: z.string(),
        topic: z.string(),
        scenes: z.array(SceneSchema).min(1),
        quiz: z.array(
          z.object({
            question: z.string().min(1),
            choices: z.array(z.string().min(1)).min(2).max(4),
            answer: z.number().int().min(0),
            explanation: z.string(),
          }),
        ),
        takeaway: z.string(),
      }),
    )
    .min(1),
  source: z.enum(["built-in", "ai"]),
  createdAt: z.string().optional(),
}) satisfies z.ZodType<Series>;
