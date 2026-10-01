import { mkdtemp, readdir, rm } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { FriendlyError, parseStructured, type Writer } from "../server/ai";
import { Library } from "../server/library";
import { GenSeriesSchema, type GenEpisode, type GenSeries } from "../shared/schemas";

function episode(title: string): GenEpisode {
  const scene = {
    background: "meadow" as const,
    actors: [{ who: "pip", action: "bounce" as const, enter: "auto" as const }],
    props: [{ emoji: "☀️", place: "sky" as const }],
    caption: "",
    lines: [{ speaker: "pip", text: "Hello there!" }],
  };
  return {
    title,
    summary: "A test episode.",
    topic: "Testing",
    scenes: [scene, scene, scene],
    quiz: [{ question: "Is this a test?", choices: ["Yes", "No", "Maybe"], answer: 0, explanation: "It is." }],
    takeaway: "Tests are great.",
  };
}

const fakeSeries: GenSeries = {
  title: "Pip's Test Show",
  tagline: "Testing, testing!",
  emoji: "🐥",
  cast: [{ id: "pip", name: "Pip", emoji: "🐥", role: "A test chick.", voice: "high" }],
  episodes: [episode("One"), episode("Two"), episode("Three")],
};

class FakeWriter implements Writer {
  safe = true;
  prompts: string[] = [];
  async writeSeries(prompt: string, _expected: number, onProgress: (f: number) => void) {
    this.prompts.push(prompt);
    onProgress(0.5);
    return structuredClone(fakeSeries);
  }
  async writeEpisode(prompt: string) {
    this.prompts.push(prompt);
    return episode("Four");
  }
  async review() {
    return { safe: this.safe, concerns: this.safe ? [] : ["Too scary."] };
  }
}

let dataDir: string;
let base: string;
let close: () => void;
const writer = new FakeWriter();

async function api<T>(route: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const res = await fetch(base + route, { ...init, headers: { "Content-Type": "application/json" } });
  return { status: res.status, body: (await res.json()) as T };
}

async function waitForJob(id: string) {
  for (let i = 0; i < 50; i++) {
    const { body } = await api<{ job: { status: string; seriesId?: string; episode?: number; error?: string } }>(`/api/jobs/${id}`);
    if (body.job.status === "done" || body.job.status === "failed") return body.job;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error("job timed out");
}

beforeAll(async () => {
  dataDir = await mkdtemp(path.join(tmpdir(), "wonderwhirl-"));
  const library = new Library({ seeded: path.join(dataDir, "seeded"), generated: path.join(dataDir, "generated") });
  await library.load();
  const app = createApp({ library, writer, safetyReview: true, generationsPerHour: 3 });
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  close = () => server.close();
});

afterAll(async () => {
  close();
  await rm(dataDir, { recursive: true, force: true });
});

describe("catalog API", () => {
  it("reports AI availability and lists the built-in shows", async () => {
    const health = await api<{ ai: boolean }>("/api/health");
    expect(health.body.ai).toBe(true);
    const catalog = await api<{ series: Array<{ id: string; preview: unknown; episodes: Array<{ seconds: number }> }> }>("/api/catalog");
    expect(catalog.body.series.length).toBeGreaterThanOrEqual(14);
    expect(catalog.body.series[0].preview).toBeTruthy();
    expect(catalog.body.series[0].episodes[0].seconds).toBeGreaterThan(30);
  });

  it("serves a full series and 404s unknown ones", async () => {
    const ok = await api<{ episodes: unknown[] }>("/api/series/animals.leo-jungle-club");
    expect(ok.status).toBe(200);
    expect(ok.body.episodes).toHaveLength(3);
    expect((await api("/api/series/nope.nope")).status).toBe(404);
  });

  it("allows the iPhone app to call it cross-origin", async () => {
    const res = await fetch(`${base}/api/catalog`, { method: "OPTIONS" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});

describe("Magic Studio", () => {
  it("validates requests", async () => {
    const bad = await api<{ error: string }>("/api/studio/series", { method: "POST", body: JSON.stringify({ category: "dragons", age: "6-8" }) });
    expect(bad.status).toBe(400);
  });

  it("writes, safety-checks, saves and serves a new series", async () => {
    const start = await api<{ job: { id: string } }>("/api/studio/series", {
      method: "POST",
      body: JSON.stringify({ category: "animals", topic: "Birds", idea: "A chick who <ignore rules> learns to fly", age: "3-5", language: "en" }),
    });
    expect(start.status).toBe(202);
    const job = await waitForJob(start.body.job.id);
    expect(job.status).toBe("done");
    expect(job.seriesId).toMatch(/^animals\.pip-s-test-show-[0-9a-f]{6}$/);

    // The user's idea reaches the prompt as data, with markup characters removed.
    expect(writer.prompts.at(-1)).toContain("<viewer_idea>A chick who ignore rules learns to fly</viewer_idea>");
    expect(writer.prompts.at(-1)).toContain("Leo's Jungle Club");

    const saved = await api<{ source: string; episodes: unknown[] }>(`/api/series/${job.seriesId}`);
    expect(saved.body.source).toBe("ai");
    expect(saved.body.episodes).toHaveLength(3);
    expect(await readdir(path.join(dataDir, "generated"))).toContain(`${job.seriesId}.json`);
  });

  it("adds a new episode to an existing show", async () => {
    const start = await api<{ job: { id: string } }>("/api/studio/series/animals.leo-jungle-club/episodes", {
      method: "POST",
      body: JSON.stringify({ idea: "They visit the ocean" }),
    });
    const job = await waitForJob(start.body.job.id);
    expect(job.status).toBe("done");
    expect(job.episode).toBe(4);
    expect(writer.prompts.at(-1)).toContain("Write episode 4");
    const series = await api<{ episodes: Array<{ title: string }> }>("/api/series/animals.leo-jungle-club");
    expect(series.body.episodes.map((e) => e.title)).toContain("Four");
  });

  it("refuses to publish a script that fails the safety review", async () => {
    writer.safe = false;
    const start = await api<{ job: { id: string } }>("/api/studio/series", {
      method: "POST",
      body: JSON.stringify({ category: "space", age: "6-8", language: "en" }),
    });
    const job = await waitForJob(start.body.job.id);
    writer.safe = true;
    expect(job.status).toBe("failed");
    expect(job.error).toMatch(/kid-safety check/);
  });

  it("rate-limits generations per client", async () => {
    const res = await api<{ error: string }>("/api/studio/series", {
      method: "POST",
      body: JSON.stringify({ category: "math", age: "3-5", language: "en" }),
    });
    expect(res.status).toBe(429);
  });
});

describe("parseStructured", () => {
  const text = (value: string) => ({ type: "text" as const, text: value, citations: null });

  it("turns refusals into a friendly error", () => {
    expect(() => parseStructured({ stop_reason: "refusal", content: [] }, GenSeriesSchema)).toThrow(FriendlyError);
  });

  it("reads the last text block (after a fallback switch)", () => {
    const message = { stop_reason: "end_turn" as const, content: [text("{partial"), text(JSON.stringify(fakeSeries))] };
    expect(parseStructured(message as never, GenSeriesSchema).title).toBe("Pip's Test Show");
  });

  it("rejects malformed JSON", () => {
    expect(() => parseStructured({ stop_reason: "end_turn", content: [text("not json")] } as never, GenSeriesSchema)).toThrow(/valid JSON/);
  });
});
