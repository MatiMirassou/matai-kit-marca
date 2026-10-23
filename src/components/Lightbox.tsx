import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { media, url } from '../lib/media.ts';
import { content } from '../content';
import { Brackets } from './Cinema.tsx';

/**
 * Full playback with sound, in a native <dialog> (ported from the landing
 * page's Lightbox): showModal() gives a real focus trap, inert background,
 * Esc to close, focus return, and works inside fullscreen present mode.
 */
export interface LightboxItem {
  title: string;
  media: string;
  meta?: string[];
  episodes?: { label: string; media: string }[];
}

const Ctx = createContext<{ open: (item: LightboxItem) => void } | null>(null);

export function useLightbox() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLightbox outside LightboxProvider');
  return ctx;
}

function timecode(t: number) {
  const fps = 24;
  const total = Math.floor(t * fps);
  const ff = total % fps;
  const s = Math.floor(total / fps);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(ff).padStart(2, '0')}`;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  const open = useCallback((next: LightboxItem) => {
    setItem(next);
    setCurrent(next.media);
    setTime(0);
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (item && d && !d.open) d.showModal();
  }, [item]);

  const close = useCallback(() => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  }, []);

  const entry = media(current ?? undefined);
  const portrait = !!entry && entry.height > entry.width;
  const src = url(entry?.full ?? entry?.loop);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={item?.title ?? 'Video'}
        onClose={() => {
          setItem(null);
          setCurrent(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="lightbox m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 text-cream backdrop:bg-ink/92 backdrop:backdrop-blur-sm"
      >
        {item && entry && (
          <div className="flex flex-col overflow-hidden rounded-[3px] border border-cream/15 bg-ink shadow-2xl">
            <div className="flex items-center gap-4 border-b border-cream/10 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="truncate text-cream">{item.title}</span>
              <span className="ml-auto tabular-nums text-cream/80" aria-hidden="true">
                {timecode(time)}
              </span>
              <button
                type="button"
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 text-base normal-case text-cream transition-colors hover:border-accent hover:text-accent"
                aria-label={content.ui.close}
                autoFocus
              >
                ✕
              </button>
            </div>
            <div
              className="relative bg-black"
              style={
                portrait
                  ? { height: 'min(78svh, 1100px)', aspectRatio: `${entry.width} / ${entry.height}` }
                  : { width: 'min(90vw, calc(76svh * 16 / 9), 1400px)', aspectRatio: `${entry.width} / ${entry.height}` }
              }
            >
              <Brackets inset={10} size={16} />
              {entry.kind === 'audio' ? (
                <div className="relative flex h-full flex-col justify-center p-6">
                  <img src={url(entry.poster)} alt="Waveform of the actual audio sample" className="h-auto w-full"/>
                  <audio key={current} ref={(el)=>{videoRef.current=el;}} src={src} controls autoPlay onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} className="mt-5 w-full"/>
                </div>
              ) : <video key={current} ref={(el)=>{videoRef.current=el;}} src={src} poster={url(entry.poster)} controls autoPlay playsInline onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} className="absolute inset-0 h-full w-full object-contain"/>}

            </div>
            {(item.meta?.length || item.episodes?.length) && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 px-4 py-3">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone">{item.meta?.join('  ·  ')}</p>
                {item.episodes && item.episodes.length > 1 && (
                  <div className="flex gap-1.5" role="group" aria-label={content.ui.episode}>
                    {item.episodes.map((ep) => (
                      <button
                        key={ep.media}
                        type="button"
                        aria-pressed={current === ep.media}
                        onClick={() => {
                          setCurrent(ep.media);
                          setTime(0);
                        }}
                        className={`rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                          current === ep.media ? 'border-accent bg-accent text-ink' : 'border-cream/25 text-cream hover:border-cream/60'
                        }`}
                      >
                        {ep.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
