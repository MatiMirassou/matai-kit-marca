// Local three-slide design review. Requires the owner's untracked media and
// original portable edition. Does not regenerate or overwrite either PDF.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {launchBrowser,projectDir,startPreview,waitForPrintReady} from './lib/browser.mjs';

const changed=['cover','series','case/forgotten-fortune'];
const out=path.join(projectDir,'qa','hybrid-review');
const baseline=path.join(projectDir,'exports','Mat.AI-Capabilities-2026-10-19-Portable','index.html');
const server=await startPreview();
const browser=await launchBrowser();
const results=[];
function check(name,ok,detail=''){
 results.push({name,ok,detail});
 console.log(`${ok?'PASS':'FAIL'} ${name}${detail?' / '+detail:''}`);
}
async function loadPrint(url){
 const p=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
 await p.emulateMedia({media:'print',reducedMotion:'reduce'});
 await p.goto(url,{waitUntil:'load'});
 await waitForPrintReady(p);
 return p;
}
async function sameLayoutAndImageBytes(before,after,selector){
 const describe=el=>{
  const frame=el.getBoundingClientRect();
  return {text:el.innerText,items:[...el.querySelectorAll('img,h1,h2,h3,p,a,.media-frame')].map(i=>{
   const r=i.getBoundingClientRect(),s=getComputedStyle(i);
   return {tag:i.tagName,x:r.x-frame.x,y:r.y-frame.y,w:r.width,h:r.height,
    font:s.font,color:s.color,fit:s.objectFit,position:s.objectPosition,opacity:s.opacity,
    image:i.tagName==='IMG'?i.src.split('/media/').at(-1):null};
  })};
 };
 const a=await before.locator(selector).evaluate(describe);
 const b=await after.locator(selector).evaluate(describe);
 if(JSON.stringify(a)!==JSON.stringify(b))return false;
 for(const item of a.items.filter(i=>i.image)){
  const original=await readFile(path.join(path.dirname(baseline),'media',item.image));
  const current=await readFile(path.join(projectDir,'public','media',item.image));
  if(!original.equals(current))return false;
 }
 return true;
}
try{
 await mkdir(out,{recursive:true});
 const before=await loadPrint(pathToFileURL(baseline).href+'?print=1');
 const after=await loadPrint(server.url+'/?print=1');
 const ids=await after.locator('.frame').evaluateAll(es=>es.map(e=>e.dataset.slide));
 check('Deck still contains 12 slides',ids.length===12);
 check('No public placeholders',await after.locator('[data-placeholder]').count()===0);
 for(const id of ids){
  const selector=`[data-slide="${id}"]`;
  const next=await after.locator(selector).screenshot({animations:'disabled'});
  if(changed.includes(id)){
   await writeFile(path.join(out,id.replaceAll('/','_')+'.png'),next);
  }else{
   const previous=await before.locator(selector).screenshot({animations:'disabled'});
   // Chromium can sample fractional-size raster images differently in file and
   // HTTP contexts. In that case verify actual layout, text and source bytes.
   const exact=next.equals(previous);
   const same=exact||await sameLayoutAndImageBytes(before,after,selector);
   check('Unchanged composition: '+id,same,exact?'pixel-identical':'layout, text and image bytes match');
  }
 }
 check('Gallery contains four posters and sixteen real stills',
  await after.locator('.series-poster img').count()===4&&await after.locator('.series-shot img').count()===16);
 check('All five Forgotten Fortune stages retained',await after.locator('.ff-process-heading').count()===5);
 const spacing=await after.locator('.ff-script').evaluate(el=>{
  const next=document.querySelector('.ff-process-edit');
  return next.getBoundingClientRect().top-el.getBoundingClientRect().bottom;
 });
 check('Script evidence clears the next stage',spacing>=12,Math.round(spacing)+'px');
 const images=await after.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0));
 check('Every print image decodes',images);
 await before.close();await after.close();

 const web=await browser.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'});
 const errors=[];web.on('pageerror',e=>errors.push(e.message));
 await web.goto(server.url+'/?motion=off',{waitUntil:'load'});
 await web.locator('[data-slide="series"]').getByRole('button',{name:'Play Forgotten Fortune',exact:true}).click();
 await web.waitForFunction(()=>document.querySelector('dialog[open] video')?.readyState>=2);
 await web.getByRole('button',{name:'EP 02',exact:true}).click();
 await web.waitForFunction(()=>document.querySelector('dialog[open] video')?.currentSrc.includes('ff-ep02')&&document.querySelector('dialog[open] video')?.readyState>=2);
 check('Gallery playback and episode switching decode',true);
 await web.keyboard.press('Escape');
 const ff=web.locator('[data-slide="case/forgotten-fortune"]');
 const references=await ff.locator('.ff-reference-grid a').evaluateAll(es=>es.map(e=>e.href));
 check('Four reference images open their actual source assets',references.length===4&&references.every(u=>u.includes('/media/ff-')&&u.endsWith('/poster.jpg')));
 await ff.getByRole('button',{name:'Play Forgotten Fortune stereo mix',exact:true}).click();
 await web.waitForFunction(()=>document.querySelector('dialog[open] audio')?.readyState>=2);
 check('Stereo-mix link opens actual audio',await web.locator('dialog[open] audio').evaluate(a=>a.currentSrc.includes('/ff-mix/')&&!a.error));
 await web.keyboard.press('Escape');
 await ff.getByRole('button',{name:'Play Forgotten Fortune episode 01',exact:true}).click();
 await web.waitForFunction(()=>document.querySelector('dialog[open] video')?.readyState>=2);
 check('Delivery link opens actual finished episode',await web.locator('dialog[open] video').evaluate(v=>v.currentSrc.includes('/ff-ep01/')&&!v.error));
 await web.keyboard.press('Escape');
 check('No runtime errors',errors.length===0,errors.join(' / '));
 await web.close();

 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await mobile.goto(server.url+'/?motion=off',{waitUntil:'load'});
 await mobile.evaluate(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));
 });
 await mobile.addStyleTag({content:'.no-print,.skip-link{display:none!important}'});
 for(const id of changed){
  const frame=mobile.locator(`[data-slide="${id}"]`);
  await frame.scrollIntoViewIfNeeded();
  await frame.screenshot({path:path.join(out,'mobile-'+id.replaceAll('/','_')+'.png'),animations:'disabled'});
  check('Mobile width: '+id,await frame.evaluate(e=>e.scrollWidth<=innerWidth));
 }
 await mobile.close();
 const manifest=JSON.parse(await readFile(path.join(projectDir,'src','generated','media.json'),'utf8'));
 check('Selected cover frames exist in media manifest',!!manifest['lingopie-ugc']?.stills?.[0]&&!!manifest['news-output']?.stills?.[2]);
 await writeFile(path.join(out,'checks.json'),JSON.stringify(results,null,2)+'\n');
 if(results.some(r=>!r.ok))process.exitCode=1;
}finally{
 await browser.close();await server.close();
}
