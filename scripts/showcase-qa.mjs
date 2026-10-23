import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {launchBrowser,startPreview,watchPage,projectDir,waitForPrintReady} from './lib/browser.mjs';
import {projects} from '../src/content/en/work.ts';
const server=await startPreview();const browser=await launchBrowser();
const out=path.join(projectDir,'qa','showcase');await mkdir(out,{recursive:true});
let checks=0;const ok=(label,value)=>{assert.ok(value,label);checks++;console.log('✓ '+label);};
const prepareShot=page=>page.evaluate(async()=>{const images=Array.from(document.images);images.forEach(img=>img.loading='eager');await Promise.all(images.map(img=>img.decode()));await document.fonts.ready;});
try{
 for(const lang of ['en','es']){
  const html=await readFile(path.join(projectDir,'dist',lang,'index.html'),'utf8');
  ok(lang+' static HTML includes indexable showcase content',html.includes(lang==='en'?'Human':'Creatividad')&&html.includes('Forgotten Fortune')&&html.includes('data-rendered="true"'));
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const page=await context.newPage();const errors=watchPage(page);
 await page.goto(server.url+'/en/?motion=off',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 ok('Home gallery shows 10 real projects',await page.locator('.work-card').count()===10);
 ok('Portrait and widescreen galleries are separate',await page.locator('.work-group-vertical .work-card').count()===4&&await page.locator('.work-group-horizontal .work-card').count()===4);
 ok('No horizontal overflow on desktop',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 ok('Reduced motion disables every preview loop',await page.locator('video').count()===0);
 await prepareShot(page);await page.screenshot({path:path.join(out,'desktop-hero.png')});await page.locator('#work').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'desktop-work.png')});
 await page.getByRole('button',{name:'AI advertising',exact:true}).click();ok('Service filter shows two advertising projects',await page.locator('.work-card').count()===2);
 await page.locator('.format-select select').selectOption('vertical');ok('Incompatible filters have a useful empty state',await page.locator('.work-empty').count()===1);
 await page.getByRole('button',{name:/Show all work/}).click();ok('Reset filters restores all projects',await page.locator('.work-card').count()===10);
 await page.getByRole('button',{name:'Microdramas',exact:true}).click();await page.locator('.format-select select').selectOption('vertical');
 await page.locator('.site-header .site-languages a[lang="es"]').click();await page.waitForLoadState('networkidle');
 ok('Language switch retains filters and section',page.url().includes('/es/')&&page.url().includes('service=dramas')&&page.url().includes('format=vertical')&&page.url().endsWith('#work'));
 ok('Spanish content and gallery hydrate correctly',await page.locator('html').getAttribute('lang')==='es'&&await page.locator('.work-card').count()===4&&await page.locator('h1').innerText().then(t=>t.includes('Creatividad')));
 await page.goto(server.url+'/en/work/forgotten-fortune/',{waitUntil:'networkidle'});
 ok('Direct project route has its own title and production story',(await page.title()).includes('Forgotten Fortune')&&await page.locator('.reference-grid figure').count()===4);
 await page.getByRole('button',{name:'Play Forgotten Fortune',exact:true}).click();await page.waitForSelector('dialog[open] video');
 ok('Full media opens in a native dialog',await page.locator('dialog[open] video').getAttribute('src').then(s=>s.includes('ff-ep01/full.mp4')));
 await page.keyboard.press('Escape');ok('Escape closes playback',await page.locator('dialog[open]').count()===0);
 await page.locator('.site-header .site-languages a[lang="es"]').click();await page.waitForLoadState('networkidle');ok('Project language switch retains the same project',page.url().includes('/es/work/forgotten-fortune/'));
 for(const lang of ['en','es']){for(const project of projects){await page.goto(server.url+`/${lang}/work/${project.id}/`,{waitUntil:'load'});assert.equal(await page.locator('h1').innerText(),project.title);}ok(lang+' all eleven direct project routes render the correct project',true);}
 await page.goto(server.url+'/en/work/news-audio/',{waitUntil:'load'});await page.getByRole('button',{name:'Play News in Easy Spanish',exact:true}).click();await page.waitForFunction(()=>document.querySelector('dialog[open] audio')?.readyState>=2);ok('Audio project plays the actual audio file',await page.locator('dialog[open] audio').getAttribute('src').then(s=>s.includes('/news-audio/full.mp3')));await page.keyboard.press('Escape');
 await page.goto(server.url+'/en/not-a-real-page/',{waitUntil:'load'});ok('Unknown routes have a usable not-found page',await page.locator('.site-not-found').count()===1);
 await page.goto(server.url+'/',{waitUntil:'networkidle'});ok('Root visit remembers an explicit Spanish preference',page.url().endsWith('/es/'));
 await page.goto(server.url+'/en/#process',{waitUntil:'networkidle'});const tab=page.locator('#site-workflow-tab-news-video');await tab.focus();await page.keyboard.press('ArrowRight');ok('Workflow tabs support keyboard navigation',await page.locator('[role="tab"][aria-selected="true"]').count()===1&&await page.locator('#site-workflow-tab-podcast').getAttribute('aria-selected')==='true');
 await page.locator('.site-header .site-languages a[lang="es"]').click();await page.waitForLoadState('networkidle');ok('Language switch preserves the selected workflow',page.url().includes('workflow=podcast')&&await page.locator('#site-workflow-tab-podcast').getAttribute('aria-selected')==='true');
 await page.goto(server.url+'/en/presentation/?motion=off#series',{waitUntil:'networkidle'});ok('Presentation remains a distinct 12-slide layout',await page.locator('.frame').count()===12&&await page.locator('.presentation-site-nav').count()===1);
 await page.locator('.presentation-site-nav .site-languages a[lang="es"]').click();await page.waitForLoadState('networkidle');ok('Presentation language keeps current slide',page.url().endsWith('#series')&&await page.locator('html').getAttribute('lang')==='es');
 await page.keyboard.press('p');ok('Presentation mode hides website navigation',await page.locator('.presentation-site-nav').count()===0);await page.keyboard.press('Escape');
 for(const lang of ['en','es']){await page.goto(server.url+`/${lang}/presentation/?print=1&motion=off`,{waitUntil:'load'});await waitForPrintReady(page);ok(lang+' print layout has 12 slides and no site navigation',await page.locator('.frame').count()===12&&await page.locator('.presentation-site-nav').count()===0);}
 if(errors.length)console.error(errors);ok('Desktop has no console, network or hydration errors',errors.length===0);await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const mp=await mobile.newPage();const mobileErrors=watchPage(mp);
 for(const lang of ['en','es']){
  await mp.goto(server.url+`/${lang}/`,{waitUntil:'networkidle'});ok(lang+' mobile has no horizontal overflow',await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));ok(lang+' mobile headlines fit',await mp.locator('h1,h2,h3').evaluateAll(es=>es.every(el=>el.scrollWidth<=el.clientWidth+1)));await prepareShot(mp);await mp.screenshot({path:path.join(out,`mobile-${lang}.png`),fullPage:true});await mp.screenshot({path:path.join(out,`mobile-${lang}-hero.png`)});
  await mp.locator('.site-menu-toggle').click();ok(lang+' mobile menu opens',await mp.locator('.site-menu').evaluate(el=>getComputedStyle(el).display!=='none'));await mp.keyboard.press('Escape');ok(lang+' mobile menu returns focus',await mp.locator('.site-menu-toggle').evaluate(el=>el===document.activeElement));
  await mp.goto(server.url+`/${lang}/work/patient/`,{waitUntil:'networkidle'});ok(lang+' mobile project page has no horizontal overflow',await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 if(mobileErrors.length)console.error(mobileErrors);ok('Mobile has no console, network or hydration errors',mobileErrors.length===0);await mobile.close();
 console.log(`Passed ${checks} showcase checks. Screenshots: qa/showcase/`);
}finally{await browser.close();await server.close();}
