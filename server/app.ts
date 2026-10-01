import { randomBytes } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { AGE_PROFILES, CATEGORY_BY_ID, LANGUAGE_NAMES } from "../shared/categories";
import { normalizeEpisode, normalizeSeries, slugify } from "../shared/normalize";
import { AGE_GROUPS } from "../shared/types";
import { FriendlyError, MODEL, type Writer } from "./ai";
import { JobQueue, type JobUpdate } from "./jobs";
import type { Library } from "./library";
import { cleanIdea, episodePrompt, reviewPrompt, seriesPrompt } from "./prompts";

export interface AppOptions {
  library: Library;
  /** null when no Anthropic API key is configured: the catalog still works. */
  writer: Writer | null;
  safetyReview: boolean;
  generationsPerHour: number;
  episodesPerSeries?: number;
  maxEpisodes?: number;
}

const SeriesRequest = z.object({
  category: z.string().refine((c) => c in CATEGORY_BY_ID, "Unknown category"),
  topic: z.string().max(60).optional(),
  idea: z.string().max(200).optional(),
  age: z.enum(AGE_GROUPS),
  language: z.string().refine((l) => l in LANGUAGE_NAMES, "Unsupported language").default("en"),
});

const EpisodeRequest = z.object({ idea: z.string().max(200).optional() });

/** Simple per-client sliding-window limit so nobody can run up the AI bill. */
function rateLimiter(limit: number, windowMs = 60 * 60 * 1000) {
  const hits = new Map<string, number[]>();
  return (key: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}

function writingMessage(fraction: number, kind: "series" | "episode") {
  if (fraction < 0.05) return kind === "series" ? "Dreaming up the characters…" : "Planning the next adventure…";
  if (fraction < 0.4) return "Writing the script…";
  if (fraction < 0.75) return "Directing the scenes…";
  return "Adding the quiz and final touches…";
}

export function createApp(options: AppOptions) {
  const { library, writer, safetyReview } = options;
  const episodesPerSeries = options.episodesPerSeries ?? 3;
  const maxEpisodes = options.maxEpisodes ?? 24;
  const jobs = new JobQueue();
  const allow = rateLimiter(options.generationsPerHour);
  const busySeries = new Set<string>();

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "20kb" }));

  // The iPhone app loads from capacitor://localhost, so allow cross-origin calls.
  // No cookies or credentials are used, so a wildcard origin is safe here.
  app.use("/api", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ai: writer !== null, model: writer ? MODEL : null, safetyReview });
  });

  app.get("/api/catalog", (_req, res) => {
    res.json({ series: library.list() });
  });

  app.get("/api/series/:id", (req, res) => {
    const series = library.get(req.params.id);
    if (!series) {
      res.status(404).json({ error: "Show not found." });
      return;
    }
    res.json(series);
  });

  app.get("/api/jobs/:id", (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) {
      res.status(404).json({ error: "Job not found." });
      return;
    }
    res.json({ job });
  });

  const guard = (req: Request, res: Response): Writer | null => {
    if (!writer) {
      res.status(503).json({ error: "The Magic Studio needs an AI key on the server." });
      return null;
    }
    if (!allow(req.ip ?? "unknown")) {
      res.status(429).json({ error: "The studio needs a little rest. Try again later!" });
      return null;
    }
    return writer;
  };

  const review = async (w: Writer, update: JobUpdate, prompt: string) => {
    if (!safetyReview) return;
    update({ status: "checking", progress: 0.92, message: "Making sure it's kind and safe…" });
    const verdict = await w.review(prompt);
    if (!verdict.safe) {
      console.warn("Safety review rejected a script:", verdict.concerns);
      throw new FriendlyError("That one didn't pass our kid-safety check. Let's try a different idea!");
    }
  };

  app.post("/api/studio/series", (req, res) => {
    const parsed = SeriesRequest.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request." });
      return;
    }
    const w = guard(req, res);
    if (!w) return;
    const { category: categoryId, topic, age, language } = parsed.data;
    const idea = cleanIdea(parsed.data.idea);
    const category = CATEGORY_BY_ID[categoryId];
    const profile = AGE_PROFILES[age];

    const job = jobs.start("series", async (update) => {
      update({ status: "writing", progress: 0.02, message: writingMessage(0, "series") });
      const prompt = seriesPrompt({
        category,
        topic: cleanIdea(topic),
        idea,
        age,
        language,
        episodes: episodesPerSeries,
        existingTitles: library.titlesIn(category.id).slice(0, 40),
      });
      const expected = episodesPerSeries * (profile.scenes * 340 + 900) + 1200;
      const raw = await w.writeSeries(prompt, expected, (f) =>
        update({ progress: 0.04 + f * 0.84, message: writingMessage(f, "series") }),
      );
      const id = `${category.id}.${slugify(raw.title, 28)}-${randomBytes(3).toString("hex")}`;
      const series = normalizeSeries(raw, { id, category: category.id, age, language, fallbackEmoji: category.emoji });
      await review(w, update, reviewPrompt(series));
      await library.save(series);
      return { seriesId: series.id, episode: 1 };
    });
    res.status(202).json({ job });
  });

  app.post("/api/studio/series/:id/episodes", (req, res) => {
    const parsed = EpisodeRequest.safeParse(req.body ?? {});
    const series = library.get(req.params.id);
    if (!parsed.success || !series) {
      res.status(series ? 400 : 404).json({ error: series ? "Invalid request." : "Show not found." });
      return;
    }
    if (series.episodes.length >= maxEpisodes) {
      res.status(409).json({ error: "This show has so many episodes already! Try making a new show." });
      return;
    }
    if (busySeries.has(series.id)) {
      res.status(409).json({ error: "A new episode of this show is already being made!" });
      return;
    }
    const w = guard(req, res);
    if (!w) return;
    const idea = cleanIdea(parsed.data.idea);
    const category = CATEGORY_BY_ID[series.category];

    busySeries.add(series.id);
    const job = jobs.start(
      "episode",
      async (update) => {
        try {
          update({ status: "writing", progress: 0.02, message: writingMessage(0, "episode") });
          const prompt = episodePrompt(series, category?.name ?? series.category, idea);
          const expected = AGE_PROFILES[series.age].scenes * 340 + 900;
          const raw = await w.writeEpisode(prompt, expected, (f) =>
            update({ progress: 0.04 + f * 0.84, message: writingMessage(f, "episode") }),
          );
          const current = library.get(series.id) ?? series;
          const episode = normalizeEpisode(raw, current.cast, current.episodes.length + 1);
          const updated = { ...current, episodes: [...current.episodes, episode] };
          await review(w, update, reviewPrompt(updated, [episode.number]));
          await library.save(updated);
          return { seriesId: updated.id, episode: episode.number };
        } finally {
          busySeries.delete(series.id);
        }
      },
      series.id,
    );
    res.status(202).json({ job });
  });

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  });

  return app;
}
