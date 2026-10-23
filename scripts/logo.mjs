// Vectorises the original Mat.AI logo (Logo/Mat.AI Cinematic Brand Identity.png)
// into per-colour SVG paths, so the deck uses the real logo — and can recolour it
// for dark backgrounds — instead of a redraw.
//
//   node scripts/logo.mjs        → src/assets/logo.json
//
// Pipeline: ffmpeg crops + upscales each variant and splits it into colour masks
// (ink / saffron / signal red); potrace traces each mask to a path.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import potrace from 'potrace';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.resolve(projectDir, '..', 'Logo', 'Mat.AI Cinematic Brand Identity.png');
const tmp = path.join(projectDir, '.media-cache', 'logo');
const SCALE = 3;

// Crop boxes in source pixels (x, y, w, h).
const VARIANTS = {
  framed: [92, 168, 1264, 456],   // logo inside the viewfinder brackets
  full: [148, 258, 1154, 290],    // Mat.AI wordmark with monogram
  mark: [148, 258, 386, 290],     // film-strip M only
};

// Colour masks (pixel → black when it belongs to the layer).
const MASKS = {
  ink: 'lt(r(X,Y),110)*lt(g(X,Y),110)*lt(b(X,Y),110)',
  saffron: 'gt(r(X,Y),195)*gt(g(X,Y),125)*lt(g(X,Y),215)*lt(b(X,Y),120)',
  red: 'gt(r(X,Y),120)*lt(g(X,Y),95)*lt(b(X,Y),95)*gt(r(X,Y)-g(X,Y),60)',
};

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { windowsHide: true });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err))));
  });
}

function trace(file) {
  return new Promise((resolve, reject) => {
    const t = new potrace.Potrace({ threshold: 128, turdSize: 40, optCurve: true, optTolerance: 0.35, blackOnWhite: true });
    t.loadImage(file, (err) => {
      if (err) return reject(err);
      const tag = t.getPathTag();
      const d = /d="([^"]*)"/.exec(tag)?.[1] ?? '';
      resolve(d.trim());
    });
  });
}

async function main() {
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });
  const out = {};
  for (const [name, [x, y, w, h]] of Object.entries(VARIANTS)) {
    const W = w * SCALE;
    const H = h * SCALE;
    out[name] = { width: W, height: H };
    for (const [layer, expr] of Object.entries(MASKS)) {
      const file = path.join(tmp, `${name}-${layer}.png`);
      const e = `if(${expr},0,255)`;
      await ffmpeg([
        '-i', SOURCE,
        '-vf', `crop=${w}:${h}:${x}:${y},scale=${W}:${H}:flags=lanczos,format=gbrp,geq=r='${e}':g='${e}':b='${e}',format=gray`,
        '-frames:v', '1', file,
      ]);
      out[name][layer] = await trace(file);
    }
    const sizes = Object.entries(out[name]).filter(([k]) => k in MASKS).map(([k, v]) => `${k} ${(v.length / 1024).toFixed(1)}KB`);
    console.log(`  ${name}: ${W}×${H} — ${sizes.join(', ')}`);
  }
  const target = path.join(projectDir, 'src', 'assets', 'logo.json');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(out)}\n`);
  console.log(`→ ${path.relative(projectDir, target)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
