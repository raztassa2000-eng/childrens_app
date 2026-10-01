import { useStore, StoreProvider } from "./lib/store";
import { href, useRoute, type Route } from "./lib/router";
import { useCatalog } from "./lib/catalog";
import { Home } from "./pages/Home";
import { CategoryPage } from "./pages/CategoryPage";
import { SeriesPage } from "./pages/SeriesPage";
import { Watch } from "./pages/Watch";
import { Studio } from "./pages/Studio";
import { Parents } from "./pages/Parents";

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Home />;
    case "category":
      return <CategoryPage id={route.id} />;
    case "series":
      return <SeriesPage key={route.id} id={route.id} />;
    case "watch":
      return <Watch id={route.id} episode={route.episode} />;
    case "studio":
      return <Studio key={`${route.category}|${route.series}|${route.topic}`} category={route.category} series={route.series} topic={route.topic} />;
    case "parents":
      return <Parents />;
  }
}

function Shell() {
  const route = useRoute();
  const { progress } = useStore();
  const catalog = useCatalog();
  const tabs: Array<{ route: Route; icon: string; label: string; active: boolean }> = [
    { route: { name: "home" }, icon: "🏠", label: "Home", active: ["home", "category", "series", "watch"].includes(route.name) },
    { route: { name: "studio" }, icon: "🪄", label: "Studio", active: route.name === "studio" },
    { route: { name: "parents" }, icon: "🔒", label: "Grown-ups", active: route.name === "parents" },
  ];

  return (
    <div className={`app app--${route.name}`}>
      <header className="topbar">
        <a className="logo" href="#/" aria-label="WonderWhirl home">
          <span className="logo__swirl">🌀</span>
          <span className="logo__text">WonderWhirl</span>
        </a>
        <nav className="topbar__nav">
          {tabs.map((t) => (
            <a key={t.label} className={`topbar__link ${t.active ? "is-active" : ""}`} href={href(t.route)}>
              {t.icon} {t.label}
            </a>
          ))}
        </nav>
        <span className="stars-pill" title="Quiz stars">
          ⭐ {progress.stars}
        </span>
      </header>

      <Page route={route} />

      <nav className="tabbar" aria-label="Main">
        {tabs.map((t) => (
          <a key={t.label} className={`tabbar__tab ${t.active ? "is-active" : ""}`} href={href(t.route)}>
            <span className="tabbar__icon">{t.icon}</span>
            <span>{t.label}</span>
            {t.label === "Studio" && catalog?.ai && <span className="tabbar__dot" />}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
