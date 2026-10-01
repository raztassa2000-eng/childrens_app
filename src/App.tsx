import { useEffect } from "react";
import { useStore, StoreProvider } from "./lib/store";
import { RTL_LANGUAGES, useT } from "./i18n";
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
  const { progress, settings } = useStore();
  const catalog = useCatalog();
  const t = useT();

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = RTL_LANGUAGES.has(settings.language) ? "rtl" : "ltr";
  }, [settings.language]);

  const tabs: Array<{ route: Route; icon: string; label: string; active: boolean; studio?: boolean }> = [
    { route: { name: "home" }, icon: "🏠", label: t.home, active: ["home", "category", "series", "watch"].includes(route.name) },
    { route: { name: "studio" }, icon: "🪄", label: t.studio, active: route.name === "studio", studio: true },
    { route: { name: "parents" }, icon: "🔒", label: t.grownUps, active: route.name === "parents" },
  ];

  return (
    <div className={`app app--${route.name}`}>
      <header className="topbar">
        <a className="logo" href="#/" aria-label="WonderWhirl" dir="ltr">
          <span className="logo__swirl">🌀</span>
          <span className="logo__text">WonderWhirl</span>
        </a>
        <nav className="topbar__nav">
          {tabs.map((tab) => (
            <a key={tab.icon} className={`topbar__link ${tab.active ? "is-active" : ""}`} href={href(tab.route)}>
              {tab.icon} {tab.label}
            </a>
          ))}
        </nav>
        <span className="stars-pill" title={t.quizStars}>
          ⭐ {progress.stars}
        </span>
      </header>

      <Page route={route} />

      <nav className="tabbar">
        {tabs.map((tab) => (
          <a key={tab.icon} className={`tabbar__tab ${tab.active ? "is-active" : ""}`} href={href(tab.route)}>
            <span className="tabbar__icon">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.studio && catalog?.ai && <span className="tabbar__dot" />}
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
