import { useEffect, useRef, useState } from "react";
import { buildTimeline } from "../../shared/timeline";
import { Confetti, EmptyState, EpisodeDuration, Loading, ParentGate, categoryColors } from "../components/Bits";
import { Quiz } from "../components/Quiz";
import { SceneThumb } from "../components/Thumbs";
import { VideoPlayer } from "../components/VideoPlayer";
import { sfx } from "../engine/sfx";
import { useCatalog, useSeries } from "../lib/catalog";
import { haptic } from "../lib/native";
import { go, href } from "../lib/router";
import { useStore } from "../lib/store";
import { useT } from "../i18n";

type Phase = "watch" | "quiz" | "done";

export function Watch({ id, episode: number }: { id: string; episode: number }) {
  const { series, error } = useSeries(id);
  const catalog = useCatalog();
  const { settings, markWatched, setLast, addWatchTime, grantBonus, minutesLeft } = useStore();
  const [phase, setPhase] = useState<Phase>("watch");
  const [earned, setEarned] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gate, setGate] = useState(false);
  const pendingSeconds = useRef(0);
  const t = useT();

  useEffect(() => {
    setPhase("watch");
    setEarned(0);
    setCountdown(null);
  }, [id, number]);

  useEffect(() => {
    if (series) setLast(series.id, number);
  }, [series, number, setLast]);

  // Watch time is batched so the whole app doesn't re-render every frame.
  useEffect(() => {
    const flush = () => {
      if (pendingSeconds.current > 0) {
        addWatchTime(pendingSeconds.current);
        pendingSeconds.current = 0;
      }
    };
    const timer = window.setInterval(flush, 5000);
    return () => {
      window.clearInterval(timer);
      flush();
    };
  }, [addWatchTime]);

  const episode = series?.episodes.find((e) => e.number === number) ?? null;
  const hasNext = Boolean(series && number < series.episodes.length);

  useEffect(() => {
    if (phase !== "done" || !hasNext || !settings.autoplayNext) return;
    setCountdown(10);
    const timer = window.setInterval(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase, hasNext, settings.autoplayNext]);

  useEffect(() => {
    if (countdown === 0 && series) go({ name: "watch", id: series.id, episode: number + 1 });
  }, [countdown, series, number]);

  if (error) return <EmptyState emoji="🙈" title={t.showNotFound} />;
  if (!series) return <Loading />;
  if (!episode) return <EmptyState emoji="🔍" title={t.episodeNotFound} />;

  const colors = categoryColors(series.category);
  const timeUp = minutesLeft !== null && minutesLeft <= 0;

  const onEnded = () => {
    if (episode.quiz.length > 0) setPhase("quiz");
    else finish(0);
  };

  const finish = (stars: number) => {
    setEarned(stars);
    markWatched(series.id, episode.number, stars);
    setPhase("done");
    sfx.tada();
    haptic.success();
  };

  return (
    <main className="page page--watch">
      <div className="watch">
        <div className="watch__screen">
          <VideoPlayer
            series={series}
            episode={episode}
            colors={colors}
            autoPlay={phase === "watch"}
            blocked={timeUp || phase !== "watch"}
            onEnded={onEnded}
            onWatched={(s) => (pendingSeconds.current += s)}
          />

          {phase === "quiz" && (
            <div className="overlay">
              <Quiz series={series} questions={episode.quiz} colors={colors} onDone={finish} />
            </div>
          )}

          {phase === "done" && (
            <div className="overlay">
              <Confetti />
              <div className="finish">
                <div className="finish__stars">{earned > 0 ? "⭐".repeat(earned) : "🎉"}</div>
                <h2>{earned > 0 ? t.earnedStars(earned) : t.greatWatching}</h2>
                <p dir="auto">{episode.takeaway}</p>
                <div className="finish__actions">
                  {hasNext ? (
                    <a className="btn btn--primary btn--big" href={href({ name: "watch", id: series.id, episode: number + 1 })}>
                      {t.nextEpisode}
                      {countdown !== null && countdown > 0 ? ` (${countdown})` : ""}
                    </a>
                  ) : catalog?.ai ? (
                    <a className="btn btn--primary btn--big" href={href({ name: "studio", series: series.id })}>
                      {t.makeNextEpisode}
                    </a>
                  ) : (
                    <a className="btn btn--primary btn--big" href={href({ name: "category", id: series.category })}>
                      {t.moreShows}
                    </a>
                  )}
                  <button className="btn btn--ghost" onClick={() => { setCountdown(null); setPhase("watch"); }}>
                    {t.watchAgain}
                  </button>
                </div>
              </div>
            </div>
          )}

          {timeUp && phase === "watch" && (
            <div className="overlay overlay--night">
              {gate ? (
                <ParentGate
                  title={t.addMinutes}
                  onPass={() => {
                    grantBonus(15);
                    setGate(false);
                  }}
                  onCancel={() => setGate(false)}
                />
              ) : (
                <div className="finish">
                  <div className="finish__stars">🌙</div>
                  <h2>{t.breakTitle}</h2>
                  <p>{t.breakText}</p>
                  <div className="finish__actions">
                    <a className="btn btn--primary btn--big" href="#/">
                      {t.ok}
                    </a>
                    <button className="btn btn--ghost" onClick={() => setGate(true)}>
                      {t.moreTime}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="watch__side">
          <a className="crumb" href={href({ name: "series", id: series.id })} dir="auto">
            {series.emoji} {series.title}
          </a>
          <h1 dir="auto">
            {episode.number}. {episode.title}
          </h1>
          <p className="muted" dir="auto">
            {episode.summary}
          </p>
          <h2 className="watch__upnext">{t.episodes}</h2>
          <ol className="mini-episodes">
            {series.episodes.map((e) => (
              <li key={e.number}>
                <a className={`mini-episode ${e.number === number ? "is-current" : ""}`} href={href({ name: "watch", id: series.id, episode: e.number })}>
                  <div className="mini-episode__thumb">
                    <SceneThumb cast={series.cast} scene={e.scenes[Math.min(1, e.scenes.length - 1)]} colors={colors} className="mini-episode__canvas" />
                    <EpisodeDuration seconds={buildTimeline(series, e, settings.rate).duration} />
                  </div>
                  <span dir="auto">
                    <strong>{e.number}.</strong> {e.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}
