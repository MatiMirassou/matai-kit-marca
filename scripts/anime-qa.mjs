import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {launchBrowser,projectDir,watchPage,startPreview} from './lib/browser.mjs';
const dev=process.argv.includes('--dev');
const server=dev?{url:'http://127.0.0.1:5180',close:async()=>{}}:await startPreview();
const browser=await launchBrowser();
const shots=path.join(projectDir,'qa/anime');await mkdir(shots,{recursive:true});
const ids=['cover','offer','anime','anime/vamp-process','anime/vamp-results','anime/platform-process','anime/platform-results','anime/mars-process','anime/mars-characters','anime/mars-results','founder','contact'];
const failures=[];let checks=0;
try{
for(const lang of ['en','es']){
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=watchPage(page);
 await page.goto(`${server.url}/${lang}/presentation/anime/?motion=off`);await page.waitForSelector('[data-slide="contact"]');await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('[data-slide]').count(),19);checks++;
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow, noarchive');checks++;
 // The middle cover strip uses The Vamp ep01, including the reduced-motion poster.
 const coverAnime=page.locator('[data-slide="cover"] .cover-panel').nth(1);
 assert.match(await coverAnime.locator('img').getAttribute('src'),/anime-vamp-01\/still-0/);checks++;
 await coverAnime.locator('button').click();await page.waitForFunction(()=>{const v=document.querySelector('dialog[open] video');return v&&v.readyState>=2&&v.currentTime>0;});
 assert.match(await page.locator('dialog[open] video').getAttribute('src'),/anime-vamp-01\/full.mp4/);await page.keyboard.press('Escape');checks++;
 await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});checks++;
 for(const id of ids){const slide=page.locator(`[data-slide="${id}"]`);await slide.scrollIntoViewIfNeeded();await page.waitForTimeout(100);await slide.screenshot({path:path.join(shots,`${lang}-${id.replaceAll('/','-')}.png`)});}
 // Every source plays, and switching episodes replaces the native video source.
 for(const id of ['anime/vamp-results','anime/platform-results','anime/mars-results']){
  const slide=page.locator(`[data-slide="${id}"]`);await slide.locator('button.anime-screening,button.anime-trailer').first().click();
  await page.waitForFunction(()=>{const v=document.querySelector('dialog[open] video');return v&&v.readyState>=2&&v.currentTime>0;});
  const switches=page.locator('dialog[open] [role="group"] button');
  for(let i=0;i<await switches.count();i++){await switches.nth(i).click();await page.waitForFunction(()=>{const v=document.querySelector('dialog[open] video');return v&&v.readyState>=2&&v.currentTime>0;});checks++;}
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);checks++;
 }
 const mars=page.locator('[data-slide="anime/mars-process"]');assert.equal(await mars.locator('.anime-art').count(),4);assert.equal(await mars.locator('[role="tab"]').count(),0);checks++;
 assert.equal(await page.locator('[data-slide="anime/mars-characters"] .anime-art').count(),2);checks++;
 assert.equal(await page.locator('[data-slide="ads"]').count(),0);checks++;
 assert.deepEqual(await page.locator('[data-slide="cover"] .cover-service').allTextContents(),lang==='en'?['Vertical Drama','AI Anime','Automated Content']:['Drama vertical','Anime con IA','Contenido automatizado']);checks++;
 assert.match(await page.locator('[data-slide="offer"]').innerText(),lang==='en'?/Human creativity powered by AI/i:/Creatividad humana potenciada por IA/i);checks++;
 assert.doesNotMatch(await page.locator('[data-slide="offer"]').innerText(),/AI Ads|UGC/);checks++;
 assert.match(await page.locator('[data-slide="founder"]').innerText(),/Coderhouse · 2021–2025/);checks++;
 const years=await page.locator('[data-slide="founder"] .founder-timeline li>span').allTextContents();assert.ok(years.every(y=>parseInt(y)>=2010));checks++;
 assert.match(await page.locator('[data-slide="contact"] .anime-contact-image').innerText(),lang==='en'?/AI Creative Producer & Technical Director/:/Productor Creativo de IA y Director Técnico/);checks++;
 // Context-preserving language switch.
 await page.locator('[data-slide="anime/platform-results"]').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 const opposite=lang==='en'?'ES':'EN';await page.locator('.presentation-site-nav').getByRole('link',{name:opposite,exact:true}).click();
 await page.waitForURL(`**/${lang==='en'?'es':'en'}/presentation/anime/**`);await page.waitForSelector('[data-slide="anime/platform-results"]');assert.equal(new URL(page.url()).hash,'#anime/platform-results');checks++;
 // Fullscreen-like presenter navigation maintains the 19-slide variant.
 await page.goto(`${server.url}/${lang}/presentation/anime/?mode=present&motion=off#anime/platform-results`);await page.waitForSelector('[data-slide="anime/platform-results"]');await page.keyboard.press('ArrowRight');await page.waitForSelector('[data-slide="anime/mars-process"]');checks++;
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});await page.goto(`${server.url}/${lang}/presentation/anime/?motion=off`);await page.waitForSelector('[data-slide="contact"]');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);checks++;
  await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
  await page.locator('[data-slide="anime/mars-results"]').scrollIntoViewIfNeeded();await page.locator('[data-slide="anime/mars-results"]').screenshot({path:path.join(shots,`${lang}-mobile-${width}.png`)});
  if(width===390){await page.locator('[data-slide="anime/mars-results"] button.anime-screening').first().click();await page.waitForFunction(()=>document.querySelector('dialog[open] video')?.readyState>=2);const bounds=await page.locator('dialog[open]').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1);await page.locator('dialog[open]').screenshot({path:path.join(shots,`${lang}-mobile-player.png`)});await page.keyboard.press('Escape');checks++;}
 }
 if(errors.length)failures.push(...errors);await page.close();
}
// Public routes must not advertise the edition; the existing deck stays at 12.
const page=await browser.newPage();
for(const lang of ['en','es']){
 await page.goto(`${server.url}/${lang}/presentation/?motion=off`);await page.waitForSelector('[data-slide="contact"]');assert.equal(await page.locator('[data-slide]').count(),12);assert.equal(await page.locator('.anime-slide').count(),0);checks++;
 await page.goto(`${server.url}/${lang}/`);await page.waitForSelector('.showcase');assert.equal(await page.locator('a[href*="presentation/anime"]').count(),0);checks++;
}
await page.close();
const motionPage=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
for(const lang of ['en','es']){
 await motionPage.goto(`${server.url}/${lang}/presentation/anime/?motion=on`);
 await motionPage.waitForFunction(()=>{const videos=[...document.querySelectorAll('[data-slide="cover"] .cover-panel video')];return videos.length===3&&videos.every(v=>!v.paused&&v.currentTime>0);});
 assert.match(await motionPage.locator('[data-slide="cover"] .cover-panel').nth(1).locator('video').getAttribute('src'),/vamp-ep01\/loop.mp4/);checks++;
}
await motionPage.close();
assert.deepEqual(failures,[]);console.log(`Anime QA: ${checks} checks passed. No browser errors. Screenshots: qa/anime/`);
}finally{await browser.close();await server.close();}
