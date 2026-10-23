import {useDeck} from '../deck/DeckProvider.tsx';
import {playbackHref} from './MediaAction.tsx';
/** Only render verified playback files; unknown public addresses never become a CTA. */
export function WatchLink({anchor,label}:{anchor:string;label:string}) {
 const {isPrint}=useDeck();
 const ids:Record<string,string>={series:'ff-ep01',ads:'lingopie-ugc',outputs:'news-output',podcasts:'podcast-b'};
 const href=ids[anchor]?playbackHref(ids[anchor]!):null;
 return isPrint&&href?<a href={href} className="media-play-link">{label}</a>:null;
}
