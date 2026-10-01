import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { Series } from "../../shared/types";
import { loadCatalog, loadSeries, type Catalog } from "./api";

/** Shared, cached catalog so every screen sees the same list of shows. */

let catalog: Catalog | null = null;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();
const seriesCache = new Map<string, Series>();

function emit() {
  for (const listener of listeners) listener();
}

export function refreshCatalog(): Promise<void> {
  inflight ??= loadCatalog()
    .then((next) => {
      catalog = next;
      emit();
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function forgetSeries(id: string) {
  seriesCache.delete(id);
}

export function useCatalog(): Catalog | null {
  const value = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => catalog,
  );
  useEffect(() => {
    if (!catalog) void refreshCatalog();
  }, []);
  return value;
}

export function useSeries(id: string): { series: Series | null; error: string | null; reload: () => void } {
  const [series, setSeries] = useState<Series | null>(() => seriesCache.get(id) ?? null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cached = seriesCache.get(id);
    if (cached) {
      setSeries(cached);
      return;
    }
    setSeries(null);
    setError(null);
    loadSeries(id)
      .then((s) => {
        seriesCache.set(id, s);
        if (!cancelled) setSeries(s);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id, version]);

  const reload = useCallback(() => {
    seriesCache.delete(id);
    setVersion((v) => v + 1);
  }, [id]);

  return { series, error, reload };
}
