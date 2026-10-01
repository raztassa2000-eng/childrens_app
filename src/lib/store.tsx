import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AgeGroup } from "../../shared/types";

/** Settings and progress, saved on the device. */

export interface Settings {
  age: AgeGroup | "all";
  narration: boolean;
  music: boolean;
  captions: boolean;
  sfx: boolean;
  /** Speech speed: 0.8 (slow) to 1.2 (fast). */
  rate: number;
  /** Daily watching limit in minutes; 0 = no limit. */
  dailyMinutes: number;
  /** Let kids use the AI Magic Studio without the parent gate. */
  studioForKids: boolean;
  autoplayNext: boolean;
}

export interface Progress {
  stars: number;
  /** key: `${seriesId}#${episode}` */
  watched: Record<string, { at: string; stars: number }>;
  last?: { seriesId: string; episode: number };
  today: { date: string; seconds: number };
  /** Parent-unlocked extra time for today, in minutes. */
  bonusMinutes: number;
}

const DEFAULT_SETTINGS: Settings = {
  age: "all",
  narration: true,
  music: true,
  captions: true,
  sfx: true,
  rate: 1,
  dailyMinutes: 0,
  studioForKids: true,
  autoplayNext: true,
};

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_PROGRESS: Progress = { stars: 0, watched: {}, today: { date: today(), seconds: 0 }, bonusMinutes: 0 };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the app still works for this session.
  }
}

interface StoreValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  progress: Progress;
  markWatched: (seriesId: string, episode: number, stars: number) => void;
  setLast: (seriesId: string, episode: number) => void;
  addWatchTime: (seconds: number) => void;
  grantBonus: (minutes: number) => void;
  resetProgress: () => void;
  minutesLeft: number | null;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() => load("ww.settings", DEFAULT_SETTINGS));
  const [progress, setProgress] = useState(() => {
    const p = load("ww.progress", DEFAULT_PROGRESS);
    return p.today.date === today() ? p : { ...p, today: { date: today(), seconds: 0 }, bonusMinutes: 0 };
  });

  useEffect(() => save("ww.settings", settings), [settings]);
  useEffect(() => {
    const id = window.setTimeout(() => save("ww.progress", progress), 400);
    return () => window.clearTimeout(id);
  }, [progress]);

  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  const markWatched = useCallback((seriesId: string, episode: number, stars: number) => {
    setProgress((p) => {
      const key = `${seriesId}#${episode}`;
      const previous = p.watched[key]?.stars ?? 0;
      const best = Math.max(previous, stars);
      return {
        ...p,
        stars: p.stars + (best - previous),
        watched: { ...p.watched, [key]: { at: new Date().toISOString(), stars: best } },
      };
    });
  }, []);

  const setLast = useCallback((seriesId: string, episode: number) => {
    setProgress((p) => (p.last?.seriesId === seriesId && p.last.episode === episode ? p : { ...p, last: { seriesId, episode } }));
  }, []);

  const addWatchTime = useCallback((seconds: number) => {
    setProgress((p) => {
      const date = today();
      const base = p.today.date === date ? p.today.seconds : 0;
      return { ...p, today: { date, seconds: base + seconds }, bonusMinutes: p.today.date === date ? p.bonusMinutes : 0 };
    });
  }, []);

  const grantBonus = useCallback((minutes: number) => setProgress((p) => ({ ...p, bonusMinutes: p.bonusMinutes + minutes })), []);
  const resetProgress = useCallback(() => setProgress({ ...DEFAULT_PROGRESS, today: { date: today(), seconds: 0 } }), []);

  const minutesLeft =
    settings.dailyMinutes > 0 ? Math.max(0, settings.dailyMinutes + progress.bonusMinutes - progress.today.seconds / 60) : null;

  const value = useMemo(
    () => ({ settings, updateSettings, progress, markWatched, setLast, addWatchTime, grantBonus, resetProgress, minutesLeft }),
    [settings, updateSettings, progress, markWatched, setLast, addWatchTime, grantBonus, resetProgress, minutesLeft],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside <StoreProvider>");
  return value;
}
