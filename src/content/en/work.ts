import { type CaseStudy, type Project } from '../types.ts';

export const kindLabel = {
  client: 'Client',
  personal: 'Personal R&D',
  spec: 'Spec',
  system: 'System',
  concept: 'Synthetic UGC concept',
} as const;

/* ── 04 · Vertical series ────────────────────────────────────────────────── */
export const seriesCopy = {
  kicker: 'Vertical Dramas · Lingopie Originals',
  headline: 'Earn the next episode.',
  sub: 'Selected completed dramas for Lingopie. Serialized stories, directed and finished for the vertical screen.',
  role: 'Creative production',
  series: ['forgotten-fortune', 'patient', 'wedding', 'maid'],
};

/* ── 07 · AI Ads ─────────────────────────────────────────────────────────── */
export const adsCopy = {
  kicker: 'AI Ads & UGC',
  headline: 'Commercial ideas. Distinctive execution.',
  sub: 'Product concepts and synthetic UGC-style performances. Independent spec work is identified.',
  process: ['Concept', 'Boards', 'Generated shots', 'Edit & grade', 'Versions'],
  items: ['neon-night', 'lingopie-ugc'],
};

/* ── 08 · Cinematic craft ────────────────────────────────────────────────── */
export const craftCopy = {
  kicker: 'AI Ads · Cinematic craft',
  headline: 'Range, built shot by shot.',
  sub: 'Personal R&D: performance, action, light and texture — the techniques that carry into client work.',
  items: [] as string[],
};

/* ── 09 · Podcasts & tutorials ───────────────────────────────────────────── */
export const podcastsCopy = {
  kicker: 'Content Automation / Outputs',
  headline: 'Content automation in four formats.',
  sub: 'Four formats from real production samples.',
  outputs: [
    {title:'Podcast',project:'ai-host',detail:'Consented AI likeness / Video podcast'},
    {title:'Tutorials',project:'tutorial',detail:'Synthetic presenter / Instructional video'},
    {title:'Video News',project:'news-output',detail:'Lingopie / Spanish news episode'},
    {title:'Audio News',project:'news-audio',detail:'Lingopie / Spanish audio briefing'},
  ],
};

/* ── Projects ────────────────────────────────────────────────────────────── */
export const projects: Project[] = [
  {
    "id": "forgotten-fortune",
    "title": "Forgotten Fortune",
    "logline": "A rescue, a lost memory and a family secret.",
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "ff-ep01",
    "keyArt": "keyart-ff",
    "frames": [
      "ff-ep01@0",
      "ff-ep01@1",
      "ff-ep01@2",
      "ff-ep01@3"
    ],
    "episodes": [
      {
        "label": "EP 01",
        "media": "ff-ep01"
      },
      {
        "label": "EP 02",
        "media": "ff-ep02"
      }
    ]
  },
  {
    "id": "patient",
    "title": "The Patient With No Past",
    "logline": "An identity mystery, told one episode at a time.",
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "patient-ep01",
    "keyArt": "keyart-patient",
    "frames": [
      "patient-ep01@0",
      "patient-ep01@1",
      "patient-ep01@2",
      "patient-ep01@3"
    ],
    "episodes": [
      {
        "label": "EP 01",
        "media": "patient-ep01"
      }
    ]
  },
  {
    "id": "news-show",
    "title": "Daily News Video Show",
    "logline": "News in One Minute / Spanish / 18 August 2026",
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "news-show",
    "note": "Synthetic presenter. News-show production sample."
  },
  {
    "id": "news-output",
    "title": "News in One Minute",
    "logline": "Spanish video news / 17 August 2026",
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "news-output"
  },
  {
    "id": "tutorial",
    "title": "Tutorial",
    "logline": "Instructional video with a synthetic presenter.",
    "kind": "system",
    "year": "2026",
    "media": "tutorial",
    "note": "Synthetic presenter / Production sample"
  },
  {
    "id": "news-audio",
    "title": "News in Easy Spanish",
    "logline": "Audio news briefing / 5 March 2025",
    "kind": "client",
    "client": "Lingopie",
    "year": "2025",
    "media": "news-audio"
  },
  {
    "id": "maid",
    "title": "The Maid Knows Everything",
    "logline": {
      "kind": "draft",
      "text": "A maid in a glass mansion sees what the family hides.",
      "note": "confirm logline"
    },
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "maid-ep01",
    "keyArt": "keyart-maid",
    "frames": [
      "maid-ep01@0",
      "maid-ep01@2",
      "maid-ep01@3",
      "maid-ep01@1"
    ],
    "episodes": [
      {
        "label": "EP 01",
        "media": "maid-ep01"
      },
      {
        "label": "EP 02",
        "media": "maid-ep02"
      }
    ]
  },
  {
    "id": "wedding",
    "title": "Someone Else’s Wedding",
    "logline": {
      "kind": "draft",
      "text": "A wedding planner in Chicago. A call that changes the plan.",
      "note": "confirm logline"
    },
    "kind": "client",
    "client": "Lingopie",
    "year": "2026",
    "media": "sew-ep01",
    "keyArt": "keyart-sew",
    "frames": [
      "sew-ep01@1",
      "sew-ep01@0",
      "sew-ep01@2",
      "sew-ep01@3"
    ],
    "episodes": [
      {
        "label": "EP 01",
        "media": "sew-ep01"
      }
    ]
  },
  {
    "id": "neon-night",
    "title": "Neon Night",
    "logline": "Nike-themed sneaker concept board. Independent spec work.",
    "kind": "spec",
    "year": "2026",
    "media": "neon-night-b",
    "frames": [
      "neon-night-a"
    ],
    "note": "Spec concept — not commissioned by, or affiliated with, the brand shown."
  },
  {
    "id": "lingopie-ugc",
    "title": "Street interview",
    "logline": "A synthetic street-interview concept with fictional performances.",
    "kind": "client",
    "client": "Lingopie",
    "year": "2025",
    "media": "lingopie-ugc",
    "note": "Synthetic fictional performances. Not an unscripted customer endorsement."
  },
  {
    "id": "ai-host",
    "title": "The AI Host",
    "logline": "A video podcast presented by my own consented AI likeness.",
    "kind": "system",
    "year": "2026",
    "media": "podcast-b",
    "episodes": [
      {
        "label": "Clip 1",
        "media": "podcast-a"
      },
      {
        "label": "Clip 2",
        "media": "podcast-b"
      },
      {
        "label": "Clip 3",
        "media": "podcast-c"
      }
    ]
  }
];

/* ── Case studies (two, both Lingopie) ───────────────────────────────────── */
export const caseCopy = {
  labels: {
    challenge: 'Challenge',
    solution: 'Creative solution',
    approach: 'Production approach',
    deliverables: 'Deliverables',
    results: 'Results',
    role: 'Role',
    tools: 'Tools',
  },
};

export const caseStudies: CaseStudy[] = [
  {
    id:'forgotten-fortune', title:'Forgotten Fortune', kind:'client',client:'Lingopie',
    kicker:'Case Study / Vertical Drama',headline:'Forgotten Fortune',
    challenge:'Keep the cast, world and performance consistent across an episodic story.',
    solution:'A script and reference system carried from story development into each generated shot.',
    approach:['Story Bible & Scripts','Cast & Location Anchors','Shot-by-Shot Generation','Selects, Edit & Sound','Subtitles & 9:16 Delivery'],
    deliverables:['9:16 episodes','Picture edit & stereo mix'],results:[],role:'Creative production',
    frames:[{media:'ff-ep01@0',caption:'Scene construction'},{media:'ff-ep01@1',caption:'Performance'},{media:'ff-ep01@2',caption:'Continuity'},{media:'ff-ep01@3',caption:'Finished frame'}],
  },
  {
    id:'news-show',title:'Daily News Video Show',kind:'client',client:'Lingopie',
    kicker:'Case Study / Content Automation',headline:'A daily news show, ready for the screen',
    challenge:'Turn a dated editorial rundown into a consistent presenter-led news episode.',
    solution:'An approved script feeds voice and presenter production. Visuals, sound and subtitles are assembled into the finished show.',
    approach:['Editorial rundown','Script & voice','Presenter & visuals','Assembly & captions','Review & delivery'],
    deliverables:['Spanish video-news episode','Timed subtitle file','16:9 delivery'],results:[],role:'System design / Editorial rules / Production',
    outputs:[{name:'News in One Minute',text:'18 August 2026',media:'news-show'}],
  },
];

export const forgottenEvidence = {
  bibleTitle:'World & story',
  bibleExcerpt:'When a young woman pulls a billionaire from a wrecked car on a rain-soaked mountain road…',
  scriptScene:"EPISODE 1 / INT. MIA'S CAR / NIGHT",
  script:[['SOPHIE','The electricity company called again.'],['MIA','I know.'],['SOPHIE','You said that yesterday.'],['MIA','And look at that. I still know today.']],
  anchors:[{media:'ff-mia',label:'Mia / Wardrobe'},{media:'ff-julian',label:'Julian / Wardrobe'},{media:'ff-office',label:'Cross Capital'},{media:'ff-ledger',label:'Story prop'}],
};
