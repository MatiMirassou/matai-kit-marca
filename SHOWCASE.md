# Showcase implementation — 23 October 2026

Implementation developed and verified on `codex/showcase-bilingual`. Netlify build configuration is checked in for Git-backed deployment from `main`.

## One project, two layouts

- `/en/`, `/es/`: public, scrolling showcase.
- `/en/work/<project-id>/`, `/es/work/<project-id>/`: individual project pages.
- `/en/presentation/`, `/es/presentation/`: the existing 12-slide capabilities presentation.
- `/brand.html`: the separate visual identity guide, unchanged and not promoted in public navigation.

The public layouts share the vector logo, fonts, palette, verified project registry, contact information, media manifest and playback dialog. The older portfolio checkout is not used or modified. The Git baseline and the older PDF / portable exports are preserved.

## New experience

Cream/gold editorial hero with three cinematic service frames. Dark/red work gallery, separate vertical and horizontal groupings, audio and concept-board entries, service/format filters with shareable URLs, service descriptions, Forgotten Fortune feature and production references, six interactive representative workflow diagrams, professional background, and direct email contact. No contact form or analytics service is connected.

Portrait and landscape playback uses the source media's actual dimensions. Independent spec work, synthetic fictional performances and the AI-generated self-portrait remain disclosed. The ten-item main gallery excludes a second news example to avoid repetition; its project page remains available for the production case study. Unconfirmed drama loglines are not promoted on public project pages.

Desktop parallax uses native scrolling with small image offsets. Mobile and reduced-motion users get static images. Hover/focus previews are muted, lazy-loaded and disabled under reduced motion or Save-Data. Full playback is user-initiated in a keyboard-accessible native dialog.

## Languages and preservation

English and Spanish are selected by URL, with an explicit-switch preference remembered for root visits. Switching preserves project/section, gallery filters, selected workflow and current presentation slide. Media, official titles and original script quotations are not translated or dubbed. The Spanish deck has scoped spacing adjustments for longer copy; the English slide layout is preserved.

The presentation's back/language bar disappears in present mode, PDF/print and portable file bundles. Existing root query/hash deck links still work. Portable exports inline the web bundle, strip pre-rendered showcase markup and use relative media paths when opened from disk.

## Build and verification

`npm run build` creates the client bundle, then pre-renders a homepage and eleven project pages per language, plus presentation entry pages. Static HTML includes localized titles and descriptions. Optional `VITE_PUBLIC_SITE_URL` enables canonical/hreflang links after a domain has been chosen.

Use `npm run test:showcase`, `npm test`, `npm run qa -- --no-shots`, `npm run qa -- --no-shots --lang es`, and `npm run smoke`. Browser screenshots are local under ignored `qa/showcase/`.

Verified locally: 39 showcase browser checks, 25 deck interaction checks, 10 unit tests, zero print overflow in either presentation language or the six-page brand guide. The hybrid preservation check passes for all nine unchanged English slide compositions, source image bytes, playback and the three previously revised mobile slides.

## Deferred to deployment discussion

Hosting-account setup, DNS and public media uploads remain separate from the source-code push. Authorized client media remains outside Git. A fresh clone can build the page structure but needs an agreed media delivery solution before a complete public launch. The source repository being public does not grant reuse rights to client work or the Mat.AI identity.
