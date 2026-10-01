import { Capacitor } from "@capacitor/core";
import { summarize } from "../../shared/normalize";
import type { AgeGroup, Series, SeriesSummary } from "../../shared/types";

/**
 * Talks to the WonderWhirl server (catalog + AI studio). The iPhone app ships
 * with the built-in shows, so everything except the AI studio works offline.
 */

const configured = import.meta.env.VITE_API_BASE as string | undefined;
// In the iOS simulator, "localhost" is the Mac running `npm run server`.
export const API_BASE = (configured ?? (Capacitor.isNativePlatform() ? "http://localhost:8787" : "")).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit, timeoutMs = 10000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(API_BASE + path, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status);
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Can't reach the WonderWhirl server.", 0);
  } finally {
    window.clearTimeout(timer);
  }
}

export interface Health {
  ok: boolean;
  ai: boolean;
  /** Natural AI voices (Gemini) are configured on the server. */
  voices: boolean;
  model: string | null;
  safetyReview: boolean;
}

export interface Catalog {
  series: SeriesSummary[];
  ai: boolean;
  voices: boolean;
  offline: boolean;
}

const builtin = () => import("../../shared/builtin");

export async function loadCatalog(): Promise<Catalog> {
  try {
    const [catalog, health] = await Promise.all([
      request<{ series: SeriesSummary[] }>("/api/catalog"),
      request<Health>("/api/health"),
    ]);
    return { series: catalog.series, ai: health.ai, voices: Boolean(health.voices), offline: false };
  } catch {
    const { BUILTIN_SERIES } = await builtin();
    return { series: BUILTIN_SERIES.map(summarize), ai: false, voices: false, offline: true };
  }
}

export async function loadSeries(id: string): Promise<Series> {
  try {
    return await request<Series>(`/api/series/${encodeURIComponent(id)}`);
  } catch (error) {
    const { BUILTIN_SERIES } = await builtin();
    const found = BUILTIN_SERIES.find((s) => s.id === id);
    if (found) return found;
    throw error;
  }
}

export interface StudioRequest {
  category: string;
  topic?: string;
  idea?: string;
  age: AgeGroup;
  language: string;
}

export type JobStatus = "queued" | "writing" | "checking" | "done" | "failed";

export interface Job {
  id: string;
  kind: "series" | "episode";
  status: JobStatus;
  progress: number;
  message: string;
  seriesId?: string;
  episode?: number;
  error?: string;
}

export function startSeriesJob(req: StudioRequest) {
  return request<{ job: Job }>("/api/studio/series", { method: "POST", body: JSON.stringify(req) });
}

export function startEpisodeJob(seriesId: string, idea?: string) {
  return request<{ job: Job }>(`/api/studio/series/${encodeURIComponent(seriesId)}/episodes`, {
    method: "POST",
    body: JSON.stringify({ idea }),
  });
}

export function getJob(id: string) {
  return request<{ job: Job }>(`/api/jobs/${encodeURIComponent(id)}`);
}
