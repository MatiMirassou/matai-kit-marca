import { Fragment } from 'react';

/**
 * Minimal inline markup for headlines in content files:
 *   *word*  → accent (Signal Red on cream, Saffron on graphite)   _word_ → secondary accent
 * Kept deliberately tiny so copy stays readable as plain text.
 */
type Segment = { text: string; tone?: 'accent' | 'accent2' };

export function parseRich(text: string): Segment[] {
  const out: Segment[] = [];
  const re = /\*([^*]+)\*|_([^_]+)_/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push(m[1] !== undefined ? { text: m[1], tone: 'accent' } : { text: m[2]!, tone: 'accent2' });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export const stripRich = (text: string) => text.replace(/\*([^*]+)\*|_([^_]+)_/g, '$1$2').replace(/\n/g, ' ');

export const toneClass = {
  accent: 'text-accent',
  accent2: 'text-accent-2',
} as const;

const withBreaks = (text: string) =>
  text.split('\n').map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((s, i) => (
        <Fragment key={i}>{s.tone ? <span className={toneClass[s.tone]}>{withBreaks(s.text)}</span> : withBreaks(s.text)}</Fragment>
      ))}
    </>
  );
}
