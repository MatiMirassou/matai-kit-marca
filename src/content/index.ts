import { content as en } from './en/index.ts';
import {locale} from './language.ts';
import {spanish,translateTree} from './translations.ts';

/**
 * Shared project/content model. Exact-copy translations preserve technical IDs
 * and official titles. Explicit /en/ and /es/ routes take precedence over ?lang=.
 */
export type Content = typeof en;
export {locale};
export const content: Content = locale==='es'?translateTree(en):en;
export const t=(text:string)=>locale==='es'?(spanish[text]??text):text;
