import type { Action } from "../../shared/types";

/** Per-frame offsets that bring an emoji actor to life. */
export interface Pose {
  dx: number;
  dy: number;
  rot: number;
  sx: number;
  sy: number;
  /** Rotate around the feet (bottom) or the middle (center). */
  pivot: "bottom" | "center";
  /** Mirror horizontally (emoji mostly face left, so moving right flips them). */
  flip: boolean;
  /** Height above the ground, used to shrink the shadow. */
  lift: number;
  overlay?: "zzz" | "think" | "sparkle";
}

const base = (): Pose => ({ dx: 0, dy: 0, rot: 0, sx: 1, sy: 1, pivot: "bottom", flip: false, lift: 0 });

function squash(pose: Pose, amount: number) {
  pose.sy *= 1 - 0.14 * amount;
  pose.sx *= 1 + 0.12 * amount;
}

/** `t` is a looping clock in seconds; `phase` desynchronizes actors. `floaty` = underwater/sky/space. */
export function actionPose(action: Action, t: number, phase: number, floaty: boolean): Pose {
  const p = base();
  const time = t + phase;
  switch (action) {
    case "idle": {
      p.sy = 1 + 0.03 * Math.sin(time * 2.2);
      p.sx = 1 - 0.015 * Math.sin(time * 2.2);
      break;
    }
    case "bounce": {
      const h = Math.abs(Math.sin(time * 3.2));
      p.dy = -h * 38;
      p.lift = h * 38;
      if (h < 0.18) squash(p, (0.18 - h) / 0.18);
      break;
    }
    case "walk": {
      p.dx = Math.sin(time * 0.6) * 110;
      p.flip = Math.cos(time * 0.6) > 0;
      p.dy = -Math.abs(Math.sin(time * 6)) * 10;
      p.rot = Math.sin(time * 6) * 0.05;
      break;
    }
    case "run": {
      p.dx = Math.sin(time * 1.1) * 160;
      p.flip = Math.cos(time * 1.1) > 0;
      p.dy = -Math.abs(Math.sin(time * 10)) * 16;
      p.rot = Math.sin(time * 10) * 0.08 + (p.flip ? 0.06 : -0.06);
      break;
    }
    case "fly": {
      const lift = (floaty ? 40 : 170) + Math.sin(time * 2) * 28;
      p.dy = -lift;
      p.lift = lift;
      p.dx = Math.sin(time * 0.7) * 90;
      p.flip = Math.cos(time * 0.7) > 0;
      p.rot = Math.sin(time * 2) * 0.08;
      break;
    }
    case "swim": {
      p.dx = Math.sin(time * 0.8) * 130;
      p.dy = Math.sin(time * 2.4) * 16 - (floaty ? 0 : 6);
      p.rot = Math.cos(time * 2.4) * 0.1;
      p.flip = Math.cos(time * 0.8) > 0;
      break;
    }
    case "spin": {
      p.rot = time * 3.2;
      p.pivot = "center";
      p.dy = -10;
      p.lift = 10;
      break;
    }
    case "wiggle": {
      p.rot = Math.sin(time * 14) * 0.12;
      break;
    }
    case "jump": {
      const cycle = (time % 1.3) / 1.3;
      if (cycle < 0.6) {
        const h = Math.sin((Math.PI * cycle) / 0.6);
        p.dy = -h * 110;
        p.lift = h * 110;
        p.sy = 1.06;
        p.sx = 0.95;
      } else if (cycle < 0.75) {
        squash(p, 1 - Math.abs(cycle - 0.675) / 0.075);
      }
      break;
    }
    case "grow": {
      const s = 1 + 0.14 * (0.5 + 0.5 * Math.sin(time * 2.6));
      p.sx = s;
      p.sy = s;
      break;
    }
    case "sleep": {
      p.sy = 1 + 0.035 * Math.sin(time * 1.2);
      p.rot = -0.12;
      p.overlay = "zzz";
      break;
    }
    case "wave": {
      p.rot = Math.sin(time * 5) * 0.18;
      p.dy = -Math.abs(Math.sin(time * 5)) * 4;
      break;
    }
    case "dance": {
      p.rot = Math.sin(time * 4.4) * 0.2;
      p.dy = -Math.abs(Math.sin(time * 4.4)) * 26;
      p.lift = -p.dy;
      p.dx = Math.sin(time * 2.2) * 24;
      p.flip = Math.sin(time * 1.1) > 0;
      break;
    }
    case "shiver": {
      p.dx = Math.sin(time * 55) * 3.2;
      p.sy = 1 + 0.02 * Math.sin(time * 40);
      break;
    }
    case "think": {
      p.rot = 0.1 + Math.sin(time * 1.5) * 0.04;
      p.overlay = "think";
      break;
    }
    case "cheer": {
      const cycle = (time % 0.9) / 0.9;
      const h = cycle < 0.7 ? Math.sin((Math.PI * cycle) / 0.7) : 0;
      p.dy = -h * 70;
      p.lift = h * 70;
      p.rot = Math.sin(time * 7) * 0.1;
      p.overlay = "sparkle";
      break;
    }
  }
  if (floaty && action !== "fly") {
    p.dy += Math.sin(time * 1.6) * 14;
    p.rot += Math.sin(time * 1.1) * 0.04;
  }
  return p;
}

export const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBounce = (x: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
