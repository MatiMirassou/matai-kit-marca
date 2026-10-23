import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeck, usePosition } from './DeckProvider.tsx';
import { useDeckKeys } from './useDeckKeys.ts';
import { registry } from './registry.tsx';
import type { SlideDef } from '../content/types.ts';

declare global {
  interface Window {
    __PRINT_READY__?: boolean;
  }
}

function SlideRenderer({ slide, index, total }: { slide: SlideDef; index: number; total: number }) {
  const Component = registry[slide.kind];
  return <Component slide={slide} index={index} total={total} />;
}

function PresentStage() {
  const { slides } = useDeck();
  const { index, next, prev } = usePosition();
  const slide = slides[index]!;
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastIndex = useRef(index);
  const direction = index >= lastIndex.current ? 1 : -1;
  useEffect(() => {
    lastIndex.current = index;
  }, [index]);

  return (
    <main
      id="deck"
      className="fixed inset-0 overflow-hidden bg-ink"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('button, a, input, video, [role="slider"], [data-own-keys]')) return;
        start.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      }}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && Date.now() - s.t < 800) {
          if (dx < 0) next();
          else prev();
        }
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          custom={direction}
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <SlideRenderer slide={slide} index={index} total={slides.length} />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export function Deck() {
  const { slides, mode, isPrint } = useDeck();
  const { index, setIndexFromScroll, go } = usePosition();
  useDeckKeys();

  // Read mode: track the slide crossing the viewport's centre line.
  useEffect(() => {
    if (mode !== 'read') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = slides.findIndex((s) => s.id === e.target.id);
          if (i >= 0) setIndexFromScroll(i);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    for (const s of slides) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [mode, slides, setIndexFromScroll]);

  // Entering read mode (initial load with #hash, or leaving present mode): restore position.
  const firstRead = useRef(true);
  useEffect(() => {
    if (mode !== 'read') return;
    if (firstRead.current) {
      firstRead.current = false;
      if (index === 0) return;
    }
    requestAnimationFrame(() => document.getElementById(slides[index]!.id)?.scrollIntoView({ block: 'start' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (mode === 'present') go(index, { focus: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Print: signal readiness once fonts and images are decoded.
  useEffect(() => {
    if (!isPrint) return;
    let cancelled = false;
    (async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
      // Async print-only content (QR codes) marks itself with [data-pending].
      for (let i = 0; i < 50 && document.querySelector('[data-pending]'); i++) await new Promise((r) => setTimeout(r, 100));
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!cancelled) window.__PRINT_READY__ = true;
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [isPrint]);

  if (mode === 'present') return <PresentStage />;
  return (
    <main id="deck">
      {slides.map((s, i) => (
        <SlideRenderer key={s.id} slide={s} index={i} total={slides.length} />
      ))}
    </main>
  );
}
