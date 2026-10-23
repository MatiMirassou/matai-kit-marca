import type { DeckVariant, SlideDef } from '../types.ts';

/**
 * The commercial deck: 14 slides in six sections. Reorder, remove or add
 * entries here. The visual brand guide lives in brand.ts → `brandSlides`.
 */
export const slides: SlideDef[] = [
  { id: 'cover', kind: 'cover', chapter: 'Mat.AI', title: 'Cover', tone: 'ink' },
  { id: 'offer', kind: 'offer', chapter: 'Solutions', title: 'What I make', tone: 'dark' },
  { id: 'series', kind: 'series', chapter: 'Vertical Dramas', title: 'Vertical dramas', tone: 'ink',
    notes: 'Four selected completed dramas, confirmed by the founder. Each poster opens its included episode.' },
  { id: 'vertical', kind: 'vertical', chapter: 'Vertical Dramas', title: 'Why vertical drama', tone: 'dark',
    notes: 'Global revenue and app-store purchases are different markets. Estimates and forecasts remain labelled.' },
  { id: 'case/forgotten-fortune', kind: 'case', chapter: 'Vertical Dramas', title: 'Case: Forgotten Fortune', tone: 'dark', ref: 'forgotten-fortune' },
  { id: 'ads', kind: 'ads', chapter: 'AI Ads & UGC', title: 'AI Ads & UGC', tone: 'ink',
    notes: 'Neon Night is an independent Nike-themed spec concept. Street Interview uses synthetic fictional performances.' },
  { id: 'outputs', kind: 'podcasts', chapter: 'Content Automation', title: 'Outputs', tone: 'dark' },
  { id: 'systems', kind: 'systems', chapter: 'Content Automation', title: 'Workflows', tone: 'dark',
    notes: 'Switch content types. Human review, AI assistance and automated operations have distinct symbols and borders.' },
  { id: 'case/news-show', kind: 'case', chapter: 'Content Automation', title: 'Case: Daily News Video Show', tone: 'dark', ref: 'news-show' },
  { id: 'fit', kind: 'fit', chapter: 'Working together', title: 'Working together', tone: 'cream' },
  { id: 'founder', kind: 'founder', chapter: 'About', title: 'About the founder', tone: 'cream',
    notes: 'The work comes first. Portrait is AI-generated from my own likeness.' },
  { id: 'contact', kind: 'contact', chapter: 'Contact', title: 'Start a project', tone: 'cream' },
];

export const variants: DeckVariant[] = [
  {
    id: 'full',
    name: 'Mat.AI — Capabilities',
    description: 'The commercial deck.',
    slides: slides.map((s) => s.id),
  },
];

/** Visual brand guide (brand.html) — a separate, concise document. */
export const brandSlides: SlideDef[] = [
  { id: 'brand-cover', kind: 'brand-cover', chapter: 'Brand guide', title: 'Visual identity', tone: 'ink' },
  { id: 'brand-logo', kind: 'brand-logo', chapter: 'Logo', title: 'Logo', tone: 'cream' },
  { id: 'brand-logo-misuse', kind: 'brand-logo-misuse', chapter: 'Logo', title: 'Logo — don’ts', tone: 'cream' },
  { id: 'brand-color', kind: 'brand-color', chapter: 'Colour', title: 'Colour', tone: 'dark' },
  { id: 'brand-type', kind: 'brand-type', chapter: 'Typography', title: 'Typography', tone: 'cream' },
  { id: 'brand-elements', kind: 'brand-elements', chapter: 'Elements & imagery', title: 'Elements & imagery', tone: 'dark' },
];
