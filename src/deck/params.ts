import {currentRoute} from '../lib/routes.ts';
export type DeckMode = 'read' | 'present' | 'print';

export interface DeckParams {
  /** Which document: the commercial deck or the visual brand guide. */
  doc: 'deck' | 'brand';
  deck: string;
  forCompany: string;
  mode: DeckMode;
  play: string | null;
  audit: boolean;
  final: boolean;
  motion: 'on' | 'off' | null;
}

/** Read URL parameters once at startup. `for` is rendered as text only. */
export function readParams(): DeckParams {
  const q = new URLSearchParams(window.location.search);
  const mode = q.get('print') === '1' ? 'print' : q.get('mode') === 'present' ? 'present' : 'read';
  const forCompany = (q.get('for') ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);
  const motion = q.get('motion');
  const doc = q.get('doc') === 'brand' || document.documentElement.dataset.doc === 'brand' ? 'brand' : 'deck';
  return {
    doc,
    deck: currentRoute().edition==='anime' ? 'anime' : q.get('deck') ?? 'full',
    forCompany,
    mode,
    play: q.get('play'),
    audit: q.get('audit') === '1',
    final: q.get('final') === '1',
    motion: motion === 'off' || motion === 'on' ? motion : null,
  };
}
