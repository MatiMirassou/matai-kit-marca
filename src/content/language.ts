import type {Language} from '../lib/routes.ts';
export const locale:Language=typeof window==='undefined'
 ? ((globalThis as typeof globalThis & {__MATAI_LOCALE__?:Language}).__MATAI_LOCALE__??'en')
 : location.pathname.split('/')[1]==='es'?'es':location.pathname.split('/')[1]==='en'?'en':new URLSearchParams(location.search).get('lang')==='es'?'es':'en';
export const copy=(en:string,es:string)=>locale==='es'?es:en;
