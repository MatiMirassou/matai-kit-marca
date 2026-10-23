import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import type { Stat, StatKind, StatViz } from '../content/types.ts';
import { useDeck } from '../deck/DeckProvider.tsx';
import { citationNumbers } from '../lib/cite.ts';

const kindLabel: Record<StatKind, string> = {
  estimate: 'Estimate',
  actual: 'Actual',
  forecast: 'Forecast',
  survey: 'Survey',
  growth: 'Growth',
  platform: 'Platform data',
};

export function useCitations() {
  const { slides } = useDeck();
  return citationNumbers(slides);
}

/** Superscript source marker, numbered in deck order; links to the Sources slide. */
export function Cite({ id, className = '' }: { id: string; className?: string }) {
  const numbers = useCitations();
  const n = numbers.get(id);
  const source = content.sources.find((s) => s.id === id);
  if (!n || !source) return null;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className={`num ml-[0.2em] align-super font-mono text-[0.62em] font-medium text-stone no-underline hover:text-cream [.tone-cream_&]:hover:text-graphite ${className}`}
      title={`${source.publisher} — ${source.title} (${source.date})`}
      aria-label={`Source ${n}: ${source.publisher}`}
    >
      [{n}]
    </a>
  );
}

export function KindChips({ kinds, year, className = '' }: { kinds: StatKind[]; year: string; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-[0.5em] ${className}`}>
      {kinds.map((k) => (
        <span key={k} className="meta rounded-[2px] border hairline px-[0.55em] py-[0.25em] leading-none">
          {kindLabel[k]}
        </span>
      ))}
      <span className="meta muted">{year}</span>
    </span>
  );
}

/** Animated count-up; renders the final string in print or reduced motion. */
export function CountUp({ stat }: { stat: Stat }) {
  const { still } = useDeck();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (stat.count && !still ? format(stat, 0) : stat.value));

  useEffect(() => {
    if (!stat.count || still) {
      setDisplay(stat.value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(t >= 1 ? stat.value : format(stat, eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat, still]);

  return (
    <span ref={ref} className="num" aria-label={stat.value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

function format(stat: Stat, progress: number) {
  const c = stat.count!;
  const v = c.to * progress;
  return `${c.prefix ?? ''}${v.toFixed(c.decimals ?? 0)}${c.suffix ?? ''}`;
}

/** Tiny bar or ratio visual that sits beside a stat. */
export function StatViz({ viz, className = '' }: { viz: StatViz; className?: string }) {
  if (viz.type === 'ratio') {
    return (
      <div className={`flex gap-[calc(var(--su)*6)] ${className}`} aria-hidden="true">
        {Array.from({ length: viz.total }, (_, i) => (
          <span key={i} className={`block h-[calc(var(--su)*14)] w-[calc(var(--su)*14)] rounded-full ${i < viz.filled ? 'bg-accent' : 'border border-stone/60'}`} />
        ))}
      </div>
    );
  }
  const max = Math.max(...viz.items.map((i) => i.value));
  return (
    <div className={`grid gap-[calc(var(--su)*5)] ${className}`} aria-hidden="true">
      {viz.items.map((item) => (
        <div key={item.label} className="grid grid-cols-[calc(var(--su)*100)_1fr_calc(var(--su)*34)] items-center gap-[calc(var(--su)*8)]">
          <span className="meta muted truncate tracking-[0.06em]">{item.label}</span>
          <span className="relative block h-[calc(var(--su)*7)]">
            <span
              className={`absolute inset-y-0 left-0 rounded-[1px] ${item.highlight ? 'bg-accent' : item.forecast ? 'border border-dashed border-accent/80' : 'bg-stone/55'}`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </span>
          <span className="meta num text-right tracking-[0.04em]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Big number + label + kind tags + citation (+ optional micro viz). */
export function StatFigure({ stat, size = 'lg', showViz = true, className = '' }: { stat: Stat; size?: 'xl' | 'lg' | 'md'; showViz?: boolean; className?: string }) {
  const valueSize = size === 'xl' ? 'text-[calc(var(--su)*104)] stack:text-[64px]' : size === 'lg' ? 'text-[calc(var(--su)*68)] stack:text-[48px]' : 'text-[calc(var(--su)*44)] stack:text-[36px]';
  return (
    <figure className={`flex flex-col ${className}`}>
      <p className={`display-tight leading-[0.86] ${valueSize}`}>
        <CountUp stat={stat} />
      </p>
      <figcaption className="mt-[calc(var(--su)*12)] flex flex-col gap-[calc(var(--su)*8)]">
        <span className="text-body font-medium leading-snug text-pretty">
          {stat.label}
          <Cite id={stat.sourceId} />
        </span>
        {stat.detail && <span className="text-small muted text-pretty">{stat.detail}</span>}
        {showViz && stat.viz && <StatViz viz={stat.viz} className="mt-[calc(var(--su)*6)]" />}
        <KindChips kinds={stat.kinds} year={stat.refYear} className="mt-[calc(var(--su)*4)]" />
      </figcaption>
    </figure>
  );
}

export const statById = (id: string) => {
  const s = content.stats.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown stat ${id}`);
  return s;
};
