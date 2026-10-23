import { brand, contactCopy, creditsCopy } from './brand.ts';
import { founder } from './founder.ts';
import { clients, engagements, exclusions, fitCopy, offerCopy, principles, services } from './offer.ts';
import { adsCopy, caseCopy, caseStudies, craftCopy, kindLabel, podcastsCopy, projects, seriesCopy } from './work.ts';
import { capabilities, systems, systemsCopy } from './systems.ts';
import { sources, stats, verticalCopy } from './market.ts';
import { brandSlides, slides, variants } from './deck.ts';
import { brandGuide } from './brand-guide.ts';

/** Everything the deck and the brand guide render, for one locale. */
export const content = {
  brand,
  contactCopy,
  creditsCopy,
  founder,
  offerCopy,
  services,
  fitCopy,
  clients,
  engagements,
  principles,
  exclusions,
  seriesCopy,
  adsCopy,
  craftCopy,
  podcastsCopy,
  kindLabel,
  projects,
  caseCopy,
  caseStudies,
  systemsCopy,
  systems,
  capabilities,
  verticalCopy,
  sources,
  stats,
  slides,
  variants,
  brandSlides,
  brandGuide,
  ui: {
    present: 'Present',
    exitPresent: 'Exit',
    index: 'Index',
    motionOn: 'Motion on',
    motionOff: 'Motion off',
    pdf: 'PDF',
    close: 'Close',
    slide: 'Slide',
    of: 'of',
    preparedFor: 'Prepared for',
    sources: 'Sources',
    notes: 'Notes',
    episode: 'Episode',
    fullscreen: 'Fullscreen',
    keyboardHint: '← → to navigate · P present · F fullscreen · N notes · M motion',
  },
};
