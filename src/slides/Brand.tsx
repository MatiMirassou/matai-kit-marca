import type { ReactNode } from 'react';
import { content } from '../content';
import { Brackets, Kicker, Slate } from '../components/Cinema.tsx';
import { Logo } from '../components/Logo.tsx';
import { Still } from '../components/Video.tsx';
import { SlideFrame, type SlideProps } from '../deck/SlideFrame.tsx';

const g = content.brandGuide;

function Heading({ kicker, headline }: { kicker: string; headline: string }) {
  return (
    <div>
      <Kicker className="muted mb-14">{kicker}</Kicker>
      <h2 className="title text-[calc(var(--su)*44)] stack:text-[30px]">{headline}</h2>
    </div>
  );
}

/* ── Cover ───────────────────────────────────────────────────────────────── */
export function BrandCover(props: SlideProps) {
  return (
    <SlideFrame {...props} header={false}>
      <div className="safe flex flex-col items-center justify-center text-center">
        <Logo variant="framed" tone="dark" className="h-auto w-[calc(var(--su)*560)] stack:w-full" />
        <h1 className="display-tight mt-48 text-[calc(var(--su)*56)] stack:text-[36px]">{g.title}</h1>
        <p className="meta mt-14 text-saffron">{g.version}</p>
        <p className="mt-20 max-w-[calc(var(--su)*560)] text-lede text-cream/75">{g.intro}</p>
      </div>
    </SlideFrame>
  );
}

/* ── Logo ────────────────────────────────────────────────────────────────── */
export function BrandLogo(props: SlideProps) {
  const l = g.logo;
  return (
    <SlideFrame {...props}>
      <div className="safe flex flex-col">
        <Heading kicker={l.kicker} headline={l.headline} />
        <div className="mt-24 grid flex-1 grid-cols-2 gap-16 stack:grid-cols-1">
          <div className="relative flex items-center justify-center rounded-[calc(var(--su)*2)] border hairline bg-cream p-40">
            <Logo variant="framed" tone="light" className="h-auto w-full max-w-[calc(var(--su)*440)]" />
            <span className="meta absolute bottom-12 left-14 text-graphite/55">Primary · on cream</span>
          </div>
          <div className="relative flex items-center justify-center rounded-[calc(var(--su)*2)] bg-graphite p-40">
            <Logo variant="framed" tone="dark" className="h-auto w-full max-w-[calc(var(--su)*440)]" />
            <span className="meta absolute bottom-12 left-14 text-cream/55">Primary · on graphite</span>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-[1fr_1fr_1.6fr] gap-16 stack:grid-cols-1">
          <div className="flex items-center gap-16 rounded-[calc(var(--su)*2)] border hairline p-16">
            <div className="relative border border-dashed border-signal/50 p-[calc(var(--su)*12)]">
              <Logo variant="full" tone="light" className="h-[calc(var(--su)*30)] w-auto" />
            </div>
            <p className="text-small leading-snug"><span className="font-semibold">Wordmark</span><br /><span className="muted">{l.variants[1]!.note}</span></p>
          </div>
          <div className="flex items-center gap-16 rounded-[calc(var(--su)*2)] border hairline p-16">
            <div className="flex h-[calc(var(--su)*64)] w-[calc(var(--su)*64)] shrink-0 items-center justify-center rounded-[calc(var(--su)*14)] bg-graphite">
              <Logo variant="mark" tone="dark" className="h-[calc(var(--su)*34)] w-auto" />
            </div>
            <p className="text-small leading-snug"><span className="font-semibold">Monogram</span><br /><span className="muted">{l.variants[2]!.note}</span></p>
          </div>
          <ul className="grid grid-cols-2 gap-x-24 gap-y-10 rounded-[calc(var(--su)*2)] border hairline p-16">
            {l.rules.map((r) => (
              <li key={r.label} className="text-small leading-snug">
                <span className="meta text-accent">{r.label}</span>
                <br />
                {r.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ── Logo misuse ─────────────────────────────────────────────────────────── */
function Example({ id }: { id: string }): ReactNode {
  const base = 'h-[calc(var(--su)*44)] w-auto';
  switch (id) {
    case 'red-on-dark':
      return (
        <div className="flex h-full items-center justify-center bg-graphite">
          <Logo variant="full" tone="dark" colors={{ red: '#B3261E' }} className={base} />
        </div>
      );
    case 'recolor':
      return <Logo variant="full" tone="light" colors={{ ink: '#1F3A93', saffron: '#00C2A8', red: '#7B2CBF' }} className={base} />;
    case 'stretch':
      return <Logo variant="full" tone="light" className={`${base} scale-x-[1.45] scale-y-[0.8]`} />;
    case 'effects':
      return (
        <div style={{ filter: 'drop-shadow(0 0 10px rgba(240,122,26,0.9)) drop-shadow(4px 4px 0 rgba(28,25,23,0.35))' }}>
          <Logo variant="full" tone="light" colors={{ red: '#F07A1A' }} className={base} />
        </div>
      );
    case 'retype':
      return (
        <span className="text-[calc(var(--su)*40)] font-serif italic leading-none text-graphite">
          Mat<span className="text-saffron">.</span>
          <span className="text-signal">AI</span>
        </span>
      );
    default:
      return (
        <div className="relative h-full w-full">
          <Still id="ikea-story@3" alt="" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo variant="full" tone="light" className={base} />
          </div>
        </div>
      );
  }
}

export function BrandMisuse(props: SlideProps) {
  const m = g.misuse;
  return (
    <SlideFrame {...props}>
      <div className="safe flex flex-col">
        <Heading kicker={m.kicker} headline={m.headline} />
        <ul className="mt-28 grid flex-1 grid-cols-3 gap-16 stack:grid-cols-1">
          {m.items.map((it) => (
            <li key={it.id} className="flex flex-col">
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[calc(var(--su)*2)] border hairline bg-bone stack:h-[140px] stack:flex-none">
                <Example id={it.id} />
                <span className="absolute right-10 top-10 flex h-24 w-24 items-center justify-center rounded-full bg-signal text-[calc(var(--su)*13)] font-bold text-cream" aria-hidden="true">
                  ✕
                </span>
              </div>
              <p className="mt-10 text-small font-medium">{it.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </SlideFrame>
  );
}

/* ── Colour ──────────────────────────────────────────────────────────────── */
export function BrandColor(props: SlideProps) {
  const c = g.color;
  const darkText = new Set(['#FFF8EE', '#F2B233', '#F07A1A']);
  return (
    <SlideFrame {...props}>
      <div className="safe flex flex-col">
        <Heading kicker={c.kicker} headline={c.headline} />
        <div className="mt-24 grid grid-cols-5 gap-10 stack:grid-cols-2">
          {c.swatches.map((s) => (
            <div key={s.hex} className="flex h-[calc(var(--su)*260)] flex-col justify-end rounded-[calc(var(--su)*2)] p-16 stack:h-[150px]" style={{ background: s.hex, color: darkText.has(s.hex) ? '#1C1917' : '#FFF8EE', outline: s.hex === '#1C1917' ? '1px solid rgb(255 248 238 / 0.18)' : undefined }}>
              <p className="text-[calc(var(--su)*18)] font-semibold">{s.name}</p>
              <p className="meta mt-6">{s.hex}</p>
              <p className="meta opacity-70">RGB {s.rgb}</p>
              <p className="mt-8 text-[calc(var(--su)*11.5)] leading-snug opacity-85">{s.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-[1fr_1fr_1.2fr] gap-16 stack:mt-6 stack:grid-cols-1">
          {c.pairings.map((p) => {
            const light = p.bg === 'Cream';
            return (
              <div key={p.bg} className="rounded-[calc(var(--su)*2)] p-18" style={{ background: light ? '#FFF8EE' : '#141210', color: light ? '#1C1917' : '#FFF8EE', outline: light ? undefined : '1px solid rgb(255 248 238 / 0.15)' }}>
                <p className="meta opacity-60">On {p.bg.toLowerCase()}</p>
                <p className="title mt-8 text-[calc(var(--su)*26)]">
                  Directed like <span style={{ color: light ? '#B3261E' : '#F2B233' }}>cinema</span>.
                </p>
                <p className="meta mt-8 opacity-70">
                  {p.text} text · {p.accent} accent · {p.contrast}
                </p>
              </div>
            );
          })}
          <div className="rounded-[calc(var(--su)*2)] border hairline p-18">
            <p className="meta muted">Proportion</p>
            <div className="mt-12 flex h-[calc(var(--su)*16)] overflow-hidden rounded-full">
              <span style={{ width: '40%', background: '#FFF8EE' }} />
              <span style={{ width: '40%', background: '#1C1917', outline: '1px solid rgb(255 248 238 / 0.2)' }} />
              <span style={{ width: '9%', background: '#B3261E' }} />
              <span style={{ width: '6%', background: '#F2B233' }} />
              <span style={{ width: '5%', background: '#F07A1A' }} />
            </div>
            <ul className="mt-10 grid gap-4">
              {c.proportion.map((p) => (
                <li key={p.name} className="flex justify-between text-small">
                  <span>{p.name}</span>
                  <span className="meta num">{p.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

/* ── Typography ──────────────────────────────────────────────────────────── */
export function BrandType(props: SlideProps) {
  const t = g.type;
  const sizes: Record<string, string> = {
    Display: 'text-[calc(var(--su)*76)] leading-[0.9]',
    Headline: 'text-[calc(var(--su)*42)]',
    Body: 'text-[calc(var(--su)*18)] leading-[1.45]',
    Accent: 'text-[calc(var(--su)*32)]',
    Meta: 'text-[calc(var(--su)*13)]',
  };
  return (
    <SlideFrame {...props} footer={t.note}>
      <div className="safe flex flex-col">
        <Heading kicker={t.kicker} headline={t.headline} />
        <ul className="mt-40 grid gap-0 stack:mt-6">
          {t.styles.map((s) => (
            <li key={s.role} className="grid grid-cols-[calc(var(--su)*150)_calc(var(--su)*230)_1fr] items-baseline gap-24 border-t hairline py-[calc(var(--su)*20)] stack:grid-cols-1 stack:gap-1">
              <span className="meta text-accent">{s.role}</span>
              <span className="text-small muted">{s.family}</span>
              <span className={`${s.className} ${sizes[s.role] ?? ''} min-w-0 truncate`}>{s.sample}</span>
            </li>
          ))}
        </ul>
      </div>
    </SlideFrame>
  );
}

/* ── Elements & imagery ──────────────────────────────────────────────────── */
export function BrandElements(props: SlideProps) {
  const e = g.elements;
  return (
    <SlideFrame {...props}>
      <div className="safe flex flex-col">
        <Heading kicker={e.kicker} headline={e.headline} />
        <div className="mt-24 grid flex-1 grid-cols-[1fr_1.25fr] gap-40 stack:grid-cols-1">
          <ul className="grid gap-16">
            {e.items.map((it, i) => (
              <li key={it.name} className="grid grid-cols-[calc(var(--su)*150)_1fr] items-center gap-18 border-t hairline pt-14">
                <div className="relative flex h-[calc(var(--su)*96)] items-center justify-center rounded-[calc(var(--su)*2)] bg-ink">
                  {i === 0 && (
                    <>
                      <Brackets inset={10} size={16} />
                      <span className="meta text-cream/50">frame</span>
                    </>
                  )}
                  {i === 1 && <Logo variant="mark" tone="dark" className="h-[calc(var(--su)*54)] w-auto" />}
                  {i === 2 && <Slate className="px-8 text-center text-[calc(var(--su)*8)] text-cream/80" items={['EP 01', '9:16', 'Lingopie']} />}
                </div>
                <div>
                  <p className="text-body font-semibold">{it.name}</p>
                  <p className="mt-4 text-small text-cream/70 leading-snug">{it.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col">
            <p className="meta text-accent">Imagery — do</p>
            <div className="mt-12 grid grid-cols-4 gap-10">
              {['maid-ep01@1', 'vamp-ep01@2', 'msf-ep01@0', 'sew-ep01@3'].map((id) => (
                <div key={id} className="media-frame relative aspect-[9/16]">
                  <Still id={id} alt="" />
                </div>
              ))}
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-20 gap-y-4">
              {e.imageryDo.map((d) => (
                <li key={d} className="text-small"><span className="text-accent">✓</span> {d}</li>
              ))}
            </ul>
            <p className="meta muted mt-20">Imagery — don’t</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-20 gap-y-4">
              {e.imageryDont.map((d) => (
                <li key={d} className="text-small text-cream/70"><span className="text-cream/45">✕</span> {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
