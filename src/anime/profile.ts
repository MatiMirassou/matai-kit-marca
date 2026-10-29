import {content} from '../content';
import {copy as c} from '../content/language.ts';
import type {Founder,Service} from '../content/types.ts';
import {professionalTitle} from './deck.ts';

// Edition-specific overrides: the public profile and original deck are unchanged.
export const animeOffer={...content.offerCopy,
 headline:c('Human creativity powered by AI','Creatividad humana potenciada por IA'),
 loop:c('Creative direction connects vertical drama, anime and automated content.','La dirección creativa conecta el drama vertical, el anime y el contenido automatizado.'),
};
export const animeServices:Service[]=content.services.map(s=>s.id==='ads'?{
 id:'anime',craft:'story',n:'02',name:c('AI Anime','Anime con IA'),
 line:c('Emotional stories shaped through visual exploration and AI-generated characters.','Historias emotivas con dirección visual y personajes generados con IA.'),
 points:[c('Visual direction & style','Dirección visual y estilo'),c('Character design & continuity','Diseño de personajes y continuidad'),c('Generated scenes & episodes','Escenas y episodios generados')],media:'anime-mars-mission@2',
}:s.id==='automation'?{...s,media:'news-output@2'}:s);
export const animeFounder:Founder={...content.founder,
 role:professionalTitle,
 bio:c('I’m Matías Mirassou, an audiovisual creative from Buenos Aires. My background spans television post-production, audiovisual arts and animation. Today I direct and generate AI films and series, and develop content automation systems.','Soy Matías Mirassou, creativo audiovisual de Buenos Aires. Mi recorrido combina postproducción televisiva, artes audiovisuales y animación. Hoy dirijo y genero películas y series con IA, y desarrollo sistemas de automatización de contenido.'),
 timeline:[
  {year:'2010–2014',title:'Fox Toma 1',detail:c('Video editing and post-production for Utilísima and Fox Life.','Edición y postproducción para Utilísima y Fox Life.')},
  {year:'2015',title:'Endemol Argentina',detail:c('Television finishing editor.','Editor de finalización para televisión.')},
  {year:'2016–2020',title:'Resto del Mundo · Canal 13',detail:c('Finishing editor at 3 de Febrero Visión.','Editor de finalización en 3 de Febrero Visión.')},
  {year:'2021–2026',title:'Lingopie',detail:c('Video editor and content creator.','Editor de video y creador de contenido.')},
  {year:c('2026–present','2026–actualidad'),title:c('AI Content Creator · Lingopie','Creador de contenido con IA · Lingopie'),detail:c('AI microdramas and content automation.','Microdramas con IA y automatización de contenido.')},
 ],
 credits:[
  {title:c('Audiovisual Arts / Editing','Artes Audiovisuales / Montaje'),detail:c('IUNA · Licenciatura · 2006–2012','IUNA · Licenciatura · 2006–2012')},
  {title:c('Animation Film Direction','Dirección de Cine de Animación'),detail:'Escuela Da Vinci · 2013–2017'},
  {title:c('Front End Developer','Desarrollo Front End'),detail:'Coderhouse · 2021–2025'},
  {title:c('Additional training','Formación complementaria'),detail:c('Da Vinci: After Effects (2005–2006), 3D Studio Max (2010). Cambridge CPE (2004–2007).','Da Vinci: After Effects (2005–2006), 3D Studio Max (2010). Cambridge CPE (2004–2007).')},
 ],
};
