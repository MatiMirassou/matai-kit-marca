import type { ReactNode } from 'react';
import type { SlideDef } from '../content/types.ts';
import { Logo } from '../components/Logo.tsx';

export interface SlideProps {
  slide: SlideDef;
  index: number;
  total: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * One slide: a full-bleed frame (background, media) around a 16:9 stage
 * designed in 1280×720 units. Header and footer live in the stage's chrome
 * zones; content goes in between (use the `.safe` box or absolute layouts).
 */
export function SlideFrame({
  slide,
  index,
  total,
  children,
  bleed,
  header = true,
  showFooter = true,
  footer,
  grain = true,
  className = '',
}: SlideProps & {
  children: ReactNode;
  /** Full-bleed layer behind the stage (video, image, color field). */
  bleed?: ReactNode;
  header?: boolean;
  showFooter?: boolean;
  /** Left side of the footer — typically a source line. */
  footer?: ReactNode;
  grain?: boolean;
  className?: string;
}) {
  return (
    <section
      id={slide.id}
      data-slide={slide.id}
      tabIndex={-1}
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}: ${slide.title}`}
      className={`frame tone-${slide.tone} outline-none ${className}`}
    >
      {bleed && <div className="absolute inset-0 -z-10 stack:relative stack:inset-auto">{bleed}</div>}
      <div className="stage">
        {header && (
          <header className="absolute left-72 right-72 top-30 z-20 flex items-center justify-between stack:static stack:mb-28">
            <Logo variant="full" tone={slide.tone === 'cream' ? 'light' : 'dark'} className="h-[calc(var(--su)*24)] w-auto stack:h-[24px]" />
            <p className="meta muted">
              <span className="num">{pad(index + 1)}</span>
              <span className="mx-[0.6em] opacity-60">—</span>
              {slide.chapter}
            </p>
          </header>
        )}
        {children}
        {showFooter && (
          <footer className="pointer-events-none absolute bottom-24 left-72 right-72 z-20 flex items-end justify-between gap-24 stack:static stack:mt-32">
            <div className="meta muted pointer-events-auto max-w-[80%] normal-case tracking-[0.04em]">{footer}</div>
            <p className="meta muted num shrink-0">
              {pad(index + 1)} / {pad(total)}
            </p>
          </footer>
        )}
      </div>
      {grain && <div className="grain" aria-hidden="true" />}
    </section>
  );
}
