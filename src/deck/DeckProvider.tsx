import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { MotionConfig } from 'motion/react';
import { content } from '../content';
import type { SlideDef } from '../content/types.ts';
import { readParams, type DeckMode, type DeckParams } from './params.ts';

interface DeckConfig {
  params: DeckParams;
  slides: SlideDef[];
  variantName: string;
  mode: DeckMode;
  setMode: (mode: DeckMode) => void;
  isPrint: boolean;
  motion: 'on' | 'off';
  /** True when motion is off via the toggle OR the OS reduced-motion setting. */
  still: boolean;
  setMotion: (m: 'on' | 'off') => void;
  notesOpen: boolean;
  setNotesOpen: (open: boolean) => void;
  indexOpen: boolean;
  setIndexOpen: (open: boolean) => void;
  announce: (message: string) => void;
}

interface DeckPosition {
  index: number;
  setIndexFromScroll: (i: number) => void;
  go: (target: number | string, opts?: { focus?: boolean }) => void;
  next: () => void;
  prev: () => void;
}

const ConfigCtx = createContext<DeckConfig | null>(null);
const PositionCtx = createContext<DeckPosition | null>(null);

export function useDeck(): DeckConfig {
  const ctx = useContext(ConfigCtx);
  if (!ctx) throw new Error('useDeck outside DeckProvider');
  return ctx;
}
export function usePosition(): DeckPosition {
  const ctx = useContext(PositionCtx);
  if (!ctx) throw new Error('usePosition outside DeckProvider');
  return ctx;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function readStoredMotion(): 'on' | 'off' | null {
  try {
    const v = localStorage.getItem('matai-motion');
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

export function DeckProvider({ children }: { children: ReactNode }) {
  const params = useMemo(readParams, []);
  const variant =
    params.doc === 'brand'
      ? { id: 'brand', name: 'Mat.AI — Visual identity guide', description: '', slides: content.brandSlides.map((s) => s.id) }
      : (content.variants.find((v) => v.id === params.deck) ?? content.variants[0]!);
  const slides = useMemo(() => {
    const byId = new Map([...content.slides, ...content.brandSlides].map((s) => [s.id, s]));
    return variant.slides.map((id) => byId.get(id)).filter((s): s is SlideDef => !!s);
  }, [variant]);

  const [mode, setModeState] = useState<DeckMode>(() =>
    params.mode === 'present' && window.innerWidth < 960 ? 'read' : params.mode,
  );
  const [motion, setMotionState] = useState<'on' | 'off'>(() => params.motion ?? readStoredMotion() ?? 'on');
  const osReduced = usePrefersReducedMotion();
  const [notesOpen, setNotesOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const initialIndex = useMemo(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    const i = slides.findIndex((s) => s.id === hash);
    return i >= 0 ? i : 0;
  }, [slides]);
  const [index, setIndex] = useState(initialIndex);
  const indexRef = useRef(index);
  indexRef.current = index;
  // While a programmatic (smooth) scroll runs, ignore scroll-tracking updates.
  const scrollLock = useRef(0);

  const setMode = useCallback((m: DeckMode) => setModeState(m), []);
  const setMotion = useCallback((m: 'on' | 'off') => {
    setMotionState(m);
    try {
      localStorage.setItem('matai-motion', m);
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, []);

  // Document attributes drive CSS variants (pdf:, still:, present:).
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.mode = mode;
    html.dataset.motion = motion;
    html.dataset.audit = params.audit ? 'on' : 'off';
  }, [mode, motion, params.audit]);

  useEffect(() => {
    const base = params.doc === 'brand' ? `${content.brand.name} — Visual identity guide` : `${content.brand.name} — ${content.brand.tagline}`;
    document.title = params.forCompany && params.doc === 'deck' ? `${content.brand.name} × ${params.forCompany} — Capabilities` : base;
  }, [params.forCompany, params.doc]);

  // Ctrl+P / browser print from read or present mode: render the print tree synchronously.
  useEffect(() => {
    if (params.mode === 'print') return;
    let previous: DeckMode = 'read';
    const before = () => {
      previous = document.documentElement.dataset.mode as DeckMode;
      flushSync(() => setModeState('print'));
    };
    const after = () => setModeState(previous === 'print' ? 'read' : previous);
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, [params.mode]);

  // Keep the URL hash in sync without polluting history.
  useEffect(() => {
    if (mode === 'print') return;
    const id = slides[index]?.id;
    if (id && decodeURIComponent(window.location.hash.slice(1)) !== id) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
    }
  }, [index, slides, mode]);

  const announce = useCallback((message: string) => setAnnouncement(message), []);

  const go = useCallback(
    (target: number | string, opts?: { focus?: boolean }) => {
      const i = typeof target === 'number' ? target : slides.findIndex((s) => s.id === target);
      if (i < 0) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      const slide = slides[clamped]!;
      setIndex(clamped);
      announce(`${content.ui.slide} ${clamped + 1} ${content.ui.of} ${slides.length}: ${slide.title}`);
      const el = document.getElementById(slide.id);
      if (mode === 'read' && el) {
        const reduced = motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const token = ++scrollLock.current;
        const release = () => {
          if (scrollLock.current === token) scrollLock.current = 0;
        };
        window.addEventListener('scrollend', release, { once: true });
        window.setTimeout(release, 1200);
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
      if (opts?.focus) {
        requestAnimationFrame(() => document.getElementById(slide.id)?.focus({ preventScroll: true }));
      }
    },
    [slides, mode, motion, announce],
  );

  const position = useMemo<DeckPosition>(
    () => ({
      index,
      setIndexFromScroll: (i: number) => {
        if (!scrollLock.current) setIndex(i);
      },
      go,
      next: () => go(indexRef.current + 1, { focus: mode === 'present' }),
      prev: () => go(indexRef.current - 1, { focus: mode === 'present' }),
    }),
    [index, go, mode],
  );

  const config = useMemo<DeckConfig>(
    () => ({
      params,
      slides,
      variantName: variant.name,
      mode,
      setMode,
      isPrint: mode === 'print',
      motion,
      still: motion === 'off' || osReduced || mode === 'print',
      setMotion,
      notesOpen,
      setNotesOpen,
      indexOpen,
      setIndexOpen,
      announce,
    }),
    [params, slides, variant.name, mode, setMode, motion, osReduced, setMotion, notesOpen, indexOpen, announce],
  );

  return (
    <ConfigCtx.Provider value={config}>
      <PositionCtx.Provider value={position}>
        <MotionConfig reducedMotion={config.still ? 'always' : 'user'}>{children}</MotionConfig>
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
      </PositionCtx.Provider>
    </ConfigCtx.Provider>
  );
}
