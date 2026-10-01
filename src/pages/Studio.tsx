import { useEffect, useState } from "react";
import { AGE_PROFILES, CATEGORIES, CATEGORY_BY_ID, LANGUAGES } from "../../shared/categories";
import { AGE_GROUPS, type AgeGroup } from "../../shared/types";
import { EmptyState, Loading, ParentGate, categoryColors } from "../components/Bits";
import { sfx } from "../engine/sfx";
import { ApiError, getJob, startEpisodeJob, startSeriesJob, type Job } from "../lib/api";
import { forgetSeries, refreshCatalog, useCatalog, useSeries } from "../lib/catalog";
import { haptic } from "../lib/native";
import { href } from "../lib/router";
import { useStore } from "../lib/store";

const MAGIC_LINES = [
  "Waving the magic wand…",
  "Inventing lovable characters…",
  "Writing funny jokes…",
  "Painting the backgrounds…",
  "Teaching the characters their lines…",
  "Composing a theme song…",
  "Checking every fact…",
  "Making sure it's kind and safe…",
];

function JobProgress({ job, onRetry }: { job: Job; onRetry: () => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 2600);
    return () => window.clearInterval(timer);
  }, []);

  if (job.status === "failed") {
    return (
      <div className="magic">
        <div className="magic__stage">🙈</div>
        <h2>Oops, the magic fizzled</h2>
        <p>{job.error ?? "Something went wrong. Let's try again!"}</p>
        <button className="btn btn--primary btn--big" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (job.status === "done" && job.seriesId) {
    return (
      <div className="magic magic--done">
        <div className="magic__stage">🎬</div>
        <h2>{job.kind === "episode" ? "Your new episode is ready!" : "Your show is ready!"}</h2>
        <div className="finish__actions">
          <a className="btn btn--primary btn--big" href={href({ name: "watch", id: job.seriesId, episode: job.episode ?? 1 })}>
            ▶ Watch it now
          </a>
          <a className="btn btn--ghost" href={href({ name: "series", id: job.seriesId })}>
            See the show
          </a>
        </div>
      </div>
    );
  }

  const progress = Math.max(0.04, Math.min(0.98, job.progress));
  return (
    <div className="magic" aria-live="polite">
      <div className="magic__stage">
        <span className="magic__wand">🪄</span>
        <span className="magic__spark s1">✨</span>
        <span className="magic__spark s2">⭐</span>
        <span className="magic__spark s3">💫</span>
      </div>
      <h2>{job.status === "checking" ? "Checking it's perfect for kids…" : MAGIC_LINES[tick % MAGIC_LINES.length]}</h2>
      <div className="meter">
        <div className="meter__fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="muted">{job.message}</p>
      <p className="muted small">Real animators take months. The AI needs about a minute!</p>
    </div>
  );
}

function useJob(start: () => Promise<{ job: Job }>) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!job || job.status === "done" || job.status === "failed") return;
    const timer = window.setInterval(async () => {
      try {
        const { job: next } = await getJob(job.id);
        setJob(next);
        if (next.status === "done") {
          if (next.seriesId) forgetSeries(next.seriesId);
          void refreshCatalog();
          sfx.tada();
          haptic.success();
        }
      } catch {
        // Keep polling; the server may be busy.
      }
    }, 1500);
    return () => window.clearInterval(timer);
  }, [job]);

  const run = async () => {
    setError(null);
    try {
      const { job } = await start();
      setJob(job);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    }
  };

  return { job, error, run, reset: () => setJob(null) };
}

function SeriesMaker({ initialCategory, initialTopic }: { initialCategory?: string; initialTopic?: string }) {
  const { settings } = useStore();
  const [category, setCategory] = useState(initialCategory && CATEGORY_BY_ID[initialCategory] ? initialCategory : "");
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [idea, setIdea] = useState("");
  const [age, setAge] = useState<AgeGroup>(settings.age === "all" ? "6-8" : settings.age);
  const [language, setLanguage] = useState(() => {
    const device = navigator.language.slice(0, 2).toLowerCase();
    return LANGUAGES.some((l) => l.code === device) ? device : "en";
  });
  const { job, error, run, reset } = useJob(() =>
    startSeriesJob({ category, topic: topic || undefined, idea: idea.trim() || undefined, age, language }),
  );

  if (job) return <JobProgress job={job} onRetry={reset} />;

  const chosen = CATEGORY_BY_ID[category];
  return (
    <div className="maker">
      <h2 className="maker__step">
        <span>1</span> Pick a world
      </h2>
      <div className="worlds worlds--compact">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`world ${category === c.id ? "world--on" : ""}`}
            style={{ ["--c1" as string]: c.colors[0], ["--c2" as string]: c.colors[1] }}
            onClick={() => {
              haptic.tap();
              setCategory(c.id);
              setTopic("");
            }}
          >
            <span className="world__bubble">{c.emoji}</span>
            <span className="world__name">{c.name}</span>
          </button>
        ))}
      </div>

      {chosen && (
        <>
          <h2 className="maker__step">
            <span>2</span> What should it be about?
          </h2>
          <div className="chips chips--wrap">
            {chosen.topics.map((t) => (
              <button key={t} className={`chip ${topic === t ? "chip--on" : ""}`} onClick={() => setTopic(topic === t ? "" : t)}>
                {t}
              </button>
            ))}
          </div>
          <label className="field">
            <span>Or your own idea (optional)</span>
            <input
              value={idea}
              maxLength={120}
              placeholder={`e.g. ${chosen.id === "animals" ? "Why do cats purr?" : "A robot who learns to share"}`}
              onChange={(e) => setIdea(e.target.value)}
              dir="auto"
            />
          </label>

          <h2 className="maker__step">
            <span>3</span> Who is it for?
          </h2>
          <div className="chips">
            {AGE_GROUPS.map((g) => (
              <button key={g} className={`chip ${age === g ? "chip--on" : ""}`} onClick={() => setAge(g)}>
                {AGE_PROFILES[g].emoji} {AGE_PROFILES[g].range}
              </button>
            ))}
          </div>
          <label className="field field--inline">
            <span>Language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="error">{error}</p>}
          <button
            className="btn btn--primary btn--big btn--magic"
            style={{ background: `linear-gradient(135deg, ${chosen.colors[0]}, ${chosen.colors[1]})` }}
            onClick={() => {
              sfx.chime();
              void run();
            }}
          >
            🪄 Make my show!
          </button>
          <p className="muted small center">
            A new mini-series with 3 episodes of {AGE_PROFILES[age].length} each.
          </p>
        </>
      )}
    </div>
  );
}

function EpisodeMaker({ seriesId }: { seriesId: string }) {
  const { series, error: loadError } = useSeries(seriesId);
  const [idea, setIdea] = useState("");
  const { job, error, run, reset } = useJob(() => startEpisodeJob(seriesId, idea.trim() || undefined));

  if (job) return <JobProgress job={job} onRetry={reset} />;
  if (loadError) return <EmptyState emoji="🙈" title="We couldn't find that show" />;
  if (!series) return <Loading />;
  const colors = categoryColors(series.category);

  return (
    <div className="maker">
      <div className="maker__show" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
        <span className="maker__show-emoji">{series.emoji}</span>
        <div>
          <h2>{series.title}</h2>
          <p>
            {series.cast.map((c) => `${c.emoji} ${c.name}`).join("  ·  ")}
          </p>
        </div>
      </div>
      <h2 className="maker__step">
        <span>✨</span> Episode {series.episodes.length + 1}
      </h2>
      <label className="field">
        <span>What should happen next? (optional)</span>
        <input value={idea} maxLength={120} placeholder="e.g. They visit the ocean" onChange={(e) => setIdea(e.target.value)} dir="auto" />
      </label>
      {error && <p className="error">{error}</p>}
      <button
        className="btn btn--primary btn--big btn--magic"
        style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
        onClick={() => {
          sfx.chime();
          void run();
        }}
      >
        🪄 Make the next episode!
      </button>
    </div>
  );
}

export function Studio({ category, series, topic }: { category?: string; series?: string; topic?: string }) {
  const catalog = useCatalog();
  const { settings } = useStore();
  const [unlocked, setUnlocked] = useState(settings.studioForKids);

  if (!unlocked) return <ParentGate title="Magic Studio" onPass={() => setUnlocked(true)} onCancel={() => history.back()} />;
  if (!catalog) return <Loading />;

  return (
    <main className="page">
      <section className="banner banner--studio">
        <span className="banner__emoji">🪄</span>
        <div>
          <h1>Magic Studio</h1>
          <p>Dream up a cartoon. The AI writes it, animates it and gives every character a voice.</p>
        </div>
      </section>
      {!catalog.ai ? (
        <EmptyState emoji="😴" title="The Magic Studio is asleep">
          <p className="muted">
            A grown-up needs to start the WonderWhirl server with an AI key. You can still watch all the built-in shows!
          </p>
          <a className="btn btn--ghost" href={href({ name: "parents" })}>
            Grown-ups: how to set it up
          </a>
        </EmptyState>
      ) : series ? (
        <EpisodeMaker seriesId={series} />
      ) : (
        <SeriesMaker initialCategory={category} initialTopic={topic} />
      )}
    </main>
  );
}
