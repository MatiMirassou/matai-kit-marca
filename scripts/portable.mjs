// Build a file-openable deck and copy only its referenced production media.
import {readFile,writeFile,mkdir,readdir,cp,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {projects,forgottenEvidence} from '../src/content/en/work.ts';
import {services} from '../src/content/en/offer.ts';
import {founder} from '../src/content/en/founder.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const date=process.env.MATAI_EXPORT_DATE??new Date().toISOString().slice(0,10);
const out=path.join(root,'exports','Mat.AI-Capabilities-'+date+'-Portable');
await mkdir(out,{recursive:true});
let html=await readFile(path.join(root,'dist','index.html'),'utf8');
const script=html.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/);
if(!script)throw new Error('Build first: no deck script found');
let js=await readFile(path.resolve(root,'dist',script[1].replace(/^\//,'')),'utf8');
if(/(?:^|[;}\n])\s*import\s*(?:[{'"]|\()/.test(js))throw new Error('The build has external JavaScript imports; inline them before portable export');
js=js.replace(/<\/script/gi,'<\\/script');
html=html.replace(script[0],()=>'<script type="module">'+js+'</script>');
const cssLinks=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for(const link of cssLinks){
 const cssPath=path.resolve(root,'dist',link[1].replace(/^\//,''));
 let css=await readFile(cssPath,'utf8');
 const urls=[...css.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)];
 for(const item of urls){const src=item[2];if(/^(data:|https?:|#|%23)/.test(src))continue;
  const filename=src.startsWith('/')?path.resolve(root,'dist',src.slice(1)):path.resolve(path.dirname(cssPath),src);
  const data=await readFile(filename);const mime=filename.endsWith('.woff2')?'font/woff2':filename.endsWith('.woff')?'font/woff':'application/octet-stream';
  css=css.replaceAll(item[0],'url("data:'+mime+';base64,'+data.toString('base64')+'")');
 }
 html=html.replace(link[0],()=>'<style>'+css+'</style>');
}
html=html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g,'');
html=html.replace(/<!--app-start-->[\s\S]*<!--app-end-->/,'').replace(' data-rendered="true"','').replace('href="/favicon.svg"','href="./favicon.svg"');
await writeFile(path.join(out,'index.html'),html);
await cp(path.join(root,'public','favicon.svg'),path.join(out,'favicon.svg'));
const ids=new Set(['ff-mix',...forgottenEvidence.anchors.map(x=>x.media),founder.portrait.media]);
for(const s of services)if(s.media)ids.add(s.media.split('@')[0]);
for(const p of projects){ids.add(p.media);if(p.keyArt)ids.add(p.keyArt);for(const f of p.frames??[])ids.add(f.split('@')[0]);for(const e of p.episodes??[])ids.add(e.media);}
const manifest=JSON.parse(await readFile(path.join(root,'src','generated','media.json'),'utf8'));
await mkdir(path.join(out,'media'),{recursive:true});
for(const id of ids){if(!manifest[id])throw new Error('Missing media: '+id);await cp(path.join(root,'public','media',id),path.join(out,'media',id),{recursive:true});}
const subtitleSrc=path.resolve(root,'..','Content Automation','News','0818','ES_News.in.One.Minute_260818.vtt');
await cp(subtitleSrc,path.join(out,'media','news-show','subtitles.vtt'));
await writeFile(path.join(out,'READ-ME.txt'),'Mat.AI Capabilities\n\nExtract the complete bundle before opening it.\nOpen index.html to view the interactive presentation, with videos and audio. No sign-in or internet connection is required for the included media.\nThe 12-page PDF links to the media folder beside it. Keep that folder with the PDF. Email, LinkedIn and source links use the internet.\nKeyboard: arrows to navigate, P to present, I for index, M for motion, Escape to close playback.\n\nAll media examples carry their project attribution or synthetic/spec disclosure in the presentation.\n');
console.log(JSON.stringify({directory:out,mediaCount:ids.size,html:path.join(out,'index.html')}));
