import { content } from '../content';
import type { SlideDef } from '../content/types.ts';

const statSource = (id: string) => content.stats.find((s) => s.id === id)?.sourceId;

/** Source ids a slide cites, in reading order. */
export function sourcesForSlide(slide: SlideDef): string[] {
  if (slide.kind !== 'vertical') return [];
  const c = content.verticalCopy;
  return [...[c.hero, ...c.supporting].map(statSource), c.format.sourceId].filter((s): s is string => !!s);
}

/** Citation numbers in order of first appearance in the active deck. */
export function citationNumbers(slides: SlideDef[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const slide of slides) {
    for (const id of sourcesForSlide(slide)) if (!map.has(id)) map.set(id, map.size + 1);
  }
  return map;
}
