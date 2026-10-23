import { useEffect, useRef, useState } from 'react';
import { content,t } from '../content';
import { useDeck, usePosition } from './DeckProvider.tsx';

const pad = (n: number) => String(n).padStart(2, '0');

function IconButton({ label, onClick, active, children, hideLabel = false }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode; hideLabel?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={hideLabel ? label : undefined}
      title={label}
      className={`flex h-9 items-center gap-2 rounded-full border px-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] backdrop-blur-md transition-colors ${
        active ? 'border-saffron/70 bg-saffron/10 text-saffron' : 'border-cream/20 bg-ink/55 text-cream/85 hover:border-cream/50 hover:text-cream'
      }`}
    >
      {children}
      {!hideLabel && <span>{label}</span>}
    </button>
  );
}

function IndexDialog() {
  const { slides, indexOpen, setIndexOpen, variantName } = useDeck();
  const { index, go } = usePosition();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (indexOpen && !d.open) d.showModal();
    if (!indexOpen && d.open) d.close();
  }, [indexOpen]);
  return (
    <dialog
      ref={ref}
      onClose={() => setIndexOpen(false)}
      onClick={(e) => e.target === e.currentTarget && setIndexOpen(false)}
      aria-label={content.ui.index}
      className="m-auto w-[min(720px,92vw)] max-h-[86svh] overflow-auto rounded-[3px] border border-cream/15 bg-ink p-0 text-cream backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-cream/10 px-6 py-4">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone">{content.ui.index}</p>
          <p className="mt-1 text-lg font-semibold">{variantName}</p>
        </div>
        <button type="button" autoFocus onClick={() => setIndexOpen(false)} className="h-9 w-9 rounded-full border border-cream/20 hover:border-accent hover:text-accent" aria-label={content.ui.close}>
          ✕
        </button>
      </div>
      <ol className="grid gap-px p-2 sm:grid-cols-2">
        {slides.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                setIndexOpen(false);
                go(i, { focus: true });
              }}
              aria-current={i === index ? 'true' : undefined}
              className={`flex w-full items-baseline gap-4 rounded-[2px] px-4 py-3 text-left transition-colors hover:bg-cream/[0.06] ${i === index ? 'text-accent' : ''}`}
            >
              <span className="font-mono text-[11px] tabular-nums text-stone">{pad(i + 1)}</span>
              <span className="text-[15px]">{s.title}</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-stone">{s.chapter}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="border-t border-cream/10 px-6 py-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-stone">{content.ui.keyboardHint}</p>
    </dialog>
  );
}

/** Fixed on-screen controls (never printed): progress rail, mode/motion/PDF controls, notes, index. */
export function DeckChrome() {
  const { slides, mode, setMode, motion, setMotion, notesOpen, setNotesOpen, setIndexOpen, isPrint } = useDeck();
  const { index, go } = usePosition();
  const [idle, setIdle] = useState(false);
  const [canFullscreen] = useState(() => document.fullscreenEnabled);

  // Auto-hide chrome in present mode after inactivity.
  useEffect(() => {
    if (mode !== 'present') {
      setIdle(false);
      return;
    }
    let t = window.setTimeout(() => setIdle(true), 2200);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), 2200);
    };
    window.addEventListener('pointermove', wake);
    window.addEventListener('keydown', wake);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointermove', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [mode]);

  if (isPrint) return null;
  const slide = slides[index];
  const hidden = mode === 'present' && idle && !notesOpen;

  return (
    <div className="no-print">
      {/* Progress rail */}
      <nav
        aria-label={t("Slides")}
        className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[5px] transition-opacity duration-500 min-[960px]:flex ${hidden ? 'opacity-0' : 'opacity-100'}`}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i, { focus: mode === 'present' })}
            aria-label={`${pad(i + 1)} — ${s.title}`}
            aria-current={i === index ? 'step' : undefined}
            className="group flex items-center gap-2 py-[2px]"
          >
            <span className="pointer-events-none whitespace-nowrap rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {pad(i + 1)} {s.title}
            </span>
            <span className={`block h-[2px] rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-accent' : 'w-3 bg-cream/35 group-hover:bg-cream/80'}`} />
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 transition-opacity duration-500 max-[959px]:bottom-3 max-[959px]:right-3 ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        <IconButton label={content.ui.index} onClick={() => setIndexOpen(true)} hideLabel>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" /></svg>
        </IconButton>
        <IconButton label={motion === 'on' ? content.ui.motionOn : content.ui.motionOff} onClick={() => setMotion(motion === 'on' ? 'off' : 'on')} active={motion === 'off'} hideLabel>
          {motion === 'on' ? (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
          )}
        </IconButton>
        <span className="hidden min-[960px]:contents">
          <IconButton label={content.ui.pdf} onClick={() => window.print()}>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M8 2v8m0 0-3-3m3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </IconButton>
          {mode === 'present' && canFullscreen && (
            <IconButton
              label={content.ui.fullscreen}
              onClick={() => (document.fullscreenElement ? void document.exitFullscreen() : void document.documentElement.requestFullscreen().catch(() => {}))}
              hideLabel
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
            </IconButton>
          )}
          <IconButton
            label={mode === 'present' ? content.ui.exitPresent : content.ui.present}
            onClick={() => {
              if (mode === 'present' && document.fullscreenElement) void document.exitFullscreen();
              setMode(mode === 'present' ? 'read' : 'present');
            }}
            active={mode === 'present'}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="9" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M8 11.5V14M5 14h6" stroke="currentColor" strokeWidth="1.4" /></svg>
          </IconButton>
        </span>
      </div>

      {/* Present-mode counter + notes */}
      {mode === 'present' && (
        <>
          <p className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70 transition-opacity duration-500 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
            {pad(index + 1)} / {pad(slides.length)}
          </p>
          {notesOpen && (
            <aside className="fixed bottom-16 left-4 z-50 w-[min(420px,40vw)] rounded-[3px] border border-cream/15 bg-ink/90 p-4 text-cream backdrop-blur-md" aria-label={content.ui.notes}>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">
                {content.ui.notes} · {slide?.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed">{slide?.notes ?? '—'}</p>
            </aside>
          )}
          {!notesOpen && slide?.notes && !hidden && (
            <button type="button" onClick={() => setNotesOpen(true)} className="fixed bottom-4 left-4 z-40 rounded-full border border-cream/20 bg-ink/55 px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/80 backdrop-blur-md hover:text-cream">
              N · {content.ui.notes}
            </button>
          )}
        </>
      )}
      <IndexDialog />
    </div>
  );
}
