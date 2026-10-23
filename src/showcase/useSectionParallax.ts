import {useEffect,useRef} from 'react';
/** Small, clipped image drift. Native scrolling stays native; motion can be disabled. */
export function useSectionParallax(){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const paint=()=>{frame=0;const rect=el.getBoundingClientRect();const disabled=reduced.matches||innerWidth<960||new URLSearchParams(location.search).get('motion')==='off';const drift=disabled?0:Math.max(-50,Math.min(50,(innerHeight/2-rect.top-rect.height/2)*.09));el.style.setProperty('--section-drift',drift+'px');};
  const update=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduced.addEventListener('change',update);paint();
  return()=>{removeEventListener('scroll',update);removeEventListener('resize',update);reduced.removeEventListener('change',update);cancelAnimationFrame(frame);};
 },[]);
 return ref;
}
