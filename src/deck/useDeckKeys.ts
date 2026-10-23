import { useEffect } from 'react';
import { useDeck, usePosition } from './DeckProvider.tsx';

const OWN_KEYS = 'input, textarea, select, [contenteditable="true"], [role="slider"], [role="tablist"], [role="tab"], video, [data-own-keys]';

/** Global keyboard navigation. Ignores keys that belong to form controls, tabs, video or dialogs. */
export function useDeckKeys() {
  const { mode, setMode, setMotion, motion, setNotesOpen, notesOpen, setIndexOpen, slides } = useDeck();
  const { next, prev, go } = usePosition();

  useEffect(() => {
    if (mode === 'print') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest(OWN_KEYS)) return;

      const key = e.key;
      const handled = () => e.preventDefault();
      switch (key) {
        case 'ArrowRight':
        case 'PageDown':
          handled();
          next();
          return;
        case 'ArrowLeft':
        case 'PageUp':
          handled();
          prev();
          return;
        case 'ArrowDown':
          if (mode === 'present') {
            handled();
            next();
          } else if (window.innerWidth >= 960) {
            handled();
            next();
          }
          return;
        case 'ArrowUp':
          if (mode === 'present' || window.innerWidth >= 960) {
            handled();
            prev();
          }
          return;
        case ' ':
          if (target?.closest('button, a, summary')) return;
          handled();
          if (e.shiftKey) prev();
          else next();
          return;
        case 'Home':
          handled();
          go(0, { focus: mode === 'present' });
          return;
        case 'End':
          handled();
          go(slides.length - 1, { focus: mode === 'present' });
          return;
        case 'p':
        case 'P':
          if (window.innerWidth < 960) return;
          handled();
          setMode(mode === 'present' ? 'read' : 'present');
          return;
        case 'f':
        case 'F':
          if (!document.fullscreenEnabled) return;
          handled();
          if (document.fullscreenElement) void document.exitFullscreen();
          else {
            if (mode !== 'present' && window.innerWidth >= 960) setMode('present');
            void document.documentElement.requestFullscreen().catch(() => {});
          }
          return;
        case 'n':
        case 'N':
          if (mode !== 'present') return;
          handled();
          setNotesOpen(!notesOpen);
          return;
        case 'm':
        case 'M':
          handled();
          setMotion(motion === 'on' ? 'off' : 'on');
          return;
        case 'i':
        case 'I':
        case 'g':
        case 'G':
          handled();
          setIndexOpen(true);
          return;
        case 'Escape':
          if (mode === 'present' && !document.fullscreenElement) {
            handled();
            setMode('read');
          }
          return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, setMode, setMotion, motion, setNotesOpen, notesOpen, setIndexOpen, next, prev, go, slides.length]);
}
