import type { ReactNode } from 'react';
import type { NodeType, WorkKind } from '../content/types.ts';
import { content } from '../content';

/**
 * Film-language details, ported from the landing page's cinema/* components
 * and re-scaled to slide units (u). Parents must be `relative`.
 */

/** Viewfinder corner brackets — the frame device from the logo. */
export function Brackets({ inset = 14, size = 18, className = '', tone = 'light' }: { inset?: number; size?: number; className?: string; tone?: 'light' | 'accent' | 'dark' }) {
  const color = tone === 'accent' ? 'bg-accent' : tone === 'dark' ? 'bg-graphite/50' : 'bg-cream/70';
  const corners = ['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'];
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-20 ${className}`} style={{ inset: `calc(var(--su) * ${inset})` }}>
      {corners.map((pos) => (
        <span key={pos} className={`absolute ${pos}`} style={{ width: `calc(var(--su) * ${size})`, height: `calc(var(--su) * ${size})` }}>
          <span className={`absolute left-0 top-0 h-[1.5px] w-full ${color}`} />
          <span className={`absolute left-0 top-0 h-full w-[1.5px] ${color}`} />
        </span>
      ))}
    </span>
  );
}

/** Mono slate line: segments separated by middots. */
export function Slate({ items, className = '' }: { items: (string | false | undefined | null)[]; className?: string }) {
  const parts = items.filter(Boolean) as string[];
  return (
    <p className={`meta ${className}`}>
      {parts.map((p, i) => (
        <span key={`${p}-${i}`}>
          {i > 0 && <span className="mx-[0.6em] opacity-50">·</span>}
          {p}
        </span>
      ))}
    </p>
  );
}

const kindStyles: Record<WorkKind, string> = {
  client: 'border-accent/80 text-accent',
  personal: 'border-current/35 opacity-85',
  spec: 'border-accent-2/70 text-accent-2',
  system: 'border-current/35 opacity-85',
  concept: 'border-current/35 opacity-85',
};

/** Work kind badge: CLIENT · LINGOPIE / PERSONAL R&D / SPEC / INTERNAL SYSTEM. */
export function KindTag({ kind, client, className = '' }: { kind: WorkKind; client?: string | undefined; className?: string }) {
  const label = content.kindLabel[kind];
  return (
    <span className={`meta inline-flex items-center gap-[0.5em] border px-[0.7em] py-[0.35em] leading-none ${kindStyles[kind]} ${className}`}>
      <span className="inline-block h-[0.5em] w-[0.5em] rounded-full bg-current" aria-hidden="true" />
      {label}
      {client ? ` · ${client}` : ''}
    </span>
  );
}

/** Human / assisted / automated glyph: ● ◐ ◆ — shape carries meaning, not only color. */
export function NodeGlyph({ type, className = '' }: { type: NodeType; className?: string }) {
  if (type === 'human') {
    return (
      <svg viewBox="0 0 12 12" className={`inline-block h-[0.85em] w-[0.85em] shrink-0 ${className}`} aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="var(--accent)" />
      </svg>
    );
  }
  if (type === 'auto') {
    return (
      <svg viewBox="0 0 12 12" className={`inline-block h-[0.85em] w-[0.85em] shrink-0 ${className}`} aria-hidden="true">
        <path d="M6 0.6 L11.4 6 L6 11.4 L0.6 6 Z" fill="none" stroke="var(--glyph-teal, var(--color-teal))" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" className={`inline-block h-[0.85em] w-[0.85em] shrink-0 ${className}`} aria-hidden="true">
      <circle cx="6" cy="6" r="5" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
      <path d="M6 1 A5 5 0 0 1 6 11 Z" fill="var(--accent)" />
    </svg>
  );
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`meta flex items-center gap-[0.9em] ${className}`}>
      <span className="inline-block h-px w-[2.4em] bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  );
}
