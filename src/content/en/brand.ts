import { type Brand } from '../types.ts';

export const brand: Brand = {
  name: 'Mat.AI',
  founder: 'Matías Mirassou',
  tagline: 'Directed like cinema. Engineered to scale.',
  taglineMarked: 'Directed like *cinema*.\nEngineered to _scale_.',
  coverSub: 'AI films, vertical series and the systems that produce them — by Matías Mirassou.',
  eyebrow: 'Capabilities 2026',
  location: 'Buenos Aires — working worldwide',
  languages: 'English · Español',
  publicUrl: '',
  contact: {
    email: 'matias.mirassou@gmail.com',
    emailSubject: 'Project enquiry — Mat.AI',
    links: [
      { label: 'Email', value: 'matias.mirassou@gmail.com', href: 'mailto:matias.mirassou@gmail.com' },
      { label: 'LinkedIn', value: 'linkedin.com/in/matiasmirassou', href: 'https://www.linkedin.com/in/matiasmirassou' },
    ],
  },
};

/* ── 13 · Final CTA + contact ────────────────────────────────────────────── */
export const contactCopy = {
  kicker: 'Let’s work together',
  headline: 'Bring me a *story*.\nOr a *bottleneck*.',
  sub: 'Tell me what you’re making, where it needs to go and how often. I’ll come back with a direction, a format and a plan.',
  cta: 'Start a project',
};

/* ── 14 · Credits ────────────────────────────────────────────────────────── */
export const creditsCopy = {
  title: 'Credits',
  lines: [
    { role: 'Direction, writing & edit', name: 'Matías Mirassou' },
    { role: 'Client work', name: 'Lingopie — vertical dramas & content automation' },
    { role: 'Spec & R&D', name: 'Not commissioned; brands shown are not affiliated' },
    { role: 'Synthetic media', name: 'Generated with AI, directed and finished by a person' },
  ],
  sourcesTitle: 'Sources',
  note: 'Research date: 11 Oct 2026. Figures quoted as published; estimates, forecasts and surveys are labelled on the slide.',
};
