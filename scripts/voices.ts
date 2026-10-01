/**
 * Pre-render natural Gemini voices for every episode in the library, so kids
 * never wait for voices the first time they press play. Clips are cached in
 * data/audio/ and only rendered once.
 *
 *   npm run voices                       # every show, every language
 *   npm run voices -- --language he      # just the Hebrew shows
 *   npm run voices -- --dry-run          # count lines, no API calls
 */
import "../server/env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { Library } from "../server/library";
import { VoiceStudio, episodeLines, rendererFromEnv } from "../server/voices";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { values: args } = parseArgs({
  options: {
    language: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

const library = new Library({
  seeded: path.join(root, "content", "series"),
  generated: path.resolve(root, process.env.DATA_DIR ?? "data/series"),
});
await library.load();

const shows = library
  .list()
  .map((s) => library.get(s.id)!)
  .filter((s) => !args.language || s.language === args.language);
const lines = shows.flatMap((series) => series.episodes.flatMap((episode) => episodeLines(series, episode)));
console.log(`${shows.length} shows, ${lines.length} lines to voice.`);
const engine = rendererFromEnv(process.env);
const cloud = process.env.VOICE_ENGINE === "cloud";
const rpm = cloud ? Number(process.env.GOOGLE_TTS_RPM ?? 150) : Number(process.env.GEMINI_TTS_RPM ?? 10);
console.log(`Voices: ${engine?.label ?? "none"}, pacing to ${rpm} lines a minute. Lines already recorded are skipped.`);
if (args["dry-run"]) process.exit(0);

if (!engine) {
  console.error("Set GEMINI_API_KEY first (get one at https://aistudio.google.com/apikey).");
  process.exit(1);
}
const studio = new VoiceStudio(engine.renderer, path.resolve(root, process.env.AUDIO_DIR ?? "data/audio"));

let done = 0;
let failed = 0;
for (const series of shows) {
  for (const episode of series.episodes) {
    const result = await studio.renderAll(episodeLines(series, episode));
    done += result.done;
    failed += result.failed;
    console.log(`  ${series.title} · ${episode.number}. ${episode.title}: ${result.done} ok${result.failed ? `, ${result.failed} failed` : ""}`);
  }
}
console.log(`Done: ${done} lines ready${failed ? `, ${failed} failed (run again to retry)` : ""}.`);
