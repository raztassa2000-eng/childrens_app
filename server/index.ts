import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { MODEL, createClaudeWriter } from "./ai";
import { createApp } from "./app";
import { Library } from "./library";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT ?? 8787);

const library = new Library({
  seeded: path.join(root, "content", "series"),
  generated: path.resolve(root, process.env.DATA_DIR ?? "data/series"),
});
await library.load();

const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const app = createApp({
  library,
  writer: aiConfigured ? createClaudeWriter() : null,
  safetyReview: process.env.SAFETY_REVIEW !== "off",
  generationsPerHour: Number(process.env.GENERATION_LIMIT_PER_HOUR ?? 20),
});

if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY);

// In production the same server also hosts the web build.
const dist = path.join(root, "dist");
if (existsSync(dist)) app.use(express.static(dist));

app.listen(port, () => {
  console.log(`WonderWhirl server on http://localhost:${port}`);
  console.log(`  ${library.list().length} shows in the library`);
  console.log(aiConfigured ? `  Magic Studio: on (${MODEL})` : "  Magic Studio: off (set ANTHROPIC_API_KEY to turn it on)");
});
