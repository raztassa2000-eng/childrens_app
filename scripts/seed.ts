/**
 * Bulk-generate new shows with the Message Batches API (half the price of live
 * calls). Every series is written, then checked by the child-safety reviewer,
 * and the ones that pass are saved to content/series/ — commit them and they
 * ship with the server's catalog.
 *
 *   npm run seed -- --dry-run                       # plan + rough cost, no API calls
 *   npm run seed -- --categories animals,space --ages 3-5,6-8 --per 2
 *   npm run seed -- --language es --per 1 --yes
 */
import "../server/env";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import Anthropic from "@anthropic-ai/sdk";
import { MODEL, parseStructured, writerRequest, type ModelReply } from "../server/ai";
import { Library } from "../server/library";
import { REVIEWER_SYSTEM, reviewPrompt, seriesPrompt } from "../server/prompts";
import { AGE_PROFILES, CATEGORIES, CATEGORY_BY_ID, LANGUAGE_NAMES } from "../shared/categories";
import { normalizeSeries, slugify } from "../shared/normalize";
import { GenSeriesSchema, SafetyReviewSchema } from "../shared/schemas";
import { AGE_GROUPS, type AgeGroup, type Series } from "../shared/types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "content", "series");

const { values: args } = parseArgs({
  options: {
    categories: { type: "string", default: "all" },
    ages: { type: "string", default: AGE_GROUPS.join(",") },
    per: { type: "string", default: "1" },
    episodes: { type: "string", default: "3" },
    language: { type: "string", default: "en" },
    "dry-run": { type: "boolean", default: false },
    yes: { type: "boolean", default: false },
  },
});

const categories = args.categories === "all" ? CATEGORIES : args.categories.split(",").map((id) => CATEGORY_BY_ID[id.trim()]);
const ages = args.ages.split(",").map((a) => a.trim()) as AgeGroup[];
const per = Math.max(1, Number(args.per));
const episodes = Math.min(6, Math.max(1, Number(args.episodes)));
const language = args.language;

if (categories.some((c) => !c)) throw new Error(`Unknown category. Use: ${CATEGORIES.map((c) => c.id).join(", ")}`);
if (ages.some((a) => !AGE_GROUPS.includes(a))) throw new Error(`Unknown age group. Use: ${AGE_GROUPS.join(", ")}`);
if (!(language in LANGUAGE_NAMES)) throw new Error(`Unsupported language. Use: ${Object.keys(LANGUAGE_NAMES).join(", ")}`);

interface Planned {
  customId: string;
  categoryId: string;
  age: AgeGroup;
  topic: string;
}

// Topics are listed from simplest to most advanced, so older kids start further
// down the list; each extra series takes the next topic so shows don't repeat.
const plan: Planned[] = [];
for (const category of categories) {
  ages.forEach((age) => {
    const start = Math.floor((AGE_GROUPS.indexOf(age) * category.topics.length) / AGE_GROUPS.length);
    for (let i = 0; i < per; i++) {
      const topic = category.topics[(start + i) % category.topics.length];
      plan.push({ customId: `${category.id}__${age.replace("-", "to")}__${i}`, categoryId: category.id, age, topic });
    }
  });
}

// Rough estimate at batch prices for Claude Opus 5.5 ($2 / $10 per million input/output tokens):
// ~3k input + ~9k output tokens to write a series, ~6k input + ~1k output to review it.
const estimate = plan.length * (3_000 * 2 + 9_000 * 10 + 6_000 * 2 + 1_000 * 10) / 1_000_000;

console.log(`Plan: ${plan.length} new series (${episodes} episodes each) in ${LANGUAGE_NAMES[language]} with ${MODEL}`);
for (const p of plan) console.log(`  • ${p.categoryId.padEnd(11)} ages ${p.age.padEnd(5)} ${p.topic}`);
console.log(`Rough cost: about $${estimate.toFixed(2)} (batch pricing; real usage varies).`);

if (args["dry-run"]) process.exit(0);

if (!args.yes) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("Submit these requests to the Batches API? (y/N) ");
  rl.close();
  if (answer.trim().toLowerCase() !== "y") process.exit(0);
}

const client = new Anthropic();
const library = new Library({ seeded: outDir, generated: path.join(root, "data", "series") });
await library.load();

async function runBatch(requests: Anthropic.Messages.BatchCreateParams.Request[], label: string) {
  const batch = await client.messages.batches.create({ requests });
  console.log(`${label}: batch ${batch.id} submitted (${requests.length} requests). Results usually arrive within minutes.`);
  let status = batch;
  while (status.processing_status !== "ended") {
    await new Promise((r) => setTimeout(r, 30_000));
    status = await client.messages.batches.retrieve(batch.id);
    const c = status.request_counts;
    console.log(`  ${label}: ${c.succeeded} done, ${c.processing} working, ${c.errored + c.expired + c.canceled} failed`);
  }
  const results = new Map<string, ModelReply | null>();
  for await (const entry of await client.messages.batches.results(batch.id)) {
    results.set(entry.custom_id, entry.result.type === "succeeded" ? entry.result.message : null);
  }
  return results;
}

// 1. Write the series.
const written = await runBatch(
  plan.map((p) => ({
    custom_id: p.customId,
    params: writerRequest(
      GenSeriesSchema,
      seriesPrompt({
        category: CATEGORY_BY_ID[p.categoryId],
        topic: p.topic,
        age: p.age,
        language,
        episodes,
        existingTitles: library.titlesIn(p.categoryId).slice(0, 40),
      }),
    ),
  })),
  "Writing",
);

const drafts = new Map<string, Series>();
for (const p of plan) {
  const reply = written.get(p.customId);
  try {
    if (!reply) throw new Error("request failed");
    const raw = parseStructured(reply, GenSeriesSchema);
    const category = CATEGORY_BY_ID[p.categoryId];
    const id = `${category.id}.${slugify(raw.title, 28)}-${Math.random().toString(16).slice(2, 8)}`;
    drafts.set(p.customId, normalizeSeries(raw, { id, category: category.id, age: p.age, language, fallbackEmoji: category.emoji }));
  } catch (error) {
    console.warn(`  ✗ ${p.customId}: ${(error as Error).message}`);
  }
}

// 2. Safety-review every draft before it can reach a child.
const reviews = await runBatch(
  [...drafts].map(([customId, series]) => ({
    custom_id: customId,
    params: { ...writerRequest(SafetyReviewSchema, reviewPrompt(series), REVIEWER_SYSTEM, "low"), max_tokens: 16000 },
  })),
  "Safety review",
);

await mkdir(outDir, { recursive: true });
let saved = 0;
for (const [customId, series] of drafts) {
  const reply = reviews.get(customId);
  let verdict: { safe: boolean; concerns: string[] };
  try {
    verdict = reply ? parseStructured(reply, SafetyReviewSchema) : { safe: false, concerns: ["review failed"] };
  } catch (error) {
    verdict = { safe: false, concerns: [(error as Error).message] };
  }
  if (!verdict.safe) {
    console.warn(`  ✗ ${series.title}: rejected by safety review (${verdict.concerns.join("; ")})`);
    continue;
  }
  await writeFile(path.join(outDir, `${series.id}.json`), JSON.stringify(series, null, 2));
  saved++;
  const minutes = AGE_PROFILES[series.age].length;
  console.log(`  ✓ ${series.emoji} ${series.title} (${series.category}, ages ${series.age}, ${series.episodes.length} × ${minutes})`);
}

console.log(`Saved ${saved} of ${plan.length} new series to content/series/. Restart the server to see them.`);
