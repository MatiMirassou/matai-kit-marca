import {renderToString} from 'react-dom/server';
import {Showcase} from './Showcase.tsx';
import {content,locale} from '../content/index.ts';
import {copy} from '../content/language.ts';
import {resolveRoute} from '../lib/routes.ts';
export function pages(){
 const routes=[`/${locale}/`,...content.projects.map(p=>`/${locale}/work/${p.id}/`)];
 return routes.map(path=>{
  const route=resolveRoute(path);const project=content.projects.find(p=>p.id===route.project);
  const title=project?`${project.title} — Mat.AI`:copy('Mat.AI — Human Creativity, Powered by AI','Mat.AI — Creatividad humana, potenciada por IA');
  const description=project?(typeof project.logline==='string'?project.logline:copy('A completed vertical drama for Lingopie.','Un microdrama terminado para Lingopie.')):copy('Cinematic microdramas, AI advertising and content automation. The work of Matías Mirassou, director and creative technologist.','Microdramas cinematográficos, publicidad con IA y automatización de contenido. El trabajo de Matías Mirassou, director y tecnólogo creativo.');
  return {path,title,description,html:renderToString(<Showcase route={route}/>)};
 });
}
