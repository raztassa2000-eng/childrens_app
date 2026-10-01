import type { Background } from "../../shared/types";
import { H, W, rng } from "./paint";
import { drawEmoji } from "./sprites";

/**
 * Background life: little critters and effects that wander through each set,
 * so the world keeps moving around the characters. Everything is a pure
 * function of the clock, so frames stay deterministic.
 */

type Ctx = CanvasRenderingContext2D;

/** Emoji critters face left, so ones heading right are mirrored. */
function critter(ctx: Ctx, emoji: string, x: number, y: number, size: number, pr: number, headingRight: boolean, tilt = 0, alpha = 0.95) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(tilt);
  if (headingRight) ctx.scale(-1, 1);
  drawEmoji(ctx, emoji, 0, 0, size, pr);
  ctx.restore();
}

/**
 * Something crossing the screen every `period` seconds, taking `travel`
 * seconds to cross. Returns progress 0-1 while it's on screen, else null.
 */
function crossing(wall: number, period: number, travel: number, offset: number): number | null {
  const local = (wall + offset) % period;
  return local < travel ? local / travel : null;
}

function across(p: number, rightward: boolean, margin = 90) {
  const from = rightward ? -margin : W + margin;
  const to = rightward ? W + margin : -margin;
  return from + (to - from) * p;
}

function butterflies(ctx: Ctx, wall: number, pr: number, count: number, seed: number, emoji = "🦋") {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const cx = 160 + r() * (W - 320);
    const cy = 250 + r() * 160;
    const speed = 0.25 + r() * 0.2;
    const a = wall * speed + r() * 6;
    const x = cx + Math.sin(a) * 180 + Math.sin(a * 2.3) * 40;
    const y = cy + Math.sin(a * 1.7) * 60 + Math.sin(wall * 9 + i) * 6;
    const heading = Math.cos(a) > 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(heading ? -1 : 1, 0.75 + 0.25 * Math.abs(Math.sin(wall * 11 + i)));
    drawEmoji(ctx, emoji, 0, 0, 38, pr);
    ctx.restore();
  }
}

function birds(ctx: Ctx, wall: number, pr: number, y: number, offset: number, emoji = "🐦", count = 3) {
  const p = crossing(wall, 19, 9, offset);
  if (p === null) return;
  const rightward = Math.floor((wall + offset) / 19) % 2 === 0;
  for (let i = 0; i < count; i++) {
    const x = across(p, rightward, 90 + i * 70) + (rightward ? -i * 60 : i * 60);
    const flap = Math.sin(wall * 10 + i) * 0.12;
    critter(ctx, emoji, x, y + i * 28 + Math.sin(wall * 2 + i) * 8, 40 - i * 4, pr, rightward, flap);
  }
}

function walker(ctx: Ctx, wall: number, pr: number, emoji: string, y: number, size: number, period: number, travel: number, offset: number, hop = 4) {
  const p = crossing(wall, period, travel, offset);
  if (p === null) return;
  const rightward = Math.floor((wall + offset) / period) % 2 === 1;
  const x = across(p, rightward);
  critter(ctx, emoji, x, y - Math.abs(Math.sin(wall * 8)) * hop, size, pr, rightward, Math.sin(wall * 8) * 0.06);
}

function bubbles(ctx: Ctx, wall: number, count: number, seed: number, bottom = H, top = 0, alpha = 0.55) {
  const r = rng(seed);
  ctx.save();
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillStyle = `rgba(255,255,255,${alpha * 0.25})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < count; i++) {
    const x0 = r() * W;
    const speed = 30 + r() * 50;
    const size = 4 + r() * 9;
    const span = bottom - top + 40;
    const y = bottom - ((wall * speed + r() * span) % span);
    const x = x0 + Math.sin(wall * 1.5 + i) * 12;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function fireflies(ctx: Ctx, wall: number, count: number, seed: number) {
  const r = rng(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const cx = r() * W;
    const cy = 300 + r() * 280;
    const a = wall * (0.3 + r() * 0.3) + r() * 10;
    const x = cx + Math.sin(a) * 60;
    const y = cy + Math.cos(a * 1.3) * 40;
    const glow = 0.25 + 0.75 * Math.max(0, Math.sin(wall * 2.2 + i * 1.7));
    const g = ctx.createRadialGradient(x, y, 0, x, y, 18);
    g.addColorStop(0, `rgba(255,250,170,${glow})`);
    g.addColorStop(1, "rgba(255,250,170,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function shootingStar(ctx: Ctx, wall: number, offset: number) {
  const p = crossing(wall, 9, 1.1, offset);
  if (p === null) return;
  const x = 1100 - p * 700;
  const y = 60 + p * 220;
  ctx.save();
  const g = ctx.createLinearGradient(x, y, x + 160, y - 50);
  g.addColorStop(0, `rgba(255,255,255,${1 - p * 0.6})`);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = g;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 160, y - 50);
  ctx.stroke();
  ctx.restore();
}

function spotlights(ctx: Ctx, wall: number) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const baseX = 200 + i * 440;
    const swing = Math.sin(wall * 0.6 + i * 2.1) * 220;
    const g = ctx.createLinearGradient(baseX, 0, baseX + swing, 640);
    const color = ["255,120,200", "120,200,255", "255,230,120"][i];
    g.addColorStop(0, `rgba(${color},0.22)`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(baseX - 20, -10);
    ctx.lineTo(baseX + 20, -10);
    ctx.lineTo(baseX + swing + 150, 660);
    ctx.lineTo(baseX + swing - 150, 660);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function dustMotes(ctx: Ctx, wall: number, count: number, seed: number) {
  const r = rng(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = (r() * W + wall * (6 + r() * 10)) % W;
    const y = 120 + r() * 420 + Math.sin(wall * 0.8 + i) * 20;
    ctx.globalAlpha = 0.25 + 0.25 * Math.sin(wall * 1.3 + i);
    ctx.fillStyle = "#fff8e1";
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Draws the set's wandering life. Call after the background, before the props and characters. */
export function paintAmbient(ctx: Ctx, background: Background, wall: number, groundY: number, pr: number, seed: number) {
  const o = (seed % 97) / 7;
  switch (background) {
    case "meadow":
      butterflies(ctx, wall, pr, 2, seed);
      walker(ctx, wall, pr, "🐞", groundY + 46, 30, 23, 14, o);
      birds(ctx, wall, pr, 110, o);
      break;
    case "park":
      butterflies(ctx, wall, pr, 1, seed);
      birds(ctx, wall, pr, 120, o, "🕊️", 2);
      walker(ctx, wall, pr, "🐿️", groundY - 10, 44, 21, 7, o + 5, 10);
      break;
    case "farm":
      butterflies(ctx, wall, pr, 1, seed);
      walker(ctx, wall, pr, "🐓", groundY - 40, 50, 25, 12, o, 6);
      birds(ctx, wall, pr, 100, o + 9);
      break;
    case "forest":
      butterflies(ctx, wall, pr, 1, seed);
      walker(ctx, wall, pr, "🐇", groundY - 26, 44, 22, 6, o, 16);
      birds(ctx, wall, pr, 90, o + 7);
      break;
    case "jungle":
      butterflies(ctx, wall, pr, 2, seed);
      birds(ctx, wall, pr, 120, o, "🦜", 1);
      break;
    case "pond":
      butterflies(ctx, wall, pr, 1, seed);
      walker(ctx, wall, pr, "🦆", groundY - 50, 46, 26, 16, o, 2);
      birds(ctx, wall, pr, 100, o + 11);
      break;
    case "beach":
      walker(ctx, wall, pr, "🦀", groundY + 50, 40, 20, 9, o, 3);
      birds(ctx, wall, pr, 110, o + 4, "🕊️", 2);
      break;
    case "underwater":
      bubbles(ctx, wall, 16, seed);
      walker(ctx, wall, pr, "🐠", 220, 52, 17, 9, o, 0);
      walker(ctx, wall, pr, "🐟", 560, 44, 23, 12, o + 8, 0);
      break;
    case "sky":
      birds(ctx, wall, pr, 200, o, "🐦", 3);
      walker(ctx, wall, pr, "🎈", 120, 46, 29, 18, o + 6, 0);
      break;
    case "space":
      shootingStar(ctx, wall, o);
      walker(ctx, wall, pr, "🛰️", 130, 50, 31, 22, o + 3, 0);
      break;
    case "night":
      fireflies(ctx, wall, 12, seed);
      shootingStar(ctx, wall, o + 4);
      break;
    case "desert":
      walker(ctx, wall, pr, "🦎", groundY + 40, 40, 19, 6, o, 2);
      birds(ctx, wall, pr, 90, o + 5, "🦅", 1);
      break;
    case "snow":
      walker(ctx, wall, pr, "🐧", groundY - 6, 46, 27, 16, o, 5);
      break;
    case "mountains":
      birds(ctx, wall, pr, 120, o, "🦅", 1);
      butterflies(ctx, wall, pr, 1, seed);
      break;
    case "rainy":
      walker(ctx, wall, pr, "🐌", groundY + 44, 34, 40, 34, o, 0);
      break;
    case "city":
      walker(ctx, wall, pr, "🚕", groundY - 70, 56, 11, 4, o, 1);
      walker(ctx, wall, pr, "🚌", groundY - 72, 64, 17, 6, o + 6, 1);
      birds(ctx, wall, pr, 100, o + 2, "🕊️", 2);
      break;
    case "stage":
      spotlights(ctx, wall);
      break;
    case "lab":
      bubbles(ctx, wall, 6, seed, groundY - 80, 300, 0.4);
      dustMotes(ctx, wall, 10, seed);
      break;
    case "home":
    case "classroom":
      dustMotes(ctx, wall, 14, seed);
      break;
  }
}

/** Emoji that look best falling or drifting down instead of floating in place. */
export const FALLING = new Set(["🍎", "💧", "💦", "🍂", "🍁", "🍃", "❄️", "🪶", "🌸", "🎊", "🫧"]);
const SWIRLING = new Set(["🍂", "🍁", "🍃", "🪶", "🌸", "🎊"]);
const RISING = new Set(["🫧"]);

/** Position of a falling/drifting air prop `i` at time `wall` (a slow, looping fall with sway). */
export function fallingPath(emoji: string, x: number, wall: number, i: number, bottom: number) {
  const rising = RISING.has(emoji);
  const period = SWIRLING.has(emoji) ? 6.5 : emoji === "💧" || emoji === "💦" ? 2.2 : 4.5;
  const p = ((wall + i * 1.37) % period) / period;
  const top = 170;
  const y = rising ? bottom - p * (bottom - top) : top + p * (bottom - top);
  const sway = SWIRLING.has(emoji) ? Math.sin(p * Math.PI * 4 + i) * 60 : Math.sin(wall * 1.5 + i) * 10;
  const alpha = Math.min(1, p * 6, (1 - p) * 6);
  const rot = SWIRLING.has(emoji) ? Math.sin(p * Math.PI * 4 + i) * 0.6 : 0;
  return { x: x + sway, y, alpha, rot };
}
