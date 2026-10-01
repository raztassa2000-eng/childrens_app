import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BUILTIN_SERIES } from "../shared/builtin";
import { summarize } from "../shared/normalize";
import { SeriesSchema } from "../shared/schemas";
import type { Series, SeriesSummary } from "../shared/types";

/**
 * All shows: built-in ones, AI shows from the seed script (content/series, kept
 * in git) and shows made in the Magic Studio (data/series, written at runtime).
 */
export class Library {
  private readonly series = new Map<string, Series>();
  private summaries: SeriesSummary[] | null = null;

  constructor(private readonly dirs: { seeded: string; generated: string }) {}

  async load(): Promise<void> {
    for (const s of BUILTIN_SERIES) this.series.set(s.id, s);
    for (const dir of [this.dirs.seeded, this.dirs.generated]) {
      for (const series of await readSeriesDir(dir)) this.merge(series);
    }
    this.summaries = null;
  }

  /** A saved copy of an existing show only adds episodes on top of the original. */
  private merge(series: Series) {
    const base = this.series.get(series.id);
    if (base && base !== series) {
      const extra = series.episodes.filter((e) => e.number > base.episodes.length);
      this.series.set(series.id, { ...base, episodes: [...base.episodes, ...extra] });
    } else {
      this.series.set(series.id, series);
    }
  }

  list(): SeriesSummary[] {
    this.summaries ??= [...this.series.values()].map(summarize);
    return this.summaries;
  }

  get(id: string): Series | undefined {
    return this.series.get(id);
  }

  titlesIn(category: string): string[] {
    return [...this.series.values()].filter((s) => s.category === category).map((s) => s.title);
  }

  async save(series: Series): Promise<void> {
    SeriesSchema.parse(series);
    await mkdir(this.dirs.generated, { recursive: true });
    const file = path.join(this.dirs.generated, `${series.id}.json`);
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(series, null, 2));
    await rename(tmp, file);
    this.series.set(series.id, series);
    this.summaries = null;
  }
}

export async function readSeriesDir(dir: string): Promise<Series[]> {
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const out: Series[] = [];
  for (const file of files) {
    try {
      const parsed = SeriesSchema.safeParse(JSON.parse(await readFile(path.join(dir, file), "utf8")));
      if (parsed.success) out.push(parsed.data);
      else console.warn(`Skipping ${file}: ${parsed.error.issues[0]?.message}`);
    } catch (error) {
      console.warn(`Skipping ${file}: ${(error as Error).message}`);
    }
  }
  return out;
}
