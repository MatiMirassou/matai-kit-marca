import {content} from '../content';
import {Kicker,Slate} from '../components/Cinema.tsx';
import {Logo} from '../components/Logo.tsx';
import {Headline} from '../components/Reveal.tsx';
import {Txt} from '../components/Txt.tsx';
import {SlideFrame,type SlideProps} from '../deck/SlideFrame.tsx';
const {brand}=content;
const mailto='mailto:'+brand.contact.email+'?subject='+encodeURIComponent(brand.contact.emailSubject);
export function Fit(props:SlideProps){
 const c=content.fitCopy;
 return <SlideFrame {...props} className="revised-fit"><div className="safe"><Kicker className="muted mb-14">{c.kicker}</Kicker><Headline text={c.headline} className="title text-[calc(var(--su)*48)] stack:text-[34px]"/>
 <div className="fit-columns"><section><h3>{c.clientsTitle}</h3><ul>{content.clients.map(t=><li key={t}>{t}</li>)}</ul></section><section><h3>{c.waysTitle}</h3><ol>{content.engagements.map((x,i)=><li key={x.name}><span>0{i+1}</span><div><strong>{x.name}</strong><p>{x.text}</p></div></li>)}</ol></section><section><h3>{c.notFocusTitle}</h3><ul className="fit-exclusions">{content.exclusions.map(x=><li key={x}><span aria-hidden="true">×</span>{x}</li>)}</ul></section></div>
 </div></SlideFrame>;
}
export function Contact(props:SlideProps){
 const c=content.contactCopy;
 return <SlideFrame {...props} className="revised-contact"><div className="safe contact-layout"><div><Kicker className="muted mb-24">{c.kicker}</Kicker><Headline text={c.headline} className="display-tight contact-headline"/><p className="contact-intro">{c.sub}</p><a href={mailto} className="contact-button">{c.cta}</a></div><div className="contact-links"><Logo variant="framed" tone="light" className="contact-logo"/><dl>{brand.contact.links.filter(l=>l.href).map(l=><div key={l.label}><dt>{l.label}</dt><dd><a href={l.href} target={l.href?.startsWith('http')?'_blank':undefined} rel="noreferrer"><Txt c={l.value}/></a></dd></div>)}</dl><Slate className="muted contact-location" items={[brand.location,brand.languages]}/></div></div></SlideFrame>;
}
export function Credits(){return null;}
