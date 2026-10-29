// One process per locale keeps module-level content selection deterministic.
import {spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const lang=process.argv[2];
if(!lang){await writeFile(path.join(root,'.site-render','template.html'),await readFile(path.join(root,'dist','index.html'),'utf8'));for(const language of ['en','es']){const result=spawnSync(process.execPath,[import.meta.filename,language],{cwd:root,stdio:'inherit'});if(result.status)process.exit(result.status);}process.exit(0);}
globalThis.__MATAI_LOCALE__=lang;
const {pages}=await import('../.site-render/prerender.js');
const template=await readFile(path.join(root,'.site-render','template.html'),'utf8');
const escape=text=>text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const page of pages()){
 const head=template.replace('<html lang="en"',`<html lang="${lang}"`).replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(page.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(page.description)}" />`);
 let html=head.replace('<div id="root">',`<div id="root" data-rendered="true" data-route="${page.path}">`).replace('<!--app-start--><!--app-end-->',`<!--app-start-->${page.html}<!--app-end-->`);
 const publicUrl=process.env.VITE_PUBLIC_SITE_URL;
 if(publicUrl){const origin=new URL(publicUrl).origin;const suffix=page.path.replace(/^\/(en|es)\//,'');html=html.replace('</head>',`<link rel="canonical" href="${escape(origin+page.path)}"/><link rel="alternate" hreflang="en" href="${escape(origin+'/en/'+suffix)}"/><link rel="alternate" hreflang="es" href="${escape(origin+'/es/'+suffix)}"/></head>`);}
 const directory=path.join(root,'dist',page.path);await mkdir(directory,{recursive:true});await writeFile(path.join(directory,'index.html'),html);
 if(lang==='en'&&page.path==='/en/')await writeFile(path.join(root,'dist','index.html'),html);
}
const deckDir=path.join(root,'dist',lang,'presentation');await mkdir(deckDir,{recursive:true});
const deck=template.replace('<html lang="en" data-mode="showcase">',`<html lang="${lang}" data-mode="read">`).replace(/<title>[\s\S]*?<\/title>/,`<title>Mat.AI — ${lang==='es'?'Presentación':'Presentation'}</title>`);
await writeFile(path.join(deckDir,'index.html'),deck);
const animeDir=path.join(deckDir,'anime');await mkdir(animeDir,{recursive:true});
const anime=deck.replace(/<title>[\s\S]*?<\/title>/,`<title>Mat.AI — ${lang==='es'?'Edición Anime con IA':'AI Anime Edition'}</title>`).replace('</head>','<meta name="robots" content="noindex, nofollow, noarchive" /></head>');
await writeFile(path.join(animeDir,'index.html'),anime);
console.log(`Pre-rendered ${lang.toUpperCase()}: showcase, ${pages().length-1} project pages, presentation entry.`);
