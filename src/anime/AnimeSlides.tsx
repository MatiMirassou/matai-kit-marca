import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {usePosition} from '../deck/DeckProvider.tsx';
import {Still} from '../components/Video.tsx';
import {MediaAction} from '../components/MediaAction.tsx';
import {Logo} from '../components/Logo.tsx';
import {content} from '../content';
import {copy as c} from '../content/language.ts';
import {media,formatDuration} from '../lib/media.ts';
import {animeProjects,animeRole,animeCredit,professionalTitle} from './deck.ts';
import {Cover,Offer,Founder} from '../slides/Intro.tsx';
import {animeOffer,animeServices,animeFounder} from './profile.ts';
import '../styles/anime.css';

const Play=()=> <span className="anime-play" aria-hidden="true">▶</span>;
function Art({id,label,className=''}:{id:string;label:string;className?:string}){
 return <figure className={`anime-art ${className}`}><MediaAction id={id} title={label} className="anime-art-link"><Still id={id} alt={label} fit="contain"/></MediaAction><figcaption>{label}<span aria-hidden="true">↗</span></figcaption></figure>;
}
function Heading({eyebrow,title,sub}:{eyebrow:string;title:string;sub?:string}){
 return <div className="anime-heading"><div><p className="anime-kicker">{eyebrow}</p><h2>{title}</h2></div>{sub&&<p className="anime-heading-sub">{sub}</p>}</div>;
}
export function AnimeCover(props:SlideProps){
 return <Cover {...props} coverPanels={[
  {media:'ff-ep01',poster:'ff-ep01@0',title:c('Vertical Drama','Drama vertical'),position:'48% 28%'},
  {media:'anime-vamp-01',preview:'vamp-ep01',poster:'anime-vamp-01@0',title:c('AI Anime','Anime con IA'),position:'50% 28%'},
  {media:'news-output',poster:'news-output@2',title:c('Automated Content','Contenido automatizado'),position:'52% 35%'},
 ]}/>;
}
export function AnimeOffer(props:SlideProps){return <Offer {...props} offer={animeOffer} services={animeServices}/>;}
export function AnimeFounder(props:SlideProps){return <Founder {...props} profile={animeFounder} creditsTitle={c('Education & Qualifications','Estudios y formación')} extraClass="anime-founder"/>;}
export function AnimeOverview(props:SlideProps){
 const {go}=usePosition();
 return <SlideFrame {...props} className="anime-slide anime-overview" footer={animeCredit}><div className="anime-body">
  <Heading eyebrow={c('Selected anime work','Selección de anime')} title={c('Three stories. A spectrum of emotions.','Tres historias. Un universo de emociones.')} sub={c('My contribution across all three projects: AI direction and visual generation.','Mi aporte en los tres proyectos: dirección y generación visual con IA.')}/>
  <div className="anime-projects">{animeProjects.map((p,i)=><article key={p.id}><button className="anime-project-image" onClick={()=>go(`anime/${p.id}-process`)} aria-label={c('Explore ','Explorar ')+p.title}><Still id={i===2?'anime-mars-volley@2':p.hero} alt={p.title}/><span className="anime-project-number">0{i+1}</span></button><div className="anime-project-title"><h3>{p.title}</h3><span>{p.format}</span></div><p>{p.label}</p><button className="anime-text-link" onClick={()=>go(`anime/${p.id}-process`)}>{c('Development & results','Desarrollo y resultados')} ↗</button></article>)}</div>
 </div></SlideFrame>;
}

const marsStages=[
 {id:'style',label:c('Style exploration','Exploración de estilo'),text:c('Compare proportions, linework and shading across the same character reference.','Comparación de proporciones, trazo y sombreado sobre una misma referencia de personaje.'),images:[['anime-mars-test-art-3',c('Visual style comparison','Comparación de estilos visuales')],['anime-mars-test-art-2',c('Character treatment studies','Pruebas de tratamiento del personaje')]]},
 {id:'wardrobe',label:c('Spacesuit studies','Pruebas de trajes'),text:c('Different silhouettes and material treatments explored for the same science-fiction setting.','Exploración de siluetas y materiales para un mismo universo de ciencia ficción.'),images:[['anime-mars-test-art-1',c('Spacesuit variations','Variaciones de trajes espaciales')],['anime-mars-test-art-5',c('Character & costume exploration','Exploración de personajes y vestuario')]]},
 {id:'cast',label:c('Character references','Referencias de personajes'),text:c('Distinct faces, hairstyles and costume details give the cast a recognizable visual identity.','Rostros, peinados y detalles de vestuario diferenciados definen la identidad visual del elenco.'),images:[['anime-mars-female-art-5',c('Female cast references','Referencias del elenco femenino')],['anime-mars-male-art-2',c('Male cast references','Referencias del elenco masculino')]]},
];
function MarsProcess(){
 return <div className="anime-style-boards">{marsStages.slice(0,2).flatMap(s=>s.images).map(([id,label])=><Art key={id} id={id!} label={label!}/>)}</div>;
}
export function AnimeCharacters(props:SlideProps){
 const stage=marsStages[2]!;
 return <SlideFrame {...props} className="anime-slide anime-characters" footer={animeCredit}><div className="anime-body"><Heading eyebrow="Love on Mars" title={c('Character Selection','Selección de personajes')} sub={stage.text}/><div className="anime-character-boards">{stage.images.map(([id,label])=><Art key={id} id={id!} label={label!}/>)}</div></div></SlideFrame>;
}
export function AnimeProcess(props:SlideProps){
 const p=animeProjects.find(p=>p.id===props.slide.ref)!;
 return <SlideFrame {...props} className={`anime-slide anime-process anime-process-${p.id}`} footer={animeCredit}><div className="anime-body">
  <Heading eyebrow={p.id==='mars'?'Love on Mars':c('Creative development','Desarrollo creativo')} title={p.id==='mars'?c('Style Exploration','Exploración de estilo'):p.title} sub={p.id==='mars'?c('Visual style comparisons and spacesuit studies. Four explorations, shown together.','Comparaciones de estilo visual y pruebas de trajes espaciales. Cuatro exploraciones en conjunto.'):p.description}/>
  {p.id==='mars'?<MarsProcess/>:p.id==='vamp'?<>
   <div className="anime-vamp-boards"><Art id="anime-vamp-art-3" label={c('Lina / episode 01 reference','Lina / referencia del episodio 01')}/><Art id="anime-vamp-art-4" label={c('Lina / school wardrobe','Lina / vestuario escolar')}/><Art id="anime-vamp-art-2" label={c('Kai / school wardrobe','Kai / vestuario escolar')}/><div className="anime-process-note"><span className="anime-large-n">01—02</span><h3>{c('A character across scenes','Un personaje entre escenas')}</h3><p>{c('The sheets establish hair, face, costume and silhouette. The episode frames show those references in different lighting and locations.','Las fichas definen cabello, rostro, vestuario y silueta. Los fotogramas muestran esas referencias en distintas luces y locaciones.')}</p><div className="anime-evidence-pair"><Still id="anime-vamp-01@0" alt={c('Lina in episode 01','Lina en el episodio 01')}/><Still id="anime-vamp-02@1" alt={c('Lina in episode 02','Lina en el episodio 02')}/></div></div></div>
  </>:<>
   <div className="anime-platform-boards">{[1,2,3].map((n)=><Art key={n} id={`anime-platform-art-${n}`} label={[c('Character / camera & bag','Personaje / cámara y bolso'),c('Character / lantern & costume','Personaje / farol y vestuario'),c('Character / silhouette & props','Personaje / silueta y accesorios')][n-1]!}/>)}</div>
   <div className="anime-reference-to-shot"><div><span className="anime-kicker">{c('From reference to sequence','De la referencia a la secuencia')}</span><p>{c('The character sheets define the cast. The trailer places those characters inside a world of platforms, lanterns and suspended light.','Las fichas definen al elenco. El tráiler sitúa a esos personajes en un mundo de andenes, faroles y luces suspendidas.')}</p></div>{[1,3].map(n=><div key={n}><Still id={`anime-platform@${n}`} alt={c('Frame from the generated trailer','Fotograma del tráiler generado')}/></div>)}</div>
  </>}
 </div></SlideFrame>;
}
export function AnimeResults(props:SlideProps){
 const p=animeProjects.find(p=>p.id===props.slide.ref)!;
 return <SlideFrame {...props} className={`anime-slide anime-results anime-results-${p.id}`} footer={animeCredit}><div className="anime-body">
  <Heading eyebrow={c('Generated work / screening room','Material generado / sala de proyección')} title={p.title} sub={p.label+' / '+p.format}/>
  {p.id==='platform'?<div className="anime-trailer-layout"><MediaAction id={p.media} title={p.title} className="anime-trailer"><Still id="anime-platform" alt="Platform Zero"/><Play/><span className="anime-video-caption">{c('Watch trailer','Ver tráiler')} <small>{formatDuration(media(p.media)?.duration)}</small></span></MediaAction><aside><p className="anime-kicker">16:9 / {c('Trailer','Tráiler')}</p><h3>{c('A world in motion','Un mundo en movimiento')}</h3><p>{c('See the generated sequence with its original sound.','Mirá la secuencia generada con su sonido original.')}</p><p className="anime-role-credit">{animeRole}<strong>Matías Mirassou</strong><span>{c('Script supplied by others','Guion de terceros')}</span></p></aside></div>:<div className={`anime-screenings ${p.id==='mars'?'anime-screenings-four':''}`}>
   {p.episodes.map((ep,i)=><article key={ep.media}><MediaAction id={ep.media} title={p.title+' / '+ep.label} episodes={p.episodes} className="anime-screening"><Still id={`${ep.media}@${p.id==='vamp'?i===0?2:3:i===0?2:1}`} alt={p.title+' / '+ep.label}/><Play/><span className="anime-video-caption">{ep.label}<small>{formatDuration(media(ep.media)?.duration)}</small></span></MediaAction><p>{c('Play with sound','Reproducir con sonido')} <span aria-hidden="true">↗</span></p></article>)}
   {p.id==='vamp'&&<aside><p className="anime-kicker">{c('Two episodes / one visual identity','Dos episodios / una identidad visual')}</p><h3>{c('Characters beyond the reference sheet','Personajes más allá de la ficha')}</h3><p>{c('Watch both generated episodes. Switch between them directly in the player.','Mirá los dos episodios generados. Podés cambiar de episodio desde el reproductor.')}</p><p className="anime-role-credit">{animeRole}<strong>Matías Mirassou</strong><span>{c('Scripts supplied by others','Guiones de terceros')}</span></p></aside>}
  </div>}
 </div></SlideFrame>;
}
export function AnimeContact(props:SlideProps){
 const b=content.brand;
 return <SlideFrame {...props} className="anime-slide anime-contact" footer={c('AI Anime Producer application / Matías Mirassou','Postulación a productor de anime con IA / Matías Mirassou')}><div className="anime-body anime-contact-layout"><div><p className="anime-kicker">{c('Let’s talk about the role','Hablemos del puesto')}</p><h2>{c('Your next','Tu próxima')}<br/><em>{c('anime production','producción de anime')}</em></h2><p className="anime-contact-intro">{c('I’m looking to bring my AI direction and visual generation experience to an anime production team.','Busco aportar mi experiencia en dirección y generación visual con IA a un equipo de producción de anime.')}</p><a className="anime-link" href={`mailto:${b.contact.email}?subject=${encodeURIComponent(c('AI Anime Producer opportunity','Oportunidad de productor de anime con IA'))}`}>{c('Contact Matías','Contactar a Matías')} ↗</a><p className="anime-contact-email">{b.contact.email}</p></div><div className="anime-contact-image"><Still id="anime-platform@3" alt={c('Platform Zero generated frame','Fotograma generado de Platform Zero')}/><div><Logo variant="full" tone="dark"/><p>Matías Mirassou<br/>{professionalTitle}</p></div></div></div></SlideFrame>;
}
