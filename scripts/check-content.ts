// Content audit — run with `npm run check:content` (Node runs this TypeScript directly).
//
// Lists every PLACEHOLDER and DRAFT in src/content/en, and fails (exit 1) when:
//   - a stat has no valid source, kind or reference year
//   - a slide, variant, project, still frame, case study or system references a missing id
//   - a headline is far over its character budget
//   - a client name appears that isn't on the approved list (no fabricated clients)
import { readFileSync } from 'node:fs';
import { content } from '../src/content/en/index.ts';
import { isDraft, isPlaceholder } from '../src/content/types.ts';

const APPROVED_CLIENTS = ['Lingopie'];
const HEADLINE_BUDGET = 72;
const manifest = JSON.parse(readFileSync(new URL('../src/generated/media.json', import.meta.url), 'utf8')) as Record<string, { stills?: unknown[] }>;

type Finding = { path: string; text: string; note?: string };
const placeholders: Finding[] = [];
const drafts: Finding[] = [];
const errors: string[] = [];
const notes: string[] = [];

function walk(value: unknown, path: string) {
  if (isPlaceholder(value)) return void placeholders.push({ path, text: value.hint });
  if (isDraft(value)) return void drafts.push({ path, text: value.text, note: value.note });
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
}
walk(content, '');

/* Media references (ids and "<video>@<still>") */
const mediaExists = (id: string) => {
  const [base, still] = id.split('@');
  const entry = manifest[base!];
  if (!entry) return false;
  return still === undefined || (Array.isArray(entry.stills) && entry.stills.length > Number(still));
};
const mediaRefs: [string, string][] = [];
for (const p of content.projects) {
  mediaRefs.push([`project ${p.id}.media`, p.media]);
  if (p.keyArt) mediaRefs.push([`project ${p.id}.keyArt`, p.keyArt]);
  p.frames?.forEach((f, i) => mediaRefs.push([`project ${p.id}.frames[${i}]`, f]));
  p.episodes?.forEach((e, i) => mediaRefs.push([`project ${p.id}.episodes[${i}]`, e.media]));
}
for (const c of content.caseStudies) c.frames?.forEach((f, i) => mediaRefs.push([`case ${c.id}.frames[${i}]`, f.media]));
for (const s of content.services) if (s.media) mediaRefs.push([`service ${s.id}.media`, s.media]);
mediaRefs.push(['founder.portrait', content.founder.portrait.media]);
for (const [path, id] of mediaRefs) if (!mediaExists(id)) errors.push(`${path}: media "${id}" not in src/generated/media.json (run npm run media)`);

/* Stats & sources */
const sourceIds = new Set(content.sources.map((s) => s.id));
for (const s of content.stats) {
  if (!sourceIds.has(s.sourceId)) errors.push(`stat ${s.id}: unknown source "${s.sourceId}"`);
  if (!s.kinds.length) errors.push(`stat ${s.id}: missing kind`);
  if (!s.refYear) errors.push(`stat ${s.id}: missing reference year`);
}
for (const src of content.sources) {
  if (!/^https:\/\//.test(src.url)) errors.push(`source ${src.id}: URL must be https`);
  if (src.verification === 'reprint' && !src.via) errors.push(`source ${src.id}: reprint without "via"`);
}
const statIds = new Set(content.stats.map((s) => s.id));
for (const id of [content.verticalCopy.hero, ...content.verticalCopy.supporting]) if (!statIds.has(id)) errors.push(`unknown stat id "${id}"`);
if (!sourceIds.has(content.verticalCopy.format.sourceId)) errors.push('verticalCopy.format: unknown source');

/* Deck integrity */
const slideIds = new Set([...content.slides, ...content.brandSlides].map((s) => s.id));
for (const v of content.variants) for (const id of v.slides) if (!slideIds.has(id)) errors.push(`variant ${v.id}: unknown slide "${id}"`);
for (const s of content.slides) if (s.kind === 'case' && !content.caseStudies.some((c) => c.id === s.ref)) errors.push(`slide ${s.id}: unknown case "${s.ref}"`);
const projectIds = new Set(content.projects.map((p) => p.id));
for (const id of [...content.seriesCopy.series, ...content.adsCopy.items, ...content.craftCopy.items, 'ai-host']) if (!projectIds.has(id)) errors.push(`unknown project "${id}"`);
if (!content.systems.some((s) => s.id === content.systemsCopy.printSystem)) errors.push(`systemsCopy.printSystem "${content.systemsCopy.printSystem}" not found`);
for (const c of content.caseStudies) if (c.systemId && !content.systems.some((s) => s.id === c.systemId)) errors.push(`case ${c.id}: unknown system "${c.systemId}"`);
for (const sys of content.systems) {
  const nodeIds = new Set(sys.nodes.map((n) => n.id));
  for (const [a, b] of sys.edges) if (!nodeIds.has(a) || !nodeIds.has(b)) errors.push(`system ${sys.id}: edge ${a}→${b} references a missing node`);
}
console.log(`Deck: ${content.slides.length} slides · brand guide: ${content.brandSlides.length} pages`);

/* No fabricated clients */
for (const p of content.projects) {
  if (p.kind === 'client' && (!p.client || !APPROVED_CLIENTS.includes(p.client))) errors.push(`project ${p.id}: client "${p.client}" is not on the approved list`);
  if (p.kind !== 'client' && p.client) errors.push(`project ${p.id}: has a client but kind is "${p.kind}"`);
}
for (const c of content.caseStudies) {
  if (c.client && !APPROVED_CLIENTS.includes(c.client)) errors.push(`case ${c.id}: client "${c.client}" is not approved`);
  if (!c.results.length) notes.push(`case ${c.id}: no results yet — the block is hidden until verified results are added`);
  if (!c.tools) notes.push(`case ${c.id}: tools not listed (hidden)`);
}
for (const s of content.systems) if (!s.tools) notes.push(`system ${s.id}: tools not listed (hidden)`);

/* Headline budgets */
const headlines: [string, string][] = [
  ['brand.tagline', content.brand.tagline],
  ['offerCopy.headline', content.offerCopy.headline],
  ['founder.headline', content.founder.headline],
  ['seriesCopy.headline', content.seriesCopy.headline],
  ['verticalCopy.headline', content.verticalCopy.headline],
  ['adsCopy.headline', content.adsCopy.headline],
  ['podcastsCopy.headline', content.podcastsCopy.headline],
  ['systemsCopy.headline', content.systemsCopy.headline],
  ['fitCopy.headline', content.fitCopy.headline],
  ...content.caseStudies.map((c) => [`case ${c.id}.headline`, c.headline] as [string, string]),
];
for (const [path, text] of headlines) {
  const len = text.replace(/[*_\n]/g, '').length;
  if (len > HEADLINE_BUDGET + 30) errors.push(`${path}: ${len} chars (budget ~${HEADLINE_BUDGET})`);
  else if (len > HEADLINE_BUDGET) console.warn(`  ! ${path}: ${len} chars — long headline, check layout`);
}

/* Report */
console.log(`\nPLACEHOLDERS (${placeholders.length}) — visible in the deck and PDF until filled:`);
for (const p of placeholders) console.log(`  • ${p.path}\n      ${p.text}`);
console.log(`\nDRAFTS (${drafts.length}) — copy awaiting founder confirmation (?audit=1 highlights them):`);
for (const d of drafts) console.log(`  • ${d.path}${d.note ? `  [${d.note}]` : ''}\n      ${d.text.slice(0, 110)}${d.text.length > 110 ? '…' : ''}`);
if (notes.length) {
  console.log(`\nOPTIONAL — hidden until added (${notes.length}):`);
  for (const n of notes) console.log(`  · ${n}`);
}
console.log(`\nStats: ${content.stats.length} · Sources: ${content.sources.length}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):\n  - ${errors.join('\n  - ')}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ Content checks passed.');
}
