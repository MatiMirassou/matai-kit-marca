import {content} from '../content';
import {forgottenEvidence} from '../content/en/work.ts';
import {Kicker} from '../components/Cinema.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Still,Video} from '../components/Video.tsx';
import {MediaAction,PlayLink} from '../components/MediaAction.tsx';
import {Txt} from '../components/Txt.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {PlayGlyph} from './shared.tsx';

function ForgottenFortune(props:SlideProps) {
 const e=forgottenEvidence;
 const shots=[{id:'ff-ep01@0',label:'Interior'},{id:'ff-ep01@1',label:'Close-up'},{id:'ff-ep01@2',label:'Exterior'}];
 return <SlideFrame {...props} className="revised-ff hybrid-ff" footer={<span>Client: Lingopie / Actual story, reference assets, edit and mix</span>}><div className="safe">
  <div className="case-title-row"><div><Kicker className="muted mb-12">Case Study / Vertical Drama</Kicker><Headline text="Forgotten Fortune" className="title text-[calc(var(--su)*52)] stack:text-[36px]"/></div><p className="ff-case-intent">Character continuity, from reference to finished frame.</p></div>
  <div className="ff-process">
   <section className="ff-process-story">
    <div className="ff-process-heading"><span>01</span><h3>Story Bible & Scripts</h3></div>
    <p className="ff-story-extract">{e.bibleExcerpt}</p>
    <div className="ff-script"><strong>{e.scriptScene}</strong>{e.script.slice(0,2).map(([name,line],j)=><p key={j}><b>{name}</b>{line}</p>)}</div>
   </section>
   <section className="ff-process-anchors">
    <div className="ff-process-heading"><span>02</span><h3>Cast & Location Anchors</h3></div>
    <div className="ff-reference-grid">{e.anchors.map(a=><figure key={a.media}><MediaAction id={a.media} title={a.label+' reference'} className="media-frame"><Still id={a.media} alt={a.label+' production reference'} fit="contain"/></MediaAction><figcaption>{a.label}</figcaption></figure>)}</div>
   </section>
   <section className="ff-process-shots">
    <div className="ff-process-heading"><span>03</span><h3>Shot-by-Shot Generation</h3></div>
    <div className="ff-continuity-strip">{shots.map(s=><figure key={s.id}><div className="media-frame"><Still id={s.id} alt={'Mia / '+s.label+' / Finished Forgotten Fortune episode 01'}/></div><figcaption>{s.label}</figcaption></figure>)}</div>
    <p className="ff-continuity-note">The same character, wardrobe and world across the sequence.</p>
   </section>
   <section className="ff-process-edit">
    <div className="ff-process-heading"><span>04</span><h3>Selects, Edit & Sound</h3></div>
    <div className="ff-edit-proof"><div className="ff-edit-still media-frame"><Still id="ff-ep01@5" alt="A selected shot from the finished Forgotten Fortune edit"/></div><div><MediaAction id="ff-mix" title="Forgotten Fortune episode 01 stereo mix" className="ff-edit-wave media-frame"><Still id="ff-mix" alt="Waveform extracted from the actual episode 01 stereo mix"/></MediaAction><p className="ff-proof-note">Episode 01 / Picture edit & stereo mix</p><MediaAction id="ff-mix" title="Forgotten Fortune stereo mix" className="ff-inline-play">Listen to the episode mix</MediaAction></div></div>
   </section>
   <section className="ff-process-delivery">
    <div className="ff-process-heading"><span>05</span><h3>Subtitles & 9:16 Delivery</h3></div>
    <div className="ff-delivery-proof"><MediaAction id="ff-ep01" title="Forgotten Fortune" className="ff-master media-frame group"><Video id="ff-ep01" poster="ff-ep01@4" play="hover" alt="Finished Forgotten Fortune 9:16 episode master"/><PlayGlyph/></MediaAction><div><p className="ff-master-title">The finished episode</p><p className="ff-proof-note">9:16 master / Picture & sound</p><MediaAction id="ff-ep01" title="Forgotten Fortune episode 01" className="ff-inline-play">Watch finished episode</MediaAction></div></div>
   </section>
  </div>
 </div></SlideFrame>;
}
function NewsShow(props:SlideProps) {
 const cs=content.caseStudies.find(c=>c.id==='news-show')!;
 return <SlideFrame {...props} className="revised-news-case" footer={<span>Client: Lingopie / News in One Minute / 18 August 2026 / Synthetic presenter</span>}><div className="safe">
  <Kicker className="muted mb-14">{cs.kicker}</Kicker><Headline text={cs.headline} className="title news-case-title"/>
  <div className="news-case-layout"><div className="news-case-story"><h3>Challenge</h3><p><Txt c={cs.challenge}/></p><h3>Solution</h3><p><Txt c={cs.solution}/></p><h3>Production approach</h3><ol>{cs.approach.map((s,i)=><li key={i}><span>0{i+1}</span><Txt c={s}/></li>)}</ol><p className="news-delivery">Spanish episode / 16:9 / Timed subtitles</p></div>
  <div className="news-case-proof"><MediaAction id="news-show" title="Daily News Video Show" className="news-case-video media-frame group"><Video id="news-show" poster="news-show@0" fit="contain" play="hover" alt="Actual News in One Minute finished episode"/><PlayGlyph/></MediaAction><div className="news-proof-row"><div className="news-proof-frame media-frame"><Still id="news-show@2" alt="Actual graphic in the finished news episode"/></div><div className="news-subtitle"><span>SUBTITLE EXTRACT / 00:10</span><p>El petróleo se disparó tras vencer el plazo para las negociaciones entre Estados Unidos e Irán.</p><small>Timed to the delivered episode</small></div></div><PlayLink id="news-show" label="Watch the news episode"/></div></div>
 </div></SlideFrame>;
}
export function CaseStudy(props:SlideProps){return props.slide.ref==='forgotten-fortune'?<ForgottenFortune {...props}/>:<NewsShow {...props}/>;}
