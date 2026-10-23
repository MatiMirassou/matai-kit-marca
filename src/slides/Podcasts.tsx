import {content} from '../content';
import {Kicker} from '../components/Cinema.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Video} from '../components/Video.tsx';
import {MediaAction,PlayLink} from '../components/MediaAction.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {PlayGlyph} from './shared.tsx';
export function Podcasts(props:SlideProps) {
 const c=content.podcastsCopy;
 return <SlideFrame {...props} className="revised-outputs" footer={<span>Synthetic presenters / Real production samples</span>}><div className="safe">
  <Kicker className="muted mb-14">{c.kicker}</Kicker><Headline text={c.headline} className="title outputs-title"/>
  <div className="output-grid">{c.outputs.map(o=>{const p=content.projects.find(p=>p.id===o.project)!;return <article key={o.title}><MediaAction id={p.media} title={p.title} episodes={p.episodes} className="output-image media-frame group"><Video id={p.media} play="hover" fit="contain" alt={o.title+' production sample'}/><PlayGlyph/></MediaAction><h3>{o.title}</h3><p>{o.detail}</p><PlayLink id={p.media} label={o.title==='Audio News'?'Listen to audio news':'Watch included video'}/></article>})}</div>
 </div></SlideFrame>;
}
