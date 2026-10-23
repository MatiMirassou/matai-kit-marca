import {useDeck} from '../deck/DeckProvider.tsx';
import {locale} from '../content/index.ts';
import {copy} from '../content/language.ts';
import {homeHref} from '../lib/routes.ts';
import {LanguageSwitch} from './Showcase.tsx';
export function PresentationNav(){const {isPrint,mode,params}=useDeck();if(isPrint||mode==='present'||params.doc==='brand'||location.protocol==='file:')return null;return <div className="presentation-site-nav no-print"><a href={homeHref(locale)}>← {copy('Back to showcase','Volver al sitio')}</a><LanguageSwitch route={{language:locale,view:'presentation'}}/></div>;}
