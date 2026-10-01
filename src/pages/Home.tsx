import { AGE_PROFILES, CATEGORIES } from "../../shared/categories";
import { AGE_GROUPS, type SeriesSummary } from "../../shared/types";
import { Loading, Row, SeriesCard, categoryColors } from "../components/Bits";
import { LivePreview } from "../components/Thumbs";
import { useCatalog } from "../lib/catalog";
import { haptic } from "../lib/native";
import { href } from "../lib/router";
import { useStore, type Settings } from "../lib/store";

function dayIndex(length: number) {
  const day = Math.floor(Date.now() / 86_400_000);
  return length ? day % length : 0;
}

export function AgePicker() {
  const { settings, updateSettings } = useStore();
  const options: Array<{ value: Settings["age"]; label: string }> = [
    { value: "all", label: "🌈 Everyone" },
    ...AGE_GROUPS.map((age) => ({ value: age, label: `${AGE_PROFILES[age].emoji} ${age.replace("-", "–")}` })),
  ];
  return (
    <div className="chips" role="radiogroup" aria-label="Age">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={settings.age === o.value}
          className={`chip ${settings.age === o.value ? "chip--on" : ""}`}
          onClick={() => {
            haptic.tap();
            updateSettings({ age: o.value });
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Hero({ series, episode, resume }: { series: SeriesSummary; episode: number; resume: boolean }) {
  const colors = categoryColors(series.category);
  return (
    <section className="hero" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
      <a className="hero__screen" href={href({ name: "watch", id: series.id, episode })} aria-label={`Watch ${series.title}`}>
        <LivePreview cast={series.cast} scene={series.preview} colors={colors} className="hero__canvas" />
        <span className="hero__play">▶</span>
      </a>
      <div className="hero__info">
        <span className="hero__kicker">{resume ? "Keep watching" : "Today's pick"}</span>
        <h1>
          {series.emoji} {series.title}
        </h1>
        <p>{series.tagline}</p>
        <div className="hero__cast" aria-hidden="true">
          {series.cast.slice(0, 5).map((c) => (
            <span key={c.id} title={c.name}>
              {c.emoji}
            </span>
          ))}
        </div>
        <a className="btn btn--white btn--big" href={href({ name: "watch", id: series.id, episode })}>
          ▶ {resume ? `Episode ${episode}` : "Watch now"}
        </a>
      </div>
    </section>
  );
}

export function Home() {
  const catalog = useCatalog();
  const { settings, progress } = useStore();
  if (!catalog) return <Loading label="Opening the WonderWhirl…" />;

  const visible = catalog.series.filter((s) => settings.age === "all" || s.age === settings.age);
  const last = progress.last && catalog.series.find((s) => s.id === progress.last!.seriesId);
  const resumeEpisode = last ? Math.min(last.episodes.length, progress.last!.episode) : 1;
  const featured = last ?? visible[dayIndex(visible.length)] ?? catalog.series[0];

  return (
    <main className="page home">
      {featured && <Hero series={featured} episode={last ? resumeEpisode : 1} resume={Boolean(last)} />}

      <section className="section">
        <div className="section__head">
          <h2>Who's watching?</h2>
        </div>
        <AgePicker />
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Pick a world</h2>
        </div>
        <div className="worlds">
          {CATEGORIES.map((c, i) => (
            <a
              key={c.id}
              className="world"
              href={href({ name: "category", id: c.id })}
              style={{ ["--c1" as string]: c.colors[0], ["--c2" as string]: c.colors[1], animationDelay: `${i * 40}ms` }}
              onClick={() => haptic.tap()}
            >
              <span className="world__bubble">{c.emoji}</span>
              <span className="world__name">{c.name}</span>
            </a>
          ))}
        </div>
      </section>

      {catalog.ai && (
        <a className="studio-banner" href={href({ name: "studio" })}>
          <span className="studio-banner__wand">🪄</span>
          <span>
            <strong>Magic Studio</strong>
            <br />
            Make a brand-new cartoon about anything!
          </span>
          <span className="studio-banner__go">✨</span>
        </a>
      )}

      {CATEGORIES.map((c) => {
        const list = visible.filter((s) => s.category === c.id);
        if (list.length === 0) return null;
        return (
          <section className="section shelf" key={c.id}>
            <div className="section__head">
              <h2>
                {c.emoji} {c.name}
              </h2>
              <a href={href({ name: "category", id: c.id })}>See all ›</a>
            </div>
            <Row>
              {list.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </Row>
          </section>
        );
      })}

      {visible.length === 0 && (
        <p className="muted center">No shows for this age yet. Try “Everyone”{catalog.ai ? " or make one in the Magic Studio" : ""}!</p>
      )}
      {catalog.offline && (
        <p className="muted center small">Offline mode: showing the built-in shows. The Magic Studio needs the WonderWhirl server.</p>
      )}
    </main>
  );
}
