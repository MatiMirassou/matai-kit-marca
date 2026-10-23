import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
interface MediaRuntime {isPrint:boolean;still:boolean;}
const Context=createContext<MediaRuntime>({isPrint:false,still:true});
export const useMediaRuntime=()=>useContext(Context);
export function MediaRuntimeProvider({children,value}:{children:ReactNode;value?:MediaRuntime}){
 const [still,setStill]=useState(true);
 useEffect(()=>{
  if(value)return;
  const query=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setStill(query.matches||new URLSearchParams(location.search).get('motion')==='off');
  sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync);
 },[value]);
 return <Context.Provider value={value??{isPrint:false,still}}>{children}</Context.Provider>;
}
