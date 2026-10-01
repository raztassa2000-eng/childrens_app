import { describe, expect, it } from "vitest";
import { BUILTIN_SERIES } from "../shared/builtin";
import { AGE_PROFILES, CATEGORIES, CATEGORY_BY_ID } from "../shared/categories";
import { isAllowedEmoji } from "../shared/normalize";
import { SeriesSchema } from "../shared/schemas";
import { buildTimeline } from "../shared/timeline";
import { NARRATOR } from "../shared/types";

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("built-in library", () => {
  it("has a series for every category, with unique ids", () => {
    const ids = BUILTIN_SERIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const category of CATEGORIES) {
      expect(BUILTIN_SERIES.some((s) => s.category === category.id), category.id).toBe(true);
    }
  });

  it("ships every category in every app language", () => {
    for (const language of ["en", "he", "fr"]) {
      for (const category of CATEGORIES) {
        const found = BUILTIN_SERIES.some((s) => s.language === language && s.category === category.id);
        expect(found, `${language}: ${category.id}`).toBe(true);
      }
    }
  });

  for (const series of BUILTIN_SERIES) {
    describe(series.title, () => {
      it("matches the stored-series schema", () => {
        expect(() => SeriesSchema.parse(series)).not.toThrow();
        expect(CATEGORY_BY_ID[series.category]).toBeDefined();
        expect(series.id.startsWith(`${series.category}.`)).toBe(true);
      });

      it("uses allowed emoji everywhere", () => {
        expect(isAllowedEmoji(series.emoji)).toBe(true);
        for (const member of series.cast) expect(isAllowedEmoji(member.emoji), member.name).toBe(true);
        for (const episode of series.episodes) {
          for (const scene of episode.scenes) {
            for (const prop of scene.props) expect(isAllowedEmoji(prop.emoji), `${episode.title}: ${prop.emoji}`).toBe(true);
            for (const actor of scene.actors) {
              const isCast = series.cast.some((c) => c.id === actor.who);
              expect(isCast || isAllowedEmoji(actor.who), `${episode.title}: actor ${actor.who}`).toBe(true);
            }
          }
        }
      });

      it("follows the animation engine's rules", () => {
        const limit = AGE_PROFILES[series.age].maxWordsPerLine + 6;
        for (const episode of series.episodes) {
          expect(episode.scenes.length, episode.title).toBeGreaterThanOrEqual(6);
          for (const [i, scene] of episode.scenes.entries()) {
            const where = `${episode.title}, scene ${i + 1}`;
            expect(scene.actors.length, where).toBeGreaterThanOrEqual(1);
            expect(scene.actors.length, where).toBeLessThanOrEqual(3);
            expect(scene.props.length, where).toBeLessThanOrEqual(4);
            expect(scene.caption.length, where).toBeLessThanOrEqual(24);
            expect(scene.lines.length, where).toBeGreaterThanOrEqual(1);
            for (const line of scene.lines) {
              // A character only talks when they're on stage, so the bubble has someone to point at.
              const onStage = scene.actors.some((a) => a.who === line.speaker);
              expect(line.speaker === NARRATOR || onStage, `${where}: ${line.speaker} isn't on stage`).toBe(true);
              expect(words(line.text), `${where}: "${line.text}"`).toBeLessThanOrEqual(limit);
            }
          }
        }
      });

      it("has quizzes whose answers exist", () => {
        for (const episode of series.episodes) {
          expect(episode.quiz.length, episode.title).toBeGreaterThanOrEqual(2);
          for (const q of episode.quiz) {
            expect(q.choices.length).toBe(3);
            expect(q.answer).toBeGreaterThanOrEqual(0);
            expect(q.answer).toBeLessThan(q.choices.length);
            expect(new Set(q.choices.map((c) => c.toLowerCase())).size).toBe(q.choices.length);
          }
          expect(episode.takeaway.length).toBeGreaterThan(10);
        }
      });

      it("runs about as long as its age group intends", () => {
        const target = AGE_PROFILES[series.age].minutes * 60;
        for (const episode of series.episodes) {
          const seconds = buildTimeline(series, episode).duration;
          expect(seconds, episode.title).toBeGreaterThan(target * 0.5);
          expect(seconds, episode.title).toBeLessThan(target * 1.8);
        }
      });
    });
  }
});
