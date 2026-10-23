/**
 * Visual brand guide (brand.html → exports/Mat.AI-Brand-Guide-<date>.pdf).
 * Deliberately concise: logo, colour, type, elements and imagery.
 */
export const brandGuide = {
  title: 'Visual identity guide',
  version: 'v1 · October 2026',
  intro: 'A one-glance reference for using the Mat.AI identity consistently — in decks, social, video and the web.',

  logo: {
    kicker: 'Logo',
    headline: 'One logo. Two backgrounds.',
    variants: [
      { name: 'Primary', note: 'Framed wordmark — covers, titles, closing frames.' },
      { name: 'Wordmark', note: 'Headers, footers and small placements.' },
      { name: 'Monogram', note: 'App icon, avatar, favicon, watermark.' },
    ],
    rules: [
      { label: 'On cream', text: 'Graphite ink, Saffron fold and dot, Signal Red “AI”.' },
      { label: 'On graphite', text: 'Cream ink, Saffron fold and dot, Signal Red “AI”.' },
      { label: 'Clear space', text: 'At least the height of the “a” on every side.' },
      { label: 'Minimum size', text: 'Wordmark 96 px / 24 mm wide · monogram 20 px / 6 mm.' },
    ],
  },

  misuse: {
    kicker: 'Logo',
    headline: 'Keep it intact.',
    items: [
      { id: 'red-on-dark', label: 'No Signal Red on graphite — use Saffron.' },
      { id: 'recolor', label: 'No new colours.' },
      { id: 'stretch', label: 'No stretching or squashing.' },
      { id: 'effects', label: 'No glows, shadows or gradients.' },
      { id: 'retype', label: 'No retyping in another font.' },
      { id: 'busy', label: 'No busy images without a dark scrim.' },
    ],
  },

  color: {
    kicker: 'Colour',
    headline: 'Sunset Signal.',
    swatches: [
      { name: 'Cream', hex: '#FFF8EE', rgb: '255 248 238', role: 'Light backgrounds · text on graphite' },
      { name: 'Graphite', hex: '#1C1917', rgb: '28 25 23', role: 'Dark backgrounds · text on cream' },
      { name: 'Signal Red', hex: '#B3261E', rgb: '179 38 30', role: 'Accent on cream' },
      { name: 'Saffron', hex: '#F2B233', rgb: '242 178 51', role: 'Accent on graphite · logo dot' },
      { name: 'Tangerine', hex: '#F07A1A', rgb: '240 122 26', role: 'Secondary warmth · fills, not small text' },
    ],
    pairings: [
      { bg: 'Cream', text: 'Graphite', accent: 'Signal Red', contrast: 'Text 16:1 · accent 6:1' },
      { bg: 'Graphite', text: 'Cream', accent: 'Saffron', contrast: 'Text 16:1 · accent 9:1' },
    ],
    proportion: [
      { name: 'Cream / Graphite', share: 80, hex: '#1C1917' },
      { name: 'Signal Red / Saffron', share: 15, hex: '#B3261E' },
      { name: 'Tangerine', share: 5, hex: '#F07A1A' },
    ],
  },

  type: {
    kicker: 'Typography',
    headline: 'Title card, editorial, slate.',
    styles: [
      { role: 'Display', family: 'Archivo · condensed 800', sample: 'DIRECTED LIKE CINEMA.', className: 'display-tight' },
      { role: 'Headline', family: 'Archivo · semi-condensed 640', sample: 'Two crafts. Four ways to work.', className: 'title' },
      { role: 'Body', family: 'Archivo · 400 / 500', sample: 'Films, vertical series and the systems that produce them — directed shot by shot.', className: '' },
      { role: 'Accent', family: 'Newsreader · italic 400', sample: 'Story keeps the system honest.', className: 'accent' },
      { role: 'Meta', family: 'IBM Plex Mono · 400 / 500', sample: 'EP 01 · 9:16 · Client · Lingopie', className: 'meta' },
    ],
    note: 'The wordmark is artwork, not type — never retype it.',
  },

  elements: {
    kicker: 'Elements & imagery',
    headline: 'Film language, used sparingly.',
    items: [
      { name: 'Viewfinder frame', text: 'Corner brackets from the logo. Frame one hero element per layout.' },
      { name: 'Film strip', text: 'The perforated stroke of the M. A detail, never a pattern.' },
      { name: 'Slate captions', text: 'Mono lines in the form: EP 01 · TITLE · 9:16 · CLIENT.' },
    ],
    imageryDo: ['Real frames from the work', 'Warm, directional light', 'Clean 9:16 and 16:9 frames', 'Subtle film grain'],
    imageryDont: ['Robots, circuit boards, holograms', 'Glowing “AI” gradients', 'Stock business photography', 'Phone mockups around video'],
  },
};
