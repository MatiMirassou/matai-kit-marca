import {content} from '../content';
import {Kicker} from '../components/Cinema.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Video} from '../components/Video.tsx';
import {Cite,CountUp,StatViz,statById} from '../components/StatFigure.tsx';
import {MediaAction,PlayLink} from '../components/MediaAction.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {formatDuration,media} from '../lib/media.ts';
import {PlayGlyph} from './shared.tsx';
export function Series(props:SlideProps) {
 const c=content.seriesCopy;
 const series=c.series.map(id=>content.projects.find(p=>p.id===id)!);
 return <SlideFrame {...props} className="revised-series" footer={<span>Selected client work for Lingopie / AI-generated casts</span>}><div className="safe">
  <Kicker className="muted mb-14">Vertical Dramas</Kicker><Headline text={c.headline} className="title text-[calc(var(--su)*52)] stack:text-[36px]"/>
  <div className="series-showcase">{series.map(p=><article key={p.id} className="series-project">
    <MediaAction id={p.media} title={p.title} episodes={p.episodes} className="series-poster group media-frame"><Video id={p.media} poster={p.keyArt} play="hover" position="50% 30%" fit="contain" alt={p.title+' key art'}/><PlayGlyph/></MediaAction>
    <h3>{p.title}</h3><p className="series-meta">EP 01 / {formatDuration(media(p.media)?.duration)} / 9:16</p>
    <PlayLink id={p.media} label="Watch episode 01"/>
  </article>)}</div>
 </div></SlideFrame>;
}
export function Vertical(props:SlideProps) {
 const c=content.verticalCopy; const revenue=statById(c.hero); const minutes=statById(c.supporting[0]!);const growth=statById(c.supporting[1]!);
 const omdia=content.sources.find(s=>s.id===revenue.sourceId)!;const sensor=content.sources.find(s=>s.id===growth.sourceId)!;
 return <SlideFrame {...props} className="revised-market" footer={<span>Sources: <a href={omdia.url}>Omdia, February 2026</a> / <a href={sensor.url}>Sensor Tower via Marketing Dive, February 2026</a></span>}><div className="safe">
  <Kicker className="muted mb-14">Why Vertical Drama</Kicker><Headline text={c.headline} className="title market-title"/>
  <div className="market-grid"><figure className="market-revenue"><div className="market-values"><span>$11B<small>2025 estimate</small></span><span className="market-separator">/</span><span>$14B<small>2026 forecast</small></span></div><figcaption>Global microdrama revenue<Cite id={revenue.sourceId}/></figcaption><StatViz viz={revenue.viz!}/><p className="market-note">Omdia global market estimate and forecast</p></figure>
  <div className="market-support"><figure><p className="market-number"><CountUp stat={minutes}/></p><figcaption>Daily ReelShort viewing per user<Cite id={minutes.sourceId}/></figcaption><p className="market-note">US mobile / Q4 2025 / Minutes per user, not audience size</p><StatViz viz={minutes.viz!}/></figure><figure className="market-growth"><p className="market-number"><CountUp stat={growth}/></p><figcaption>Short-drama app purchase growth in 2025<Cite id={growth.sourceId}/></figcaption><p className="market-note">To $2.98B in app-store purchases. Excludes advertising and mini-program revenue.</p></figure></div></div>
 </div></SlideFrame>;
}
