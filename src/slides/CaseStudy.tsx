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
 const stages=['Story Bible & Scripts','Cast & Location Anchors','Shot-by-Shot Generation','Selects, Edit & Sound','Subtitles & 9:16 Delivery'];
 return <SlideFrame {...props} className="revised-ff" footer={<span>Client: Lingopie / Actual story, reference assets, edit and mix</span>}><div className="safe">
  <div className="case-title-row"><div><Kicker className="muted mb-12">Case Study / Vertical Drama</Kicker><Headline text="Forgotten Fortune" className="title text-[calc(var(--su)*52)] stack:text-[36px]"/></div><PlayLink id="ff-ep01" label="Watch episode 01"/></div>
  <div className="ff-stages">{stages.map((s,i)=><section className={'ff-stage ff-stage-'+i} key={s}><div className="ff-stage-heading"><span>0{i+1}</span><h3>{s}</h3></div>
   {i===0&&<><div className="ff-bible"><strong>{e.bibleTitle}</strong><p>{e.bibleExcerpt}</p></div><div className="ff-script"><strong>{e.scriptScene}</strong>{e.script.map(([name,line],j)=><p key={j}><b>{name}</b>{line}</p>)}</div></>}
   {i===1&&<div className="ff-anchor-mosaic">{e.anchors.map(a=><figure key={a.media}><div className="media-frame"><Still id={a.media} alt={a.label} fit="contain"/></div><figcaption>{a.label}</figcaption></figure>)}</div>}
   {i===2&&<><div className="ff-shot-mosaic">{['ff-ep01@0','ff-ep01@1','ff-ep01@2','ff-ep01@4'].map((id,j)=><div className="media-frame" key={id}><Still id={id} alt={'Forgotten Fortune shot '+(j+1)}/></div>)}</div><p className="ff-caption">Framing, performance and continuity</p></>}
   {i===3&&<><div className="ff-select media-frame"><Still id="ff-ep01@5" alt="A selected shot from the finished Forgotten Fortune edit"/></div><div className="ff-wave media-frame"><Still id="ff-mix" alt="Waveform extracted from the actual episode 01 stereo mix"/></div><p className="ff-caption">Episode 01 picture edit & stereo mix</p><PlayLink id="ff-mix" label="Listen to the episode mix"/></>}
   {i===4&&<><MediaAction id="ff-ep01" title="Forgotten Fortune" className="ff-delivery media-frame group"><Video id="ff-ep01" poster="ff-ep01@3" play="hover" alt="Finished Forgotten Fortune 9:16 delivery"/><PlayGlyph/></MediaAction><p className="ff-caption">9:16 episode master</p><PlayLink id="ff-ep01" label="Watch finished episode"/></>}
  </section>)}</div>
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
