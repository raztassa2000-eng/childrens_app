import { useEffect, useRef, useState } from "react";
import { formatClock, type TimedLine } from "../../shared/timeline";
import type { Episode, Series } from "../../shared/types";
import { EpisodePlayer, type PlayerStatus } from "../engine/player";
import { fontsReady } from "../engine/render";
import { setSfxEnabled } from "../engine/sfx";
import { VoicePack } from "../engine/voicePack";
import { useCatalog } from "../lib/catalog";
import { haptic } from "../lib/native";
import { useStore } from "../lib/store";
import { useT } from "../i18n";

interface Props {
  series: Series;
  episode: Episode;
  colors: [string, string];
  autoPlay: boolean;
  blocked: boolean;
  onEnded: () => void;
  onWatched: (seconds: number) => void;
}

/** A kid-sized video player for script-rendered episodes. */
export function VideoPlayer({ series, episode, colors, autoPlay, blocked, onEnded, onWatched }: Props) {
  const { settings, updateSettings } = useStore();
  const naturalVoices = Boolean(useCatalog()?.voices);
  const t = useT();
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<EpisodePlayer | null>(null);
  const callbacks = useRef({ onEnded, onWatched });
  callbacks.current = { onEnded, onWatched };
  const [view, setView] = useState<{
    t: number;
    status: PlayerStatus;
    duration: number;
    marks: number[];
    mode: "canvas" | "outside";
    line: TimedLine | null;
    waiting: boolean;
  }>({ t: 0, status: "paused", duration: 0, marks: [], mode: "canvas", line: null, waiting: false });
  const [controlsVisible, setControlsVisible] = useState(true);
  const [theater, setTheater] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => setSfxEnabled(settings.sfx), [settings.sfx]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const voices = naturalVoices ? new VoicePack(series.id, episode.number) : null;
    const player = new EpisodePlayer(
      canvas,
      series,
      episode,
      colors,
      { narration: settings.narration, music: settings.music, captions: settings.captions, rate: settings.rate },
      voices,
    );
    playerRef.current = player;
    if (import.meta.env.DEV) (window as unknown as { __player?: EpisodePlayer }).__player = player;
    let lastPush = 0;
    const push = () => {
      const now = performance.now();
      if (player.status === "playing" && now - lastPush < 150) return;
      lastPush = now;
      setView({
        t: player.t,
        status: player.status,
        duration: player.duration,
        marks: player.timeline.scenes.map((s) => s.start / player.duration),
        mode: player.textMode,
        line: player.activeLine(),
        waiting: player.waitingForVoice,
      });
    };
    const unsubscribe = player.subscribe(push);
    push();
    player.onEnded = () => callbacks.current.onEnded();
    player.onWatched = (s) => callbacks.current.onWatched(s);
    const observer = new ResizeObserver(() => player.resize());
    observer.observe(canvas);
    void fontsReady.then(() => player.draw());
    const onVisibility = () => document.hidden && player.pause();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      unsubscribe();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      player.destroy();
      voices?.stop();
      playerRef.current = null;
    };
    // The player is rebuilt only when the show itself or the speech speed changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, episode, colors, settings.rate, naturalVoices]);

  useEffect(() => {
    playerRef.current?.update({ narration: settings.narration, music: settings.music, captions: settings.captions });
  }, [settings.narration, settings.music, settings.captions]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (blocked) player.pause();
    else if (autoPlay) player.play();
  }, [autoPlay, blocked, series, episode, settings.rate, naturalVoices]);

  const poke = () => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (playerRef.current?.status === "playing") setControlsVisible(false);
    }, 3200);
  };

  useEffect(() => {
    if (view.status !== "playing") setControlsVisible(true);
    else poke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player || (e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        player.toggle();
      } else if (e.key === "ArrowRight") player.skip(1);
      else if (e.key === "ArrowLeft") player.skip(-1);
      else if (e.key === "Escape") setTheater(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    if (blocked) return;
    haptic.tap();
    playerRef.current?.toggle();
    poke();
  };

  const onCanvasTap = () => {
    if (!controlsVisible && view.status === "playing") poke();
    else toggle();
  };

  const toggleTheater = async () => {
    const shell = shellRef.current;
    if (!shell) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    if (shell.requestFullscreen && !theater) {
      try {
        await shell.requestFullscreen();
        return;
      } catch {
        // iPhone doesn't allow fullscreen for non-video elements: use theater mode.
      }
    }
    setTheater((v) => !v);
  };

  const progress = view.duration ? view.t / view.duration : 0;
  const playing = view.status === "playing";
  const speaker = view.line ? series.cast.find((c) => c.id === view.line!.speaker) : undefined;
  const speakerLabel = !view.line
    ? ""
    : speaker
      ? `${speaker.emoji} ${speaker.name}`
      : view.line.speaker === "narrator"
        ? "📖"
        : view.line.speaker;

  return (
    <div
      ref={shellRef}
      className={`player ${theater ? "player--theater" : ""} ${controlsVisible ? "" : "player--idle"}`}
      onPointerMove={poke}
    >
      <div className="player__stage">
        <canvas ref={canvasRef} className="player__canvas" onClick={onCanvasTap} />
        {view.waiting && playing && <div className="player__voices">🎙️ {t.gettingVoices}</div>}
        {!playing && !blocked && (
          <button className="player__big-play" onClick={toggle} aria-label={view.status === "ended" ? t.watchAgain : t.play}>
            {view.status === "ended" ? "↻" : "▶"}
          </button>
        )}
      </div>
      {view.mode === "outside" && settings.captions && (
        <div className="subtitle" aria-live="polite">
          {view.line ? (
            <p key={view.line.key} dir="auto">
              <span className="subtitle__who">{speakerLabel}</span> {view.line.text}
            </p>
          ) : (
            <p className="subtitle__idle">🎬</p>
          )}
        </div>
      )}
      <div className="player__controls">
        <button className="pbtn" onClick={() => playerRef.current?.skip(-1)} aria-label={t.prevScene}>
          ⏮
        </button>
        <button className="pbtn pbtn--main" onClick={toggle} aria-label={playing ? t.pause : t.play}>
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="pbtn" onClick={() => playerRef.current?.skip(1)} aria-label={t.nextScene}>
          ⏭
        </button>
        <div className="scrubber">
          <div className="scrubber__track">
            <div className="scrubber__fill" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />
            {view.marks.map((m, i) => (
              <span key={i} className="scrubber__mark" style={{ left: `${m * 100}%` }} />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={view.duration || 1}
            step={0.1}
            value={view.t}
            aria-label={t.seek}
            onChange={(e) => playerRef.current?.seek(Number(e.target.value))}
          />
        </div>
        <span className="player__time">
          {formatClock(view.t)} / {formatClock(view.duration)}
        </span>
        <button
          className={`pbtn pbtn--toggle ${settings.captions ? "is-on" : ""}`}
          onClick={() => updateSettings({ captions: !settings.captions })}
          aria-label={t.wordsOnScreen}
          title={t.wordsOnScreen}
        >
          CC
        </button>
        <button
          className={`pbtn pbtn--toggle ${settings.narration ? "is-on" : ""}`}
          onClick={() => updateSettings({ narration: !settings.narration })}
          aria-label={t.voices}
          title={t.voices}
        >
          🗣️
        </button>
        <button
          className={`pbtn pbtn--toggle ${settings.music ? "is-on" : ""}`}
          onClick={() => updateSettings({ music: !settings.music })}
          aria-label={t.music}
          title={t.music}
        >
          🎵
        </button>
        <button className="pbtn" onClick={toggleTheater} aria-label={t.bigScreen} title={t.bigScreen}>
          ⛶
        </button>
      </div>
    </div>
  );
}
