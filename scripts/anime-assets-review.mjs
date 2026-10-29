import {readFile,mkdir} from 'node:fs/promises';
import {launchBrowser,projectDir} from './lib/browser.mjs';
import path from 'node:path';
const manifest=JSON.parse(await readFile(path.join(projectDir,'src/generated/anime-media.json')));
const browser=await launchBrowser();
try{
const page=await browser.newPage({viewport:{width:1500,height:1000}});
for(const group of ['vamp','platform','mars']){
 const items=Object.entries(manifest).filter(([id])=>id.startsWith('anime-'+group));
 let html='<body style="margin:0;padding:20px;background:#eee5d8;font:14px sans-serif"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">';
 for(const [id,m]of items){for(const [label,poster]of [[id,m.poster],...(m.stills??[]).map((s,i)=>[id+'@'+i,s.poster])])html+=`<div><img src="http://127.0.0.1:5180/${poster}" style="width:100%;height:225px;object-fit:contain;background:white"><p>${label}</p></div>`;}
 await page.setContent(html+'</div></body>');await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await mkdir(path.join(projectDir,'qa/anime'),{recursive:true});await page.screenshot({path:path.join(projectDir,`qa/anime/assets-${group}.jpg`),fullPage:true});
}
}finally{await browser.close();}
