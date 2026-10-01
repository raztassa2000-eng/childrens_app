import { useEffect, useRef } from "react";
import type { CastMember, Scene } from "../../shared/types";
import { W } from "../engine/paint";
import { fontsReady, renderStill } from "../engine/render";

function fit(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(160, Math.round((rect.width || 320) * dpr));
  const height = Math.round((width * 9) / 16);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d")!;
  const pixelRatio = width / W;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { ctx, pixelRatio };
}

/** A real frame of the show, rendered by the same engine as the player. */
export function SceneThumb({ cast, scene, colors, className }: { cast: CastMember[]; scene: Scene | null; colors: [string, string]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !scene) return;
    const draw = () => {
      const { ctx, pixelRatio } = fit(canvas);
      renderStill(ctx, cast, scene, colors, pixelRatio);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    void fontsReady.then(draw);
    return () => observer.disconnect();
  }, [cast, scene, colors]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/** The same frame, but alive: characters keep moving (muted preview). */
export function LivePreview({ cast, scene, colors, className }: { cast: CastMember[]; scene: Scene | null; colors: [string, string]; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !scene) return;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    const frame = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      const { ctx, pixelRatio } = fit(canvas);
      renderStill(ctx, cast, scene, colors, pixelRatio, 2 + (performance.now() - start) / 1000);
      raf = requestAnimationFrame(frame);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    observer.observe(canvas);
    const onVisibility = () => !document.hidden && !raf && (raf = requestAnimationFrame(frame));
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cast, scene, colors]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
