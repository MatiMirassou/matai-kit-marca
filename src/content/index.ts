import { content as en } from './en/index.ts';

/**
 * Locale registry. To add Spanish: copy `en/` to `es/`, translate the strings,
 * then register it here — `?lang=es` selects it. Components never contain copy.
 */
export type Content = typeof en;
const locales: Record<string, Content> = { en };

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const lang = new URLSearchParams(window.location.search).get('lang') ?? 'en';
  return lang in locales ? lang : 'en';
}

export const locale = detectLocale();
export const content: Content = locales[locale] ?? en;
