# Mat.AI — Showcase, Presentation & Brand Guide

A bilingual public showcase and a separate interactive capabilities presentation for **Mat.AI** (Matías Mirassou), sharing one React / TypeScript / Vite project and the same verified projects, media and visual identity. The presentation retains its 16:9 PDF export. A separate visual brand guide remains available.

| Document | Web | PDF |
|---|---|---|
| **Showcase** | `/en/`, `/es/` | — |
| **Project pages** | `/en/work/<id>/`, `/es/work/<id>/` | — |
| **Capabilities deck** (12 slides) | `/en/presentation/`, `/es/presentation/` | `exports/Mat.AI-Capabilities-<date>.pdf` |
| **Visual brand guide** (6 pages) | `brand.html` | `exports/Mat.AI-Brand-Guide-<date>.pdf` |

- **One repository, two public layouts.** The new showcase and this presentation share this project. The older personal portfolio checkout is unrelated and has not been overwritten.
- Strategy documents and private production references are maintained outside this public repository.

## Public repository and version history

This repository contains the presentation's editable code, copy, vector logo, media manifest and the selected web media approved for the Netlify-only launch. Original production files, unused media, PDF/ZIP exports, local media-source paths and internal production notes remain excluded. Public visibility is not a grant of rights to the Mat.AI identity or third-party/client work.

Git history starts with the current revised edition on **23 October 2026**. It does not contain the earlier interactive version. The original **12 October PDF** remains in the owner's local `exports/` directory, outside Git.

A fresh clone includes the assets needed by the showcase, presentation and visual brand guide. `public-media.lock.json` records the exact public files and their SHA-256 hashes; `npm run check:media` verifies them before the build. Regenerating media still requires the owner's local, untracked `media.sources.json` and access to the original source files. Do not upload additional material without review.

For future changes, commit a known-good version first, work on a separate branch, and review the staged changes before pushing. Keeping files out of later commits does not remove them from earlier public Git history.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5180/en/ (showcase) or http://localhost:5180/en/presentation/ (deck). **Requirements:** Node 20.19+ (tested on 24), plus Microsoft Edge or Google Chrome (used for PDF export and QA; nothing is downloaded).

### Netlify

Connect this repository and select `main` as the production branch. The checked-in `netlify.toml` sets Node 24, build command `npm run build`, and publish directory `dist`; leave the base directory empty. Both public layouts deploy together. Known routes are pre-rendered as static directory pages. Selected videos, previews, posters, stills and audio are included in `public/media/` and served directly by Netlify; no separate media provider is required. Existing video files are being tried unchanged, without a new encoding/optimization pass.

| Command | What it does |
|---|---|
| `npm run dev` | Live-reloading dev server |
| `npm run build` | Type-check, client build and pre-rendered EN/ES showcase/project HTML into `dist/` |
| `npm run check:media` | Verify the public media allowlist, file availability and unchanged hashes |
| `npm run test:showcase` | Desktop/mobile navigation, language, filters, media and static HTML checks |
| `npm run qa -- --no-shots --lang es` | Spanish presentation print-overflow checks |
| `npm run export:pdf` | Build first, then export the capabilities deck PDF |
| `npm run export:brand` | Export the visual brand guide PDF |
| `npm run export:pdf:all` | Both PDFs |
| `npm run check:content` | List every placeholder and draft; fail on unsourced stats or unknown clients |
| `npm run verify` | Content check + unit tests + build + print-layout QA + interaction smoke test |
| `npm run media` | Re-transcode source footage into `public/media/` (see *Media*) |
| `npm run logo` | Re-trace the original logo into `src/assets/logo.json` |

---

## Using the deck

### Modes

- **Read** (default): scroll, or use the keyboard. Each section is one slide.
- **Present**: press **P** (or the *Present* button). One slide at a time, with transitions and swipe on touch screens. Press **F** for fullscreen and **N** for speaker notes. Esc goes back.
- **Print / PDF**: `?print=1` previews the PDF layout on screen. **Ctrl+P** works too, but use `npm run export:pdf` for the best result.

### Keyboard

| Key | Action |
|---|---|
| ← → / PageUp PageDown / Space | Previous / next slide |
| ↑ ↓ | Previous / next slide (desktop) |
| Home / End | First / last slide |
| P | Present mode |
| F | Fullscreen |
| N | Speaker notes (present mode) |
| I | Slide index |
| M | Motion on/off |
| Esc | Close dialog / leave present mode |

Keys are ignored while you are using a slider, tab list, video or dialog.

### URL options (combine freely)

| Parameter | Effect |
|---|---|
| `?for=Acme%20Studios` | Adds "Prepared for Acme Studios" to the cover and to the page and PDF title |
| `?play=maid` | Opens a project's video on load (project id or media id); used by links in the PDF |
| `?motion=off` | Static deck: no autoplay, no animation |
| `?audit=1` | Highlights DRAFT copy that still needs confirmation |
| `#systems` | Opens at a slide (any slide id) |

**Accessibility:**
- The deck follows the OS *reduce motion* setting; the on-screen Motion toggle also stops all loops (WCAG 2.2.2).
- Videos never autoplay with sound.
- Dialogs trap focus and return it when closed.

---

## Editing content (no component code needed)

All copy and data live in **`src/content/en/`**:

| File | Contains |
|---|---|
| `brand.ts` | Name, tagline, cover text, contact links, public URL, final CTA, credits |
| `founder.ts` | Bio, portrait, timeline, credits, skills |
| `offer.ts` | The three services, client fit, collaboration workflow and "not my focus" |
| `work.ts` | Series, ads, craft and podcast slides; projects (with frames); the two case studies |
| `systems.ts` | The workflows as node graphs; `printSystem` picks the one shown in the PDF |
| `market.ts` | The three vertical-drama stats and their sources |
| `deck.ts` | Slide order, section labels, speaker notes; the brand guide's pages |
| `brand-guide.ts` | Copy for the visual brand guide |

**Optional facts are hidden until you add them.** Case-study `results` and `tools`, and system `tools` and `cadence`, don't render while empty, so the deck never shows blank results.

### Three kinds of text

```ts
'Final copy'                       // plain string
DRAFT('Plausible copy', 'note')    // needs confirmation — highlighted with ?audit=1
PH('what goes here')               // visible PLACEHOLDER chip on screen and in the PDF
```

- `npm run check:content` prints every PH and DRAFT with its path.
- `node scripts/export-pdf.mjs --final` refuses to export while any placeholder is still rendered.

### Headline markup

`*word*` renders in the accent colour: Signal Red on cream slides, Saffron on graphite. `\n` forces a line break.

### Common tasks

- **Add a project:**
  1. Add the source to `media.sources.json`.
  2. Run `npm run media`.
  3. Add an entry to `projects` in `work.ts` and list its id in `adsCopy.items`, `craftCopy.items` or `seriesCopy.series`.
- **Show more frames from a video:** add `"stills": [seconds, …]` to its entry in `media.sources.json`, run `npm run media`, then reference `"<video-id>@<n>"` in `frames`.
- **Add a case study:**
  1. Add it to `caseStudies` in `work.ts`.
  2. Add a slide `{ id: 'case/<id>', kind: 'case', ref: '<id>', … }` to `deck.ts`.
- **Add a statistic:**
  1. Add the source to `sources` and the stat to `stats` in `market.ts`.
  2. Reference the stat id in `verticalCopy`.

  Only add figures you have read on the publisher's page, or on a reputable reprint (set `verification: 'reprint'` and `via`).
- **Make a tailored version:** add `{ id, name, description, slides: [...] }` to `variants` in `deck.ts` and open it with `?deck=<id>`.
- **Spanish:**
  Shared translations live in `src/content/translations.ts`. Showcase copy uses paired strings through `src/content/language.ts`. Open `/es/` or `/es/presentation/`. Official project titles, media IDs, original quotations and playback languages stay unchanged. Add a matching Spanish translation when changing shared English copy.

  The language switch preserves project, section, gallery filters, workflow and presentation slide. An explicit language choice is remembered for the next visit to `/`; explicit locale URLs always win. No location or browser-language redirect is used.

---

## Media

Originals are never modified. `npm run media` reads the owner's untracked **`media.sources.json`** (paths relative to its configured `root`) and writes `public/media/<id>/` plus `src/generated/media.json`. The manifest contains web-relative paths and dimensions, not the media itself.

**Outputs per item:**

| Item | Files |
|---|---|
| Video | `full.mp4` (H.264, 720p-class, AAC), `loop.mp4` (6–8 s muted preview with fade), `poster.jpg` (print) and `poster.webp` (screen), optional `still-N` frames |
| Image | `poster.jpg` + `poster.webp`; light grain is added to prevent banding in AI images |

**Supported inputs:**
- 10-bit HEVC (for example the `/Podcast` clips) is converted to 8-bit H.264 so every browser can play it.
- `montages` builds the mobile cover loop from cuts of several clips.

**Workflow:**
- Unchanged items are skipped. Use `--force` to rebuild, or `--only id1,id2`.
- `npm run media:sheets` writes contact sheets to `.media-cache/sheets/`. Use them to pick `loop.start` and `poster.at` times.

**Published selection:** 130 files, about 188 MB (179.5 MiB), including 13 full videos, 13 preview loops and two audio files. The largest file is about 30 MB. Full episodes load only when opened. Seven files exceed Netlify's published 10 MB CDN guidance; the owner requested trying these existing files as-is. Watch the deployment log and bandwidth usage before expanding the library.

---

## PDF export

```bash
npm run build
npm run export:pdf                       # capabilities deck
npm run export:brand                     # visual brand guide
node scripts/export-pdf.mjs --for "Acme Studios"   # personalised cover
npm run pdf:preview                      # rasterise the newest PDF → qa/pdf/… (to eyeball pages)
```

- **Fidelity:** pages are exactly 1280×720 px (13.33 × 7.5 in), with live, selectable text, embedded fonts and bookmarks.
- **Videos:** each video becomes its poster frame, plus a "Watch" link to the web deck. QR codes appear once `brand.publicUrl` is set.
- **Built-in checks:** the export fails if the page count differs from the slide count, or if the console logs errors. It warns above 10 MB. The deck is about 5 MB; the brand guide under 1 MB.
- **Workflows in the PDF:** the web deck shows one workflow at a time with tabs; the PDF shows `systemsCopy.printSystem` at full size.

---

## Quality checks

| Command | Checks |
|---|---|
| `npm test` | Diagram layout, plus deck rules: 12 slides, one CTA, two case studies, brand guide kept separate |
| `npm run qa` | Print layout: every slide fits its page and content stays inside the safe area (`--deck brand` for the guide). Also screenshots at 1440×810, 1024×768 and 390×844 → `qa/screens/` |
| `npm run smoke` | Interaction checks: keyboard, present mode, lightbox and focus return, ads, series frames, workflow tabs, `?for`, `?play`, brand guide page, reduced motion (no autoplay), autoplay when allowed. Full playback checks require the local media folder. |

---

## Project structure

```
presentation/
  media.sources.json      source footage + loop/poster points
  index.html · brand.html deck and brand-guide entry pages
  scripts/                media, logo, export-pdf, pdf-preview, qa, smoke, check-content, tests/
  src/
    content/              types.ts + en/*.ts (all copy and data)
    deck/                 provider (modes, navigation), frame, chrome, keyboard, registry
    slides/               Intro, Dramas, Ads, Podcasts, Systems, CaseStudy, Exit, Brand (guide)
    components/           Video, Lightbox, FlowDiagram, StatFigure, Reveal, Logo (traced), Cinema…
    assets/logo.json      the founder's logo as vector paths (npm run logo)
    lib/                  media manifest (+ stills), diagram layout, citations
    styles/app.css        tokens, slide scale system (--su), stacked mode, print rules
```

**How scaling works:** every slide is designed once in 1280×720 units. The CSS length `--su` scales those units to the screen, to present mode and to the PDF page. Below 960 px wide (or on portrait tablets), slides reflow into a single column.

**Ported from the landing page:** the video preview, lightbox and film-detail components, adapted for this project. Lenis and GSAP were not carried over.

---

## Before sending — founder checklist

Run `npm run check:content` for the full list. Highlights:

- [ ] Only add public contact channels once confirmed.
- [ ] Keep case-study metrics hidden until verified.
- [ ] Confirm operating cadence and review gates before adding more detailed automation claims.
- [ ] Supply the Forgotten Fortune subtitle master if the delivery stage must demonstrate captions.
- [ ] Keep Neon Night labeled as an independent spec; no finished commercial was verified.
- [x] Street Interview confirmed as commissioned work for Lingopie, with synthetic-performance disclosure.
- [x] Four completed dramas and real podcast, tutorial, video-news and audio-news samples confirmed.
- [ ] Review usage rights before publishing any additional client media.

## Deploying

`npm run build` produces a static `dist/` folder for root-domain hosting, with pre-rendered EN/ES routes and the selected public media. Netlify configuration is checked in. Keep generated builds, original production files and unused media out of Git. Check deployment logs for the larger, unchanged full-episode files.
## Final capabilities revision — 19 October 2026

The current commercial edition has **12 pages**. See REVISION_CHANGELOG.md for the original-to-new page mapping. Research/production evidence and unresolved asset notes remain in the owner's untracked SOURCE_REFERENCES.md and ASSETS_OR_INFO_NEEDED.md files.

The original 12 October PDFs are preserved locally; the earlier editable web source was revised in place. The revised web deck uses the same content and slide components as the PDF. The Git baseline described above preserves the current source from this point forward.

### Portable edition

After a successful normal build:

```powershell
$env:MATAI_EXPORT_DATE = '2026-10-19'
# Use an installed Python environment that includes pypdf:
$env:MATAI_PYTHON = 'python'
node scripts/portable.mjs
node scripts/export-pdf.mjs --final --portable
node scripts/revision-verify.mjs
```

This writes `exports/Mat.AI-Capabilities-2026-10-19-Portable/` containing a file-openable `index.html`, the 12-page PDF and its referenced media. The HTML embeds the built JavaScript, styles and fonts. The portable exporter rewrites local PDF playback links to verified sibling media files; it refuses to create unresolved playback links. Keep the media directory with the PDF. The ordinary served web version continues to work through `npm run dev`.

The portable verification checks all included full media files, audio and video lightboxes, episode switching, all six workflow selectors, the final page order, and mobile width. No public address or sign-in is required for the included offline media.

The separate brand guide remains a separate source document and is not included in this revised capabilities bundle.
