/**
 * Content schema for the Mat.AI deck.
 *
 * Edit the files in `content/en/` to change copy, projects, stats and contacts —
 * no component code needs to change. Three kinds of text are supported:
 *
 *   'Plain string'          final, approved copy
 *   DRAFT('text', 'note')   plausible copy that the founder still has to confirm
 *                           (highlighted with ?audit=1, listed by `npm run check:content`)
 *   PH('what goes here')    a visible placeholder — rendered with a dashed outline on
 *                           screen AND in the PDF, so it can never be mistaken for real
 *                           content. `export:pdf --final` refuses to export while any
 *                           placeholder is rendered.
 *
 * Optional fields (results, tools, cadence) are simply hidden while empty.
 */

export type Placeholder = { readonly kind: 'placeholder'; readonly hint: string };
export type Draft = { readonly kind: 'draft'; readonly text: string; readonly note?: string };
export type Copy = string | Placeholder | Draft;

export const PH = (hint: string): Placeholder => ({ kind: 'placeholder', hint });
export const DRAFT = (text: string, note?: string): Draft =>
  note === undefined ? { kind: 'draft', text } : { kind: 'draft', text, note };

export const isPlaceholder = (c: unknown): c is Placeholder =>
  typeof c === 'object' && c !== null && (c as Placeholder).kind === 'placeholder';
export const isDraft = (c: unknown): c is Draft =>
  typeof c === 'object' && c !== null && (c as Draft).kind === 'draft';

/** Text value of a Copy (placeholders return ''). */
export const plain = (c: Copy | undefined): string =>
  c === undefined ? '' : typeof c === 'string' ? c : c.kind === 'draft' ? c.text : '';

/* ── Brand & contact ─────────────────────────────────────────────────────── */
export interface LinkItem {
  label: string;
  value: Copy;
  href?: string;
}

export interface Brand {
  name: string;
  founder: string;
  tagline: string;
  /** Tagline with *accent* / _accent-2_ markup for display use. */
  taglineMarked: string;
  coverSub: string;
  eyebrow: string;
  location: string;
  languages: string;
  /** Public URL of the web deck. When set, PDF pages link videos to it (with QR codes). */
  publicUrl: Copy;
  contact: {
    email: string;
    emailSubject: string;
    links: LinkItem[];
  };
}

/* ── Founder ─────────────────────────────────────────────────────────────── */
export interface TimelineEntry {
  year: string;
  title: Copy;
  detail: Copy;
}
export interface Credit {
  title: string;
  detail: Copy;
}
export interface Founder {
  name: string;
  role: string;
  headline: string;
  bio: Copy;
  portrait: { media: string; caption: string; alt: string };
  timeline: TimelineEntry[];
  credits: Credit[];
  skills: string[];
}

/* ── Offer ───────────────────────────────────────────────────────────────── */
export interface Service {
  id: string;
  craft: 'story' | 'system';
  n: string;
  name: string;
  line: string;
  points: string[];
  /** Media id (or "<video-id>@<still>") for the thumbnail. */
  media?: string;
}

export interface Engagement {
  name: string;
  text: string;
}

/* ── Work ────────────────────────────────────────────────────────────────── */
export type WorkKind = 'client' | 'personal' | 'spec' | 'system' | 'concept';

export interface Project {
  id: string;
  title: string;
  logline: Copy;
  kind: WorkKind;
  client?: string;
  year: string;
  /** Media id from src/generated/media.json. "<video-id>@<n>" addresses an extracted still. */
  media: string;
  /** Key art / poster image id shown instead of the video poster. */
  keyArt?: string;
  /** Still frames from the work ("<video-id>@<n>"). */
  frames?: string[];
  episodes?: { label: string; media: string }[];
  role?: Copy;
  note?: string;
}

export interface CaseOutput {
  name: string;
  text: string;
  cadence?: Copy;
  media?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  kind: WorkKind;
  client?: string;
  kicker: string;
  headline: string;
  challenge: Copy;
  solution: Copy;
  approach: Copy[];
  deliverables: Copy[];
  /** Verified results only. Leave empty to hide the block. */
  results: Copy[];
  role: Copy;
  /** Tools used. Leave undefined to hide. */
  tools?: Copy;
  /** Visual proof: frames (case 1) or outputs (case 2). */
  frames?: { media: string; caption: string }[];
  framesTitle?: string;
  framesNote?: string;
  outputs?: CaseOutput[];
  systemId?: string;
}

/* ── Systems ─────────────────────────────────────────────────────────────── */
export type NodeType = 'human' | 'auto' | 'assisted';

export interface SystemNode {
  id: string;
  label: string;
  detail: Copy;
  type: NodeType;
  col: number;
  row?: number;
  /** Verified tool name, shown only when supported by the project source. */
  tool?: string;
}

export interface ContentSystem {
  id: string;
  name: string;
  short: string;
  tagline: string;
  client?: string;
  /** Optional facts — hidden while undefined. */
  cadence?: Copy;
  output: Copy;
  tools?: Copy;
  nodes: SystemNode[];
  edges: [string, string][];
}

/* ── Market & sources ────────────────────────────────────────────────────── */
export type StatKind = 'estimate' | 'actual' | 'forecast' | 'survey' | 'growth' | 'platform';

export type StatViz =
  | { type: 'bars'; unit?: string; items: { label: string; value: number; highlight?: boolean; forecast?: boolean }[] }
  | { type: 'ratio'; filled: number; total: number };

export interface Stat {
  id: string;
  value: string;
  count?: { to: number; decimals?: number; prefix?: string; suffix?: string };
  label: string;
  detail?: string;
  kinds: StatKind[];
  refYear: string;
  sourceId: string;
  viz?: StatViz;
}

export interface Source {
  id: string;
  publisher: string;
  title: string;
  date: string;
  url: string;
  verification: 'primary' | 'reprint';
  via?: string;
}

/* ── Deck ────────────────────────────────────────────────────────────────── */
export type SlideKind =
  | 'cover'
  | 'founder'
  | 'offer'
  | 'series'
  | 'vertical'
  | 'case'
  | 'ads'
  | 'craft'
  | 'podcasts'
  | 'systems'
  | 'fit'
  | 'contact'
  | 'credits'
  // Visual brand guide (brand.html)
  | 'brand-cover'
  | 'brand-logo'
  | 'brand-logo-misuse'
  | 'brand-color'
  | 'brand-type'
  | 'brand-elements';

export type Tone = 'dark' | 'ink' | 'cream';

export interface SlideDef {
  id: string;
  kind: SlideKind;
  /** Section label shown in the slide header and index. */
  chapter: string;
  title: string;
  tone: Tone;
  notes?: string;
  ref?: string;
}

export interface DeckVariant {
  id: string;
  name: string;
  description: string;
  slides: string[];
}
