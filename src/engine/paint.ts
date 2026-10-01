/** Small canvas drawing helpers shared by the background painters. */

export const W = 1280;
export const H = 720;
/** Painters cover a margin beyond the frame so camera zoom/pan never shows edges. */
export const L = -120;
export const R = W + 120;
export const T = -90;
export const B = H + 90;

export type Ctx = CanvasRenderingContext2D;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Wraps a value moving at `speed` px/s across the painted width. */
export function drift(start: number, speed: number, t: number, span = R - L + 400): number {
  const x = (start - L + speed * t) % span;
  return L - 200 + (x < 0 ? x + span : x);
}

export function fillSky(ctx: Ctx, top: string, bottom: string, y0 = T, y1 = H) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(L, T, R - L, B - T);
}

export function circle(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, color: string) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function sun(ctx: Ctx, x: number, y: number, r: number, t: number, color = "#ffd84d") {
  const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 2.6);
  glow.addColorStop(0, "rgba(255,236,150,0.55)");
  glow.addColorStop(1, "rgba(255,236,150,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.15);
  ctx.fillStyle = color;
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(r * 1.15, -r * 0.12);
    ctx.lineTo(r * 1.55 + Math.sin(t * 2 + i) * r * 0.08, 0);
    ctx.lineTo(r * 1.15, r * 0.12);
    ctx.fill();
  }
  ctx.restore();
  circle(ctx, x, y, r, color);
  circle(ctx, x - r * 0.25, y - r * 0.25, r * 0.55, "rgba(255,255,255,0.25)");
}

export function cloud(ctx: Ctx, x: number, y: number, s: number, color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 34 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y - 18 * s, 42 * s, 0, Math.PI * 2);
  ctx.arc(x + 82 * s, y, 32 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y + 12 * s, 36 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function clouds(ctx: Ctx, t: number, seed: number, count: number, yMin: number, yMax: number, color = "#ffffff", alpha = 0.95) {
  const r = rng(seed);
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < count; i++) {
    const s = 0.6 + r() * 0.8;
    cloud(ctx, drift(r() * (R - L), 6 + s * 10, t), yMin + r() * (yMax - yMin), s, color);
  }
  ctx.restore();
}

/** Rolling hills: a smooth band filled to the bottom of the frame. */
export function hills(ctx: Ctx, baseY: number, amp: number, color: string, freq = 1, phase = 0) {
  ctx.beginPath();
  ctx.moveTo(L, B);
  for (let x = L; x <= R; x += 20) {
    const y = baseY + Math.sin((x / W) * Math.PI * 2 * freq + phase) * amp + Math.sin((x / W) * Math.PI * 5.3 * freq + phase * 2) * amp * 0.3;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(R, B);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function ground(ctx: Ctx, y: number, top: string, bottom: string) {
  const g = ctx.createLinearGradient(0, y, 0, B);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(L, y, R - L, B - y);
}

export function grass(ctx: Ctx, y: number, t: number, seed: number, color: string, count = 60) {
  const r = rng(seed);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    const x = L + r() * (R - L);
    const yy = y + r() * (B - y - 40);
    const h = 12 + r() * 14;
    const sway = Math.sin(t * 1.8 + x * 0.02) * 4;
    ctx.beginPath();
    ctx.moveTo(x - 5, yy);
    ctx.quadraticCurveTo(x - 4 + sway * 0.5, yy - h * 0.6, x - 7 + sway, yy - h);
    ctx.moveTo(x + 3, yy);
    ctx.quadraticCurveTo(x + 4 + sway * 0.5, yy - h * 0.7, x + 7 + sway, yy - h * 1.1);
    ctx.stroke();
  }
}

export function flowers(ctx: Ctx, y: number, seed: number, count = 18) {
  const r = rng(seed);
  const colors = ["#ff6b9a", "#ffd23f", "#ffffff", "#b388ff", "#ff9f43"];
  for (let i = 0; i < count; i++) {
    const x = L + r() * (R - L);
    const yy = y + 20 + r() * (B - y - 60);
    const c = colors[Math.floor(r() * colors.length)];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(a) * 6, yy + Math.sin(a) * 6, 5, c);
    }
    circle(ctx, x, yy, 4, "#ffb400");
  }
}

export function tree(ctx: Ctx, x: number, y: number, s: number, leaf = "#3fae4a", leafDark = "#2e8b3a", t = 0) {
  ctx.fillStyle = "#8b5a2b";
  roundRect(ctx, x - 14 * s, y - 120 * s, 28 * s, 120 * s, 8 * s);
  ctx.fill();
  const sway = Math.sin(t * 0.9 + x) * 3 * s;
  circle(ctx, x - 40 * s + sway, y - 140 * s, 52 * s, leafDark);
  circle(ctx, x + 42 * s + sway, y - 135 * s, 50 * s, leafDark);
  circle(ctx, x + sway, y - 190 * s, 64 * s, leaf);
  circle(ctx, x - 30 * s + sway, y - 160 * s, 46 * s, leaf);
  circle(ctx, x + 34 * s + sway, y - 165 * s, 44 * s, leaf);
  circle(ctx, x - 14 * s + sway, y - 205 * s, 22 * s, "rgba(255,255,255,0.18)");
}

export function pine(ctx: Ctx, x: number, y: number, s: number, color = "#2f7d4f", snow = false) {
  ctx.fillStyle = "#7a4a22";
  ctx.fillRect(x - 8 * s, y - 30 * s, 16 * s, 30 * s);
  for (let i = 0; i < 3; i++) {
    const w = (70 - i * 16) * s;
    const top = y - (60 + i * 45) * s - 40 * s;
    const base = y - (22 + i * 45) * s;
    ctx.beginPath();
    ctx.moveTo(x - w, base);
    ctx.lineTo(x, top);
    ctx.lineTo(x + w, base);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (snow) {
      ctx.beginPath();
      ctx.moveTo(x - w * 0.45, top + (base - top) * 0.45);
      ctx.lineTo(x, top);
      ctx.lineTo(x + w * 0.45, top + (base - top) * 0.45);
      ctx.quadraticCurveTo(x, top + (base - top) * 0.6, x - w * 0.45, top + (base - top) * 0.45);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }
}

export function palm(ctx: Ctx, x: number, y: number, s: number, t: number, flip = 1) {
  const lean = 40 * s * flip;
  ctx.strokeStyle = "#9b6a3c";
  ctx.lineWidth = 22 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + lean * 0.2, y - 160 * s, x + lean, y - 300 * s);
  ctx.stroke();
  const topX = x + lean;
  const topY = y - 300 * s;
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.5 + Math.sin(t * 1.3 + i) * 0.06;
    const len = 150 * s;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(a) * len * 0.6,
      topY + Math.sin(a) * len * 0.6 - 30 * s,
      topX + Math.cos(a) * len,
      topY + Math.sin(a) * len + 50 * s,
    );
    ctx.strokeStyle = i % 2 ? "#2fa44f" : "#3cc463";
    ctx.lineWidth = 18 * s;
    ctx.stroke();
  }
  circle(ctx, topX - 10 * s, topY + 12 * s, 12 * s, "#6b4423");
  circle(ctx, topX + 12 * s, topY + 14 * s, 12 * s, "#6b4423");
}

export function stars(ctx: Ctx, t: number, seed: number, count: number, maxY = H * 0.75) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = L + r() * (R - L);
    const y = T + r() * (maxY - T);
    const size = 1 + r() * 2.6;
    const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * (0.6 + r() * 1.6) + i));
    ctx.globalAlpha = tw;
    circle(ctx, x, y, size, "#ffffff");
    if (size > 3) {
      ctx.fillRect(x - size * 2.5, y - 0.6, size * 5, 1.2);
      ctx.fillRect(x - 0.6, y - size * 2.5, 1.2, size * 5);
    }
  }
  ctx.globalAlpha = 1;
}

export function moon(ctx: Ctx, x: number, y: number, r: number) {
  const glow = ctx.createRadialGradient(x, y, r, x, y, r * 3);
  glow.addColorStop(0, "rgba(255,250,220,0.35)");
  glow.addColorStop(1, "rgba(255,250,220,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  circle(ctx, x, y, r, "#fff6d5");
  circle(ctx, x - r * 0.3, y - r * 0.2, r * 0.18, "#efe2b4");
  circle(ctx, x + r * 0.35, y + r * 0.25, r * 0.22, "#efe2b4");
  circle(ctx, x + r * 0.1, y - r * 0.45, r * 0.1, "#efe2b4");
}

/** Particles that fall (snow, rain) or rise (bubbles), looping forever. */
export function particles(
  t: number,
  seed: number,
  count: number,
  speed: number,
  draw: (x: number, y: number, size: number, i: number) => void,
) {
  const r = rng(seed);
  const span = B - T;
  for (let i = 0; i < count; i++) {
    const x0 = L + r() * (R - L);
    const size = 0.5 + r();
    const y = T + ((((r() * span + speed * size * t) % span) + span) % span);
    const x = x0 + Math.sin(t * 0.8 + i) * 14 * size;
    draw(x, y, size, i);
  }
}
