import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { LANGUAGE_NAMES } from "../shared/categories";
import { buildTimeline } from "../shared/timeline";
import { NARRATOR, type Episode, type Series, type Voice } from "../shared/types";

/**
 * Natural character voices from Google's Gemini text-to-speech. Every line of
 * an episode is rendered once, cached on disk as a WAV file, and served to the
 * app together with its length and a loudness envelope (so mouths move with
 * the words). Only lines from shows in the library can be rendered, so the
 * endpoint can't be used to voice arbitrary text.
 */

export const DEFAULT_TTS_MODEL = "gemini-3.8-flash-tts";
/** Tried in order when a model name isn't available to this API key. */
const FALLBACK_MODELS = ["gemini-2.5-flash-preview-tts"];
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
/** Loudness samples per second in the envelope. */
export const ENVELOPE_RATE = 20;

type Style = Voice | "narrator";

/** Prebuilt Gemini voices per style, plus how to perform the line. */
const CASTING: Record<Style, { voices: string[]; direction: string }> = {
  narrator: {
    voices: ["Sulafat"],
    direction: "Narrate warmly and expressively, like a favorite storyteller reading to young children",
  },
  child: { voices: ["Leda", "Laomedeia", "Achird"], direction: "Say this like an excited, curious young kid" },
  high: { voices: ["Laomedeia", "Zephyr", "Leda"], direction: "Say this in a bright, bubbly, cheerful voice" },
  gentle: { voices: ["Vindemiatrix", "Achernar", "Aoede"], direction: "Say this softly, kindly and calmly" },
  deep: { voices: ["Algenib", "Charon", "Orus"], direction: "Say this in a big, warm, booming cartoon voice" },
  silly: { voices: ["Puck", "Fenrir", "Sadachbia"], direction: "Say this in a goofy, playful, giggly cartoon voice" },
  wise: { voices: ["Gacrux", "Sadaltager", "Schedar"], direction: "Say this slowly and wisely, like a kind grandparent" },
  robot: { voices: ["Kore", "Iapetus"], direction: "Say this like a friendly cartoon robot: a little mechanical, very cheerful" },
};

export interface Casting {
  voice: string;
  style: Style;
}

/** Gives every speaker a stable voice, and different voices to characters who share a style. */
export function castVoices(series: Pick<Series, "cast">): Record<string, Casting> {
  const out: Record<string, Casting> = { [NARRATOR]: { voice: CASTING.narrator.voices[0], style: "narrator" } };
  const used = new Map<Style, number>();
  for (const member of series.cast) {
    const style = member.voice in CASTING ? member.voice : "child";
    const n = used.get(style) ?? 0;
    used.set(style, n + 1);
    const options = CASTING[style].voices;
    out[member.id] = { voice: options[n % options.length], style };
  }
  return out;
}

export interface VoiceLine {
  key: string;
  text: string;
  casting: Casting;
  language: string;
}

/** Everything spoken in an episode, keyed the same way as the player's timeline. */
export function episodeLines(series: Series, episode: Episode): VoiceLine[] {
  const casting = castVoices(series);
  // Speakers that aren't in the cast (a passing duck, say) get a kid voice.
  const extra: Casting = { voice: CASTING.child.voices[2], style: "child" };
  return buildTimeline(series, episode).lines.map((line) => ({
    key: line.key,
    text: line.text,
    casting: casting[line.speaker] ?? extra,
    language: series.language,
  }));
}

export function prompt(line: Pick<VoiceLine, "text" | "casting" | "language">): string {
  const language = LANGUAGE_NAMES[line.language];
  const direction = CASTING[line.casting.style].direction;
  return `${direction}${language && line.language !== "en" ? `, in ${language}` : ""}: ${line.text}`;
}

export interface Clip {
  file: string;
  seconds: number;
  env: number[];
}

export interface VoiceRenderer {
  /** Returns 16-bit mono PCM samples and their sample rate. */
  synthesize(text: string, voice: string): Promise<{ pcm: Int16Array; sampleRate: number }>;
}

class GeminiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function createGeminiRenderer(options: {
  apiKey: string;
  model?: string;
  fetch?: typeof fetch;
}): VoiceRenderer {
  const doFetch = options.fetch ?? fetch;
  const models = [options.model ?? DEFAULT_TTS_MODEL, ...FALLBACK_MODELS].filter((m, i, all) => all.indexOf(m) === i);
  let modelIndex = 0;

  const call = async (model: string, text: string, voice: string) => {
    const res = await doFetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": options.apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
        },
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }>;
    };
    if (!res.ok) throw new GeminiError(body.error?.message ?? `Gemini TTS failed (${res.status})`, res.status);
    const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
    if (!part?.data) throw new GeminiError("Gemini TTS returned no audio", 502);
    const rate = Number(/rate=(\d+)/.exec(part.mimeType ?? "")?.[1] ?? 24000);
    const bytes = Buffer.from(part.data, "base64");
    const pcm = new Int16Array(bytes.length >> 1);
    for (let i = 0; i < pcm.length; i++) pcm[i] = bytes.readInt16LE(i * 2);
    return { pcm, sampleRate: rate };
  };

  return {
    async synthesize(text, voice) {
      for (let attempt = 0; ; attempt++) {
        try {
          return await call(models[modelIndex], text, voice);
        } catch (error) {
          const status = error instanceof GeminiError ? error.status : 0;
          // Unknown model for this key: move on to the next model name.
          if ((status === 404 || status === 400) && /model/i.test((error as Error).message) && modelIndex < models.length - 1) {
            modelIndex++;
            continue;
          }
          const retryable = status === 429 || status >= 500 || status === 0;
          if (!retryable || attempt >= 3) throw error;
          await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt));
        }
      }
    },
  };
}

/** Cuts leading/trailing silence (keeping a short breath) so lip-sync starts on the first word. */
export function trimSilence(pcm: Int16Array, sampleRate: number): Int16Array {
  let peak = 0;
  for (const s of pcm) peak = Math.max(peak, Math.abs(s));
  if (peak === 0) return pcm;
  const threshold = peak * 0.02;
  let start = 0;
  while (start < pcm.length && Math.abs(pcm[start]) < threshold) start++;
  let end = pcm.length - 1;
  while (end > start && Math.abs(pcm[end]) < threshold) end--;
  const pad = Math.round(sampleRate * 0.06);
  return pcm.subarray(Math.max(0, start - pad), Math.min(pcm.length, end + pad));
}

/** Loudness from 0 to 1, ENVELOPE_RATE times per second. */
export function envelope(pcm: Int16Array, sampleRate: number): number[] {
  const size = Math.max(1, Math.round(sampleRate / ENVELOPE_RATE));
  const rms: number[] = [];
  for (let i = 0; i < pcm.length; i += size) {
    let sum = 0;
    const end = Math.min(pcm.length, i + size);
    for (let j = i; j < end; j++) sum += pcm[j] * pcm[j];
    rms.push(Math.sqrt(sum / (end - i)));
  }
  const loud = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)] || 1;
  return rms.map((v) => Math.round(Math.min(1, v / loud) * 100) / 100);
}

export function wav(pcm: Int16Array, sampleRate: number): Buffer {
  const data = Buffer.alloc(pcm.length * 2);
  for (let i = 0; i < pcm.length; i++) data.writeInt16LE(pcm[i], i * 2);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

export interface PackStatus {
  lines: Record<string, Clip>;
  pending: number;
  failed: number;
}

/** Renders, caches and serves voice clips, a few at a time. */
export class VoiceStudio {
  private readonly inFlight = new Map<string, Promise<Clip | null>>();
  private readonly failedAt = new Map<string, number>();
  private readonly known = new Map<string, Clip>();
  private readonly queue: Array<() => void> = [];
  private running = 0;

  constructor(
    private readonly renderer: VoiceRenderer,
    readonly dir: string,
    private readonly concurrency = 4,
  ) {}

  /** Cache key: changes whenever the words, voice or performance change. */
  static id(line: Pick<VoiceLine, "text" | "casting" | "language">): string {
    return createHash("sha1").update(`v1|${line.casting.voice}|${prompt(line)}`).digest("hex");
  }

  /** What's ready now; starts rendering the rest in the background (in story order). */
  async pack(lines: VoiceLine[]): Promise<PackStatus> {
    const out: PackStatus = { lines: {}, pending: 0, failed: 0 };
    for (const line of lines) {
      const id = VoiceStudio.id(line);
      const clip = await this.cached(id);
      if (clip) {
        out.lines[line.key] = clip;
        continue;
      }
      const failed = this.failedAt.get(id);
      if (failed && Date.now() - failed < 5 * 60 * 1000) {
        out.failed++;
        continue;
      }
      out.pending++;
      void this.render(line, id);
    }
    return out;
  }

  /** Renders every line and waits for it (used to pre-voice the library). */
  async renderAll(lines: VoiceLine[]): Promise<{ done: number; failed: number }> {
    const results = await Promise.all(lines.map((line) => this.render(line, VoiceStudio.id(line))));
    return { done: results.filter(Boolean).length, failed: results.filter((r) => !r).length };
  }

  private async cached(id: string): Promise<Clip | null> {
    const hit = this.known.get(id);
    if (hit) return hit;
    try {
      const meta = JSON.parse(await readFile(path.join(this.dir, `${id}.json`), "utf8")) as Clip;
      this.known.set(id, meta);
      return meta;
    } catch {
      return null;
    }
  }

  private render(line: VoiceLine, id: string): Promise<Clip | null> {
    const existing = this.inFlight.get(id);
    if (existing) return existing;
    const task = (async () => {
      const hit = await this.cached(id);
      if (hit) return hit;
      await this.slot();
      try {
        const { pcm, sampleRate } = await this.renderer.synthesize(prompt(line), line.casting.voice);
        const trimmed = trimSilence(pcm, sampleRate);
        const clip: Clip = {
          file: `${id}.wav`,
          seconds: Math.round((trimmed.length / sampleRate) * 1000) / 1000,
          env: envelope(trimmed, sampleRate),
        };
        await mkdir(this.dir, { recursive: true });
        await writeAtomic(path.join(this.dir, clip.file), wav(trimmed, sampleRate));
        await writeAtomic(path.join(this.dir, `${id}.json`), Buffer.from(JSON.stringify(clip)));
        this.known.set(id, clip);
        this.failedAt.delete(id);
        return clip;
      } catch (error) {
        console.warn(`Voice for "${line.text.slice(0, 40)}" failed: ${(error as Error).message}`);
        this.failedAt.set(id, Date.now());
        return null;
      } finally {
        this.release();
      }
    })().finally(() => this.inFlight.delete(id));
    this.inFlight.set(id, task);
    return task;
  }

  private slot(): Promise<void> {
    if (this.running < this.concurrency) {
      this.running++;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  private release() {
    const next = this.queue.shift();
    if (next) next();
    else this.running--;
  }
}

async function writeAtomic(file: string, data: Buffer) {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, data);
  await rename(tmp, file);
}
