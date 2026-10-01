/** Emoji are pre-rendered once per size so animated scaling/rotation stays cheap and crisp. */

export const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif';
export const TEXT_FONT = 'Fredoka, "Baloo 2", "Trebuchet MS", system-ui, sans-serif';

const cache = new Map<string, HTMLCanvasElement>();

export interface Sprite {
  canvas: HTMLCanvasElement;
  /** Logical size the sprite should be drawn at (the canvas may be higher-res). */
  size: number;
}

export function emojiSprite(emoji: string, size: number, pixelRatio: number): Sprite {
  const res = Math.min(4, Math.max(1, pixelRatio));
  const px = Math.round(size * res);
  const key = `${emoji}|${px}`;
  let canvas = cache.get(key);
  if (!canvas) {
    canvas = document.createElement("canvas");
    const box = Math.ceil(px * 1.3);
    canvas.width = box;
    canvas.height = box;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${px}px ${EMOJI_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, box / 2, box / 2 + px * 0.06);
    if (cache.size > 400) cache.clear();
    cache.set(key, canvas);
  }
  return { canvas, size: size * 1.3 };
}

/** Draws an emoji centered on (x, y) at `size` logical pixels. */
export function drawEmoji(ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number, size: number, pixelRatio: number) {
  const sprite = emojiSprite(emoji, size, pixelRatio);
  ctx.drawImage(sprite.canvas, x - sprite.size / 2, y - sprite.size / 2, sprite.size, sprite.size);
}

export function clearSpriteCache() {
  cache.clear();
}
