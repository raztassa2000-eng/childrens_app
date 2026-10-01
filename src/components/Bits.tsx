import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CATEGORY_BY_ID } from "../../shared/categories";
import { formatClock } from "../../shared/timeline";
import type { SeriesSummary } from "../../shared/types";
import { haptic } from "../lib/native";
import { href } from "../lib/router";
import { useStore } from "../lib/store";
import { useT, type Dict } from "../i18n";
import { SceneThumb } from "./Thumbs";

export function categoryColors(categoryId: string): [string, string] {
  return CATEGORY_BY_ID[categoryId]?.colors ?? ["#a18cd1", "#fbc2eb"];
}

export function ageLabel(age: string, t: Dict) {
  return age === "all" ? t.allAges : t.ages(age.replace("-", "–"));
}

export function SeriesCard({ series }: { series: SeriesSummary }) {
  const { progress } = useStore();
  const t = useT();
  const colors = categoryColors(series.category);
  const watched = series.episodes.filter((e) => progress.watched[`${series.id}#${e.number}`]).length;
  const minutes = Math.max(1, Math.round(series.episodes.reduce((sum, e) => sum + e.seconds, 0) / series.episodes.length / 60));
  return (
    <a className="series-card" href={href({ name: "series", id: series.id })} onClick={() => haptic.tap()}>
      <div className="series-card__thumb" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
        <SceneThumb cast={series.cast} scene={series.preview} colors={colors} className="series-card__canvas" />
        <span className="series-card__badge">{t.episodesCount(series.episodes.length)}</span>
        {series.source === "ai" && <span className="series-card__ai">{t.ai}</span>}
      </div>
      <div className="series-card__body">
        <span className="series-card__emoji" aria-hidden="true">
          {series.emoji}
        </span>
        <div>
          <h3 dir="auto">{series.title}</h3>
          <p>
            {ageLabel(series.age, t)} · {t.minutesShort(minutes)}
            {watched > 0 && ` · ${t.watchedOf(watched, series.episodes.length)}`}
          </p>
        </div>
      </div>
    </a>
  );
}

export function EpisodeDuration({ seconds }: { seconds: number }) {
  return <span className="duration">{formatClock(seconds)}</span>;
}

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        color: ["#ff6b9a", "#ffd23f", "#4dd0e1", "#9ccc65", "#b388ff", "#ff9f43"][i % 6],
        size: 8 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [count],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 0.6,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Grown-ups only: a times-table question most young kids can't answer yet. */
export function ParentGate({ onPass, onCancel, title }: { onPass: () => void; onCancel?: () => void; title?: string }) {
  const t = useT();
  const [a] = useState(() => 6 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 3 + Math.floor(Math.random() * 7));
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const check = () => {
    if (Number(answer) === a * b) onPass();
    else {
      setWrong(true);
      haptic.oops();
      setAnswer("");
    }
  };
  return (
    <div className="gate">
      <div className="gate__card">
        <div className="gate__lock">🔒</div>
        <h2>{title ?? t.gateTitle}</h2>
        <p>{t.gateAsk}</p>
        <p className="gate__sum">
          {a} × {b} = ?
        </p>
        <input
          className={`gate__input ${wrong ? "shake" : ""}`}
          inputMode="numeric"
          pattern="[0-9]*"
          value={answer}
          autoFocus
          onAnimationEnd={() => setWrong(false)}
          onChange={(e) => setAnswer(e.target.value.replace(/\D/g, "").slice(0, 3))}
          onKeyDown={(e) => e.key === "Enter" && check()}
          aria-label={t.answer}
        />
        <div className="gate__actions">
          {onCancel && (
            <button className="btn btn--ghost" onClick={onCancel}>
              {t.back}
            </button>
          )}
          <button className="btn btn--primary" onClick={check} disabled={!answer}>
            {t.unlock}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Loading({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="loading">
      <div className="loading__dots">
        <span>🌟</span>
        <span>🎈</span>
        <span>🌈</span>
      </div>
      <p>{label ?? t.loading}</p>
    </div>
  );
}

export function EmptyState({ emoji, title, children }: { emoji: string; title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty__emoji">{emoji}</div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

/** Horizontal, swipeable row of cards (works left-to-right and right-to-left). */
export function Row({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // In right-to-left layouts scrollLeft runs from 0 down to negative numbers.
    const update = () => {
      const pos = Math.abs(el.scrollLeft);
      setCanScroll({ back: pos > 8, forward: pos + el.clientWidth < el.scrollWidth - 8 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);
  const scroll = (forward: boolean) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: (forward !== rtl ? 1 : -1) * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="row">
      {canScroll.back && (
        <button className="row__arrow row__arrow--start" onClick={() => scroll(false)} aria-hidden="true" tabIndex={-1}>
          ‹
        </button>
      )}
      <div className="row__track" ref={ref}>
        {children}
      </div>
      {canScroll.forward && (
        <button className="row__arrow row__arrow--end" onClick={() => scroll(true)} aria-hidden="true" tabIndex={-1}>
          ›
        </button>
      )}
    </div>
  );
}
