// Interaction smoke test against the production build (npm run build first).
//   node scripts/smoke.mjs
// Checks keyboard navigation, present mode, lightbox + focus return, portfolio
// filters, system tabs, the impact simulator, deck variants, ?for=, ?play=,
// reduced motion (no autoplay) and that loops do autoplay when motion is allowed.
import { launchBrowser, startPreview, watchPage } from './lib/browser.mjs';

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

async function main() {
  const server = await startPreview();
  const browser = await launchBrowser();
  const base = server.url;
  try {
    /* Keyboard + present mode (motion off so scrolling is instant) */
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const problems = watchPage(page);
      await page.goto(`${base}/en/presentation/?motion=off`, { waitUntil: 'load' });
      // The static entry shell loads before React installs deck keyboard handlers.
      // #cover is written by the mounted provider, after child effects run.
      await page.waitForFunction(() => location.hash === '#cover');
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('PageDown');
        await page.waitForFunction(expected=>location.hash===expected,['#offer','#series','#vertical'][i]);
      }
      check('PageDown ×3 reaches slide 4', (await page.evaluate(() => location.hash)) === '#vertical', await page.evaluate(() => location.hash));
      await page.keyboard.press('End');
      await page.waitForTimeout(250);
      check('End jumps to last slide', (await page.evaluate(() => location.hash)) === '#contact');
      await page.keyboard.press('Home');
      await page.waitForTimeout(250);

      await page.keyboard.press('p');
      await page.waitForTimeout(300);
      check('P enters present mode', (await page.evaluate(() => document.documentElement.dataset.mode)) === 'present');
      check('Present mode renders one slide', (await page.locator('.frame').count()) === 1);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(600);
      check('ArrowRight advances in present mode', (await page.evaluate(() => location.hash)) === '#offer');
      await page.keyboard.press('n');
      await page.waitForTimeout(150);
      check('N shows speaker notes', (await page.locator('aside[aria-label="Notes"]').count()) === 1);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      check('Escape returns to read mode', (await page.evaluate(() => document.documentElement.dataset.mode)) === 'read');

      /* Index dialog */
      await page.keyboard.press('i');
      await page.waitForTimeout(150);
      check('I opens the slide index', await page.evaluate(() => !!document.querySelector('dialog[open]')));
      await page.keyboard.press('Escape');
      await page.waitForTimeout(150);

      /* Lightbox */
      await page.goto(`${base}/en/presentation/?motion=off#series`, { waitUntil: 'load' });
      await page.waitForTimeout(400);
      const card = page.locator('[data-slide="series"] button[aria-label^="Play"]').first();
      await card.click();
      await page.waitForTimeout(400);
      const src = await page.evaluate(() => document.querySelector('dialog[open] video')?.getAttribute('src') ?? '');
      check('Series card opens lightbox with full episode', src.endsWith('full.mp4'), src);
      check('Lightbox offers episode switcher', (await page.locator('dialog[open] [role="group"] button').count()) === 2);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const focusBack = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? '');
      check('Escape closes lightbox and returns focus', !(await page.evaluate(() => !!document.querySelector('dialog[open]'))) && focusBack.startsWith('Play'), focusBack);

      /* Ads: spot opens in the lightbox */
      await page.goto(`${base}/en/presentation/?motion=off#ads`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      await page.locator('[data-slide="ads"] button[aria-label="Play Street interview"]').click();
      await page.waitForTimeout(400);
      const adSrc = await page.evaluate(() => document.querySelector('dialog[open] video')?.getAttribute('src') ?? '');
      check('Ad tile opens the full spot', adSrc.includes('lingopie-ugc/full.mp4'), adSrc);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);

      /* Series frames are real stills */
      await page.goto(`${base}/en/presentation/?motion=off#series`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      const posters = await page.locator('[data-slide="series"] .series-poster img').count();
      check('Series slide shows all four completed projects', posters === 4, `${posters} project posters`);

      /* System tabs */
      await page.goto(`${base}/en/presentation/?motion=off#systems`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      const ids = await page.locator('[role="tab"]').evaluateAll((els) => els.map((e) => e.id));
      const startId = await page.locator('[role="tab"][aria-selected="true"]').getAttribute('id');
      const beforeWorkflow = await page.locator('#system-panel').innerText();
      await page.locator('[role="tab"][aria-selected="true"]').focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      const nextId = await page.locator('[role="tab"][aria-selected="true"]').getAttribute('id');
      check('Arrow keys move between system tabs', ids.indexOf(nextId) === (ids.indexOf(startId) + 1) % ids.length, `${startId} → ${nextId}`);
      check('Workflow selector changes the nodes and labels', beforeWorkflow !== await page.locator('#system-panel').innerText());
      check('One workflow visible at a time', (await page.locator('#system-panel').count()) === 1 && (await page.locator('[data-slide="systems"] .edge-flow').count()) > 0);
      check('Arrow keys on tabs do not change slide', (await page.evaluate(() => location.hash)) === '#systems');


      check('No console errors (read/present)', problems.length === 0, problems.join(' | '));
      await ctx.close();
    }

    /* Variants, personalisation, deep link */
    {
      const page = await browser.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: 'reduce' });
      await page.goto(`${base}/?for=Acme%20Studios&motion=off`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      check('Deck renders 12 slides', (await page.locator('.frame').count()) === 12);
      check('?for= personalises cover and title', (await page.locator('text=Prepared for Acme Studios').count()) > 0 && (await page.title()).includes('Acme Studios'), await page.title());
      await page.goto(`${base}/?for=%3Cscript%3Ealert(1)%3C%2Fscript%3E&motion=off`, { waitUntil: 'load' });
      check('?for= is rendered as plain text', (await page.locator('script:has-text("alert(1)")').count()) === 0);
      await page.goto(`${base}/?play=forgotten-fortune&motion=off`, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      check('?play=<project> opens the lightbox', await page.evaluate(() => !!document.querySelector('dialog[open] video')));
      await page.goto(`${base}/brand.html?motion=off`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      check('brand.html renders the 6-page brand guide', (await page.locator('.frame').count()) === 6 && (await page.title()).includes('Visual identity'));
      await page.close();
    }

    /* Motion: reduced → no autoplay; allowed → cover loops play */
    {
      const reduced = await browser.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: 'reduce' });
      await reduced.goto(`${base}/en/presentation/`, { waitUntil: 'load' });
      await reduced.waitForTimeout(1500);
      const playingReduced = await reduced.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length);
      check('prefers-reduced-motion: no video autoplays', playingReduced === 0, `${playingReduced} playing`);
      await reduced.close();

      const motion = await browser.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: 'no-preference' });
      await motion.goto(`${base}/en/presentation/?motion=on`, { waitUntil: 'load' });
      await motion.waitForTimeout(2500);
      const playing = await motion.evaluate(() => [...document.querySelectorAll('video')].filter((v) => !v.paused).length);
      check('Motion allowed: cover loops autoplay (muted)', playing >= 1, `${playing} playing`);
      await motion.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
