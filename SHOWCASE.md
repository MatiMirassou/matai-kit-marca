# Showcase implementation — 23 October 2026

## Unlisted anime edition — 29 October 2026

The owner approved publishing the reviewed bilingual anime edition to the existing GitHub/Netlify project on 29 October 2026.

- Routes on the same site: `/en/presentation/anime/` and `/es/presentation/anime/`.
- 19 slides (revised 29 October): original three-strip cover with Vertical Drama / AI Anime / Automated Content, updated services, eight anime slides, original sections except Ads, updated founder and job-focused closing.
- The AI Anime cover strip previews The Vamp episode 01 using its existing muted loop; clicking opens the original full episode. Reduced motion retains a frame from that episode. The loop at `public/media/vamp-ep01/loop.mp4` is included in the publication allowlist.
- The original 12-slide presentation and public showcase remain separate. No public navigation advertises the anime route. Static entry HTML and runtime set `noindex, nofollow, noarchive`; this is unlisted, not access-controlled.
- The Vamp: character sheets, wardrobe references and both generated episodes. Platform Zero: three character sheets and the trailer. Love on Mars: four visible Style Exploration boards, a separate Character Selection slide, and four playable generated scenes.
- Edition-specific offer headline: “Human creativity powered by AI”. Anime headline: “Three stories. A spectrum of emotions.” / “Tres historias. Un universo de emociones.”
- Founder experience starts in 2010. Education replaces selected film credits, including Coderhouse Front End Developer (2021–2025, confirmed by the owner). Founder and contact use “AI Creative Producer & Technical Director” with the corresponding Spanish title. Original deck/profile data is not overwritten.
- Attribution: AI direction and visual generation by Matías Mirassou; scripts supplied by others. No unverified tool, budget, team-management or production-timeline claims.
- New media lives in `public/media/anime-review/`; only used files are allowlisted. Seven videos are original, untranscoded copies. This edition adds 70 files (including the existing cover loop) to the previous 130-file selection: 200 files / 516,281,489 bytes total. Unused development assets remain ignored.
- Preparation: `node scripts/anime-media.mjs "D:/03 MatAI/AI Anime Presentation"`. This generates the separate `src/generated/anime-media.json` catalog and a local inventory in `qa/anime/`.
- Review: `npm run dev -- --host 127.0.0.1 --port 5180`. Test after building with `npm run test:anime`; use `node scripts/anime-qa.mjs --dev` against the review server.
- `public-media.lock.json` fingerprints the complete publication selection. Validate from a clean index export before pushing. Unlisted routes and robots metadata are not privacy controls: published media is downloadable and the GitHub repository is public.

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

## Netlify-only media launch

The owner requested direct Netlify media delivery, using existing files without further video optimization. The exact 200-file selection (about 516 MB, including the anime edition) is tracked under `public/media/`, restricted by the `.gitignore` allowlist, and fingerprinted in `public-media.lock.json`. The build verifies file availability and hashes. No unused full videos or private source directories are included. No external media service is configured for this launch. Fourteen files exceed Netlify's published 10 MB CDN guidance and are intentionally being tried as-is; inspect the actual deployment for acceptance and playback. The source repository being public does not grant reuse rights to client work or the Mat.AI identity.
