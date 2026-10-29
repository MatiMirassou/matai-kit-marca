import type {SlideDef} from '../content/types.ts';
import {copy as c} from '../content/language.ts';

export const animeSlides:SlideDef[]=[
 {id:'anime',kind:'anime-overview',chapter:c('AI Anime','Anime con IA'),title:c('Three anime projects','Tres proyectos de anime'),tone:'cream'},
 {id:'anime/vamp-process',kind:'anime-process',ref:'vamp',chapter:'The Vamp',title:c('The Vamp: development','The Vamp: desarrollo'),tone:'cream'},
 {id:'anime/vamp-results',kind:'anime-results',ref:'vamp',chapter:'The Vamp',title:c('The Vamp: episodes','The Vamp: episodios'),tone:'ink'},
 {id:'anime/platform-process',kind:'anime-process',ref:'platform',chapter:'Platform Zero',title:c('Platform Zero: development','Platform Zero: desarrollo'),tone:'cream'},
 {id:'anime/platform-results',kind:'anime-results',ref:'platform',chapter:'Platform Zero',title:c('Platform Zero: trailer','Platform Zero: tráiler'),tone:'ink'},
 {id:'anime/mars-process',kind:'anime-process',ref:'mars',chapter:'Love on Mars',title:c('Style Exploration','Exploración de estilo'),tone:'cream'},
 {id:'anime/mars-characters',kind:'anime-characters',ref:'mars',chapter:'Love on Mars',title:c('Character Selection','Selección de personajes'),tone:'cream'},
 {id:'anime/mars-results',kind:'anime-results',ref:'mars',chapter:'Love on Mars',title:c('Love on Mars: scenes','Love on Mars: escenas'),tone:'ink'},
];
export function animeEdition(base:SlideDef[]):SlideDef[]{
 return [
  {...base[0]!,kind:'anime-cover',title:c('AI anime: selected work','Anime con IA: trabajos seleccionados')},
  {...base[1]!,kind:'anime-offer'},...animeSlides,...base.slice(2,-1).filter(s=>s.id!=='ads').map(s=>s.id==='founder'?{...s,kind:'anime-founder' as const}:s),
  {...base.at(-1)!,kind:'anime-contact',title:c('An AI anime production role','Un rol en producción de anime con IA')},
 ];
}
export const animeName=c('Mat.AI — AI Anime Edition','Mat.AI — Edición Anime con IA');
export const animeRole=c('AI direction & visual generation','Dirección y generación visual con IA');
export const professionalTitle=c('AI Creative Producer & Technical Director','Productor Creativo de IA y Director Técnico');
export const animeCredit=c('AI direction & visual generation: Matías Mirassou. Scripts supplied by others.','Dirección y generación visual con IA: Matías Mirassou. Guiones de terceros.');
export const animeProjects=[
 {id:'vamp',title:'The Vamp',media:'anime-vamp-01',hero:'anime-vamp-01@1',format:'9:16',
  label:c('Two generated episodes','Dos episodios generados'),
  description:c('Character references and wardrobe variations, carried into two vertical episodes.','Referencias de personajes y variaciones de vestuario llevadas a dos episodios verticales.'),
  episodes:[{media:'anime-vamp-01',label:c('Episode 01','Episodio 01')},{media:'anime-vamp-02',label:c('Episode 02','Episodio 02')}],
 },
 {id:'platform',title:'Platform Zero',media:'anime-platform',hero:'anime-platform@1',format:'16:9',
  label:c('One generated trailer','Un tráiler generado'),
  description:c('Character sheets with multiple views, costume details and props, alongside the generated trailer.','Fichas de personajes con múltiples vistas, detalles de vestuario y accesorios, junto al tráiler generado.'),
  episodes:[{media:'anime-platform',label:c('Watch trailer','Ver tráiler')}],
 },
 {id:'mars',title:'Love on Mars',media:'anime-mars-mission',hero:'anime-mars-mission@1',format:'9:16',
  label:c('Four generated scenes','Cuatro escenas generadas'),
  description:c('Style comparisons, character exploration and spacesuit studies, followed by four generated scenes.','Comparaciones de estilo, exploración de personajes y pruebas de trajes espaciales, seguidas de cuatro escenas generadas.'),
  episodes:[{media:'anime-mars-mission',label:c('Last Mission','Última misión')},{media:'anime-mars-ramen',label:c('Ramen','Ramen')},{media:'anime-mars-training',label:c('Training','Entrenamiento')},{media:'anime-mars-volley',label:c('Volleyball','Vóley')}],
 },
];
