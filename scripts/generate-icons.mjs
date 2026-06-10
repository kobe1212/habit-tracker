// Generates the Habit Tracker PWA icon set from the "Progress Dial" design.
// Run: node scripts/generate-icons.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

const BG = "#0b1220";
const BORDER = "#1e3a5f";
const INACTIVE = "#1e3a5f";
const CHECK = "#bae6fd";
const START = [0x25, 0x63, 0xeb]; // blue
const END = [0x22, 0xd3, 0xee]; // cyan
const TICKS = 36;
const ACTIVE = 25;

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const tickColor = (i) => {
  const t = ACTIVE <= 1 ? 1 : i / (ACTIVE - 1);
  const [r, g, b] = [0, 1, 2].map((k) => lerp(START[k], END[k], t));
  return `rgb(${r},${g},${b})`;
};

function buildSVG(size, { rounded }) {
  const c = size / 2;
  const f = size / 120; // design was authored on a 120 unit canvas
  const rOut = 150 * (size / 512);
  const rIn = 112 * (size / 512);
  const tickW = 13 * (size / 512);
  const rx = rounded ? size * 0.234 : 0;

  let ticks = "";
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * 2 * Math.PI - Math.PI / 2;
    const x1 = (c + Math.cos(a) * rOut).toFixed(2);
    const y1 = (c + Math.sin(a) * rOut).toFixed(2);
    const x2 = (c + Math.cos(a) * rIn).toFixed(2);
    const y2 = (c + Math.sin(a) * rIn).toFixed(2);
    const color = i < ACTIVE ? tickColor(i) : INACTIVE;
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${tickW.toFixed(2)}" stroke-linecap="round"/>`;
  }

  const p = (px, py) => `${(c + px * f).toFixed(1)} ${(c + py * f).toFixed(1)}`;
  const check = `<path d="M${p(-13, 2)} L${p(-4, 12)} L${p(14, -11)}" fill="none" stroke="${CHECK}" stroke-width="${(6 * f).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const border = rounded
    ? `<rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" rx="${(rx - 0.5).toFixed(1)}" fill="none" stroke="${BORDER}" stroke-width="1"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${rx.toFixed(1)}" fill="${BG}"/>${border}${ticks}${check}</svg>`;
}

async function png(name, size, opts) {
  const svg = buildSVG(size, opts);
  await sharp(Buffer.from(svg)).png().toFile(resolve(publicDir, name));
  console.log("wrote", name);
}

// Favicon (scalable, rounded) authored on the 120 canvas for crispness.
writeFileSync(resolve(publicDir, "favicon.svg"), buildSVG(120, { rounded: true }));
console.log("wrote favicon.svg");

await png("pwa-192x192.png", 192, { rounded: true });
await png("pwa-512x512.png", 512, { rounded: true });
await png("maskable-512x512.png", 512, { rounded: false });
await png("apple-touch-icon.png", 180, { rounded: false });
