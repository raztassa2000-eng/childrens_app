import { useState, type ReactNode } from "react";
import { ParentGate } from "../components/Bits";
import { APP_LANGUAGES, useT, type AppLanguage } from "../i18n";
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
  const t = useT();

  if (!unlocked) return <ParentGate title={t.parentZone} onPass={() => setUnlocked(true)} onCancel={() => history.back()} />;

  const watchedToday = Math.round(progress.today.seconds / 60);
  const episodesWatched = Object.keys(progress.watched).length;

  return (
    <main className="page parents">
      <section className="banner banner--parents">
        <span className="banner__emoji">👨‍👩‍👧</span>
        <div>
          <h1>{t.parentZone}</h1>
          <p>{t.parentIntro}</p>
        </div>
      </section>

      <div className="stats">
        <div>
          <strong>{t.minutes(watchedToday)}</strong>
          <span>{t.watchedToday}</span>
        </div>
        <div>
          <strong>{episodesWatched}</strong>
          <span>{t.episodesFinished}</span>
        </div>
        <div>
          <strong>{progress.stars} ⭐</strong>
          <span>{t.starsLabel}</span>
        </div>
      </div>

      <Card title={t.appLanguage}>
        <div className="chips" role="radiogroup" aria-label={t.appLanguage}>
          {APP_LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="radio"
              aria-checked={settings.language === l.code}
              className={`chip ${settings.language === l.code ? "chip--on" : ""}`}
              onClick={() => updateSettings({ language: l.code as AppLanguage })}
            >
              {l.name}
            </button>
          ))}
        </div>
        <p className="muted small">{t.appLanguageHint}</p>
      </Card>

      <Card title={t.screenTime}>
        <label className="field field--inline">
          <span>{t.dailyLimit}</span>
          <select value={settings.dailyMinutes} onChange={(e) => updateSettings({ dailyMinutes: Number(e.target.value) })}>
            <option value={0}>{t.noLimit}</option>
            {[15, 20, 30, 45, 60, 90].map((m) => (
              <option key={m} value={m}>
                {t.nMinutes(m)}
              </option>
            ))}
          </select>
        </label>
        {minutesLeft !== null && <p className="muted small">{t.minutesLeft(Math.ceil(minutesLeft))}</p>}
        <Toggle label={t.autoplay} checked={settings.autoplayNext} onChange={(v) => updateSettings({ autoplayNext: v })} />
      </Card>

      <Card title={t.watching}>
        <Toggle label={t.voices} hint={t.voicesHint} checked={settings.narration} onChange={(v) => updateSettings({ narration: v })} />
        <Toggle label={t.wordsOnScreen} hint={t.wordsHint} checked={settings.captions} onChange={(v) => updateSettings({ captions: v })} />
        <Toggle label={t.themeMusic} checked={settings.music} onChange={(v) => updateSettings({ music: v })} />
        <Toggle label={t.soundEffects} checked={settings.sfx} onChange={(v) => updateSettings({ sfx: v })} />
        <label className="field">
          <span>{t.voiceSpeed}</span>
          <input
            type="range"
            min={0.8}
            max={1.2}
            step={0.05}
            value={settings.rate}
            onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
          />
          <span className="range-labels">
            <small>{t.slower}</small>
            <small>{t.faster}</small>
          </span>
        </label>
        <p className="muted small">{catalog?.voices ? t.voicesOn : t.voicesOff}</p>
      </Card>

      <Card title={t.studioCard}>
        <p className="status-line">{catalog?.ai ? t.statusOn : catalog?.offline ? t.statusOffline : t.statusNoKey}</p>
        <Toggle
          label={t.kidsStudio}
          hint={t.kidsStudioHint}
          checked={settings.studioForKids}
          onChange={(v) => updateSettings({ studioForKids: v })}
        />
        <details className="details">
          <summary>{t.howMade}</summary>
          <p>{t.howMadeText}</p>
        </details>
        <details className="details">
          <summary>{t.setupTitle}</summary>
          <ol>
            <li>
              {t.setupStep1} <code dir="ltr">ANTHROPIC_API_KEY=… GEMINI_API_KEY=… npm run server</code>
            </li>
            <li>{isNative ? t.setupStep2Native : t.setupStep2Web}</li>
          </ol>
          <p className="muted small">
            {t.server}: <span dir="ltr">{API_BASE || window.location.origin}</span>
          </p>
        </details>
      </Card>

      <Card title={t.progress}>
        <button
          className="btn btn--ghost"
          onClick={() => {
            if (window.confirm(t.resetConfirm)) resetProgress();
          }}
        >
          {t.resetButton}
        </button>
      </Card>
    </main>
  );
}
