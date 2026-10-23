// Visual + layout QA.
//   node scripts/qa.mjs                 all checks (requires `npm run build`)
//   node scripts/qa.mjs --only desktop  screenshots for one viewport (desktop | laptop | mobile)
//   node scripts/qa.mjs --slides a,b    limit screenshots to slide ids
//   node scripts/qa.mjs --no-shots      only the print overflow + console checks
//
// Output: qa/screens/<viewport>/NN-<slide>.png, plus a summary on stdout.
// Exit code 1 if any slide overflows its 1280×720 print page or the console logs errors.
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser, projectDir, startPreview, waitForPrintReady, watchPage } from './lib/browser.mjs';

const args = process.argv.slice(2);
const argValue = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const onlyViewport = argValue('--only');
const onlySlides = argValue('--slides')?.split(',');
const deck = argValue('--deck') ?? 'full';
const shots = !args.includes('--no-shots');

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 810 },
  { id: 'laptop', width: 1024, height: 768 },
  { id: 'mobile', width: 390, height: 844, hasTouch: true, deviceScaleFactor: 1 },
];

const outDir = path.join(projectDir, 'qa', 'screens');
const failures = [];

async function printOverflow(browser, base) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const problems = watchPage(page);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await page.goto(`${base}/${deck === 'brand' ? 'brand.html?print=1' : `?print=1&deck=${deck}`}`, { waitUntil: 'load' });
  await waitForPrintReady(page);
  const report = await page.evaluate(() => {
    const out = [];
    for (const frame of document.querySelectorAll('.frame')) {
      const id = frame.getAttribute('data-slide');
      const stage = frame.querySelector('.stage');
      const box = stage.getBoundingClientRect();
      const issues = [];
      if (stage.scrollHeight > stage.clientHeight + 1) issues.push(`stage scrollHeight ${stage.scrollHeight} > ${stage.clientHeight}`);
      for (const el of stage.querySelectorAll('*')) {
        if (el.closest('[data-bleed]') || el.closest('svg')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        const out_ = r.right > box.right + 1.5 || r.bottom > box.bottom + 1.5 || r.left < box.left - 1.5 || r.top < box.top - 1.5;
        if (out_) {
          const label = `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')} "${(el.textContent || '').trim().slice(0, 40)}"`;
          issues.push(`${label} → ${Math.round(r.left - box.left)},${Math.round(r.top - box.top)} ${Math.round(r.width)}×${Math.round(r.height)}`);
          if (issues.length > 6) break;
        }
      }
      // Text that overflows its own box (clipped headlines etc.)
      for (const el of stage.querySelectorAll('h1,h2,h3,p,li,dd')) {
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') issues.push(`clipped text: ${el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
      }
      const safe = stage.querySelector(':scope > .safe');
      if (safe) {
        const sb = safe.getBoundingClientRect();
        if (safe.scrollHeight > safe.clientHeight + 1) issues.push(`.safe content height ${safe.scrollHeight} > ${safe.clientHeight}`);
        for (const el of safe.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.height && r.bottom > sb.bottom + 1.5) {
            issues.push(`below safe area: ${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 40)}" (+${Math.round(r.bottom - sb.bottom)}px)`);
            break;
          }
        }
      }
      const placeholders = frame.querySelectorAll('[data-placeholder]').length;
      out.push({ id, issues, placeholders });
    }
    return out;
  });
  await page.close();
  return { report, problems };
}

async function screenshots(browser, base, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor ?? 1,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.hasTouch ?? false,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const problems = watchPage(page);
  await page.goto(`${base}/?motion=off&deck=${deck}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // Fixed on-screen chrome is not part of a slide; keep it out of stitched element screenshots.
  await page.addStyleTag({ content: '.skip-link, .no-print { display: none !important; }' });
  const ids = await page.$$eval('.frame', (els) => els.map((e) => e.getAttribute('data-slide')));
  const dir = path.join(outDir, vp.id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  for (const [i, id] of ids.entries()) {
    if (onlySlides && !onlySlides.includes(id)) continue;
    if (process.env.QA_DEBUG) console.log('  ->', id);
    const el = page.locator(`[data-slide="${id}"]`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    // Wait for nearby images that are loading; never await lazy images that have not started (decode() would hang).
    await page.evaluate(() => Promise.all([...document.images].filter((img) => img.currentSrc && !img.complete && img.getBoundingClientRect().top < innerHeight * 2).map((img) => Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 2500))]))));
    const file = path.join(dir, `${String(i + 1).padStart(2, '0')}-${id.replace(/\//g, '_')}.png`);
    await el.screenshot({ path: file, animations: 'disabled', timeout: 20000 });
    process.stdout.write('.');
  }
  await context.close();
  return { count: ids.length, problems };
}

async function main() {
  const server = await startPreview();
  const browser = await launchBrowser();
  try {
    console.log(`QA against ${server.url} (deck=${deck}) using ${browser.version()}`);

    const { report, problems } = await printOverflow(browser, server.url);
    const overflow = report.filter((r) => r.issues.length);
    console.log(`\nPrint layout: ${report.length} pages, ${overflow.length} with overflow`);
    for (const r of overflow) {
      console.log(`  ✗ ${r.id}`);
      for (const i of r.issues) console.log(`      ${i}`);
      failures.push(`overflow: ${r.id}`);
    }
    const ph = report.reduce((n, r) => n + r.placeholders, 0);
    console.log(`  Placeholders rendered in print: ${ph} (${report.filter((r) => r.placeholders).map((r) => r.id).join(', ') || '—'})`);
    if (problems.length) {
      console.log('  Console / network problems (print):');
      for (const p of problems) console.log(`    ${p}`);
      failures.push(...problems);
    }

    if (shots) {
      for (const vp of VIEWPORTS) {
        if (onlyViewport && vp.id !== onlyViewport) continue;
        const res = await screenshots(browser, server.url, vp);
        console.log(`\nScreenshots ${vp.id} ${vp.width}×${vp.height}: ${res.count} slides → qa/screens/${vp.id}/`);
        if (res.problems.length) {
          for (const p of res.problems) console.log(`    ${p}`);
          failures.push(...res.problems.map((p) => `${vp.id}: ${p}`));
        }
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
  if (failures.length) {
    console.log(`\nQA finished with ${failures.length} problem(s).`);
    process.exitCode = 1;
  } else {
    console.log('\nQA passed.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
