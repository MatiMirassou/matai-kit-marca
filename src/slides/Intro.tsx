import {content,t} from '../content';
import {Brackets,Kicker} from '../components/Cinema.tsx';
import {Logo} from '../components/Logo.tsx';
import {Headline,Reveal} from '../components/Reveal.tsx';
import {Txt} from '../components/Txt.tsx';
import {Still,Video} from '../components/Video.tsx';
import {MediaAction} from '../components/MediaAction.tsx';
import {useDeck} from '../deck/DeckProvider.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import type {Founder as FounderData,Service} from '../content/types.ts';

const panels=[
 {media:'ff-ep01',poster:'ff-ep01@0',title:'Vertical Dramas',position:'48% 28%'},
 {media:'lingopie-ugc',poster:'lingopie-ugc@0',title:'AI Ads & UGC',position:'51% 35%'},
 {media:'news-output',poster:'news-output@2',title:'Content Automation',position:'52% 35%'},
];
export function Cover({coverPanels=panels,...props}:SlideProps & {coverPanels?:Array<(typeof panels)[number] & {preview?:string}>}) {
 const {params}=useDeck(); const {brand}=content;
 return <SlideFrame {...props} header={false} showFooter={false} className="revised-cover hybrid-cover">
  <div className="cover-panels">{coverPanels.map(p=><div key={p.media} className="cover-panel"><MediaAction id={p.media} title={t(p.title)} className="cover-panel-action"><Video id={p.preview??p.media} poster={p.poster} position={p.position} priority alt={t(p.title)}/></MediaAction><div className="cover-shade"/><span className="cover-service">{t(p.title)}</span></div>)}</div>
  <div className="cover-wash"/>
  <Brackets inset={22} size={22} className="stack:hidden"/>
  <div className="cover-top"><Logo variant="full" tone="dark" className="cover-logo"/><p className="cover-prepared">{params.forCompany ? `${content.ui.preparedFor} ${params.forCompany}` : brand.eyebrow}</p></div>
  <div className="cover-copy"><Headline as="h1" text={brand.taglineMarked} className="display-tight cover-title"/><p>{brand.coverSub.split(/ — (?:by|por) /)[0]}.<span className="cover-byline">{t('By')} {brand.founder}</span></p></div>
  <p className="cover-location">{brand.location}<span>{brand.languages}</span></p>
 </SlideFrame>;
}
export function Founder({profile=content.founder,creditsTitle=t('Selected credits'),extraClass='',...props}:SlideProps & {profile?:FounderData;creditsTitle?:string;extraClass?:string}) {
 const f=profile;
 return <SlideFrame {...props} className={`revised-founder ${extraClass}`}><div className="safe founder-layout">
  <div className="founder-portrait"><div className="media-frame"><Still id={f.portrait.media} alt={f.portrait.alt} position="50% 35%"/></div><p>{f.portrait.caption}</p></div>
  <div className="founder-bio"><Kicker className="muted">{f.role}</Kicker><Headline text={f.headline} className="title"/><p className="founder-body"><Txt c={f.bio}/></p><h3>{creditsTitle}</h3><ul>{f.credits.map(c=><li key={c.title}><em>{c.title}</em><span><Txt c={c.detail}/></span></li>)}</ul><p className="founder-skills">{f.skills.join(' / ')}</p></div>
  <div className="founder-timeline"><h3>{t("Experience")}</h3><ol>{f.timeline.map((t,i)=><li key={i}><span>{t.year}</span><strong><Txt c={t.title}/></strong><p><Txt c={t.detail}/></p></li>)}</ol></div>
 </div></SlideFrame>;
}
export function Offer({offer=content.offerCopy,services=content.services,...props}:SlideProps & {offer?:typeof content.offerCopy;services?:Service[]}) {
 const c=offer;
 return <SlideFrame {...props} className="revised-offer"><div className="safe">
  <Kicker className="muted mb-16">{c.kicker}</Kicker><Headline text={c.headline} className="title offer-title"/>
  <div className="solution-grid">{services.map(s=><Reveal key={s.id} className="solution"><div className="solution-image media-frame">{s.media&&<Still id={s.media} alt={s.name} position="50% 35%"/>}</div><div className="solution-title"><span>{s.n}</span><h3>{s.name}</h3></div><p>{s.line}</p><ul>{s.points.map(p=><li key={p}>{p}</li>)}</ul></Reveal>)}</div>
  <p className="solution-note">{c.loop}</p>
 </div></SlideFrame>;
}
