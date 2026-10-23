// Shared helpers for QA and PDF export: an in-process Vite preview server
// (serving dist/) and a Playwright browser driving the installed Edge/Chrome.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-core';

export const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function startPreview() {
  if (!existsSync(path.join(projectDir, 'dist', 'index.html'))) {
    throw new Error('dist/ not found — run `npm run build` first.');
  }
  const server = await preview({
    root: projectDir,
    configFile: path.join(projectDir, 'vite.config.ts'),
    preview: { port: 4180, strictPort: false, open: false },
    logLevel: 'error',
  });
  const url = server.resolvedUrls?.local?.[0];
  if (!url) throw new Error('Preview server did not report a URL');
  return { url: url.replace(/\/$/, ''), close: () => new Promise((r) => server.httpServer.close(() => r())) };
}

export async function launchBrowser() {
  const errors = [];
  for (const channel of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (err) {
      errors.push(`${channel}: ${err.message.split('\n')[0]}`);
    }
  }
  throw new Error(`No Chromium-based browser found (Edge or Chrome is required).\n${errors.join('\n')}`);
}

/** Collect console errors and failed requests for a page. */
export function watchPage(page) {
  const problems = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText ?? '';
    // Media requests aborted by the player (range requests / pause) are normal.
    if (/ERR_ABORTED/.test(failure) && /\.(mp4|webm)(\?|$)/.test(req.url())) return;
    problems.push(`requestfailed: ${req.url()} ${failure}`);
  });
  return problems;
}

/** Wait until the deck signals print readiness (fonts + images decoded). */
export async function waitForPrintReady(page, timeout = 30000) {
  await page.waitForFunction(() => window.__PRINT_READY__ === true, null, { timeout });
}
