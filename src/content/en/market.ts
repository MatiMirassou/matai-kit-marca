import type { Source, Stat } from '../types.ts';

/**
 * Market data for the single "Why vertical drama" slide. Every stat carries its kind
 * (estimate / actual / forecast / survey / growth / platform), the year it refers to
 * and a source read on the publisher's page ('primary') or a reputable reprint
 * ('reprint' + `via`). Research date: 11 Oct 2026 — see BRAND_STRATEGY.md §9 for the
 * wider set of verified figures that were deliberately left out of the deck.
 */
export const sources: Source[] = [
  {
    id: 'omdia-2026',
    publisher: 'Omdia',
    title: 'Microdramas overtake streamers on mobile engagement',
    date: '23 Feb 2026',
    url: 'https://omdia.tech.informa.com/pr/2026/feb/microdramas-overtake-streamers-on-mobile-engagement-says-omdia',
    verification: 'primary',
  },
  {
    id: 'sensortower-som-2026',
    publisher: 'Sensor Tower (via Marketing Dive)',
    title: 'State of Mobile 2026 — microdrama apps',
    date: '20 Feb 2026',
    url: 'https://www.marketingdive.com/news/microdrama-apps-stand-out-on-mobile-heres-what-the-numbers-say/812610/',
    verification: 'reprint',
    via: 'Marketing Dive',
  },
];

export const stats: Stat[] = [
  {
    id: 'md-revenue',
    value: '$11B',
    count: { to: 11, prefix: '$', suffix: 'B' },
    label: 'Global microdrama revenue in 2025',
    detail: 'Growing to $14B by the end of 2026 (forecast), with $3B outside China.',
    kinds: ['estimate', 'forecast'],
    refYear: '2025–26',
    sourceId: 'omdia-2026',
    viz: { type: 'bars', unit: '$B', items: [{ label: '2025', value: 11, highlight: true }, { label: '2026', value: 14, forecast: true }] },
  },
  {
    id: 'md-minutes',
    value: '35.7 min',
    count: { to: 35.7, decimals: 1, suffix: ' min' },
    label: 'A day per user in ReelShort — more than Netflix (24.8)',
    detail: 'US mobile, Q4 2025. Engagement intensity, not reach.',
    kinds: ['platform'],
    refYear: 'Q4 2025',
    sourceId: 'omdia-2026',
    viz: { type: 'bars', unit: 'min', items: [{ label: 'ReelShort', value: 35.7, highlight: true }, { label: 'Prime Video', value: 26.9 }, { label: 'Netflix', value: 24.8 }, { label: 'Disney+', value: 23.0 }] },
  },
  {
    id: 'md-iap',
    value: '+115%',
    count: { to: 115, prefix: '+', suffix: '%' },
    label: 'Growth in short-drama app revenue in 2025, to $2.98B',
    detail: 'App-store purchases only — excludes ads and mini-programs.',
    kinds: ['actual', 'growth'],
    refYear: '2025',
    sourceId: 'sensortower-som-2026',
  },
];

/* ── 05 · Why vertical drama ─────────────────────────────────────────────── */
export const verticalCopy = {
  kicker: 'Why vertical drama',
  headline: 'Attention moved to the vertical screen.',
  hero: 'md-revenue',
  supporting: ['md-minutes', 'md-iap'],
  format: {
    title: 'The format',
    text: 'Episodes of one to two minutes, shot vertical, built for mobile — and discovered on YouTube, Instagram and TikTok.',
    sourceId: 'omdia-2026',
  },
  implication: 'Formats that hold attention are now a business. They need directors who can hold it.',
};
