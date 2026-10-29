import {useDeck} from '../deck/DeckProvider.tsx';
import {locale} from '../content/index.ts';
import {copy} from '../content/language.ts';
import {homeHref,currentRoute} from '../lib/routes.ts';
import {LanguageSwitch} from './Showcase.tsx';
export function PresentationNav(){const {isPrint,mode,params}=useDeck();if(isPrint||mode==='present'||params.doc==='brand'||location.protocol==='file:')return null;return <div className="presentation-site-nav no-print">{params.deck==='anime'?<span>{copy('AI Anime · Selected work','Anime con IA · Selección de trabajos')}</span>:<a href={homeHref(locale)}>← {copy('Back to showcase','Volver al sitio')}</a>}<LanguageSwitch route={{...currentRoute(),view:'presentation'}}/></div>;}
