import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaRuntime } from './MediaRuntime.tsx';
import { media, url } from '../lib/media.ts';

/**
 * Muted preview loop with a poster underneath (ported from the landing page's
 * VideoPreview). The video source is attached only when needed, plays only
 * while in view (or hovered), never under reduced motion / Save-Data, pauses
 * when the tab is hidden, and at most MAX_PLAYING loops run at once.
 * In print it renders the JPEG poster only.
 */
const MAX_PLAYING = 4;
const playing = new Set<HTMLVideoElement>();

export type PlayMode = 'inView' | 'hover' | 'none';

export function Video({
  id,
  poster,
  play = 'inView',
  fit = 'cover',
  className = '',
  alt = '',
  priority = false,
  position = 'center',
}: {
  /** Media id (video or image) from src/generated/media.json. */
  id: string;
  /** Optional media id whose image replaces the poster (e.g. key art). */
  poster?: string;
  play?: PlayMode;
  fit?: 'cover' | 'contain';
  className?: string;
  alt?: string;
  priority?: boolean;
  /** object-position for the poster/video. */
  position?: string;
}) {
  const { isPrint, still } = useMediaRuntime();
  const entry = media(id);
  const posterEntry = media(poster) ?? entry;
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const attached = useRef(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const saveData = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const canPlay = !!entry?.loop && play !== 'none' && !isPrint && !still && !saveData && !failed;
  const shouldPlay = canPlay && visible && (play === 'inView' || hovered);

  // Visibility.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !canPlay) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting && e.intersectionRatio > 0.3), {
      threshold: [0, 0.3, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, [canPlay]);

  // Hover / focus on the nearest [data-hover-root].
  useEffect(() => {
    if (play !== 'hover' || !canPlay) return;
    const root = (wrapRef.current?.closest('[data-hover-root]') as HTMLElement | null) ?? wrapRef.current;
    if (!root) return;
    const on = () => setHovered(true);
    const off = () => setHovered(false);
    root.addEventListener('pointerenter', on);
    root.addEventListener('pointerleave', off);
    root.addEventListener('focusin', on);
    root.addEventListener('focusout', off);
    return () => {
      root.removeEventListener('pointerenter', on);
      root.removeEventListener('pointerleave', off);
      root.removeEventListener('focusin', on);
      root.removeEventListener('focusout', off);
    };
  }, [play, canPlay]);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    playing.delete(v);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !entry?.loop) return;
    if (shouldPlay && !document.hidden) {
      if (!playing.has(v) && playing.size >= MAX_PLAYING) return;
      if (!attached.current) {
        v.src = url(entry.loop)!;
        attached.current = true;
      }
      v.muted = true; // set programmatically: required for iOS autoplay
      playing.add(v);
      v.play().catch(() => playing.delete(v)); // blocked (e.g. Low Power Mode): poster stays
    } else {
      stop();
    }
  }, [shouldPlay, entry?.loop, stop]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) stop();
      else if (shouldPlay) videoRef.current?.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [shouldPlay, stop]);

  if (!entry) {
    return (
      <div className={`grid h-full w-full place-items-center bg-graphite ${className}`}>
        <span className="ph meta">media “{id}” missing — run npm run media</span>
      </div>
    );
  }

  const objectFit = fit === 'cover' ? 'object-cover' : 'object-contain';
  const p = posterEntry!;
  return (
    <div ref={wrapRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {isPrint ? (
        <img
          src={url(p.poster)}
          alt={alt}
          width={p.width}
          height={p.height}
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 h-full w-full ${objectFit}`}
          style={{ objectPosition: position }}
        />
      ) : (
        <picture>
          <source srcSet={url(p.posterWebp)} type="image/webp" />
          <img
            src={url(p.poster)}
            alt={alt}
            width={p.width}
            height={p.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className={`absolute inset-0 h-full w-full ${objectFit}`}
            style={{ objectPosition: position }}
          />
        </picture>
      )}
      {canPlay && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setReady(true)}
          onError={() => {
            setFailed(true);
            setReady(false);
          }}
          className={`absolute inset-0 h-full w-full ${objectFit} transition-opacity duration-700 ${ready && shouldPlay ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: position }}
        />
      )}
    </div>
  );
}

/** Still image from the manifest (posters/JPEG in print, WebP on screen). */
export function Still({ id, alt, className = '', fit = 'cover', position = 'center', priority = false }: { id: string; alt: string; className?: string; fit?: 'cover' | 'contain'; position?: string; priority?: boolean }) {
  return <Video id={id} play="none" alt={alt} className={className} fit={fit} position={position} priority={priority} />;
}
