import {content,t} from '../content';
import {Kicker,KindTag} from '../components/Cinema.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Video} from '../components/Video.tsx';
import {MediaAction,PlayLink} from '../components/MediaAction.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {PlayGlyph} from './shared.tsx';
export function Ads(props:SlideProps) {
 const c=content.adsCopy;
 return <SlideFrame {...props} className="revised-ads"><div className="safe">
  <Kicker className="muted mb-14">{c.kicker}</Kicker><Headline text={c.headline} className="title ads-title"/>
  <div className="ads-showcase">{c.items.map(id=>{const p=content.projects.find(p=>p.id===id)!;return <article key={id}><MediaAction id={p.media} title={p.title} className="ad-visual media-frame group"><Video id={p.media} play="hover" fit="contain" alt={p.title}/>{id!=='neon-night'&&<PlayGlyph/>}</MediaAction><div className="ad-heading"><h3>{p.title}</h3><KindTag kind={p.kind} client={p.client}/></div><p>{id==='neon-night'?t("Independent Nike-themed spec concept. Not commissioned by or affiliated with Nike."):t("Synthetic fictional performances. UGC-style concept, not an unscripted customer endorsement.")}</p><PlayLink id={p.media} label={id==='neon-night'?t("Open concept board"):t("Watch Street Interview")}/></article>})}</div>
 </div></SlideFrame>;
}
/** Kept only for the separate source registry; not part of the capabilities deck. */
export function Craft(){return null;}
