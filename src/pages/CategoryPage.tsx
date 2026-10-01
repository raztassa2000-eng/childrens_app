import { CATEGORY_BY_ID } from "../../shared/categories";
import { EmptyState, Loading, SeriesCard } from "../components/Bits";
import { useCatalog } from "../lib/catalog";
import { href } from "../lib/router";
import { useStore } from "../lib/store";
import { AgePicker } from "./Home";

export function CategoryPage({ id }: { id: string }) {
  const catalog = useCatalog();
  const { settings } = useStore();
  const category = CATEGORY_BY_ID[id];
  if (!category) return <EmptyState emoji="🧭" title="That world doesn't exist yet" />;
  if (!catalog) return <Loading />;

  const all = catalog.series.filter((s) => s.category === id);
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
            <strong>Make a new {category.name} show</strong>
            <span className="muted">The AI writes and animates it for you</span>
          </a>
        )}
      </div>

      {shows.length === 0 && (
        <p className="muted center">
          {all.length > 0 ? "No shows for this age here yet — try “Everyone”." : "No shows here yet."}
          {catalog.ai ? " Make one in the Magic Studio!" : ""}
        </p>
      )}

      <section className="section">
        <div className="section__head">
          <h2>Ideas to explore</h2>
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
