import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import App from "./App";
import { unlockAudioOnFirstTap } from "./lib/native";
import "./styles.css";

unlockAudioOnFirstTap();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
