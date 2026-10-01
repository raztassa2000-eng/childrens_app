import type { Background } from "../../shared/types";
import {
  B,
  H,
  L,
  R,
  T,
  W,
  circle,
  clouds,
  drift,
  ellipse,
  fillSky,
  flowers,
  grass,
  ground,
  hills,
  moon,
  palm,
  particles,
  pine,
  rng,
  roundRect,
  stars,
  sun,
  tree,
  type Ctx,
} from "./paint";

export interface BackgroundInfo {
  /** Where actors' feet touch the ground. */
  groundY: number;
  /** Actors hover (underwater, sky, space) instead of standing. */
  floaty: boolean;
  /** Dark sets get light-colored text and shadows. */
  dark: boolean;
}

export const BACKGROUND_INFO: Record<Background, BackgroundInfo> = {
  meadow: { groundY: 600, floaty: false, dark: false },
  park: { groundY: 605, floaty: false, dark: false },
  forest: { groundY: 610, floaty: false, dark: false },
  jungle: { groundY: 612, floaty: false, dark: false },
  farm: { groundY: 610, floaty: false, dark: false },
  pond: { groundY: 590, floaty: false, dark: false },
  beach: { groundY: 620, floaty: false, dark: false },
  underwater: { groundY: 470, floaty: true, dark: false },
  sky: { groundY: 470, floaty: true, dark: false },
  space: { groundY: 470, floaty: true, dark: true },
  night: { groundY: 605, floaty: false, dark: true },
  desert: { groundY: 612, floaty: false, dark: false },
  snow: { groundY: 612, floaty: false, dark: false },
  mountains: { groundY: 615, floaty: false, dark: false },
  rainy: { groundY: 610, floaty: false, dark: false },
  city: { groundY: 615, floaty: false, dark: false },
  home: { groundY: 640, floaty: false, dark: false },
  classroom: { groundY: 640, floaty: false, dark: false },
  lab: { groundY: 640, floaty: false, dark: false },
  stage: { groundY: 625, floaty: false, dark: true },
};

type Painter = (ctx: Ctx, t: number) => void;

const meadow: Painter = (ctx, t) => {
  fillSky(ctx, "#7cc8ff", "#dff4ff");
  sun(ctx, 1090, 120, 58, t);
  clouds(ctx, t, 11, 5, 40, 230);
  hills(ctx, 470, 36, "#a5d96a", 1.2, 0.6);
  hills(ctx, 540, 28, "#7fc552", 0.9, 2.1);
  ground(ctx, 590, "#6abf45", "#4f9d34");
  flowers(ctx, 600, 3, 22);
  grass(ctx, 600, t, 5, "#3f8f2b", 50);
};

const park: Painter = (ctx, t) => {
  fillSky(ctx, "#86d0ff", "#e6f7ff");
  sun(ctx, 160, 110, 50, t);
  clouds(ctx, t, 21, 4, 50, 200);
  hills(ctx, 500, 22, "#9fd86a", 1, 1.3);
  // fence
  ctx.fillStyle = "#ffffff";
  for (let x = L; x < R; x += 46) {
    ctx.fillRect(x, 500, 12, 70);
    ctx.beginPath();
    ctx.moveTo(x - 2, 500);
    ctx.lineTo(x + 6, 488);
    ctx.lineTo(x + 14, 500);
    ctx.fill();
  }
  ctx.fillRect(L, 515, R - L, 9);
  ctx.fillRect(L, 548, R - L, 9);
  ground(ctx, 568, "#76c84f", "#58a83a");
  tree(ctx, 120, 600, 1.1, "#4cbf56", "#34974a", t);
  tree(ctx, 1180, 585, 0.9, "#5fcf5f", "#3c9d47", t);
  // path
  ctx.beginPath();
  ctx.moveTo(L, 700);
  ctx.bezierCurveTo(300, 640, 900, 690, R, 640);
  ctx.lineTo(R, 700);
  ctx.bezierCurveTo(900, 750, 300, 700, L, 770);
  ctx.closePath();
  ctx.fillStyle = "#f3d9a4";
  ctx.fill();
  // bench
  ctx.fillStyle = "#b5651d";
  roundRect(ctx, 930, 540, 170, 16, 6);
  ctx.fill();
  roundRect(ctx, 930, 512, 170, 14, 6);
  ctx.fill();
  ctx.fillStyle = "#555";
  ctx.fillRect(945, 556, 10, 34);
  ctx.fillRect(1075, 556, 10, 34);
  flowers(ctx, 590, 8, 12);
  grass(ctx, 590, t, 9, "#3f8f2b", 30);
};

const forest: Painter = (ctx, t) => {
  fillSky(ctx, "#a8e0c9", "#e8fbef");
  for (let i = 0; i < 9; i++) pine(ctx, L + 40 + i * 175, 520, 1.3, "#5b9e7a");
  hills(ctx, 540, 18, "#79b86a", 1, 0.3);
  for (let i = 0; i < 6; i++) tree(ctx, L + 100 + i * 290, 600, 1.15 + (i % 2) * 0.2, "#48a85a", "#2f7d43", t);
  // sunbeams
  ctx.save();
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.08 + 0.05 * Math.sin(t * 0.7 + i);
    ctx.fillStyle = "#fffbe0";
    ctx.beginPath();
    ctx.moveTo(200 + i * 260, T);
    ctx.lineTo(320 + i * 260, T);
    ctx.lineTo(120 + i * 260, 640);
    ctx.lineTo(40 + i * 260, 640);
    ctx.fill();
  }
  ctx.restore();
  ground(ctx, 600, "#5ca845", "#3f7f30");
  const r = rng(77);
  for (let i = 0; i < 6; i++) {
    const x = L + r() * (R - L);
    const y = 640 + r() * 80;
    ctx.fillStyle = "#f5f0e1";
    ctx.fillRect(x - 5, y - 16, 10, 16);
    ctx.beginPath();
    ctx.ellipse(x, y - 16, 18, 12, 0, Math.PI, 0);
    ctx.fillStyle = "#e63946";
    ctx.fill();
    circle(ctx, x - 6, y - 22, 3, "#fff");
    circle(ctx, x + 6, y - 20, 2.5, "#fff");
  }
  grass(ctx, 610, t, 13, "#2f6f24", 40);
};

const jungle: Painter = (ctx, t) => {
  fillSky(ctx, "#6fd3b0", "#d6f8ea");
  const r = rng(31);
  for (let i = 0; i < 26; i++) circle(ctx, L + i * 62, 360 + r() * 80, 70 + r() * 40, i % 2 ? "#2f8f5b" : "#37a065");
  for (let i = 0; i < 20; i++) circle(ctx, L + 30 + i * 80, 470 + r() * 50, 60 + r() * 30, i % 2 ? "#3cae5c" : "#2e9a52");
  palm(ctx, 90, 640, 1.15, t, 1);
  palm(ctx, 1200, 640, 1.05, t, -1);
  // vines
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#2a7a3b";
  for (let i = 0; i < 7; i++) {
    const x = 120 + i * 180;
    const len = 120 + (i % 3) * 60;
    const sway = Math.sin(t * 1.1 + i) * 14;
    ctx.beginPath();
    ctx.moveTo(x, T);
    ctx.quadraticCurveTo(x + sway, len * 0.6, x + sway * 1.6, len);
    ctx.stroke();
    ellipse(ctx, x + sway * 1.6, len + 6, 9, 14, "#3fbf5f");
  }
  ground(ctx, 602, "#4e9f3d", "#336f29");
  // big front leaves
  for (const [x, flip] of [
    [L + 60, 1],
    [R - 60, -1],
  ] as const) {
    ctx.save();
    ctx.translate(x, B - 40);
    ctx.scale(flip, 1);
    ctx.rotate(-0.6 + Math.sin(t * 0.9) * 0.04);
    ellipse(ctx, 90, 0, 120, 42, "#1f8a4c");
    ctx.restore();
  }
  grass(ctx, 610, t, 3, "#2c6e22", 40);
};

const farm: Painter = (ctx, t) => {
  fillSky(ctx, "#8fd5ff", "#eaf8ff");
  sun(ctx, 170, 110, 52, t);
  clouds(ctx, t, 41, 4, 50, 210);
  hills(ctx, 470, 30, "#b7e07a", 0.8, 1);
  // barn
  const bx = 880;
  ctx.fillStyle = "#c0392b";
  ctx.fillRect(bx, 380, 260, 200);
  ctx.beginPath();
  ctx.moveTo(bx - 20, 385);
  ctx.lineTo(bx + 130, 280);
  ctx.lineTo(bx + 280, 385);
  ctx.closePath();
  ctx.fillStyle = "#962d22";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 8;
  ctx.strokeRect(bx + 80, 460, 100, 120);
  ctx.beginPath();
  ctx.moveTo(bx + 80, 460);
  ctx.lineTo(bx + 180, 580);
  ctx.moveTo(bx + 180, 460);
  ctx.lineTo(bx + 80, 580);
  ctx.stroke();
  circle(ctx, bx + 130, 345, 22, "#ffffff");
  circle(ctx, bx + 130, 345, 15, "#7a2318");
  hills(ctx, 560, 14, "#86cc55", 1.1, 0.4);
  // fence
  ctx.fillStyle = "#d9a066";
  for (let x = L; x < 820; x += 70) ctx.fillRect(x, 520, 12, 62);
  ctx.fillRect(L, 535, 940, 10);
  ctx.fillRect(L, 560, 940, 10);
  ground(ctx, 585, "#78c24e", "#5a9e38");
  // hay bale
  ellipse(ctx, 120, 640, 60, 42, "#f2c94c");
  ctx.strokeStyle = "#d4a72c";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(120, 640, 40, 28, 0, 0, Math.PI * 2);
  ctx.stroke();
  grass(ctx, 600, t, 17, "#447f2b", 40);
};

const pond: Painter = (ctx, t) => {
  fillSky(ctx, "#86d4ff", "#e9f9ff");
  sun(ctx, 1110, 110, 48, t);
  clouds(ctx, t, 51, 4, 40, 200);
  for (let i = 0; i < 8; i++) tree(ctx, L + 80 + i * 200, 520, 0.7, "#5cbf63", "#3e9a4b", t);
  ground(ctx, 500, "#79c652", "#5aa83e");
  // water
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(640, 700, 640, 110, 0, 0, Math.PI * 2);
  const water = ctx.createLinearGradient(0, 590, 0, 810);
  water.addColorStop(0, "#5ec8f2");
  water.addColorStop(1, "#2a8fd0");
  ctx.fillStyle = water;
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const p = (t * 0.35 + i / 4) % 1;
    ctx.globalAlpha = 1 - p;
    ctx.beginPath();
    ctx.ellipse(380 + i * 170, 690 + (i % 2) * 30, 30 + p * 90, 8 + p * 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  for (const [x, y] of [
    [260, 640],
    [980, 660],
    [700, 730],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.ellipse(x, y, 40, 14, 0, 0.3, Math.PI * 2 - 0.3);
    ctx.closePath();
    ctx.fillStyle = "#3daa4f";
    ctx.fill();
  }
  circle(ctx, 985, 652, 9, "#ff8fb8");
  // reeds
  for (const x of [L + 80, L + 130, R - 140, R - 90]) {
    const sway = Math.sin(t * 1.4 + x) * 5;
    ctx.strokeStyle = "#3b8a2e";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, 690);
    ctx.quadraticCurveTo(x + sway, 600, x + sway * 1.5, 530);
    ctx.stroke();
    ellipse(ctx, x + sway * 1.5, 540, 9, 26, "#7b4a26");
  }
  grass(ctx, 510, t, 23, "#4c9a30", 30);
};

const beach: Painter = (ctx, t) => {
  fillSky(ctx, "#65c7ff", "#d9f3ff");
  sun(ctx, 1080, 110, 56, t);
  clouds(ctx, t, 61, 3, 50, 180);
  const sea = ctx.createLinearGradient(0, 380, 0, 560);
  sea.addColorStop(0, "#1e90d6");
  sea.addColorStop(1, "#5fd0f0");
  ctx.fillStyle = sea;
  ctx.fillRect(L, 380, R - L, 200);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 4;
  for (let row = 0; row < 4; row++) {
    ctx.beginPath();
    const y = 410 + row * 40;
    for (let x = L; x <= R; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.03 + t * (1.5 + row * 0.3) + row) * 5);
    ctx.stroke();
  }
  // foam edge
  ctx.beginPath();
  ctx.moveTo(L, 560);
  for (let x = L; x <= R; x += 16) ctx.lineTo(x, 556 + Math.sin(x * 0.02 + t * 1.2) * 8);
  ctx.lineTo(R, B);
  ctx.lineTo(L, B);
  ctx.closePath();
  ctx.fillStyle = "#fff6e0";
  ctx.fill();
  ground(ctx, 575, "#f7dc9b", "#eec479");
  palm(ctx, 110, 660, 1.0, t, 1);
  const r = rng(63);
  for (let i = 0; i < 10; i++) ellipse(ctx, L + r() * (R - L), 640 + r() * 120, 7, 5, ["#ffb3c1", "#fff", "#ffd59e"][i % 3]);
};

const underwater: Painter = (ctx, t) => {
  fillSky(ctx, "#2fc0f5", "#0b4f8f", T, B);
  ctx.save();
  for (let i = 0; i < 5; i++) {
    ctx.globalAlpha = 0.07 + 0.05 * Math.sin(t * 0.8 + i * 1.7);
    ctx.fillStyle = "#e9fbff";
    ctx.beginPath();
    ctx.moveTo(100 + i * 260, T);
    ctx.lineTo(220 + i * 260, T);
    ctx.lineTo(40 + i * 260, 700);
    ctx.lineTo(-60 + i * 260, 700);
    ctx.fill();
  }
  ctx.restore();
  hills(ctx, 650, 16, "#e9c77d", 1.3, 0.2);
  // coral
  for (const [x, c] of [
    [180, "#ff6f91"],
    [1060, "#ff9671"],
    [880, "#c780fa"],
  ] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    for (let b = -2; b <= 2; b++) {
      ctx.beginPath();
      ctx.moveTo(x, 690);
      ctx.quadraticCurveTo(x + b * 22, 640, x + b * 34 + Math.sin(t + b) * 4, 600 - Math.abs(b) * 10);
      ctx.stroke();
    }
  }
  // seaweed
  for (let i = 0; i < 9; i++) {
    const x = L + 60 + i * 175;
    ctx.strokeStyle = i % 2 ? "#2bb673" : "#1f9e5e";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(x, B);
    for (let y = B; y > 520; y -= 20) ctx.lineTo(x + Math.sin(y * 0.03 + t * 1.6 + i) * 16, y);
    ctx.stroke();
  }
  particles(t, 71, 30, -40, (x, y, s) => {
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 5 + s * 8, 0, Math.PI * 2);
    ctx.stroke();
    circle(ctx, x - 3, y - 3, 2, "rgba(255,255,255,0.8)");
  });
};

const sky: Painter = (ctx, t) => {
  fillSky(ctx, "#5bb8ff", "#e3f5ff", T, B);
  sun(ctx, 1110, 100, 50, t);
  clouds(ctx, t * 0.6, 81, 4, 40, 300, "#ffffff", 0.7);
  clouds(ctx, t * 1.4, 82, 5, 380, 700, "#ffffff", 0.95);
  ctx.save();
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 6; i++) {
    const x = drift(i * 260, 220, t);
    const y = 140 + ((i * 97) % 420);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, 90, 3);
  }
  ctx.restore();
};

const space: Painter = (ctx, t) => {
  fillSky(ctx, "#070b24", "#2b1b5a", T, B);
  const neb = ctx.createRadialGradient(950, 520, 10, 950, 520, 420);
  neb.addColorStop(0, "rgba(200,90,255,0.35)");
  neb.addColorStop(1, "rgba(200,90,255,0)");
  ctx.fillStyle = neb;
  ctx.fillRect(L, T, R - L, B - T);
  stars(ctx, t, 91, 160, B);
  // ringed planet
  ctx.save();
  ctx.translate(200, 170);
  ctx.rotate(-0.35);
  ctx.strokeStyle = "rgba(255,214,160,0.9)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 30, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  circle(ctx, 0, 0, 70, "#f4a261");
  circle(ctx, -20, -18, 26, "rgba(255,255,255,0.18)");
  ctx.beginPath();
  ctx.ellipse(0, 0, 120, 30, 0, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
  circle(ctx, 1150, 600, 40, "#5dade2");
  circle(ctx, 1138, 590, 14, "#58d68d");
  // shooting star every 7 seconds
  const p = (t % 7) / 1.2;
  if (p < 1) {
    const x = 1300 - p * 700;
    const y = 40 + p * 260;
    const g = ctx.createLinearGradient(x, y, x + 160, y - 60);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 160, y - 60);
    ctx.stroke();
  }
};

const night: Painter = (ctx, t) => {
  fillSky(ctx, "#0d1b48", "#3d4f8f");
  stars(ctx, t, 101, 110, 480);
  moon(ctx, 1060, 130, 60);
  hills(ctx, 470, 30, "#203a66", 0.9, 1.5);
  hills(ctx, 540, 24, "#1d4d4f", 1.2, 0.2);
  ground(ctx, 595, "#235c3e", "#163f2b");
  for (let i = 0; i < 4; i++) pine(ctx, L + 150 + i * 430, 590, 1.0, "#173d34");
  // fireflies
  const r = rng(103);
  for (let i = 0; i < 14; i++) {
    const x = L + r() * (R - L) + Math.sin(t * 0.7 + i) * 30;
    const y = 420 + r() * 260 + Math.cos(t * 0.9 + i * 2) * 20;
    const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
    ctx.globalAlpha = glow;
    circle(ctx, x, y, 9, "rgba(255,240,120,0.35)");
    circle(ctx, x, y, 3.5, "#fff59d");
  }
  ctx.globalAlpha = 1;
  grass(ctx, 605, t, 29, "#123826", 30);
};

const desert: Painter = (ctx, t) => {
  fillSky(ctx, "#ffb55e", "#ffecc4");
  sun(ctx, 640, 150, 70, t, "#fff1a8");
  hills(ctx, 470, 40, "#f2c46d", 0.7, 0.4);
  hills(ctx, 545, 30, "#e9ae55", 1, 2.2);
  ground(ctx, 595, "#f0bd62", "#d99a42");
  const cactus = (x: number, y: number, s: number) => {
    ctx.fillStyle = "#3f9b4f";
    roundRect(ctx, x - 18 * s, y - 170 * s, 36 * s, 170 * s, 18 * s);
    ctx.fill();
    roundRect(ctx, x - 62 * s, y - 120 * s, 22 * s, 60 * s, 11 * s);
    ctx.fill();
    roundRect(ctx, x - 62 * s, y - 72 * s, 50 * s, 20 * s, 10 * s);
    ctx.fill();
    roundRect(ctx, x + 40 * s, y - 145 * s, 22 * s, 70 * s, 11 * s);
    ctx.fill();
    roundRect(ctx, x + 12 * s, y - 92 * s, 50 * s, 20 * s, 10 * s);
    ctx.fill();
  };
  cactus(140, 640, 1.1);
  cactus(1150, 600, 0.8);
  const r = rng(113);
  for (let i = 0; i < 8; i++) ellipse(ctx, L + r() * (R - L), 640 + r() * 100, 14 + r() * 16, 8 + r() * 6, "#c98b45");
};

const snow: Painter = (ctx, t) => {
  fillSky(ctx, "#a9cff7", "#eef6ff");
  ctx.fillStyle = "#c9dcf2";
  ctx.beginPath();
  ctx.moveTo(L, 520);
  ctx.lineTo(200, 260);
  ctx.lineTo(420, 480);
  ctx.lineTo(700, 220);
  ctx.lineTo(1000, 470);
  ctx.lineTo(1180, 300);
  ctx.lineTo(R, 500);
  ctx.lineTo(R, 600);
  ctx.lineTo(L, 600);
  ctx.fill();
  hills(ctx, 540, 26, "#ffffff", 0.9, 0.5);
  ground(ctx, 598, "#ffffff", "#dbe9f7");
  for (const [x, s] of [
    [90, 1.1],
    [210, 0.8],
    [1120, 1.0],
    [1220, 0.75],
  ]) pine(ctx, x, 620, s, "#2f6f57", true);
  ellipse(ctx, 640, 700, 420, 30, "rgba(160,190,230,0.35)");
  particles(t, 121, 70, 45, (x, y, s) => circle(ctx, x, y, 2.5 + s * 3, "rgba(255,255,255,0.95)"));
};

const mountains: Painter = (ctx, t) => {
  fillSky(ctx, "#7ec8ff", "#e8f6ff");
  sun(ctx, 1120, 100, 46, t);
  clouds(ctx, t, 131, 3, 60, 200);
  const peak = (x: number, y: number, w: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(x - w, 560);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w, 560);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - w * 0.28, y + (560 - y) * 0.28);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w * 0.28, y + (560 - y) * 0.28);
    ctx.lineTo(x + w * 0.1, y + (560 - y) * 0.22);
    ctx.lineTo(x - w * 0.05, y + (560 - y) * 0.3);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  };
  peak(250, 190, 330, "#7b88c9");
  peak(760, 140, 380, "#6a76b8");
  peak(1180, 230, 300, "#8592d1");
  hills(ctx, 520, 30, "#7cc35a", 0.8, 1.1);
  ground(ctx, 600, "#6fbe4b", "#4f9a35");
  for (let i = 0; i < 5; i++) pine(ctx, L + 120 + i * 320, 600, 0.75, "#2f7a4a");
  flowers(ctx, 610, 133, 14);
  grass(ctx, 610, t, 137, "#3d872a", 30);
};

const rainy: Painter = (ctx, t) => {
  fillSky(ctx, "#7f96a8", "#cfdbe3");
  clouds(ctx, t * 0.8, 141, 7, -10, 160, "#9aa9b5", 1);
  clouds(ctx, t * 1.1, 142, 5, 40, 200, "#b8c4cd", 1);
  hills(ctx, 500, 26, "#79a964", 1, 0.8);
  ground(ctx, 590, "#5f9a4b", "#467a37");
  // puddles with ripples
  for (const [x, y] of [
    [300, 680],
    [900, 700],
  ]) {
    ellipse(ctx, x, y, 110, 22, "#8fb6d0");
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      const p = (t * 0.8 + i * 0.5 + x) % 1;
      ctx.globalAlpha = 1 - p;
      ctx.beginPath();
      ctx.ellipse(x - 30 + i * 60, y, 10 + p * 40, 3 + p * 9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = "rgba(220,235,255,0.75)";
  ctx.lineWidth = 2.5;
  particles(t, 143, 110, 520, (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 6, y + 22);
    ctx.stroke();
  });
};

const city: Painter = (ctx, t) => {
  fillSky(ctx, "#8ad3ff", "#eef9ff");
  sun(ctx, 1150, 90, 44, t);
  clouds(ctx, t, 151, 3, 40, 170);
  const r = rng(153);
  for (let x = L; x < R; x += 90) {
    const h = 160 + r() * 160;
    ctx.fillStyle = "#b9c9e8";
    ctx.fillRect(x, 470 - h, 82, h + 40);
  }
  const colors = ["#ff8a65", "#4fc3f7", "#ffd54f", "#81c784", "#ba68c8", "#f06292"];
  for (let i = 0, x = L + 20; x < R; i++, x += 150) {
    const h = 180 + r() * 150;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, 530 - h, 130, h + 30);
    for (let wy = 545 - h; wy < 500; wy += 42) {
      for (let wx = x + 16; wx < x + 120; wx += 38) {
        ctx.fillStyle = (Math.floor(wx + wy) % 3) === 0 ? "#fff6c2" : "#e3f2fd";
        ctx.fillRect(wx, wy, 22, 26);
      }
    }
  }
  // sidewalk + road
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(L, 555, R - L, 75);
  ctx.fillStyle = "#b0bec5";
  for (let x = L; x < R; x += 80) ctx.fillRect(x, 555, 4, 75);
  ctx.fillStyle = "#4a4f57";
  ctx.fillRect(L, 630, R - L, B - 630);
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 7; i++) ctx.fillRect(560 + i * 34, 640, 20, 140);
  ctx.fillStyle = "#ffd54f";
  for (let x = L; x < R; x += 120) if (x < 520 || x > 820) ctx.fillRect(x, 718, 60, 8);
  // traffic light cycling green -> yellow -> red
  const phase = t % 9;
  ctx.fillStyle = "#37474f";
  ctx.fillRect(1086, 380, 12, 180);
  roundRect(ctx, 1062, 300, 60, 140, 14);
  ctx.fill();
  circle(ctx, 1092, 330, 16, phase >= 6 ? "#ff3b30" : "#5c2a2a");
  circle(ctx, 1092, 370, 16, phase >= 4.5 && phase < 6 ? "#ffcc00" : "#5c4a1a");
  circle(ctx, 1092, 410, 16, phase < 4.5 ? "#34c759" : "#1f4a2a");
};

const room = (ctx: Ctx, wall: string, floor: string, floorDark: string) => {
  ctx.fillStyle = wall;
  ctx.fillRect(L, T, R - L, 640 - T);
  ctx.fillStyle = floor;
  ctx.fillRect(L, 600, R - L, B - 600);
  ctx.strokeStyle = floorDark;
  ctx.lineWidth = 3;
  for (let y = 630; y < B; y += 36) {
    ctx.beginPath();
    ctx.moveTo(L, y);
    ctx.lineTo(R, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(L, 596, R - L, 10);
};

const home: Painter = (ctx, t) => {
  room(ctx, "#ffe7c7", "#d39a5f", "#b77f45");
  const r = rng(161);
  for (let i = 0; i < 40; i++) circle(ctx, L + r() * (R - L), T + r() * 680, 6, "rgba(255,170,120,0.25)");
  // window
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 150, 140, 300, 230, 16);
  ctx.fill();
  ctx.save();
  roundRect(ctx, 166, 156, 268, 198, 10);
  ctx.clip();
  fillSky(ctx, "#79c7ff", "#d9f1ff", 156, 354);
  cloud(ctx, 160 + ((t * 12) % 360), 230, 0.7);
  ctx.restore();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(296, 156, 8, 198);
  ctx.fillRect(166, 250, 268, 8);
  // picture + shelf
  ctx.fillStyle = "#8d6e63";
  roundRect(ctx, 820, 150, 180, 130, 10);
  ctx.fill();
  fillRectGradient(ctx, 834, 164, 152, 102);
  ctx.fillStyle = "#a1887f";
  ctx.fillRect(1020, 330, 200, 14);
  const books = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8"];
  books.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(1035 + i * 30, 262 + (i % 2) * 10, 24, 68 - (i % 2) * 10);
  });
  // rug
  ellipse(ctx, 640, 690, 420, 70, "#7e57c2");
  ellipse(ctx, 640, 690, 360, 52, "#9575cd");
  ellipse(ctx, 640, 690, 280, 36, "#b39ddb");
};

function cloud(ctx: Ctx, x: number, y: number, s: number) {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, 30 * s, 0, Math.PI * 2);
  ctx.arc(x + 34 * s, y - 14 * s, 36 * s, 0, Math.PI * 2);
  ctx.arc(x + 70 * s, y, 28 * s, 0, Math.PI * 2);
  ctx.fill();
}

function fillRectGradient(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "#81d4fa");
  g.addColorStop(1, "#c5e1a5");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  circle(ctx, x + w * 0.75, y + h * 0.3, 14, "#ffeb3b");
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.35, y + h * 0.45);
  ctx.lineTo(x + w * 0.65, y + h);
  ctx.fillStyle = "#66bb6a";
  ctx.fill();
}

const classroom: Painter = (ctx, t) => {
  room(ctx, "#dff3ea", "#c69563", "#a8784a");
  // bunting
  const colors = ["#ef5350", "#ffca28", "#66bb6a", "#42a5f5", "#ab47bc"];
  ctx.strokeStyle = "#8d6e63";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(L, 40);
  ctx.quadraticCurveTo(640, 90, R, 40);
  ctx.stroke();
  for (let i = 0; i < 18; i++) {
    const x = L + 40 + i * 85;
    const y = 40 + Math.sin((i / 17) * Math.PI) * 25;
    ctx.beginPath();
    ctx.moveTo(x - 22, y);
    ctx.lineTo(x + 22, y);
    ctx.lineTo(x, y + 40 + Math.sin(t * 2 + i) * 3);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
  }
  // chalkboard
  ctx.fillStyle = "#8d5a3b";
  roundRect(ctx, 280, 150, 720, 330, 16);
  ctx.fill();
  ctx.fillStyle = "#2e5e4e";
  ctx.fillRect(300, 170, 680, 290);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 54px Fredoka, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("A B C", 340, 260);
  ctx.fillText("1 + 2 = 3", 600, 400);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(420, 380, 40, 0, Math.PI * 2);
  ctx.stroke();
  // clock
  circle(ctx, 1130, 180, 60, "#ffffff");
  ctx.strokeStyle = "#455a64";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(1130, 180, 60, 0, Math.PI * 2);
  ctx.stroke();
  const hand = (angle: number, len: number, width: number) => {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(1130, 180);
    ctx.lineTo(1130 + Math.sin(angle) * len, 180 - Math.cos(angle) * len);
    ctx.stroke();
  };
  hand(t * 0.5, 44, 4);
  hand(t * 0.04 + 2, 30, 7);
  // desks
  ctx.fillStyle = "#e0a96d";
  ctx.fillRect(L + 40, 560, 200, 22);
  ctx.fillRect(R - 260, 560, 200, 22);
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(L + 60, 582, 14, 60);
  ctx.fillRect(L + 206, 582, 14, 60);
  ctx.fillRect(R - 240, 582, 14, 60);
  ctx.fillRect(R - 94, 582, 14, 60);
};

const lab: Painter = (ctx, t) => {
  room(ctx, "#e3e9ff", "#d7dce8", "#bcc3d6");
  // checkered floor overlay
  ctx.fillStyle = "rgba(120,130,170,0.18)";
  for (let y = 600, row = 0; y < B; y += 40, row++) {
    for (let x = L + (row % 2) * 40; x < R; x += 80) ctx.fillRect(x, y, 40, 40);
  }
  // shelves with flasks
  for (const sy of [230, 400]) {
    ctx.fillStyle = "#90a4ae";
    ctx.fillRect(100, sy, 380, 12);
    ctx.fillRect(820, sy, 380, 12);
  }
  const flask = (x: number, y: number, color: string, i: number) => {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 80);
    ctx.lineTo(x + 10, y - 80);
    ctx.lineTo(x + 10, y - 50);
    ctx.lineTo(x + 34, y);
    ctx.lineTo(x - 34, y);
    ctx.lineTo(x - 10, y - 50);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 22, y - 26);
    ctx.lineTo(x + 22, y - 26);
    ctx.lineTo(x + 34, y);
    ctx.lineTo(x - 34, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    for (let b = 0; b < 3; b++) {
      const p = (t * 0.6 + b / 3 + i * 0.13) % 1;
      circle(ctx, x - 6 + b * 6, y - 26 - p * 70, 4 * (1 - p) + 1, color);
    }
  };
  ["#ff5c8a", "#4dd0e1", "#9ccc65", "#ffb74d"].forEach((c, i) => flask(150 + i * 95, 230, c, i));
  ["#ba68c8", "#4fc3f7", "#ffd54f"].forEach((c, i) => flask(880 + i * 120, 230, c, i + 4));
  // atom poster
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 540, 120, 200, 200, 18);
  ctx.fill();
  ctx.strokeStyle = "#5c6bc0";
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(640, 220);
    ctx.rotate((i * Math.PI) / 3 + t * 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 80, 28, 0, 0, Math.PI * 2);
    ctx.stroke();
    circle(ctx, Math.cos(t * 2 + i) * 80, Math.sin(t * 2 + i) * 28, 8, "#ef5350");
    ctx.restore();
  }
  circle(ctx, 640, 220, 14, "#ffca28");
  // bench
  ctx.fillStyle = "#78909c";
  ctx.fillRect(L + 20, 520, 300, 24);
  ctx.fillRect(R - 320, 520, 300, 24);
};

const stage: Painter = (ctx, t) => {
  fillSky(ctx, "#231436", "#3d2459");
  // spotlights
  for (let i = 0; i < 3; i++) {
    const x = 640 + Math.sin(t * 0.6 + i * 2.1) * 360;
    const g = ctx.createRadialGradient(x, 560, 10, x, 560, 260);
    g.addColorStop(0, "rgba(255,240,180,0.45)");
    g.addColorStop(1, "rgba(255,240,180,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 30, T);
    ctx.lineTo(x + 30, T);
    ctx.lineTo(x + 240, 640);
    ctx.lineTo(x - 240, 640);
    ctx.fill();
  }
  // floor
  ctx.fillStyle = "#9c6233";
  ctx.fillRect(L, 600, R - L, B - 600);
  ctx.strokeStyle = "#7d4a22";
  ctx.lineWidth = 3;
  for (let x = L; x < R; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x - 40, B);
    ctx.stroke();
  }
  ctx.fillStyle = "#6d3b16";
  ctx.fillRect(L, 596, R - L, 10);
  // curtains
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const x = side < 0 ? L + i * 52 : R - (i + 1) * 52;
      const g = ctx.createLinearGradient(x, 0, x + 52, 0);
      g.addColorStop(0, "#9b1c31");
      g.addColorStop(0.5, "#d7263d");
      g.addColorStop(1, "#9b1c31");
      ctx.fillStyle = g;
      ctx.fillRect(x, T, 54, 700 + Math.sin(t + i) * 4);
    }
  }
  ctx.fillStyle = "#b71c1c";
  for (let x = L; x < R; x += 90) {
    ctx.beginPath();
    ctx.arc(x + 45, 40, 48, 0, Math.PI);
    ctx.fill();
  }
  ctx.fillRect(L, T, R - L, 40 - T);
  ctx.fillStyle = "#ffcc33";
  ctx.fillRect(L, 30, R - L, 8);
};

const PAINTERS: Record<Background, Painter> = {
  meadow,
  park,
  forest,
  jungle,
  farm,
  pond,
  beach,
  underwater,
  sky,
  space,
  night,
  desert,
  snow,
  mountains,
  rainy,
  city,
  home,
  classroom,
  lab,
  stage,
};

export function paintBackground(ctx: Ctx, background: Background, t: number) {
  ctx.save();
  (PAINTERS[background] ?? meadow)(ctx, t);
  ctx.restore();
}

export const STAGE = { W, H, L, R, T, B };
