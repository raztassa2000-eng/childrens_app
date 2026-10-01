import { describe, expect, it } from "vitest";
import { cleanEmoji, cleanSpoken, normalizeSeries, slugify, summarize } from "../shared/normalize";
import type { GenSeries } from "../shared/schemas";
import { buildTimeline, lineAt, sceneAt } from "../shared/timeline";

const meta = { id: "animals.test-show", category: "animals", age: "6-8" as const, language: "en", fallbackEmoji: "🦁" };

function rawSeries(overrides: Partial<GenSeries> = {}): GenSeries {
  return {
    title: "Ocean Pals",
    tagline: "Splashy science!",
    emoji: "🐬",
    cast: [
      { id: "Finn", name: "Finn", emoji: "🐬", role: "A playful dolphin.", voice: "child" },
      { id: "shelly", name: "Shelly", emoji: "🐢", role: "A wise turtle.", voice: "wise" },
    ],
    episodes: [
      {
        title: "Deep Blue",
        summary: "Finn and Shelly explore the ocean.",
        topic: "Ocean zones",
        scenes: [
          {
            background: "underwater",
            actors: [
              { who: "finn", action: "swim", enter: "left" },
              { who: "Shelly", action: "idle", enter: "auto" },
              { who: "🐙", action: "wiggle", enter: "pop" },
              { who: "🦈", action: "swim", enter: "auto" },
            ],
            props: [
              { emoji: "🫧 bubbles", place: "air" },
              { emoji: "🔫", place: "ground" },
            ],
            caption: "The sunlight zone is the top layer of the ocean",
            lines: [
              { speaker: "Finn", text: "Hi! 🐬 *splash* Let's dive!" },
              { speaker: "Shelly", text: "[waves flipper] Hello, friends." },
              { speaker: "🐙", text: "Blub blub!" },
              { speaker: "ghost", text: "Who said that?" },
            ],
          },
          {
            background: "volcano" as never,
            actors: [{ who: "finn", action: "moonwalk" as never, enter: "auto" }],
            props: [],
            caption: "",
            lines: [{ speaker: "narrator", text: "The ocean is deep." }],
          },
        ],
        quiz: [
          { question: "Who is the turtle?", choices: ["Shelly", "Finn", "shelly", "Bob"], answer: 0, explanation: "Shelly!" },
          { question: "Broken?", choices: ["A", "B"], answer: 5, explanation: "" },
        ],
        takeaway: "The ocean has layers 🌊.",
      },
    ],
    ...overrides,
  };
}

describe("emoji and text cleaning", () => {
  it("keeps the first allowed emoji and blocks unsafe ones", () => {
    expect(cleanEmoji("🫧 bubbles")).toBe("🫧");
    expect(cleanEmoji("🔫", "⭐")).toBe("⭐");
    expect(cleanEmoji("no emoji here", "⭐")).toBe("⭐");
    expect(cleanEmoji("🇯🇵")).toBe("🇯🇵");
  });

  it("strips emoji, markdown and stage directions from spoken lines", () => {
    expect(cleanSpoken("Hi! 🐬 *splash* Let's dive!")).toBe("Hi! splash Let's dive!");
    expect(cleanSpoken("[waves flipper] Hello, friends.")).toBe("Hello, friends.");
  });

  it("makes ids safe", () => {
    expect(slugify("Leo's Jungle Club!")).toBe("leo-s-jungle-club");
    expect(slugify("שלום")).toBe("x");
  });
});

describe("normalizeSeries", () => {
  const series = normalizeSeries(rawSeries(), meta);
  const [scene, second] = series.episodes[0].scenes;

  it("normalizes cast ids and resolves references by id or name", () => {
    expect(series.cast.map((c) => c.id)).toEqual(["finn", "shelly"]);
    expect(scene.actors.map((a) => a.who)).toEqual(["finn", "shelly", "🐙"]);
  });

  it("caps actors at three, drops blocked props and clips long captions", () => {
    expect(scene.actors).toHaveLength(3);
    expect(scene.props).toEqual([{ emoji: "🫧", place: "air" }]);
    expect(scene.caption.length).toBeLessThanOrEqual(29);
  });

  it("maps speakers to cast, on-stage extras, or the narrator", () => {
    expect(scene.lines.map((l) => l.speaker)).toEqual(["finn", "shelly", "🐙", "narrator"]);
  });

  it("repairs unknown backgrounds and actions", () => {
    expect(second.background).toBe("meadow");
    expect(second.actors[0].action).toBe("idle");
  });

  it("dedupes quiz choices and drops broken questions", () => {
    const quiz = series.episodes[0].quiz;
    expect(quiz).toHaveLength(1);
    expect(quiz[0].choices).toEqual(["Shelly", "Finn", "Bob"]);
    expect(quiz[0].choices[quiz[0].answer]).toBe("Shelly");
  });

  it("produces a summary with a playable preview", () => {
    const summary = summarize(series);
    expect(summary.episodes[0].seconds).toBeGreaterThan(5);
    expect(summary.preview?.background).toBe("underwater");
    expect("scenes" in summary.episodes[0]).toBe(false);
  });

  it("rejects scripts that are too short to be an episode", () => {
    const raw = rawSeries();
    raw.episodes[0].scenes = raw.episodes[0].scenes.slice(0, 1);
    expect(() => normalizeSeries(raw, meta)).toThrow(/too short/);
  });
});

describe("timeline", () => {
  const series = normalizeSeries(rawSeries(), meta);
  const episode = series.episodes[0];
  const timeline = buildTimeline(series, episode);

  it("orders intro, scenes and outro without gaps", () => {
    expect(timeline.scenes[0].start).toBe(timeline.introEnd);
    for (let i = 1; i < timeline.scenes.length; i++) {
      expect(timeline.scenes[i].start).toBe(timeline.scenes[i - 1].end);
    }
    expect(timeline.outroStart).toBe(timeline.scenes.at(-1)!.end);
    expect(timeline.duration).toBeGreaterThan(timeline.outroStart);
  });

  it("finds the scene and line at any time", () => {
    expect(sceneAt(timeline, 0)).toBe(-1);
    expect(sceneAt(timeline, timeline.scenes[1].start + 0.1)).toBe(1);
    expect(sceneAt(timeline, timeline.duration)).toBe(timeline.scenes.length);
    const first = timeline.lines.find((l) => l.segment === "scene")!;
    expect(lineAt(timeline, first.start + 0.01)?.key).toBe(first.key);
  });

  it("stretches when speech is slower", () => {
    expect(buildTimeline(series, episode, 0.8).duration).toBeGreaterThan(timeline.duration);
  });
});
