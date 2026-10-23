import {useRef,useState,type KeyboardEvent} from 'react';
import {content,t} from '../content';
import {Kicker,NodeGlyph} from '../components/Cinema.tsx';
import {FlowDiagram} from '../components/FlowDiagram.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Txt} from '../components/Txt.tsx';
import {useDeck} from '../deck/DeckProvider.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
export function Systems(props:SlideProps) {
 const c=content.systemsCopy;const {isPrint}=useDeck();
 const initial=Math.max(0,content.systems.findIndex(s=>s.id===c.printSystem));
 const [active,setActive]=useState(initial);const refs=useRef<(HTMLButtonElement|null)[]>([]);
 const s=content.systems[isPrint?initial:active]!;
 const onKey=(e:KeyboardEvent<HTMLButtonElement>)=>{let n:number|null=null;if(e.key==='ArrowRight')n=(active+1)%content.systems.length;if(e.key==='ArrowLeft')n=(active-1+content.systems.length)%content.systems.length;if(e.key==='Home')n=0;if(e.key==='End')n=content.systems.length-1;if(n!==null){e.preventDefault();setActive(n);refs.current[n]?.focus();}};
 return <SlideFrame {...props} className="revised-systems" footer={isPrint?<span>{t("Representative workflow: video news. The web version includes the other content types.")}</span>:undefined}><div className="safe">
  <Kicker className="muted mb-14">{c.kicker}</Kicker><Headline text={c.headline} className="title systems-title"/>
  {!isPrint&&<div role="tablist" aria-label={t("Workflows")} className="workflow-tabs">{content.systems.map((x,i)=><button ref={el=>{refs.current[i]=el}} role="tab" type="button" key={x.id} id={'tab-'+x.id} aria-selected={active===i} aria-controls="system-panel" tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={onKey}>{x.short}</button>)}</div>}
  <div id="system-panel" role={isPrint?undefined:'tabpanel'} aria-labelledby={isPrint?undefined:'tab-'+s.id} className="workflow-panel"><h3>{s.name}</h3><FlowDiagram key={s.id} system={s}/><div className="workflow-summary"><ul>{(['human','assisted','auto'] as const).map(t=><li key={t}><NodeGlyph type={t}/>{c.legend[t]}</li>)}</ul><p>{t('Output')}: <Txt c={s.output}/></p></div></div>
 </div></SlideFrame>;
}
