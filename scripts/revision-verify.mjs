// Verify the portable deliverable from disk, including media decoding and web interactions.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {launchBrowser,projectDir} from './lib/browser.mjs';
const date=process.env.MATAI_EXPORT_DATE??new Date().toISOString().slice(0,10);
const dir=path.join(projectDir,'exports','Mat.AI-Capabilities-'+date+'-Portable');
const manifest=JSON.parse(await readFile(path.join(projectDir,'src','generated','media.json'),'utf8'));
const browser=await launchBrowser();
const checks=[];
function check(name,ok,detail){checks.push({name,ok,detail});console.log((ok?'PASS ':'FAIL ')+name+(detail?' / '+detail:''));}
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(dir,'index.html')).href+'?motion=off',{waitUntil:'load'});
 await page.waitForSelector('.frame');await page.evaluate(()=>document.fonts.ready);
 check('Portable HTML opens without a server',await page.locator('.frame').count()===12);
 const ids=await page.locator('.frame').evaluateAll(es=>es.map(e=>e.getAttribute('data-slide')));
 check('Founder is penultimate; Contact closes',ids.at(-2)==='founder'&&ids.at(-1)==='contact');
 check('No public placeholders',await page.locator('[data-placeholder]').count()===0);
 await page.getByRole('button',{name:'Play News in Easy Spanish',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('dialog[open] audio')?.readyState>=2);
 check('Audio-news sample opens and decodes',await page.locator('dialog[open] audio').evaluate(v=>!v.error&&v.duration>0));
 await page.keyboard.press('Escape');
 await page.locator('[data-slide=series]').getByRole('button',{name:'Play Forgotten Fortune',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('dialog[open] video')?.readyState>=2);
 check('Forgotten Fortune opens and decodes',await page.locator('dialog[open] video').evaluate(v=>!v.error&&v.videoHeight>0));
 await page.getByRole('button',{name:'EP 02',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('dialog[open] video')?.currentSrc.includes('ff-ep02')&&document.querySelector('dialog[open] video')?.readyState>=2);
 check('Episode switching loads the second episode',true);
 await page.keyboard.press('Escape');
 const tabs=page.getByRole('tab');
 const snapshots=[];
 for(let i=0;i<await tabs.count();i++){await tabs.nth(i).click();snapshots.push(await page.locator('#system-panel').innerText());}
 check('Every workflow tab changes its nodes',new Set(snapshots).size===snapshots.length,String(snapshots.length)+' workflows');
 await page.locator('[role=tab][aria-selected=true]').focus();
 const before=await page.locator('#system-panel').innerText();await page.keyboard.press('ArrowLeft');
 check('Workflow keyboard navigation changes the diagram',before!==await page.locator('#system-panel').innerText());
 for(const id of await readdir(path.join(dir,'media'))){
  const m=manifest[id];if(!m?.full)continue;
  const source=pathToFileURL(path.join(dir,m.full)).href;
  const r=await page.evaluate(async({source,audio})=>new Promise(resolve=>{
   const v=document.createElement(audio?'audio':'video');v.muted=true;v.preload='auto';
   const timeout=setTimeout(()=>{v.remove();resolve({ok:false,error:'decode timeout'});},15000);
   v.onloadeddata=()=>{clearTimeout(timeout);const ok=v.readyState>=2&&v.duration>0;v.pause();v.remove();resolve({ok,duration:v.duration});};
   v.onerror=()=>{clearTimeout(timeout);resolve({ok:false,error:v.error?.message});v.remove();};
   v.src=source;document.body.append(v);v.load();
  }),{source,audio:m.kind==='audio'});
  check('Included media decodes: '+id,r.ok,r.error);
 }
 await mkdir(path.join(projectDir,'qa','revision'),{recursive:true});
 await page.setViewportSize({width:390,height:844});
 for(const id of ids){await page.locator('[data-slide="'+id+'"]').scrollIntoViewIfNeeded();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);check('Mobile width: '+id,!overflow);}
 await page.evaluate(async()=>{document.activeElement?.blur?.();const images=Array.from(document.images);for(const image of images)image.loading='eager';await Promise.all(images.map(image=>image.decode().catch(()=>null)));});
 await page.locator('[data-slide=outputs]').screenshot({path:path.join(projectDir,'qa','revision','mobile-outputs.png')});
 await page.locator('[data-slide="case/forgotten-fortune"]').screenshot({path:path.join(projectDir,'qa','revision','mobile-forgotten-fortune.png')});
 await page.locator('[data-slide=contact]').screenshot({path:path.join(projectDir,'qa','revision','mobile-contact.png')});
 check('No offline JavaScript errors',errors.length===0,errors.join('; '));
 await writeFile(path.join(projectDir,'qa','revision','checks.json'),JSON.stringify(checks,null,2));
}finally{await browser.close();}
if(checks.some(c=>!c.ok))process.exitCode=1;
