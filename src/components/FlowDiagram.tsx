import {useId,useMemo,useState} from 'react';
import type {ContentSystem} from '../content/types.ts';
import {plain} from '../content/types.ts';
import {layoutSystem,stages} from '../lib/layout.ts';
import {NodeGlyph} from './Cinema.tsx';
import {Txt} from './Txt.tsx';
import {systems as englishSystems} from '../content/en/systems.ts';

function StepIcon({label}:{label:string}) {
 const l=label.toLowerCase();
 let shape=<><circle cx="12" cy="9" r="6"/><path d="M9 15v4h6v-4M10 22h4"/></>;
 if(/voice|sound|music|narrat/.test(l))shape=<><path d="M3 10v4M7 6v12M11 3v18M15 7v10M19 5v14M23 10v4"/></>;
 else if(/script|story|bible|brief/.test(l))shape=<><path d="M5 2h10l5 5v15H5zM15 2v6h5M8 12h9M8 16h9M8 19h6"/></>;
 else if(/review|check|select/.test(l))shape=<><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>;
 else if(/visual|anchor|reference|generat|presenter|video/.test(l))shape=<><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="2"/><path d="m4 19 6-6 4 4 3-4 4 6"/></>;
 else if(/edit|sub|caption|assembl/.test(l))shape=<><path d="M3 5h18M3 12h18M3 19h18"/><rect x="5" y="2" width="4" height="6"/><rect x="14" y="9" width="4" height="6"/><rect x="8" y="16" width="4" height="6"/></>;
 else if(/publish|deliver|version|format|episode|clips/.test(l))shape=<><path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/></>;
 return <svg viewBox="0 0 24 24" className="flow-step-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shape}</svg>;
}
export function FlowDiagram({system,width=1136,height=280,nodeWidth=124,nodeHeight=96}:{system:ContentSystem;width?:number;height?:number;nodeWidth?:number;nodeHeight?:number}) {
 const layout=useMemo(()=>layoutSystem(system,width,height,nodeWidth,nodeHeight),[system,width,height,nodeWidth,nodeHeight]);
 const [active,setActive]=useState<string|null>(null);
 const iconLabels=useMemo(()=>new Map(englishSystems.find(s=>s.id===system.id)?.nodes.map(n=>[n.id,n.label])),[system.id]);
 const marker=useId().replace(/:/g,'');
 const u=(n:number)=>'calc(var(--su) * '+n+')';
 return <div className="flow-visual">
  <div className="relative stack:hidden" style={{width:u(width),height:u(height)}}>
   <svg viewBox={'0 0 '+width+' '+height} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true"><defs><marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1L7 4L0 7" fill="none" stroke="var(--color-stone)" strokeWidth="1.4"/></marker></defs>{layout.edges.map(e=><g key={e.from+'-'+e.to}><path d={e.d} fill="none" stroke="var(--color-stone)" strokeWidth="1.5" markerEnd={'url(#'+marker+')'}/><path d={e.d} fill="none" stroke="var(--color-teal)" strokeOpacity=".75" strokeWidth="1.5" className="edge-flow pdf:hidden"/></g>)}</svg>
   {system.nodes.map(n=>{const p=layout.nodes.get(n.id)!;return <button type="button" key={n.id} className={'flow-node flow-node-'+n.type} onMouseEnter={()=>setActive(n.id)} onMouseLeave={()=>setActive(null)} onFocus={()=>setActive(n.id)} onBlur={()=>setActive(null)} title={plain(n.detail)} aria-label={n.label+'. '+plain(n.detail)} style={{left:u(p.x-nodeWidth/2),top:u(p.y-nodeHeight/2),width:u(nodeWidth),height:u(nodeHeight)}}><div className="flow-node-top"><StepIcon label={iconLabels.get(n.id)??n.label}/><NodeGlyph type={n.type}/></div><strong>{n.label}</strong>{n.tool&&<span>{n.tool}</span>}</button>})}
  </div>
  <p className="flow-detail pdf:hidden" role="status">{active?<Txt c={system.nodes.find(n=>n.id===active)?.detail??''}/>:null}</p>
  <ol className="hidden stack:grid gap-4">{stages(system).map((group,i)=><li key={i} className="grid gap-3 border-l border-cream/20 pl-4">{group.map(n=><div key={n.id} className={'flow-mobile flow-mobile-'+n.type}><StepIcon label={iconLabels.get(n.id)??n.label}/><div><strong><NodeGlyph type={n.type}/> {n.label}</strong>{n.tool&&<span>{n.tool}</span>}</div></div>)}</li>)}</ol>
 </div>;
}
export function FlowChain({system,className=''}:{system:ContentSystem;className?:string}) {
 return <ol className={className}>{system.nodes.map(n=><li key={n.id}><NodeGlyph type={n.type}/> {n.label}</li>)}</ol>;
}
