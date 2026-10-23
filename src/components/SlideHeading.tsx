import type { ReactNode } from 'react';
import { Kicker } from './Cinema.tsx';
import { Headline, Reveal } from './Reveal.tsx';

/** Kicker + headline (+ optional supporting line) used by most slides. */
export function SlideHeading({
  kicker,
  headline,
  sub,
  size = 'h1',
  style = 'title',
  className = '',
  headlineClass = '',
  as = 'h2',
}: {
  kicker?: ReactNode;
  headline: string;
  sub?: ReactNode;
  size?: 'display' | 'h1' | 'h2' | 'h3';
  style?: 'title' | 'display';
  className?: string;
  headlineClass?: string;
  as?: 'h1' | 'h2';
}) {
  const sizeClass = { display: 'text-display', h1: 'text-h1', h2: 'text-h2', h3: 'text-h3' }[size];
  return (
    <div className={className}>
      {kicker && (
        <Reveal y={8}>
          <Kicker className="muted mb-18">{kicker}</Kicker>
        </Reveal>
      )}
      <Headline as={as} text={headline} className={`${style} ${sizeClass} ${headlineClass}`} />
      {sub && (
        <Reveal delay={0.15} className="mt-18 text-lede muted text-pretty">
          {sub}
        </Reveal>
      )}
    </div>
  );
}
