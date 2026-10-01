import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import type { Voice } from "../../shared/types";
import { speechSeconds } from "../../shared/timeline";

/**
 * Text-to-speech with a distinct voice per character. In the iPhone app this
 * uses the native iOS voices (AVSpeechSynthesizer); in a browser it uses the
 * Web Speech API.
 */

type Style = Voice | "narrator";

// Gentle shifts only: extreme pitch is what makes device voices sound robotic.
const STYLES: Record<Style, { pitch: number; rate: number }> = {
  narrator: { pitch: 1.0, rate: 0.96 },
  child: { pitch: 1.2, rate: 1.0 },
  high: { pitch: 1.3, rate: 1.02 },
  gentle: { pitch: 1.08, rate: 0.93 },
  deep: { pitch: 0.82, rate: 0.92 },
  silly: { pitch: 1.35, rate: 1.06 },
  wise: { pitch: 0.9, rate: 0.88 },
  robot: { pitch: 0.75, rate: 0.95 },
};

interface VoiceInfo {
  name: string;
  lang: string;
  default?: boolean;
}

function scoreVoice(voice: VoiceInfo, lang: string): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/natural|neural|online|premium|enhanced|siri/.test(name)) score += 4;
  if (/google/.test(name)) score += 3;
  if (/samantha|aria|jenny|karen|moira|tessa|serena|libby|ava|zoe/.test(name)) score += 1;
  if (/novelty|bad news|bells|boing|bubbles|cellos|whisper|zarvox|trinoids|jester|organ|superstar|wobble|albert|bahh/.test(name)) score -= 10;
  if (voice.lang.toLowerCase().replace("_", "-") === lang.toLowerCase()) score += 1;
  if (voice.default) score += 0.5;
  return score;
}

function rankVoices<T extends VoiceInfo>(voices: T[], lang: string): T[] {
  const prefix = lang.slice(0, 2).toLowerCase();
  return voices
    .filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix))
    .sort((a, b) => scoreVoice(b, lang) - scoreVoice(a, lang));
}

export interface SpeakOptions {
  lang: string;
  style: Style;
  rate: number;
  /** Different slots get different voices where the device has several. */
  slot: number;
}

export interface Speech {
  readonly supported: boolean;
  speak(text: string, opts: SpeakOptions): Promise<void>;
  cancel(): void;
}

class WebSpeech implements Speech {
  readonly supported = typeof window !== "undefined" && "speechSynthesis" in window;
  private voices: SpeechSynthesisVoice[] = [];
  private pending = new Set<SpeechSynthesisUtterance>();

  constructor() {
    if (!this.supported) return;
    const load = () => {
      this.voices = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
  }

  speak(text: string, opts: SpeakOptions): Promise<void> {
    if (!this.supported || !text) return Promise.resolve();
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      const candidates = rankVoices(this.voices, opts.lang);
      const voice = candidates.length ? candidates[opts.slot % Math.min(candidates.length, 3)] : undefined;
      const preset = STYLES[opts.style] ?? STYLES.narrator;
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? opts.lang;
      utterance.pitch = Math.min(2, Math.max(0, preset.pitch));
      utterance.rate = Math.min(1.6, Math.max(0.5, preset.rate * opts.rate));

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        this.pending.delete(utterance);
        resolve();
      };
      // Some browsers occasionally never fire onend; never let the show stall.
      const timer = window.setTimeout(finish, (speechSeconds(text, opts.rate) * 2 + 4) * 1000);
      utterance.onend = finish;
      utterance.onerror = finish;
      // Keep a reference: Chrome can garbage-collect utterances mid-speech.
      this.pending.add(utterance);
      synth.resume();
      synth.speak(utterance);
    });
  }

  cancel() {
    if (this.supported) window.speechSynthesis.cancel();
  }
}

class NativeSpeech implements Speech {
  readonly supported = true;
  private voices: Promise<VoiceInfo[]> = TextToSpeech.getSupportedVoices()
    .then((r) => r.voices as VoiceInfo[])
    .catch(() => []);
  private generation = 0;

  async speak(text: string, opts: SpeakOptions): Promise<void> {
    if (!text) return;
    const generation = this.generation;
    const all = await this.voices;
    if (generation !== this.generation) return;
    const ranked = rankVoices(all, opts.lang);
    const chosen = ranked.length ? ranked[opts.slot % Math.min(ranked.length, 3)] : undefined;
    const preset = STYLES[opts.style] ?? STYLES.narrator;
    try {
      await TextToSpeech.speak({
        text,
        lang: chosen?.lang ?? opts.lang,
        voice: chosen ? all.indexOf(chosen) : undefined,
        // AVSpeechUtterance accepts pitch 0.5-2.0.
        pitch: Math.min(2, Math.max(0.5, preset.pitch)),
        rate: Math.min(1.5, Math.max(0.5, preset.rate * opts.rate)),
        volume: 1,
        category: "playback",
      });
    } catch {
      // Interrupted by stop() or unavailable: the player simply moves on.
    }
  }

  cancel() {
    this.generation++;
    void TextToSpeech.stop().catch(() => undefined);
  }
}

let shared: Speech | null = null;
export function getSpeech(): Speech {
  shared ??= Capacitor.isNativePlatform() ? new NativeSpeech() : new WebSpeech();
  return shared;
}
