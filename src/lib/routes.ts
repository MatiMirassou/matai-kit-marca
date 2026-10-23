export type Language = 'en' | 'es';
export interface SiteRoute { language: Language; view: 'showcase' | 'project' | 'presentation' | 'brand' | 'not-found'; project?: string; }
const deckAnchors = ['cover','offer','series','vertical','case/forgotten-fortune','ads','outputs','systems','case/news-show','fit','founder','contact'];
export function resolveRoute(pathname: string, search = '', hash = '', portable = false): SiteRoute {
  const q = new URLSearchParams(search);
  const segments = pathname.split('/').filter(Boolean);
  const language: Language = segments[0] === 'es' || q.get('lang') === 'es' && !['en','es'].includes(segments[0] ?? '') ? 'es' : 'en';
  if (pathname.endsWith('/brand.html') || q.get('doc') === 'brand') return {language,view:'brand'};
  if (portable || ['print','mode','play','deck','for','audit'].some(k=>q.has(k)) && !['en','es'].includes(segments[0] ?? '') || !segments.length && deckAnchors.includes(decodeURIComponent(hash.slice(1)))) return {language,view:'presentation'};
  if (!segments.length || segments.length===1 && ['en','es'].includes(segments[0]!)) return {language,view:'showcase'};
  if (['en','es'].includes(segments[0] ?? '')) {
    if (segments.length===2 && segments[1]==='presentation') return {language,view:'presentation'};
    if (segments.length===3 && segments[1]==='work') return {language,view:'project',project:segments[2]!};
  }
  return {language,view:'not-found'};
}
export function currentRoute(): SiteRoute {
  if(typeof window==='undefined') return {language:'en',view:'showcase'};
  return resolveRoute(location.pathname,location.search,location.hash,location.protocol==='file:');
}
export const homeHref=(language:Language,anchor='')=>`/${language}/${anchor?'#'+anchor:''}`;
export const projectHref=(language:Language,id:string)=>`/${language}/work/${encodeURIComponent(id)}/`;
export const presentationHref=(language:Language)=>`/${language}/presentation/`;
export function languageHref(route:SiteRoute, language:Language, search='', hash='') {
  const q=new URLSearchParams(search);q.delete('lang');
  const path=route.view==='project'?projectHref(language,route.project!):route.view==='presentation'?presentationHref(language):homeHref(language);
  return path+(q.size?'?'+q.toString():'')+hash;
}
