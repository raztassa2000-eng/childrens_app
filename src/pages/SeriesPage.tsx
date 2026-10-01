import { useMemo } from "react";
import { localCategoryById } from "../../shared/categoryText";
import { buildTimeline } from "../../shared/timeline";
import { EmptyState, EpisodeDuration, Loading, ageLabel, categoryColors } from "../components/Bits";
import { LivePreview, SceneThumb } from "../components/Thumbs";
import { useCatalog, useSeries } from "../lib/catalog";
import { haptic } from "../lib/native";
import { href } from "../lib/router";
import { useStore } from "../lib/store";
import { useT } from "../i18n";

export function SeriesPage({ id }: { id: string }) {
  const { series, error } = useSeries(id);
  const catalog = useCatalog();
  const { progress, settings } = useStore();
  const t = useT();

  const durations = useMemo(
    () => (series ? series.episodes.map((e) => buildTimeline(series, e, settings.rate).duration) : []),
    [series, settings.rate],
  );

  if (error) return <EmptyState emoji="🙈" title={t.showNotFound}>{<a className="btn btn--primary" href="#/">{t.goHome}</a>}</EmptyState>;
  if (!series) return <Loading />;

  const colors = categoryColors(series.category);
  const category = localCategoryById(series.category, settings.language);
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
          <h1 dir="auto">
            {series.emoji} {series.title}
          </h1>
          <p dir="auto">{series.tagline}</p>
          <div className="tags">
            <span className="tag">{ageLabel(series.age, t)}</span>
            <span className="tag">{t.episodesCount(series.episodes.length)}</span>
            {series.source === "ai" && <span className="tag">{t.madeWithAI}</span>}
          </div>
          <a className="btn btn--white btn--big" href={href({ name: "watch", id: series.id, episode: nextUp.number })} onClick={() => haptic.tap()}>
            {t.playEpisode(nextUp.number)}
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>{t.meetCast}</h2>
        </div>
        <div className="cast">
          {series.cast.map((c, i) => (
            <div className="cast__member" key={c.id} style={{ animationDelay: `${i * 0.2}s` }}>
              <span className="cast__emoji">{c.emoji}</span>
              <strong dir="auto">{c.name}</strong>
              <span className="muted small" dir="auto">{c.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>{t.episodes}</h2>
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
                    <span className="episode__num">{t.episodeN(e.number)}</span>
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
            <strong>{t.makeEpisodeN(series.episodes.length + 1)}</strong>
            <span className="muted">{t.makeEpisodeHint}</span>
          </a>
        )}
      </section>
    </main>
  );
}
