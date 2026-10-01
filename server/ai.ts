import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import {
  GenEpisodeSchema,
  GenSeriesSchema,
  SafetyReviewSchema,
  type GenEpisode,
  type GenSeries,
  type SafetyReview,
} from "../shared/schemas";
import { REVIEWER_SYSTEM, WRITER_SYSTEM } from "./prompts";

type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5-5";
const WRITER_EFFORT = (process.env.CLAUDE_EFFORT ?? "medium") as Effort;
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

/** An error whose message is safe and friendly enough to show in the app. */
export class FriendlyError extends Error {}

export type Progress = (fraction: number) => void;

/** Everything the server needs from the AI; swapped for a fake in tests. */
export interface Writer {
  writeSeries(prompt: string, expectedChars: number, onProgress: Progress): Promise<GenSeries>;
  writeEpisode(prompt: string, expectedChars: number, onProgress: Progress): Promise<GenEpisode>;
  review(prompt: string): Promise<SafetyReview>;
}

/** JSON-schema output format without the SDK's auto-parser, so we can handle refusals ourselves. */
export function jsonFormat(schema: z.ZodType) {
  const { type, schema: jsonSchema } = betaZodOutputFormat(schema);
  return { type, schema: jsonSchema };
}

/** Request body shared by live generation and the batch seed script. */
export function writerRequest(schema: z.ZodType, prompt: string, system = WRITER_SYSTEM, effort: Effort = WRITER_EFFORT) {
  return {
    model: MODEL,
    max_tokens: 64000,
    thinking: { type: "adaptive" as const },
    system: [{ type: "text" as const, text: system, cache_control: { type: "ephemeral" as const } }],
    messages: [{ role: "user" as const, content: prompt }],
    output_config: { effort, format: jsonFormat(schema) },
  };
}

/** The parts of a Messages API reply we read (works for live, beta and batch results). */
export interface ModelReply {
  stop_reason: string | null;
  content: ReadonlyArray<{ type: string; text?: string }>;
}

export function parseStructured<T>(message: ModelReply, schema: z.ZodType<T>): T {
  if (message.stop_reason === "refusal") throw new FriendlyError("Let's pick a different idea for this one!");
  if (message.stop_reason === "max_tokens") throw new FriendlyError("That story got a bit too long. Let's try again!");
  // With refusal fallbacks the final answer is always the last text block.
  const text = message.content.filter((block) => block.type === "text").at(-1)?.text;
  if (!text) throw new Error("The model returned no script.");
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("The script was not valid JSON.");
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`The script didn't match the schema (${issues.join("; ")}).`);
  }
  return result.data;
}

export function createClaudeWriter(client: Anthropic = new Anthropic()): Writer {
  async function write<T>(schema: z.ZodType<T>, prompt: string, expectedChars: number, onProgress: Progress): Promise<T> {
    const stream = client.beta.messages.stream({
      ...writerRequest(schema, prompt),
      // If a safety classifier declines, the API retries on Anthropic's recommended fallback model.
      betas: [FALLBACK_BETA],
      fallbacks: "default",
    });
    stream.on("text", (_delta, snapshot) => onProgress(Math.min(0.98, snapshot.length / expectedChars)));
    const message = await stream.finalMessage();
    return parseStructured(message, schema);
  }

  return {
    writeSeries: (prompt, expectedChars, onProgress) => write(GenSeriesSchema, prompt, expectedChars, onProgress),
    writeEpisode: (prompt, expectedChars, onProgress) => write(GenEpisodeSchema, prompt, expectedChars, onProgress),
    async review(prompt) {
      const message = await client.beta.messages.create({
        ...writerRequest(SafetyReviewSchema, prompt, REVIEWER_SYSTEM, "low"),
        max_tokens: 16000,
        betas: [FALLBACK_BETA],
        fallbacks: "default",
      });
      try {
        return parseStructured(message, SafetyReviewSchema);
      } catch (error) {
        // Fail closed: if the reviewer can't give a clear answer, don't publish.
        return { safe: false, concerns: [error instanceof Error ? error.message : "Review failed."] };
      }
    },
  };
}
