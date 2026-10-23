// PDF export — renders the deck's print layout (one 1280×720 slide per page)
// with the installed Edge/Chrome and saves a vector PDF (live text, embedded fonts).
//
//   npm run build && node scripts/export-pdf.mjs                 full deck
//   node scripts/export-pdf.mjs --deck short                     one variant
//   node scripts/export-pdf.mjs --brand                          the visual brand guide
//   node scripts/export-pdf.mjs --all                            deck + brand guide
//   node scripts/export-pdf.mjs --for "Acme Studios"             personalised cover
//   node scripts/export-pdf.mjs --final                          refuse if placeholders remain
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import { launchBrowser, projectDir, startPreview, waitForPrintReady, watchPage } from './lib/browser.mjs';

const args = process.argv.slice(2);
const argValue = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const final = args.includes('--final');
const forCompany = argValue('--for');
const SIZE_BUDGET = 10 * 1024 * 1024;

async function variantIds() {
  const src = await readFile(path.join(projectDir, 'src', 'content', 'en', 'deck.ts'), 'utf8');
  const block = src.slice(src.indexOf('export const variants'), src.indexOf('export const brandSlides'));
  return [...block.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
}

function countPages(buffer) {
  const text = buffer.toString('latin1');
  return (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
}

async function exportDeck(browser, base, deck) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const problems = watchPage(page);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  const brand = deck === 'brand';
  const q = new URLSearchParams(brand ? { print: '1' } : { print: '1', deck });
  if (forCompany && !brand) q.set('for', forCompany);
  await page.goto(`${base}/${brand ? 'brand.html' : ''}?${q}`, { waitUntil: 'networkidle' });
  await waitForPrintReady(page);
  // Make sure every face used by the deck is loaded, not just the ones seen first.
  await page.evaluate(async () => {
    const faces = ['800 72px "Archivo Variable"', '640 40px "Archivo Variable"', '400 16px "Archivo Variable"', 'italic 400 24px "Newsreader"', '400 11px "IBM Plex Mono"', '500 11px "IBM Plex Mono"'];
    await Promise.all(faces.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  });

  const info = await page.evaluate(() => ({
    slides: document.querySelectorAll('.frame').length,
    placeholders: [...document.querySelectorAll('[data-placeholder]')].map((el) => `${el.closest('.frame')?.getAttribute('data-slide')}: ${el.getAttribute('data-placeholder')}`),
    title: document.title,
  }));
  if (final && info.placeholders.length) {
    await page.close();
    throw new Error(`--final: ${info.placeholders.length} placeholder(s) still rendered:\n  ${info.placeholders.join('\n  ')}`);
  }
  if (problems.length) {
    await page.close();
    throw new Error(`Console/network problems while rendering:\n  ${problems.join('\n  ')}`);
  }

  const date = process.env.MATAI_EXPORT_DATE ?? new Date().toISOString().slice(0, 10);
  const slug = forCompany ? `-for-${forCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '';
  const name = brand ? 'Mat.AI-Brand-Guide' : deck === 'full' ? 'Mat.AI-Capabilities' : `Mat.AI-Capabilities-${deck}`;
  const portable = !brand && args.includes('--portable');
  const exportDir = portable ? path.join(projectDir,'exports','Mat.AI-Capabilities-'+date+'-Portable') : path.join(projectDir,'exports');
  const file = path.join(exportDir, `${name}${slug}-${date}.pdf`);
  await mkdir(path.dirname(file), { recursive: true });
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
  await writeFile(file, pdf);
  if(portable){
    const result=spawnSync(process.env.MATAI_PYTHON??'python',[path.join(projectDir,'scripts','portable-pdf-links.py'),file,base],{stdio:'inherit',windowsHide:true});
    if(result.status!==0)throw new Error('Portable PDF link validation failed. Set MATAI_PYTHON to a Python environment with pypdf.');
  }
  await page.close();

  const pages = countPages(pdf);
  const bytes = (await stat(file)).size;
  const notes = [];
  if (pages && pages !== info.slides) notes.push(`PAGE COUNT MISMATCH: ${pages} pages vs ${info.slides} slides`);
  if (bytes > SIZE_BUDGET) notes.push(`over size budget (${(bytes / 1e6).toFixed(1)} MB > 10 MB)`);
  return { file, pages, slides: info.slides, bytes, placeholders: info.placeholders.length, notes };
}

async function main() {
  const decks = args.includes('--all') ? [...(await variantIds()), 'brand'] : args.includes('--brand') ? ['brand'] : [argValue('--deck') ?? 'full'];
  const server = await startPreview();
  const browser = await launchBrowser();
  let failed = false;
  try {
    for (const deck of decks) {
      try {
        const r = await exportDeck(browser, server.url, deck);
        console.log(`✓ ${path.relative(projectDir, r.file)} — ${r.pages || '?'} pages / ${r.slides} slides, ${(r.bytes / 1e6).toFixed(2)} MB, ${r.placeholders} placeholder(s)`);
        for (const n of r.notes) {
          console.log(`  ! ${n}`);
          if (n.startsWith('PAGE COUNT')) failed = true;
        }
      } catch (err) {
        failed = true;
        console.error(`✗ ${deck}: ${err.message}`);
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
