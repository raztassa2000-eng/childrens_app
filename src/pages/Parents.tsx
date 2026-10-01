import { useState, type ReactNode } from "react";
import { ParentGate } from "../components/Bits";
import { API_BASE } from "../lib/api";
import { useCatalog } from "../lib/catalog";
import { isNative } from "../lib/native";
import { useStore } from "../lib/store";

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__switch" aria-hidden="true" />
    </label>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Parents() {
  const [unlocked, setUnlocked] = useState(false);
  const { settings, updateSettings, progress, resetProgress, minutesLeft } = useStore();
  const catalog = useCatalog();

  if (!unlocked) return <ParentGate title="Parent zone" onPass={() => setUnlocked(true)} onCancel={() => history.back()} />;

  const watchedToday = Math.round(progress.today.seconds / 60);
  const episodesWatched = Object.keys(progress.watched).length;

  return (
    <main className="page parents">
      <section className="banner banner--parents">
        <span className="banner__emoji">👨‍👩‍👧</span>
        <div>
          <h1>Parent zone</h1>
          <p>Screen time, voices and the AI studio.</p>
        </div>
      </section>

      <div className="stats">
        <div>
          <strong>{watchedToday} min</strong>
          <span>watched today</span>
        </div>
        <div>
          <strong>{episodesWatched}</strong>
          <span>episodes finished</span>
        </div>
        <div>
          <strong>{progress.stars} ⭐</strong>
          <span>quiz stars</span>
        </div>
      </div>

      <Card title="Screen time">
        <label className="field field--inline">
          <span>Daily limit</span>
          <select value={settings.dailyMinutes} onChange={(e) => updateSettings({ dailyMinutes: Number(e.target.value) })}>
            <option value={0}>No limit</option>
            {[15, 20, 30, 45, 60, 90].map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </label>
        {minutesLeft !== null && <p className="muted small">{Math.ceil(minutesLeft)} minutes left today. When time is up, the player shows a friendly “time for a break” screen.</p>}
        <Toggle label="Play the next episode automatically" checked={settings.autoplayNext} onChange={(v) => updateSettings({ autoplayNext: v })} />
      </Card>

      <Card title="Watching">
        <Toggle label="Voices" hint="Characters and narrator read everything aloud" checked={settings.narration} onChange={(v) => updateSettings({ narration: v })} />
        <Toggle label="Words on screen" hint="Speech bubbles and subtitles for early readers" checked={settings.captions} onChange={(v) => updateSettings({ captions: v })} />
        <Toggle label="Theme music" checked={settings.music} onChange={(v) => updateSettings({ music: v })} />
        <Toggle label="Sound effects" checked={settings.sfx} onChange={(v) => updateSettings({ sfx: v })} />
        <label className="field">
          <span>Voice speed</span>
          <input
            type="range"
            min={0.8}
            max={1.2}
            step={0.05}
            value={settings.rate}
            onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
          />
          <span className="range-labels">
            <small>🐢 Slower</small>
            <small>🐇 Faster</small>
          </span>
        </label>
      </Card>

      <Card title="Magic Studio (AI)">
        <p className="status-line">
          {catalog?.ai ? "🟢 Connected — the AI can make new shows." : catalog?.offline ? "🔴 Offline — showing built-in shows only." : "🟡 Server connected, but no AI key is set."}
        </p>
        <Toggle
          label="Kids can open the Magic Studio"
          hint="Off = a grown-up must unlock it each time"
          checked={settings.studioForKids}
          onChange={(v) => updateSettings({ studioForKids: v })}
        />
        <details className="details">
          <summary>How are the shows made?</summary>
          <p>
            Claude, an AI model by Anthropic, writes each episode as a script: the characters, scenes, actions, dialogue and a short quiz.
            The script follows strict rules for kind, age-appropriate, factual content, then a second AI review checks every episode for
            safety before it appears. The app then animates the script and the device's voices read it aloud. Nothing your child types is
            used for anything else.
          </p>
        </details>
        <details className="details">
          <summary>Set up the AI studio</summary>
          <ol>
            <li>
              On a computer, run the WonderWhirl server with an Anthropic API key: <code>ANTHROPIC_API_KEY=… npm run server</code>
            </li>
            <li>
              {isNative
                ? "Build the app with VITE_API_BASE pointing at that server (the iOS Simulator can use http://localhost:8787)."
                : "Open the app from the same server, or set VITE_API_BASE when building."}
            </li>
          </ol>
          <p className="muted small">Server: {API_BASE || window.location.origin}</p>
        </details>
      </Card>

      <Card title="Progress">
        <button
          className="btn btn--ghost"
          onClick={() => {
            if (window.confirm("Reset all stars and watch history?")) resetProgress();
          }}
        >
          Reset stars & history
        </button>
      </Card>
    </main>
  );
}
