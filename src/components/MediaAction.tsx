import type { ReactNode } from 'react';
import { useDeck } from '../deck/DeckProvider.tsx';
import { media, url } from '../lib/media.ts';
import { useLightbox } from './Lightbox.tsx';

export function playbackHref(id: string) {
  const m = media(id);
  return url(m?.full ?? (m?.kind === 'image' ? m.poster : undefined));
}

/** The same thumbnail opens playback on the web and the bundled media in the PDF. */
export function MediaAction({id,title,children,className='',episodes}:{id:string;title:string;children:ReactNode;className?:string;episodes?:{label:string;media:string}[]}) {
  const {isPrint}=useDeck();
  const {open}=useLightbox();
  const m=media(id);
  const href=playbackHref(id);
  if(!m || !href) return <div className={className}>{children}</div>;
  if(isPrint || m.kind==='image') return <a href={href} target={isPrint?undefined:'_blank'} rel="noreferrer" className={className} aria-label={m.kind==='image'?'Open '+title:'Play '+title}>{children}</a>;
  return <button type="button" data-hover-root className={className} onClick={()=>open({title,media:id,episodes})} aria-label={'Play '+title}>{children}</button>;
}
export function PlayLink({id,label='Watch included video'}:{id:string;label?:string}) {
  const {isPrint}=useDeck();
  if(!isPrint) return null;
  const href=playbackHref(id);
  return href?<a href={href} className="media-play-link">{label}</a>:null;
}
