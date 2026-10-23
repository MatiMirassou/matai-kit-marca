// Media pipeline: reads media.sources.json, transcodes originals (read-only) into
// public/media/<id>/ and writes src/generated/media.json.
//
//   node scripts/media.mjs                 build everything (skips unchanged assets)
//   node scripts/media.mjs --only a,b      build selected asset/montage ids
//   node scripts/media.mjs --force         rebuild even if unchanged
//   node scripts/media.mjs --sheets [--only a,b]   contact sheets only (.media-cache/sheets)
//
// ffmpeg/ffprobe are spawned with argument arrays (no shell), so paths with spaces
// or unicode are safe on Windows.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PIPELINE_VERSION = 3;
const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(projectDir, 'public', 'media');
const manifestPath = path.join(projectDir, 'src', 'generated', 'media.json');
const sheetDir = path.join(projectDir, '.media-cache', 'sheets');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const onlyArg = args[args.indexOf('--only') + 1];
const only = args.includes('--only') && onlyArg ? new Set(onlyArg.split(',')) : null;

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { shell: false, windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${cmd} exited ${code}\n${stderr.split('\n').slice(-12).join('\n')}`));
    });
  });
}

const ffmpeg = (a) => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a]);

async function probe(file) {
  const json = await run('ffprobe', [
    '-v', 'error', '-show_entries',
    'stream=codec_type,codec_name,width,height,pix_fmt,color_transfer,r_frame_rate:stream_side_data=rotation:format=duration',
    '-of', 'json', file,
  ]);
  const data = JSON.parse(json);
  const v = data.streams.find((s) => s.codec_type === 'video');
  if (!v) throw new Error(`No video/image stream in ${file}`);
  const rotation = Math.abs(Number(v.side_data_list?.[0]?.rotation ?? 0));
  const swap = rotation === 90 || rotation === 270;
  return {
    width: swap ? v.height : v.width,
    height: swap ? v.width : v.height,
    pixFmt: v.pix_fmt ?? '',
    transfer: v.color_transfer ?? '',
    duration: Number(data.format?.duration ?? 0),
    hasAudio: data.streams.some((s) => s.codec_type === 'audio'),
  };
}

const even = (n) => Math.max(2, Math.round(n / 2) * 2);
/** Fit (w,h) so the long edge is at most `long`. Never upscales. */
function fitLong(w, h, long) {
  const scale = Math.min(1, long / Math.max(w, h));
  return [even(w * scale), even(h * scale)];
}
function fitWidth(w, h, width) {
  const scale = Math.min(1, width / w);
  return [even(w * scale), even(h * scale)];
}
function aspectLabel(w, h) {
  const r = w / h;
  const known = [['9:16', 9 / 16], ['16:9', 16 / 9], ['1:1', 1], ['4:5', 4 / 5], ['5:7', 5 / 7], ['3:2', 3 / 2], ['2:3', 2 / 3], ['7:4', 7 / 4]];
  for (const [label, value] of known) if (Math.abs(r - value) < 0.02) return label;
  return `${w}:${h}`;
}

/** Scale filter; 10-bit sources are dithered down to 8-bit with zscale. */
function scaleFilter(info, w, h) {
  const tenBit = /10|12/.test(info.pixFmt);
  if (/smpte2084|arib-std-b67/.test(info.transfer)) {
    throw new Error('HDR source detected — add a tonemap step before using it.');
  }
  return tenBit
    ? `zscale=w=${w}:h=${h}:f=lanczos:d=error_diffusion,format=yuv420p`
    : `scale=${w}:${h}:flags=lanczos,format=yuv420p`;
}

const X264 = [
  '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-tune', 'film', '-x264-params', 'aq-mode=3', '-g', '48',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-movflags', '+faststart',
];

const rel = (id, file) => `media/${id}/${file}`;
const size = async (f) => (await stat(f)).size;
const hashOf = (obj) => createHash('sha1').update(JSON.stringify({ v: PIPELINE_VERSION, obj })).digest('hex');

async function upToDate(dir, hash, files) {
  if (flag('--force')) return false;
  const hashFile = path.join(dir, '.hash');
  if (!existsSync(hashFile)) return false;
  if ((await readFile(hashFile, 'utf8')).trim() !== hash) return false;
  return files.every((f) => existsSync(path.join(dir, f)));
}

async function buildAudio(asset, src, previous) {
  const dir = path.join(outRoot, asset.id);
  await mkdir(dir, { recursive: true });
  const hash = hashOf(asset);
  if (previous && await upToDate(dir, hash, ['full.mp3','poster.jpg','poster.webp'])) return previous;
  const duration = Number((await run('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',src])).trim());
  console.log('  > ' + asset.id + ': audio ' + duration.toFixed(1) + 's');
  await ffmpeg(['-i',src,'-vn','-c:a','libmp3lame','-b:a','128k',path.join(dir,'full.mp3')]);
  await ffmpeg(['-i',src,'-filter_complex','[0:a]aformat=channel_layouts=mono,showwavespic=s=1280x720:colors=0xF2B233:scale=sqrt:draw=full,format=rgb24[out]','-map','[out]','-frames:v','1','-q:v','2',path.join(dir,'poster.jpg')]);
  await ffmpeg(['-i',path.join(dir,'poster.jpg'),'-frames:v','1','-c:v','libwebp','-quality','85',path.join(dir,'poster.webp')]);
  await writeFile(path.join(dir,'.hash'),hash);
  return {kind:'audio',width:1280,height:720,aspect:'audio',duration:Math.round(duration*10)/10,hasAudio:true,poster:rel(asset.id,'poster.jpg'),posterWebp:rel(asset.id,'poster.webp'),full:rel(asset.id,'full.mp3'),bytes:{full:await size(path.join(dir,'full.mp3')),poster:await size(path.join(dir,'poster.jpg'))}};
}

async function buildVideo(asset, src, previous) {
  const dir = path.join(outRoot, asset.id);
  await mkdir(dir, { recursive: true });
  const info = await probe(src);
  const files = ['poster.jpg', 'poster.webp', 'loop.mp4', ...(asset.full ? ['full.mp4'] : [])];
  const hash = hashOf({ ...asset, stills: undefined }); // stills are hashed separately
  if (previous && (await upToDate(dir, hash, files))) {
    console.log(`  = ${asset.id} (unchanged)`);
    return previous;
  }

  const [fw, fh] = fitLong(info.width, info.height, 1280);
  const [lw, lh] = fitLong(info.width, info.height, 960);
  const posterAt = Math.min(asset.poster?.at ?? info.duration * 0.3, Math.max(0, info.duration - 0.1));
  const loopStart = Math.min(asset.loop?.start ?? info.duration * 0.2, Math.max(0, info.duration - 1));
  const loopDur = Math.min(asset.loop?.duration ?? 6, info.duration - loopStart);
  const fade = Math.min(0.35, loopDur / 6);

  console.log(`  > ${asset.id}: ${info.width}x${info.height} ${info.duration.toFixed(1)}s ${info.pixFmt}`);

  await ffmpeg([
    '-ss', String(posterAt), '-i', src, '-frames:v', '1',
    '-vf', `${scaleFilter(info, fw, fh)},format=yuvj444p`, '-q:v', '2', path.join(dir, 'poster.jpg'),
  ]);
  await ffmpeg([
    '-ss', String(posterAt), '-i', src, '-frames:v', '1',
    '-vf', scaleFilter(info, fw, fh), '-c:v', 'libwebp', '-quality', '80', path.join(dir, 'poster.webp'),
  ]);
  await ffmpeg([
    '-ss', String(loopStart), '-t', String(loopDur), '-i', src, '-an',
    '-vf', `${scaleFilter(info, lw, lh)},fade=t=in:st=0:d=${fade},fade=t=out:st=${(loopDur - fade).toFixed(3)}:d=${fade}`,
    ...X264, '-crf', '27', path.join(dir, 'loop.mp4'),
  ]);
  if (asset.full) {
    await ffmpeg([
      '-i', src, '-vf', scaleFilter(info, fw, fh), ...X264, '-crf', '23',
      ...(info.hasAudio ? ['-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '48000'] : ['-an']),
      path.join(dir, 'full.mp4'),
    ]);
  }
  await writeFile(path.join(dir, '.hash'), hash);

  const entry = {
    kind: 'video',
    width: fw,
    height: fh,
    aspect: aspectLabel(fw, fh),
    duration: Math.round(info.duration * 10) / 10,
    hasAudio: info.hasAudio,
    poster: rel(asset.id, 'poster.jpg'),
    posterWebp: rel(asset.id, 'poster.webp'),
    loop: rel(asset.id, 'loop.mp4'),
    bytes: { poster: await size(path.join(dir, 'poster.jpg')), loop: await size(path.join(dir, 'loop.mp4')) },
  };
  if (asset.full) {
    entry.full = rel(asset.id, 'full.mp4');
    entry.bytes.full = await size(path.join(dir, 'full.mp4'));
  }
  return entry;
}

/**
 * Extra still frames from a video (`"stills": [seconds, …]`), used to show more of
 * the actual work than a single poster. Hashed separately so changing stills
 * never re-encodes the video. Referenced in content as "<id>@<index>".
 */
async function buildStills(asset, src, entry) {
  const times = asset.stills ?? [];
  if (!times.length) {
    delete entry.stills;
    return entry;
  }
  const dir = path.join(outRoot, asset.id);
  const hash = hashOf({ stills: times });
  const files = times.flatMap((_, i) => [`still-${i}.jpg`, `still-${i}.webp`]);
  const hashFile = path.join(dir, '.stills-hash');
  const fresh = !flag('--force') && existsSync(hashFile) && (await readFile(hashFile, 'utf8')).trim() === hash && files.every((f) => existsSync(path.join(dir, f)));
  const info = await probe(src);
  const [w, h] = fitLong(info.width, info.height, 960);
  if (!fresh) {
    console.log(`  > ${asset.id}: ${times.length} stills`);
    for (const [i, t] of times.entries()) {
      const at = String(Math.min(t, Math.max(0, info.duration - 0.1)));
      await ffmpeg(['-ss', at, '-i', src, '-frames:v', '1', '-vf', `${scaleFilter(info, w, h)},format=yuvj444p`, '-q:v', '3', path.join(dir, `still-${i}.jpg`)]);
      await ffmpeg(['-ss', at, '-i', src, '-frames:v', '1', '-vf', scaleFilter(info, w, h), '-c:v', 'libwebp', '-quality', '78', path.join(dir, `still-${i}.webp`)]);
    }
    await writeFile(hashFile, hash);
  }
  entry.stills = times.map((_, i) => ({ poster: rel(asset.id, `still-${i}.jpg`), posterWebp: rel(asset.id, `still-${i}.webp`), width: w, height: h }));
  return entry;
}

async function buildImage(asset, src, previous) {
  const dir = path.join(outRoot, asset.id);
  await mkdir(dir, { recursive: true });
  const info = await probe(src);
  const hash = hashOf(asset);
  if (previous && (await upToDate(dir, hash, ['poster.jpg', 'poster.webp']))) {
    console.log(`  = ${asset.id} (unchanged)`);
    return previous;
  }
  const [w, h] = fitWidth(info.width, info.height, asset.width ?? 1400);
  const grain = asset.grain ? `,noise=alls=${asset.grain}:allf=u` : '';
  console.log(`  > ${asset.id}: ${info.width}x${info.height} -> ${w}x${h}`);
  await ffmpeg(['-i', src, '-frames:v', '1', '-vf', `scale=${w}:${h}:flags=lanczos${grain},format=yuvj444p`, '-q:v', '2', path.join(dir, 'poster.jpg')]);
  await ffmpeg(['-i', src, '-frames:v', '1', '-vf', `scale=${w}:${h}:flags=lanczos${grain}`, '-c:v', 'libwebp', '-quality', '82', path.join(dir, 'poster.webp')]);
  await writeFile(path.join(dir, '.hash'), hash);
  return {
    kind: 'image',
    width: w,
    height: h,
    aspect: aspectLabel(w, h),
    poster: rel(asset.id, 'poster.jpg'),
    posterWebp: rel(asset.id, 'poster.webp'),
    bytes: { poster: await size(path.join(dir, 'poster.jpg')) },
  };
}

async function buildMontage(montage, assetsById, root, previous) {
  const dir = path.join(outRoot, montage.id);
  await mkdir(dir, { recursive: true });
  const hash = hashOf(montage);
  if (previous && (await upToDate(dir, hash, ['loop.mp4', 'poster.jpg', 'poster.webp']))) {
    console.log(`  = ${montage.id} (unchanged)`);
    return previous;
  }
  const [W, H] = montage.size;
  const inputs = [];
  const chains = [];
  let total = 0;
  for (const [i, clip] of montage.clips.entries()) {
    const asset = assetsById.get(clip.asset);
    if (!asset) throw new Error(`Montage ${montage.id}: unknown asset ${clip.asset}`);
    const src = path.join(root, asset.src);
    const info = await probe(src);
    const tenBit = /10|12/.test(info.pixFmt);
    inputs.push('-ss', String(clip.start), '-t', String(clip.duration), '-i', src);
    const scale = tenBit
      ? `zscale=w=${W}:h=${H}:f=lanczos:d=error_diffusion`
      : `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}`;
    chains.push(`[${i}:v]${scale},setsar=1,fps=24,format=yuv420p,trim=duration=${clip.duration},setpts=PTS-STARTPTS[v${i}]`);
    total += clip.duration;
  }
  const n = montage.clips.length;
  const concat = `${montage.clips.map((_, i) => `[v${i}]`).join('')}concat=n=${n}:v=1:a=0,fade=t=in:st=0:d=0.3,fade=t=out:st=${(total - 0.3).toFixed(2)}:d=0.3[out]`;
  console.log(`  > ${montage.id}: ${n} clips, ${total}s`);
  await ffmpeg([...inputs, '-filter_complex', [...chains, concat].join(';'), '-map', '[out]', '-an', ...X264, '-crf', '26', path.join(dir, 'loop.mp4')]);
  await ffmpeg(['-ss', '0.6', '-i', path.join(dir, 'loop.mp4'), '-frames:v', '1', '-vf', 'format=yuvj444p', '-q:v', '2', path.join(dir, 'poster.jpg')]);
  await ffmpeg(['-ss', '0.6', '-i', path.join(dir, 'loop.mp4'), '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', path.join(dir, 'poster.webp')]);
  await writeFile(path.join(dir, '.hash'), hash);
  return {
    kind: 'video',
    width: W,
    height: H,
    aspect: aspectLabel(W, H),
    duration: total,
    hasAudio: false,
    poster: rel(montage.id, 'poster.jpg'),
    posterWebp: rel(montage.id, 'poster.webp'),
    loop: rel(montage.id, 'loop.mp4'),
    bytes: { poster: await size(path.join(dir, 'poster.jpg')), loop: await size(path.join(dir, 'loop.mp4')) },
  };
}

async function contactSheet(asset, src) {
  const info = await probe(src);
  const interval = Math.max(0.5, Math.round((info.duration / 40) * 2) / 2);
  const count = Math.max(1, Math.floor(info.duration / interval));
  const cols = 10;
  const rows = Math.ceil(count / cols);
  const tileScale = info.height > info.width ? 'scale=-2:220' : 'scale=260:-2';
  await mkdir(sheetDir, { recursive: true });
  const out = path.join(sheetDir, `${asset.id}.jpg`);
  await ffmpeg(['-i', src, '-vf', `fps=1/${interval},${tileScale},tile=${cols}x${rows}:padding=4:margin=4`, '-frames:v', '1', '-q:v', '4', out]);
  console.log(`  ${asset.id}: ${info.duration.toFixed(1)}s, one tile every ${interval}s (row-major, tile 0 = 0s) -> ${path.relative(projectDir, out)}`);
}

async function main() {
  const config = JSON.parse(await readFile(path.join(projectDir, 'media.sources.json'), 'utf8'));
  const root = config.root;
  const assetsById = new Map(config.assets.map((a) => [a.id, a]));
  const selected = (id) => !only || only.has(id);

  if (flag('--sheets')) {
    console.log('Contact sheets:');
    for (const asset of config.assets) {
      if (asset.type === 'video' && selected(asset.id)) await contactSheet(asset, path.join(root, asset.src));
    }
    return;
  }

  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};
  const failures = [];
  console.log('Building media:');
  for (const asset of config.assets) {
    if (!selected(asset.id)) continue;
    const src = path.join(root, asset.src);
    if (!existsSync(src)) {
      failures.push(`${asset.id}: source not found (${asset.src})`);
      continue;
    }
    try {
      manifest[asset.id] = asset.type === 'audio' ? await buildAudio(asset, src, manifest[asset.id]) : asset.type === 'video'
        ? await buildStills(asset, src, await buildVideo(asset, src, manifest[asset.id]))
        : await buildImage(asset, src, manifest[asset.id]);
    } catch (err) {
      failures.push(`${asset.id}: ${err.message}`);
    }
  }
  for (const montage of config.montages ?? []) {
    if (!selected(montage.id)) continue;
    try {
      manifest[montage.id] = await buildMontage(montage, assetsById, root, manifest[montage.id]);
    } catch (err) {
      failures.push(`${montage.id}: ${err.message}`);
    }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);

  const totalBytes = Object.values(sorted).reduce((sum, e) => sum + Object.values(e.bytes ?? {}).reduce((a, b) => a + b, 0), 0);
  console.log(`\nManifest: ${Object.keys(sorted).length} entries, ${(totalBytes / 1e6).toFixed(1)} MB in public/media`);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):\n- ${failures.join('\n- ')}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
