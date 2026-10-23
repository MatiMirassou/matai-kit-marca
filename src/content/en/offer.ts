import type { Engagement, Service } from '../types.ts';

/* ── 03 · What I make ────────────────────────────────────────────────────── */
export const offerCopy = {
  kicker: 'What I make',
  headline: 'THREE SOLUTIONS. ONE CREATIVE ENGINE.',
  crafts: { story: 'Cinematic storytelling', system: 'Content systems' },
  loop: 'Automation can also support repeatable drama and ad production.',
};

export const services: Service[] = [
  { id:'dramas', craft:'story', n:'01', name:'Vertical Dramas',
    line:'Serialized 9:16 stories with a cast and a world that stay consistent.',
    points:['Writing & direction','AI casts & continuity','Edit, sound & delivery'], media:'ff-ep01@1' },
  { id:'ads', craft:'story', n:'02', name:'AI Ads & UGC',
    line:'Commercials, product advertising and UGC-style performance creative.',
    points:['Commercial concepts','Product & brand films','Social variants'], media:'lingopie-ugc' },
  { id:'automation', craft:'system', n:'03', name:'Content Automation',
    line:'Repeatable audiovisual systems for podcasts, tutorials and news.',
    points:['Production workflows','Audio & video outputs','Human review & delivery'], media:'news-show' },
];

/* ── 12 · Client fit & engagement ────────────────────────────────────────── */
export const fitCopy = {
  kicker: 'Working together',
  headline: 'Who I work with — and how.',
  clientsTitle: 'Best fit',
  waysTitle: 'How we work',
  standardsTitle: 'Standards',
  notFocusTitle: 'Not my focus',
};

export const clients: string[] = [
  'Microdrama platforms & studios',
  'Advertising & creative agencies',
  'Brands investing in premium video',
  'Media, news & education companies',
  'Tech & AI companies',
];

export const engagements: Engagement[] = [
  {name:'Brief & plan',text:'Define the audience, format, scope and delivery needs.'},
  {name:'Creative development',text:'Agree the story, references or workflow before production.'},
  {name:'Production & build',text:'Generate, edit and assemble the film or production system.'},
  {name:'Review & delivery',text:'Review the work together, refine it and deliver the agreed formats.'},
];

export const principles: string[] = [
  'A person directs and signs off every deliverable.',
  'Real faces and voices only with explicit consent.',
  'No unlicensed IP or imitation of living artists on commission.',
  'Synthetic media is disclosed where it could mislead.',
];

export const exclusions: string[] = [
  'Mass-produced content with no creative direction',
  'Deceptive uses: impersonation, fake testimonials',
  'Work that can’t meet professional review',
  'Projects without the necessary IP, brand, likeness or usage rights',
];
