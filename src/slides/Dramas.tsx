import {content,t} from '../content';
import {Kicker} from '../components/Cinema.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Still,Video} from '../components/Video.tsx';
import {Cite,CountUp,StatViz,statById} from '../components/StatFigure.tsx';
import {MediaAction,PlayLink} from '../components/MediaAction.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
import {formatDuration,media} from '../lib/media.ts';
import {PlayGlyph} from './shared.tsx';
export function Series(props:SlideProps) {
 const c=content.seriesCopy;
 const series=c.series.map(id=>content.projects.find(p=>p.id===id)!);
 return <SlideFrame {...props} className="revised-series hybrid-series" footer={<span>{t("Selected client work for Lingopie / AI-generated casts")}</span>}><div className="safe">
  <Kicker className="muted mb-14">{t("Vertical Dramas")}</Kicker><Headline text={c.headline} className="title text-[calc(var(--su)*52)] stack:text-[36px]"/>
  <div className="series-showcase">{series.map(p=><article key={p.id} className="series-project">
    <MediaAction id={p.media} title={p.title} episodes={p.episodes} className="series-reel group">
      <span className="series-poster media-frame"><Still id={p.keyArt ?? p.media} fit="contain" alt={p.title+' key art'}/></span>
      {(p.frames ?? []).slice(0,4).map((id,i)=><span key={id} className="series-shot media-frame">{i===0 ? <Video id={p.media} poster={id} play="hover" alt={p.title+' episode 01 preview'}/> : <Still id={id} alt={`${p.title}, episode 01, frame ${i+1}`}/>}</span>)}
      <PlayGlyph/>
    </MediaAction>
    <div className="series-caption"><h3>{p.title}</h3><p className="series-meta">EP 01 / {formatDuration(media(p.media)?.duration)} / 9:16</p></div>
    <PlayLink id={p.media} label={t("Watch episode 01")}/>
  </article>)}</div>
 </div></SlideFrame>;
}
export function Vertical(props:SlideProps) {
 const c=content.verticalCopy; const revenue=statById(c.hero); const minutes=statById(c.supporting[0]!);const growth=statById(c.supporting[1]!);
 const omdia=content.sources.find(s=>s.id===revenue.sourceId)!;const sensor=content.sources.find(s=>s.id===growth.sourceId)!;
 return <SlideFrame {...props} className="revised-market" footer={<span>{t('Sources')}: <a href={omdia.url}>{t("Omdia, February 2026")}</a> / <a href={sensor.url}>{t("Sensor Tower via Marketing Dive, February 2026")}</a></span>}><div className="safe">
  <Kicker className="muted mb-14">{t("Why Vertical Drama")}</Kicker><Headline text={c.headline} className="title market-title"/>
  <div className="market-grid"><figure className="market-revenue"><div className="market-values"><span>$11B<small>{t("2025 estimate")}</small></span><span className="market-separator">/</span><span>$14B<small>{t("2026 forecast")}</small></span></div><figcaption>{t("Global microdrama revenue")}<Cite id={revenue.sourceId}/></figcaption><StatViz viz={revenue.viz!}/><p className="market-note">{t("Omdia global market estimate and forecast")}</p></figure>
  <div className="market-support"><figure><p className="market-number"><CountUp stat={minutes}/></p><figcaption>{t("Daily ReelShort viewing per user")}<Cite id={minutes.sourceId}/></figcaption><p className="market-note">{t("US mobile / Q4 2025 / Minutes per user, not audience size")}</p><StatViz viz={minutes.viz!}/></figure><figure className="market-growth"><p className="market-number"><CountUp stat={growth}/></p><figcaption>{t("Short-drama app purchase growth in 2025")}<Cite id={growth.sourceId}/></figcaption><p className="market-note">{t("To $2.98B in app-store purchases. Excludes advertising and mini-program revenue.")}</p></figure></div></div>
 </div></SlideFrame>;
}
