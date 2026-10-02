import { mkdtemp, rm } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { Library } from "../server/library";
import {
  VoiceStudio,
  castVoices,
  createCloudRenderer,
  rendererFromEnv,
  createGeminiRenderer,
  envelope,
  episodeLines,
  prompt,
  trimSilence,
  wav,
  type VoiceRenderer,
} from "../server/voices";
import { BUILTIN_SERIES } from "../shared/builtin";
import { buildTimeline } from "../shared/timeline";

/** A tone with silence on both sides, like real TTS output. */
function tone(seconds: number, rate = 24000): Int16Array {
  const pad = Math.round(rate * 0.3);
  const body = Math.round(rate * seconds);
  const out = new Int16Array(pad * 2 + body);
  for (let i = 0; i < body; i++) out[pad + i] = Math.round(Math.sin(i / 8) * 12000);
  return out;
}

class FakeRenderer implements VoiceRenderer {
  readonly engine = "gemini";
  calls: Array<{ text: string; voice: string }> = [];
  async synthesize({ prompt: text, voice }: { prompt: string; voice: string }) {
    this.calls.push({ text, voice });
    await new Promise((r) => setTimeout(r, 5));
    return { pcm: tone(0.5 + (text.length % 7) / 10), sampleRate: 24000 };
  }
}

const hebrew = BUILTIN_SERIES.find((s) => s.language === "he")!;

describe("voice helpers", () => {
  it("gives characters with the same style different voices", () => {
    const casting = castVoices({
      cast: [
        { id: "a", name: "A", emoji: "🐥", voice: "silly", role: "" },
        { id: "b", name: "B", emoji: "🐸", voice: "silly", role: "" },
      ],
    });
    expect(casting.a.voice).not.toBe(casting.b.voice);
    expect(casting.narrator.style).toBe("narrator");
  });

  it("voices every timeline line, keyed like the player", () => {
    const episode = hebrew.episodes[0];
    const lines = episodeLines(hebrew, episode);
    expect(lines.map((l) => l.key)).toEqual(buildTimeline(hebrew, episode).lines.map((l) => l.key));
    expect(prompt(lines[1])).toContain("in Hebrew");
    expect(prompt(lines[1])).toContain(lines[1].text);
  });

  it("trims silence, measures loudness and writes a valid WAV", () => {
    const raw = tone(1);
    const trimmed = trimSilence(raw, 24000);
    expect(trimmed.length / 24000).toBeGreaterThan(1);
    expect(trimmed.length / 24000).toBeLessThan(1.2);
    const env = envelope(trimmed, 24000);
    expect(env.length).toBeGreaterThan(15);
    expect(Math.max(...env)).toBeLessThanOrEqual(1);
    const file = wav(trimmed, 24000);
    expect(file.toString("ascii", 0, 4)).toBe("RIFF");
    expect(file.readUInt32LE(24)).toBe(24000);
    expect(file.length).toBe(44 + trimmed.length * 2);
  });

  it("calls Gemini TTS and falls back to another model name when one isn't available", async () => {
    const pcm = Buffer.alloc(4800 * 2);
    const requests: Array<{ url: string; body: { generationConfig: { speechConfig: unknown } } }> = [];
    const fakeFetch = (async (url: string, init: RequestInit) => {
      requests.push({ url, body: JSON.parse(String(init.body)) });
      if (requests.length === 1) {
        return new Response(JSON.stringify({ error: { message: "models/nope is not found" } }), { status: 404 });
      }
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ inlineData: { mimeType: "audio/L16;codec=pcm;rate=24000", data: pcm.toString("base64") } }] } }],
        }),
      );
    }) as unknown as typeof fetch;
    const renderer = createGeminiRenderer({ apiKey: "test", model: "nope", fetch: fakeFetch, requestsPerMinute: 6000 });
    const out = await renderer.synthesize({ prompt: "Say hi: hi", text: "hi", direction: "", voice: "Puck", language: "en" });
    expect(out.sampleRate).toBe(24000);
    expect(out.pcm.length).toBe(4800);
    expect(requests[0].url).toContain("/nope:generateContent");
    expect(requests[1].url).not.toContain("/nope:");
    expect(requests[1].body.generationConfig.speechConfig).toEqual({ voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } });
  });
});

describe("voice API", () => {
  let dir: string;
  let base: string;
  let close: () => void;
  const renderer = new FakeRenderer();

  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "ww-voices-"));
    const library = new Library({ seeded: path.join(dir, "none"), generated: path.join(dir, "series") });
    await library.load();
    const app = createApp({
      library,
      writer: null,
      safetyReview: false,
      generationsPerHour: 5,
      voices: new VoiceStudio(renderer, path.join(dir, "audio")),
    });
    const server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    close = () => server.close();
  });

  afterAll(async () => {
    close();
    await rm(dir, { recursive: true, force: true });
  });

  const pack = async (body: unknown) => {
    const res = await fetch(`${base}/api/voices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json()) as { lines: Record<string, { url: string; seconds: number; env: number[] }>; pending: number } };
  };

  it("reports voices in health", async () => {
    const health = await (await fetch(`${base}/api/health`)).json();
    expect(health.voices).toBe(true);
  });

  it("renders an episode's voices in the background and serves them", async () => {
    const request = { seriesId: hebrew.id, episode: 1 };
    const first = await pack(request);
    expect(first.status).toBe(200);
    const total = buildTimeline(hebrew, hebrew.episodes[0]).lines.length;
    expect(first.body.pending).toBe(total);

    let latest = first.body;
    for (let i = 0; i < 50 && latest.pending > 0; i++) {
      await new Promise((r) => setTimeout(r, 20));
      latest = (await pack(request)).body;
    }
    expect(latest.pending).toBe(0);
    expect(Object.keys(latest.lines)).toHaveLength(total);
    expect(renderer.calls).toHaveLength(total);

    const intro = latest.lines.intro;
    expect(intro.seconds).toBeGreaterThan(0.5);
    const audio = await fetch(base + intro.url);
    expect(audio.status).toBe(200);
    expect(Buffer.from(await audio.arrayBuffer()).toString("ascii", 0, 4)).toBe("RIFF");

    // Cached: asking again renders nothing new.
    await pack(request);
    expect(renderer.calls).toHaveLength(total);
  });

  it("only voices shows from the library", async () => {
    expect((await pack({ seriesId: "nope.nope", episode: 1 })).status).toBe(404);
    expect((await pack({ seriesId: hebrew.id, episode: 99 })).status).toBe(404);
    expect((await fetch(`${base}/api/audio/..%2Fsecret.wav`)).status).toBe(404);
  });
});

describe("Gemini rate limits", () => {
  it("waits as long as Google asks after a 429, then succeeds", async () => {
    let calls = 0;
    const pcm = Buffer.alloc(480 * 2).toString("base64");
    const fakeFetch = (async () => {
      calls++;
      if (calls === 1) {
        return new Response(JSON.stringify({ error: { message: "Quota exceeded for metric: requests per minute. Please retry in 0.05s." } }), { status: 429 });
      }
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { mimeType: "audio/L16;rate=24000", data: pcm } }] } }] }));
    }) as unknown as typeof fetch;
    const renderer = createGeminiRenderer({ apiKey: "test", fetch: fakeFetch, requestsPerMinute: 6000 });
    const out = await renderer.synthesize({ prompt: "hi", text: "hi", direction: "", voice: "Puck", language: "en" });
    expect(out.pcm.length).toBe(480);
    expect(calls).toBe(2);
  });

  it("stops asking once the daily limit is used up", async () => {
    let calls = 0;
    const fakeFetch = (async () => {
      calls++;
      return new Response(JSON.stringify({ error: { message: "Quota exceeded for metric: generate_requests_per_model_per_day" } }), { status: 429 });
    }) as unknown as typeof fetch;
    const renderer = createGeminiRenderer({ apiKey: "test", fetch: fakeFetch, requestsPerMinute: 6000 });
    await expect(renderer.synthesize({ prompt: "a", text: "a", direction: "", voice: "Puck", language: "en" })).rejects.toThrow();
    await expect(renderer.synthesize({ prompt: "b", text: "b", direction: "", voice: "Puck", language: "en" })).rejects.toThrow(/daily/);
    expect(calls).toBe(1);
  });
});

describe("Cloud Chirp 3 HD voices", () => {
  it("asks for the right locale and voice, and strips the WAV header", async () => {
    const pcm = tone(0.2);
    const file = wav(pcm, 24000);
    let sent: { voice: { languageCode: string; name: string }; input: { text: string } } | null = null;
    const fakeFetch = (async (_url: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ audioContent: file.toString("base64") }));
    }) as unknown as typeof fetch;
    const renderer = createCloudRenderer({ apiKey: "test", fetch: fakeFetch, requestsPerMinute: 6000 });
    const out = await renderer.synthesize({ prompt: "Say warmly: שלום", text: "שלום", direction: "Say warmly", voice: "Sulafat", language: "he" });
    expect(sent!.voice).toEqual({ languageCode: "he-IL", name: "he-IL-Chirp3-HD-Sulafat" });
    expect(sent!.input.text).toBe("שלום");
    expect(out.sampleRate).toBe(24000);
    expect(out.pcm.length).toBe(pcm.length);
    expect(out.pcm[pcm.length >> 1]).toBe(pcm[pcm.length >> 1]);
  });
});

describe("Gemini voices through Google Cloud", () => {
  it("sends the model, the voice and the acting direction separately", async () => {
    const file = wav(tone(0.2), 24000);
    let sent: { voice: unknown; input: unknown } | null = null;
    const fakeFetch = (async (_url: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ audioContent: file.toString("base64") }));
    }) as unknown as typeof fetch;
    const renderer = createCloudRenderer({ apiKey: "t", fetch: fakeFetch, requestsPerMinute: 6000, model: "gemini-2.5-flash-tts" });
    expect(renderer.engine).toBe("cloud-gemini-2.5-flash-tts");
    await renderer.synthesize({ prompt: "", text: "שלום", direction: "Say this softly, in Hebrew", voice: "Leda", language: "he" });
    expect(sent!.voice).toEqual({ languageCode: "he-IL", name: "Leda", modelName: "gemini-2.5-flash-tts" });
    expect(sent!.input).toEqual({ text: "שלום", prompt: "Say this softly, in Hebrew" });
  });

  it("routes each language to its own engine", () => {
    const picked = rendererFromEnv({ GOOGLE_TTS_API_KEY: "k", VOICE_ENGINE: "cloud", VOICE_ENGINE_HE: "cloud-gemini" });
    expect(picked!.renderer.engineFor!("he")).toBe("cloud-gemini-2.5-flash-tts");
    expect(picked!.renderer.engineFor!("fr")).toBe("cloud-chirp3");
  });
});

describe("Gemini voices through Vertex AI", () => {
  it("calls the Vertex endpoint and falls back to a model Vertex has", async () => {
    const urls: string[] = [];
    const pcm = Buffer.alloc(480 * 2).toString("base64");
    const fakeFetch = (async (url: string) => {
      urls.push(url);
      if (urls.length === 1) return new Response(JSON.stringify({ error: { message: "Publisher Model `x` was not found" } }), { status: 404 });
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { mimeType: "audio/L16;rate=24000", data: pcm } }] } }] }));
    }) as unknown as typeof fetch;
    const renderer = createGeminiRenderer({ apiKey: "AQ.test", vertex: true, fetch: fakeFetch, requestsPerMinute: 6000 });
    expect(renderer.engine).toBe("vertex-gemini");
    await renderer.synthesize({ prompt: "Say: שלום", text: "שלום", direction: "", voice: "Leda", language: "he" });
    expect(urls[0]).toContain("aiplatform.googleapis.com/v1/publishers/google/models/gemini-3.8-flash-tts:generateContent");
    expect(urls[1]).toContain("/gemini-2.5-flash-tts:generateContent");
  });
});
