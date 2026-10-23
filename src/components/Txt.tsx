import type { Copy } from '../content/types.ts';

/**
 * Renders a Copy value: plain text, DRAFT (highlighted in ?audit=1) or a
 * visible PLACEHOLDER chip.
 */
export function Txt({ c, className }: { c: Copy | undefined; className?: string }) {
  if (c === undefined) return null;
  if (typeof c === 'string') return className ? <span className={className}>{c}</span> : <>{c}</>;
  if (c.kind === 'draft') {
    return (
      <span className={className} data-draft={c.note ?? 'draft'}>
        {c.text}
      </span>
    );
  }
  return (
    <span className={`ph ${className ?? ''}`} data-placeholder={c.hint}>
      {c.hint}
    </span>
  );
}
