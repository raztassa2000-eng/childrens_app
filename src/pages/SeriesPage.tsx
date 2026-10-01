import { useMemo } from "react";
import { CATEGORY_BY_ID } from "../../shared/categories";
import { buildTimeline } from "../../shared/timeline";
import { EmptyState, EpisodeDuration, Loading, ageLabel, categoryColors } from "../components/Bits";
import { LivePreview, SceneThumb } from "../components/Thumbs";
import { useCatalog, useSeries } from "../lib/catalog";
import { haptic } from "../lib/native";
import { href } from "../lib/router";
import { useStore } from "../lib/store";

export function SeriesPage({ id }: { id: string }) {
  const { series, error } = useSeries(id);
  const catalog = useCatalog();
  const { progress, settings } = useStore();

  const durations = useMemo(
    () => (series ? series.episodes.map((e) => buildTimeline(series, e, settings.rate).duration) : []),
    [series, settings.rate],
  );

  if (error) return <EmptyState emoji="🙈" title="We couldn't find that show">{<a className="btn btn--primary" href="#/">Go home</a>}</EmptyState>;
  if (!series) return <Loading />;

  const colors = categoryColors(series.category);
  const category = CATEGORY_BY_ID[series.category];
  const nextUp = series.episodes.find((e) => !progress.watched[`${series.id}#${e.number}`]) ?? series.episodes[0];

  return (
    <main className="page">
      <section className="show-hero" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
        <a className="show-hero__screen" href={href({ name: "watch", id: series.id, episode: nextUp.number })}>
          <LivePreview cast={series.cast} scene={series.episodes[0].scenes[0]} colors={colors} className="show-hero__canvas" />
          <span className="hero__play">▶</span>
        </a>
        <div className="show-hero__info">
          <a className="crumb" href={href({ name: "category", id: series.category })}>
            {category?.emoji} {category?.name ?? series.category}
          </a>
          <h1>
            {series.emoji} {series.title}
          </h1>
          <p>{series.tagline}</p>
          <div className="tags">
            <span className="tag">{ageLabel(series.age)}</span>
            <span className="tag">{series.episodes.length} episodes</span>
            {series.source === "ai" && <span className="tag">✨ Made with AI</span>}
          </div>
          <a className="btn btn--white btn--big" href={href({ name: "watch", id: series.id, episode: nextUp.number })} onClick={() => haptic.tap()}>
            ▶ Play episode {nextUp.number}
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Meet the cast</h2>
        </div>
        <div className="cast">
          {series.cast.map((c, i) => (
            <div className="cast__member" key={c.id} style={{ animationDelay: `${i * 0.2}s` }}>
              <span className="cast__emoji">{c.emoji}</span>
              <strong>{c.name}</strong>
              <span className="muted small">{c.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Episodes</h2>
        </div>
        <ol className="episodes">
          {series.episodes.map((e, i) => {
            const watched = progress.watched[`${series.id}#${e.number}`];
            return (
              <li key={e.number}>
                <a className="episode" href={href({ name: "watch", id: series.id, episode: e.number })} onClick={() => haptic.tap()}>
                  <div className="episode__thumb">
                    <SceneThumb cast={series.cast} scene={e.scenes[Math.min(1, e.scenes.length - 1)]} colors={colors} className="episode__canvas" />
                    <EpisodeDuration seconds={durations[i] ?? 0} />
                    {watched && <span className="episode__done">✓</span>}
                  </div>
                  <div className="episode__info">
                    <span className="episode__num">Episode {e.number}</span>
                    <h3 dir="auto">{e.title}</h3>
                    <p dir="auto">{e.summary}</p>
                    {watched && watched.stars > 0 && <span className="episode__stars">{"⭐".repeat(watched.stars)}</span>}
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
        {catalog?.ai && (
          <a className="make-card make-card--wide" href={href({ name: "studio", series: series.id })}>
            <span className="make-card__icon">🪄</span>
            <strong>Make episode {series.episodes.length + 1}</strong>
            <span className="muted">The AI writes a new adventure with the same cast</span>
          </a>
        )}
      </section>
    </main>
  );
}
