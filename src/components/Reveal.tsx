import { motion, type Variants } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { useDeck } from '../deck/DeckProvider.tsx';
import { parseRich, RichText, stripRich, toneClass } from './RichText.tsx';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade-and-rise on entering view. Static in print; transforms off under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: 'div' | 'li';
}) {
  const { isPrint, still } = useDeck();
  if (isPrint || still) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Comp = as === 'li' ? motion.li : motion.div;
  return (
    <Comp
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const lineParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } };
const word: Variants = {
  hidden: { y: '108%' },
  show: { y: '0%', transition: { duration: 0.75, ease: EASE } },
};

/**
 * Headline whose words rise out of a mask, like a title card. Supports the
 * *accent* / _accent-2_ markup from RichText. Plain text in print. `as` sets the
 * heading level (one h1/h2 per slide keeps the PDF outline clean).
 */
export function Headline({
  text,
  as: Tag = 'h2',
  className = '',
  id,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const { isPrint, still } = useDeck();
  if (isPrint || still) {
    return (
      <Tag id={id} className={className}>
        <RichText text={text} />
      </Tag>
    );
  }
  const words = parseRich(text).flatMap((seg) =>
    seg.text
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w) => ({ w, tone: seg.tone })),
  );
  return (
    <Tag id={id} className={className} aria-label={stripRich(text)}>
      <motion.span
        aria-hidden="true"
        data-reveal
        variants={lineParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delayChildren: delay }}
        style={{ display: 'inline' }}
      >
        {words.map(({ w, tone }, i) =>
          /^\s+$/.test(w) ? (
            w.includes('\n') ? <br key={i} /> : <span key={i}> </span>
          ) : (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span className={`inline-block ${tone ? toneClass[tone] : ''}`} variants={word}>
                {w}
              </motion.span>
            </span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}
