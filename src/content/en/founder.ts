import { DRAFT, type Founder } from '../types.ts';

// Facts below come from the founder's CV (LinkedIn export, CV/Profile.pdf).
// Items marked DRAFT need a final confirmation before external use.
export const founder: Founder = {
  name: 'Matías Mirassou',
  role: 'Director · Editor · Creative technologist',
  headline: 'Twenty years of cutting picture. Now I direct it with AI.',
  bio: DRAFT(
    'I’m Matías Mirassou, an editor and director from Buenos Aires. I trained in audiovisual arts and animation film direction, spent a decade finishing broadcast television, and edited documentaries for the big screen. Today I write, direct and finish AI-generated films and series — and build the pipelines that produce them.',
    'confirm tone and facts',
  ),
  portrait: {
    media: 'portrait-studio',
    caption: 'Portrait: AI-generated from my own likeness.',
    alt: 'AI-generated portrait of Matías Mirassou in a dark overshirt against a warm orange background.',
  },
  timeline: [
    { year: '2006', title: 'First editing credits', detail: 'Documentaries and short films while studying audiovisual arts (IUNA).' },
    { year: '2010', title: 'Broadcast TV post-production', detail: 'Fox Toma 1 — editing for Utilísima and Fox Life.' },
    { year: '2015', title: 'Endemol Argentina', detail: 'Finishing editor for television.' },
    { year: '2016', title: 'Resto del Mundo · Canal 13', detail: 'Finishing editor, 3 de Febrero Visión (2016–2020).' },
    { year: '2017', title: 'Animation film direction', detail: 'Escuela Da Vinci (2013–2017).' },
    { year: '2021', title: 'Lingopie', detail: 'Video editor and content creator.' },
    { year: '2026', title: 'AI Content Creator · Mat.AI', detail: 'Gen-AI microdramas and content automation.' },
  ],
  credits: [
    { title: 'El Almafuerte', detail: 'Editor · feature documentary, INCAA · 2009' },
    { title: 'El Objeto de mi Amor', detail: 'Editor · feature documentary, INCAA · 2014' },
    { title: 'Otoño', detail: DRAFT('Editor · short film, Premio Talento UNIFEST · 2007', 'verify award wording') },
  ],
  skills: [
    'Direction',
    'Editing & finishing',
    'Motion graphics',
    'Generative image & video',
    'Voice, music & mix',
    'Workflow automation',
  ],
};
