import { localCategoryById } from "../../shared/categoryText";
import { EmptyState, Loading, SeriesCard } from "../components/Bits";
import { useT } from "../i18n";
import { useCatalog } from "../lib/catalog";
import { href } from "../lib/router";
import { useStore } from "../lib/store";
import { AgePicker } from "./Home";

export function CategoryPage({ id }: { id: string }) {
  const catalog = useCatalog();
  const { settings } = useStore();
  const t = useT();
  const category = localCategoryById(id, settings.language);
  if (!category) return <EmptyState emoji="🧭" title={t.noWorld} />;
  if (!catalog) return <Loading />;

  const all = catalog.series.filter((s) => s.category === id && s.language === settings.language);
  const shows = all.filter((s) => settings.age === "all" || s.age === settings.age);

  return (
    <main className="page">
      <section className="banner" style={{ background: `linear-gradient(135deg, ${category.colors[0]}, ${category.colors[1]})` }}>
        <span className="banner__emoji">{category.emoji}</span>
        <div>
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </section>

      <AgePicker />

      <div className="grid">
        {shows.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
        {catalog.ai && (
          <a className="make-card" href={href({ name: "studio", category: id })}>
            <span className="make-card__icon">🪄</span>
            <strong>{t.makeShowIn(category.name)}</strong>
            <span className="muted">{t.makeShowHint}</span>
          </a>
        )}
      </div>

      {shows.length === 0 && (
        <p className="muted center">
          {all.length > 0 ? t.noShowsHereAge : t.noShowsHere}
          {catalog.ai ? t.makeOneInStudio : ""}
        </p>
      )}

      <section className="section">
        <div className="section__head">
          <h2>{t.ideasToExplore}</h2>
        </div>
        <div className="chips chips--wrap">
          {category.topics.map((topic) =>
            catalog.ai ? (
              <a key={topic} className="chip" href={href({ name: "studio", category: id, topic })}>
                {topic}
              </a>
            ) : (
              <span key={topic} className="chip chip--static">
                {topic}
              </span>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
