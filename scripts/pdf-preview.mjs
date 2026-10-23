// Rasterise an exported PDF to PNG pages (via pdf.js in headless Edge/Chrome)
// so the actual PDF — not the HTML — can be reviewed page by page.
//
//   node scripts/pdf-preview.mjs                      newest PDF in exports/
//   node scripts/pdf-preview.mjs exports/file.pdf     a specific file
//   node scripts/pdf-preview.mjs --scale 1.5          render scale (default 1)
//
// Output: qa/pdf/<file-name>/page-NN.png
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser, projectDir } from './lib/browser.mjs';

const args = process.argv.slice(2);
const scaleArg = args.includes('--scale') ? Number(args[args.indexOf('--scale') + 1]) : 1;
const fileArg = args.find((a) => a.endsWith('.pdf'));

async function newestPdf() {
  const dir = path.join(projectDir, 'exports');
  const files = await Promise.all(
    (await readdir(dir)).filter((f) => f.endsWith('.pdf')).map(async (f) => ({ f, t: (await stat(path.join(dir, f))).mtimeMs })),
  );
  if (!files.length) throw new Error('No PDF in exports/ — run npm run export:pdf first.');
  return path.join(dir, files.sort((a, b) => b.t - a.t)[0].f);
}

const types = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.pdf': 'application/pdf', '.html': 'text/html' };

async function main() {
  const pdfPath = fileArg ? path.resolve(projectDir, fileArg) : await newestPdf();
  const pdfjsDir = path.join(projectDir, 'node_modules', 'pdfjs-dist', 'build');
  const page = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#555">
<script type="module">
import * as pdfjs from '/pdfjs/pdf.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
const doc = await pdfjs.getDocument({ url: '/doc.pdf' }).promise;
window.pageCount = doc.numPages;
window.renderPage = async (n, scale) => {
  const p = await doc.getPage(n);
  const vp = p.getViewport({ scale });
  const c = document.createElement('canvas');
  c.width = vp.width; c.height = vp.height;
  await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  return c.toDataURL('image/png');
};
window.ready = true;
</script>`;

  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = null;
    if (url === '/') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page);
    }
    if (url === '/doc.pdf') file = pdfPath;
    else if (url.startsWith('/pdfjs/')) file = path.join(pdfjsDir, path.basename(url));
    if (!file) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await launchBrowser();
  try {
    const tab = await browser.newPage();
    await tab.goto(`http://127.0.0.1:${port}/`);
    await tab.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
    const count = await tab.evaluate(() => window.pageCount);
    const outDir = path.join(projectDir, 'qa', 'pdf', path.basename(pdfPath, '.pdf'));
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });
    for (let n = 1; n <= count; n++) {
      const dataUrl = await tab.evaluate(([i, s]) => window.renderPage(i, s), [n, scaleArg]);
      await writeFile(path.join(outDir, `page-${String(n).padStart(2, '0')}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
    }
    console.log(`${count} page(s) → ${path.relative(projectDir, outDir)}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
