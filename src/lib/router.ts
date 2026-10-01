import { useEffect, useState } from "react";

/** Tiny hash router: works the same on the web and inside the iOS app. */

export type Route =
  | { name: "home" }
  | { name: "category"; id: string }
  | { name: "series"; id: string }
  | { name: "watch"; id: string; episode: number }
  | { name: "studio"; category?: string; series?: string; topic?: string }
  | { name: "parents" };

export function parseHash(hash: string): Route {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const params = new URLSearchParams(query);
  switch (parts[0]) {
    case "category":
      return parts[1] ? { name: "category", id: parts[1] } : { name: "home" };
    case "series":
      return parts[1] ? { name: "series", id: parts[1] } : { name: "home" };
    case "watch":
      return parts[1] ? { name: "watch", id: parts[1], episode: Math.max(1, Number(parts[2]) || 1) } : { name: "home" };
    case "studio":
      return {
        name: "studio",
        category: params.get("category") ?? undefined,
        series: params.get("series") ?? undefined,
        topic: params.get("topic") ?? undefined,
      };
    case "parents":
      return { name: "parents" };
    default:
      return { name: "home" };
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/";
    case "category":
      return `#/category/${encodeURIComponent(route.id)}`;
    case "series":
      return `#/series/${encodeURIComponent(route.id)}`;
    case "watch":
      return `#/watch/${encodeURIComponent(route.id)}/${route.episode}`;
    case "studio": {
      const params = new URLSearchParams();
      if (route.category) params.set("category", route.category);
      if (route.series) params.set("series", route.series);
      if (route.topic) params.set("topic", route.topic);
      const query = params.toString();
      return `#/studio${query ? `?${query}` : ""}`;
    }
    case "parents":
      return "#/parents";
  }
}

export function go(route: Route) {
  window.location.hash = href(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
