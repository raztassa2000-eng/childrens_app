import { NARRATOR, type CastMember, type Episode, type Prop, type Scene, type Series } from "../../shared/types";
import { sceneAt, type TimedLine, type Timeline } from "../../shared/timeline";
import { BACKGROUND_INFO, paintBackground } from "./backgrounds";
import { actionPose, clamp01, easeInOut, easeOutBack, easeOutBounce, easeOutCubic, type Pose } from "./motion";
import { H, W, hash, rng, roundRect } from "./paint";
import { TEXT_FONT, drawEmoji } from "./sprites";

/** Everything needed to draw one frame of an episode at time `t`. */
export interface FrameInput {
  series: Pick<Series, "title" | "cast" | "language" | "emoji">;
  episode: Pick<Episode, "number" | "title" | "scenes" | "takeaway">;
  timeline: Timeline;
  /** Timeline position in seconds (drives entrances, camera, transitions). */
  t: number;
  /** Free-running clock in seconds (drives looping motion, keeps moving while narration holds). */
  wall: number;
  activeLine: TimedLine | null;
  showText: boolean;
  colors: [string, string];
  pixelRatio: number;
  /** Enlarges on-canvas text so it stays readable when the video is shown small. */
  textScale: number;
  /**
   * "canvas": speech bubbles and subtitles are drawn in the video.
   * "outside": the app shows lines as subtitles under the video (phones held upright),
   * so the video only marks who is talking.
   */
  textMode: "canvas" | "outside";
}

const RTL_LANGUAGES = new Set(["he", "ar", "fa", "ur"]);
const SLOTS: Record<number, number[]> = { 1: [640], 2: [430, 850], 3: [290, 640, 990], 4: [220, 490, 790, 1060] };
const SIZES: Record<number, number> = { 1: 200, 2: 180, 3: 162, 4: 140 };

export function renderFrame(ctx: CanvasRenderingContext2D, f: FrameInput) {
  ctx.save();
  ctx.direction = RTL_LANGUAGES.has(f.series.language.slice(0, 2)) ? "rtl" : "ltr";
  const index = sceneAt(f.timeline, f.t);
  if (index === -1) drawIntro(ctx, f);
  else if (index >= f.timeline.scenes.length) drawOutro(ctx, f);
  else drawScene(ctx, f, index);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const wrapCache = new Map<string, string[]>();

/**
 * Resolves once the bundled UI font is usable on canvas. Canvas drawing doesn't
 * trigger web-font loading by itself, so load it explicitly, then forget line
 * breaks that were measured with a fallback font.
 */
export const fontsReady: Promise<void> =
  typeof document !== "undefined" && document.fonts
    ? Promise.all([document.fonts.load(`600 32px ${TEXT_FONT}`), document.fonts.load(`700 64px ${TEXT_FONT}`)])
        .then(() => wrapCache.clear())
        .catch(() => undefined)
    : Promise.resolve();

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const key = `${ctx.font}|${maxWidth}|${text}`;
  const cached = wrapCache.get(key);
  if (cached) return cached;
  const lines: string[] = [];
  let line = "";
  const push = (word: string, sep: string) => {
    const candidate = line ? line + sep + word : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  };
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (ctx.measureText(word).width > maxWidth) {
      for (const ch of word) push(ch, "");
    } else push(word, " ");
  }
  if (line) lines.push(line);
  if (wrapCache.size > 500) wrapCache.clear();
  wrapCache.set(key, lines);
  return lines;
}

function font(size: number, weight = 600) {
  return `${weight} ${size}px ${TEXT_FONT}`;
}

function outlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fill = "#ffffff", stroke = "rgba(40,20,70,0.55)", width = 10) {
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = stroke;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function sunburst(ctx: CanvasRenderingContext2D, colors: [string, string], wall: number) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.rotate(wall * 0.15);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 16; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 1100, (i * Math.PI) / 8, (i * Math.PI) / 8 + Math.PI / 16);
    ctx.fill();
  }
  ctx.restore();
  const r = rng(7);
  for (let i = 0; i < 26; i++) {
    const x = r() * W;
    const y = (r() * H + wall * (20 + r() * 30)) % (H + 40) - 20;
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(wall * 2 + i);
    ctx.fillStyle = ["#ffffff", "#fff3a0", "#ffd1f0"][i % 3];
    ctx.beginPath();
    ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Circular reveal: progress 0 = fully covered, 1 = fully open. */
function iris(ctx: CanvasRenderingContext2D, progress: number, color = "#2a1d4f") {
  if (progress >= 1) return;
  const radius = easeInOut(clamp01(progress)) * 780;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.arc(W / 2, H / 2, Math.max(0.1, radius), 0, Math.PI * 2, true);
  ctx.fillStyle = color;
  ctx.fill("evenodd");
  ctx.restore();
}

function textBar(ctx: CanvasRenderingContext2D, text: string, scale: number) {
  let size = Math.round(32 * scale);
  ctx.font = font(size);
  let lines = wrap(ctx, text, 1060);
  if (lines.length > 3) {
    size = Math.round(26 * scale);
    ctx.font = font(size);
    lines = wrap(ctx, text, 1100);
  }
  const lh = size * 1.25;
  const h = lines.length * lh + 28;
  const w = Math.min(1180, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 60);
  const y = H - h - 18;
  ctx.fillStyle = "rgba(22,16,48,0.68)";
  roundRect(ctx, (W - w) / 2, y, w, h, 22);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((l, i) => ctx.fillText(l, W / 2, y + 14 + lh * (i + 0.5)));
}

function castMap(cast: CastMember[]) {
  return new Map(cast.map((c) => [c.id, c]));
}

// ---------------------------------------------------------------------------
// Intro & outro title cards
// ---------------------------------------------------------------------------

function drawIntro(ctx: CanvasRenderingContext2D, f: FrameInput) {
  const t = f.t;
  sunburst(ctx, f.colors, f.wall);

  const pop = easeOutBack(clamp01(t / 0.6));
  const bob = -Math.abs(Math.sin(f.wall * 3)) * 18;
  ctx.save();
  ctx.translate(W / 2, 230 + bob);
  ctx.scale(pop, pop);
  ctx.rotate(Math.sin(f.wall * 2) * 0.06);
  drawEmoji(ctx, f.series.emoji, 0, 0, 190, f.pixelRatio);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const titleIn = easeOutBack(clamp01((t - 0.3) / 0.6));
  ctx.save();
  ctx.translate(W / 2, 420);
  ctx.scale(titleIn, titleIn);
  const titleSize = Math.round(70 * Math.min(f.textScale, 1.35));
  ctx.font = font(titleSize, 700);
  const titleLines = wrap(ctx, f.series.title, 1160).slice(0, 2);
  titleLines.forEach((line, i) =>
    outlinedText(ctx, line, 0, (i - (titleLines.length - 1) / 2) * titleSize * 1.06, "#ffffff", "rgba(40,20,70,0.6)", 14),
  );
  ctx.restore();

  const badgeIn = clamp01((t - 1) / 0.5);
  if (badgeIn > 0) {
    ctx.save();
    ctx.globalAlpha = badgeIn;
    const badgeSize = Math.round(38 * Math.min(f.textScale, 1.35));
    ctx.font = font(badgeSize, 600);
    const label = f.episode.title;
    const textW = Math.min(1000, ctx.measureText(label).width);
    const total = textW + 120;
    const x0 = W / 2 - total / 2;
    const y = 548 - (1 - easeOutCubic(badgeIn)) * 30;
    const bh = badgeSize * 1.9;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    roundRect(ctx, x0, y - bh / 2, total, bh, bh / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x0 + 40, y, 26, 0, Math.PI * 2);
    ctx.fillStyle = f.colors[1];
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = font(30, 700);
    ctx.fillText(String(f.episode.number), x0 + 40, y + 1);
    ctx.fillStyle = "#2d2150";
    ctx.font = font(badgeSize, 600);
    ctx.textAlign = "left";
    ctx.direction = "ltr";
    ctx.fillText(label, x0 + 84, y + 1, 1000);
    ctx.restore();
  }

  const cast = f.series.cast.slice(0, 5);
  cast.forEach((member, i) => {
    const appear = easeOutBack(clamp01((t - 0.6 - i * 0.15) / 0.45));
    if (appear <= 0) return;
    const x = W / 2 + (i - (cast.length - 1) / 2) * 130;
    const hop = -Math.abs(Math.sin(f.wall * 3.4 + i)) * 22;
    ctx.save();
    ctx.translate(x, 655 + hop);
    ctx.scale(appear, appear);
    drawEmoji(ctx, member.emoji, 0, 0, 84, f.pixelRatio);
    ctx.restore();
  });

  const close = clamp01((t - (f.timeline.introEnd - 0.35)) / 0.35);
  if (close > 0) iris(ctx, 1 - close);
}

function drawOutro(ctx: CanvasRenderingContext2D, f: FrameInput) {
  const lt = f.t - f.timeline.outroStart;
  sunburst(ctx, [f.colors[1], f.colors[0]], f.wall);

  const starIn = easeOutBack(clamp01((lt - 0.2) / 0.6));
  ctx.save();
  ctx.translate(W / 2, 150);
  ctx.scale(starIn, starIn);
  ctx.rotate(Math.sin(f.wall * 1.5) * 0.15);
  drawEmoji(ctx, "⭐", 0, 0, 150, f.pixelRatio);
  ctx.restore();

  const cast = f.series.cast.slice(0, 5);
  cast.forEach((member, i) => {
    const appear = easeOutBack(clamp01((lt - 0.4 - i * 0.12) / 0.4));
    if (appear <= 0) return;
    const pose = actionPose("cheer", f.wall, i * 0.37, false);
    const x = W / 2 + (i - (cast.length - 1) / 2) * 150;
    ctx.save();
    ctx.translate(x, 400 + pose.dy * 0.6);
    ctx.scale(appear, appear);
    ctx.rotate(pose.rot);
    drawEmoji(ctx, member.emoji, 0, 0, 110, f.pixelRatio);
    ctx.restore();
  });

  const cardIn = easeOutCubic(clamp01((lt - 0.8) / 0.6));
  if (cardIn > 0 && f.episode.takeaway) {
    ctx.save();
    ctx.globalAlpha = cardIn;
    const size = Math.round(36 * Math.min(f.textScale, 1.3));
    ctx.font = font(size, 600);
    const lines = wrap(ctx, f.episode.takeaway, 960).slice(0, 4);
    const lh = size * 1.28;
    const h = lines.length * lh + 50;
    const y = Math.min(H - h - 16, 580 - h / 2) + (1 - cardIn) * 40;
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    roundRect(ctx, W / 2 - 520, y, 1040, h, 30);
    ctx.fill();
    ctx.fillStyle = "#2d2150";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((l, i) => ctx.fillText(l, W / 2, y + 25 + lh * (i + 0.5)));
    ctx.restore();
  }

  if (lt < 0.6) iris(ctx, lt / 0.6);
  const fade = clamp01((f.t - (f.timeline.duration - 0.8)) / 0.8);
  if (fade > 0) {
    ctx.fillStyle = `rgba(29,18,54,${fade * 0.85})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

interface Camera {
  zoom: number;
  panX: number;
  fx: number;
  fy: number;
}

const CAMERA_MOVES = ["zoom-in", "pan-right", "static", "zoom-out", "pan-left"] as const;

function cameraFor(index: number, progress: number): Camera {
  const e = easeInOut(clamp01(progress));
  const cam: Camera = { zoom: 1, panX: 0, fx: W / 2, fy: 430 };
  switch (CAMERA_MOVES[index % CAMERA_MOVES.length]) {
    case "zoom-in":
      cam.zoom = 1 + 0.07 * e;
      break;
    case "zoom-out":
      cam.zoom = 1.07 - 0.07 * e;
      break;
    case "pan-right":
      cam.zoom = 1.05;
      cam.panX = 28 - 56 * e;
      break;
    case "pan-left":
      cam.zoom = 1.05;
      cam.panX = -28 + 56 * e;
      break;
  }
  return cam;
}

function toScreen(cam: Camera, x: number, y: number) {
  return { x: (x - cam.fx) * cam.zoom + cam.fx + cam.panX, y: (y - cam.fy) * cam.zoom + cam.fy };
}

interface PlacedActor {
  who: string;
  emoji: string;
  member?: CastMember;
  x: number;
  y: number;
  size: number;
  pose: Pose;
  scale: number;
  speaking: boolean;
  firstAppearance: boolean;
}

function propSlots(place: Prop["place"], groundY: number): Array<[number, number, number]> {
  switch (place) {
    case "sky":
      return [
        [190, 125, 92],
        [1090, 118, 92],
        [640, 82, 80],
        [420, 165, 74],
      ];
    case "air":
      return [
        [250, 300, 76],
        [1030, 290, 76],
        [640, 235, 70],
        [820, 345, 66],
      ];
    case "ground":
      return [
        [105, groundY - 34, 84],
        [1175, groundY - 34, 84],
        [470, Math.min(groundY + 50, 680), 70],
        [810, Math.min(groundY + 56, 684), 70],
      ];
  }
}

function drawProps(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  prev: Scene | null,
  f: FrameInput,
  lt: number,
  places: Array<Prop["place"]>,
) {
  const info = BACKGROUND_INFO[scene.background];
  const groundY = info.floaty ? 690 : info.groundY;
  const counters: Record<string, number> = { sky: 0, air: 0, ground: 0 };
  scene.props.forEach((prop, i) => {
    const slotIndex = counters[prop.place]++;
    if (!places.includes(prop.place)) return;
    const slot = propSlots(prop.place, groundY)[slotIndex % 4];
    const carried = prev?.background === scene.background && prev.props.some((p) => p.emoji === prop.emoji && p.place === prop.place);
    const appear = carried ? 1 : easeOutBack(clamp01((lt - 0.25 - i * 0.12) / 0.5));
    if (appear <= 0) return;
    const bob = prop.place === "ground" ? 0 : Math.sin(f.wall * (prop.place === "air" ? 2 : 1.1) + i) * (prop.place === "air" ? 12 : 6);
    ctx.save();
    ctx.translate(slot[0], slot[1] + bob);
    ctx.scale(appear, appear);
    if (prop.place === "ground") ctx.rotate(Math.sin(f.wall * 1.3 + i) * 0.04);
    drawEmoji(ctx, prop.emoji, 0, 0, slot[2], f.pixelRatio);
    ctx.restore();
  });
}

function placeActors(f: FrameInput, index: number, lt: number): PlacedActor[] {
  const scene = f.episode.scenes[index];
  const prev = index > 0 ? f.episode.scenes[index - 1] : null;
  const info = BACKGROUND_INFO[scene.background];
  const castById = castMap(f.series.cast);
  const count = Math.min(scene.actors.length, 4);
  const slots = SLOTS[count] ?? SLOTS[4];
  const size = SIZES[count] ?? 140;
  const speakingWho = f.activeLine?.segment === "scene" && f.activeLine.sceneIndex === index ? f.activeLine.speaker : null;

  return scene.actors.slice(0, 4).map((actor, i) => {
    const member = castById.get(actor.who);
    const emoji = member?.emoji ?? actor.who;
    const phase = (hash(actor.who) % 1000) / 160;
    const pose = actionPose(actor.action, f.wall, phase, info.floaty);
    let x = slots[i];
    let y = info.groundY;
    let scale = 1;

    const prevIndex = prev ? prev.actors.findIndex((a) => a.who === actor.who) : -1;
    const continuing = prevIndex >= 0 && prev!.background === scene.background;
    const entrance = actor.enter === "auto" ? (continuing ? "none" : "pop") : actor.enter;
    const delay = 0.15 + i * 0.18;
    const p = clamp01((lt - delay) / 0.85);

    if (continuing && entrance === "none") {
      const prevSlots = SLOTS[Math.min(prev!.actors.length, 4)] ?? SLOTS[4];
      const from = prevSlots[prevIndex] ?? x;
      x = from + (x - from) * easeOutCubic(clamp01(lt / 0.7));
    } else if (entrance === "pop") {
      scale = easeOutBack(clamp01((lt - delay) / 0.5));
    } else if (entrance === "left") {
      x = -160 + (x + 160) * easeOutCubic(p);
      if (p < 1) pose.flip = true;
    } else if (entrance === "right") {
      x = W + 160 - (W + 160 - x) * easeOutCubic(p);
      if (p < 1) pose.flip = false;
    } else if (entrance === "top") {
      y = -220 + (y + 220) * easeOutBounce(p);
    }

    const speaking = speakingWho === actor.who;
    if (speaking) {
      const talk = Math.abs(Math.sin(f.wall * 13));
      pose.sy *= 1 + 0.07 * talk;
      pose.dy -= talk * 5;
    }

    const firstIndex = f.episode.scenes.findIndex((s) => s.actors.some((a) => a.who === actor.who));
    return { who: actor.who, emoji, member, x, y, size: member ? size : size * 0.85, pose, scale, speaking, firstAppearance: firstIndex === index };
  });
}

function drawActor(ctx: CanvasRenderingContext2D, a: PlacedActor, f: FrameInput, floaty: boolean) {
  const { pose } = a;
  const x = a.x + pose.dx;
  if (!floaty && a.scale > 0) {
    const shrink = 1 - Math.min(pose.lift, 220) / 320;
    ctx.fillStyle = "rgba(30,20,60,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, a.y + 4, a.size * 0.34 * shrink * a.scale, a.size * 0.07 * shrink * a.scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (a.scale <= 0) return;
  ctx.save();
  ctx.translate(x, a.y + pose.dy);
  ctx.scale(a.scale, a.scale);
  if (pose.pivot === "center") {
    ctx.translate(0, -a.size * 0.5);
    ctx.rotate(pose.rot);
    ctx.scale(pose.flip ? -pose.sx : pose.sx, pose.sy);
    drawEmoji(ctx, a.emoji, 0, 0, a.size, f.pixelRatio);
  } else {
    ctx.rotate(pose.rot);
    ctx.scale(pose.flip ? -pose.sx : pose.sx, pose.sy);
    drawEmoji(ctx, a.emoji, 0, -a.size * 0.5, a.size, f.pixelRatio);
  }
  ctx.restore();

  const headX = x + a.size * 0.32;
  const headY = a.y + pose.dy - a.size * 0.95;
  if (pose.overlay === "zzz") {
    const p = (f.wall * 0.5) % 1;
    ctx.globalAlpha = 1 - p;
    drawEmoji(ctx, "💤", headX + p * 30, headY - p * 50, 52, f.pixelRatio);
    ctx.globalAlpha = 1;
  } else if (pose.overlay === "think") {
    drawEmoji(ctx, "💭", headX + 10, headY - 10 + Math.sin(f.wall * 2) * 5, 58, f.pixelRatio);
  } else if (pose.overlay === "sparkle") {
    for (let i = 0; i < 3; i++) {
      const ang = f.wall * 2.5 + (i * Math.PI * 2) / 3;
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(f.wall * 5 + i);
      drawEmoji(ctx, "✨", x + Math.cos(ang) * a.size * 0.62, a.y + pose.dy - a.size * 0.55 + Math.sin(ang) * a.size * 0.4, 40, f.pixelRatio);
    }
    ctx.globalAlpha = 1;
  }
}

function nameTag(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, alpha: number, color: string, scale: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const size = Math.round(26 * scale);
  ctx.font = font(size, 700);
  const w = ctx.measureText(name).width + size * 1.3;
  const h = size * 1.55;
  ctx.fillStyle = color;
  roundRect(ctx, x - w / 2, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, x, y + h / 2 + 1);
  ctx.restore();
}

function caption(ctx: CanvasRenderingContext2D, text: string, f: FrameInput, lt: number) {
  const s = easeOutBack(clamp01((lt - 0.5) / 0.5));
  if (s <= 0) return;
  let size = Math.round((text.length <= 12 ? 64 : text.length <= 20 ? 54 : 44) * f.textScale);
  ctx.save();
  ctx.font = font(size, 700);
  const fit = (W - 120) / (ctx.measureText(text).width + size * 1.4);
  if (fit < 1) {
    size = Math.floor(size * fit);
    ctx.font = font(size, 700);
  }
  const w = ctx.measureText(text).width + size * 1.4;
  const h = size * 1.45;
  ctx.translate(W / 2, 30 + h / 2);
  ctx.scale(s, s);
  ctx.rotate(Math.sin(f.wall * 2) * 0.02);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, f.colors[0]);
  g.addColorStop(1, f.colors[1]);
  ctx.shadowColor = "rgba(30,20,60,0.3)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = g;
  roundRect(ctx, -w / 2, -h / 2, w, h, h / 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  outlinedText(ctx, text, 0, 3, "#ffffff", "rgba(40,20,70,0.45)", 9);
  ctx.restore();
}

function speechBubble(ctx: CanvasRenderingContext2D, text: string, name: string, headX: number, headY: number, f: FrameInput, line: TimedLine) {
  const s = easeOutBack(clamp01((f.t - line.start) / 0.3));
  const scale = f.textScale;
  ctx.save();
  ctx.font = font(Math.round(30 * scale));
  const lines = wrap(ctx, text, 440 * Math.min(scale, 1.6)).slice(0, 5);
  const lh = 38 * scale;
  const w = Math.max(160, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 44 * scale);
  const h = lines.length * lh + 30 * scale;
  const bx = Math.min(W - w - 16, Math.max(16, headX - w / 2));
  const by = Math.max(54, headY - h - 40);
  const tailX = Math.min(bx + w - 40, Math.max(bx + 40, headX));
  ctx.translate(tailX, by + h);
  ctx.scale(s, s);
  ctx.translate(-tailX, -(by + h));

  ctx.shadowColor = "rgba(30,20,60,0.25)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, bx, by, w, h, 26);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tailX - 18, by + h - 2);
  ctx.lineTo(tailX + 18, by + h - 2);
  ctx.lineTo(headX, Math.min(headY - 6, by + h + 34));
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#2d2150";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + 15 * scale + lh * (i + 0.5)));

  ctx.font = font(Math.round(22 * scale), 700);
  const nw = ctx.measureText(name).width + 26 * scale;
  const nh = 32 * scale;
  ctx.fillStyle = f.colors[1];
  roundRect(ctx, bx + 18, by - nh / 2, nw, nh, nh / 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(name, bx + 18 + nw / 2, by + 1);
  ctx.restore();
}

/** A small animated "..." bubble that shows who is talking when the words are shown outside the video. */
function talkingMark(ctx: CanvasRenderingContext2D, headX: number, headY: number, f: FrameInput) {
  const w = 120;
  const h = 70;
  const x = Math.min(W - w - 12, Math.max(12, headX - w / 2));
  const y = Math.max(12, headY - h - 26);
  ctx.save();
  ctx.shadowColor = "rgba(30,20,60,0.25)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x, y, w, h, 30);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(headX - 12, y + h - 2);
  ctx.lineTo(headX + 12, y + h - 2);
  ctx.lineTo(headX, Math.min(headY - 4, y + h + 22));
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
  for (let i = 0; i < 3; i++) {
    const bounce = Math.max(0, Math.sin(f.wall * 9 - i * 0.9)) * 8;
    ctx.beginPath();
    ctx.arc(x + 32 + i * 28, y + h / 2 - bounce, 10, 0, Math.PI * 2);
    ctx.fillStyle = f.colors[1];
    ctx.fill();
  }
  ctx.restore();
}

function drawScene(ctx: CanvasRenderingContext2D, f: FrameInput, index: number) {
  const timed = f.timeline.scenes[index];
  const scene = f.episode.scenes[index];
  const prev = index > 0 ? f.episode.scenes[index - 1] : null;
  const lt = f.t - timed.start;
  const info = BACKGROUND_INFO[scene.background];
  const cam = cameraFor(index, lt / (timed.end - timed.start));

  ctx.save();
  ctx.translate(cam.fx + cam.panX, cam.fy);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.fx, -cam.fy);
  paintBackground(ctx, scene.background, f.wall);
  drawProps(ctx, scene, prev, f, lt, ["sky", "ground"]);
  const actors = placeActors(f, index, lt);
  for (const actor of actors) drawActor(ctx, actor, f, info.floaty);
  drawProps(ctx, scene, prev, f, lt, ["air"]);
  ctx.restore();

  const vignette = ctx.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 860);
  vignette.addColorStop(0, "rgba(20,10,40,0)");
  vignette.addColorStop(1, "rgba(20,10,40,0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  for (const actor of actors) {
    if (!actor.member || !actor.firstAppearance) continue;
    const alpha = clamp01((lt - 0.6) / 0.3) * clamp01((4 - lt) / 0.4);
    if (alpha <= 0) continue;
    const feet = toScreen(cam, actor.x + actor.pose.dx, actor.y + (info.floaty ? actor.size * 0.1 : 0));
    nameTag(ctx, actor.member.name, feet.x, Math.min(H - 44 * f.textScale - 8, feet.y + 14), alpha, f.colors[1], f.textScale);
  }

  if (scene.caption) caption(ctx, scene.caption, f, lt);

  const line = f.activeLine;
  if (line && line.segment === "scene" && line.sceneIndex === index) {
    const speaker = line.speaker !== NARRATOR ? actors.find((a) => a.who === line.speaker && a.scale > 0.5) : undefined;
    const head = speaker && toScreen(cam, speaker.x + speaker.pose.dx, speaker.y + speaker.pose.dy - speaker.size * 1.02);
    if (f.textMode === "outside") {
      if (head) talkingMark(ctx, head.x, head.y, f);
    } else if (f.showText) {
      if (speaker && head) speechBubble(ctx, line.text, speaker.member?.name ?? "", head.x, head.y, f, line);
      else {
        const who = castMap(f.series.cast).get(line.speaker);
        textBar(ctx, who ? `${who.name}: ${line.text}` : line.text, f.textScale);
      }
    }
  }

  if (index === 0) iris(ctx, lt / 0.6);
  else if (prev && prev.background !== scene.background) iris(ctx, lt / 0.6);
}

/** Draws a still, representative frame of a single scene (used for thumbnails). */
export function renderStill(
  ctx: CanvasRenderingContext2D,
  cast: CastMember[],
  scene: Scene,
  colors: [string, string],
  pixelRatio: number,
  wall = 2.2,
) {
  const timeline: Timeline = { introEnd: 0, scenes: [{ index: 0, start: 0, end: 10 }], outroStart: 10, duration: 12, lines: [] };
  renderFrame(ctx, {
    series: { title: "", cast, language: "en", emoji: "⭐" },
    episode: { number: 1, title: "", scenes: [scene], takeaway: "" },
    timeline,
    t: 4.5,
    wall,
    activeLine: null,
    showText: false,
    colors,
    pixelRatio,
    textScale: 1,
    textMode: "canvas",
  });
}
