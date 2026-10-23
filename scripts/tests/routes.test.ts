import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveRoute,languageHref} from '../../src/lib/routes.ts';
import {translateTree} from '../../src/content/translations.ts';
test('two layouts, explicit locales and direct project routes',()=>{
 assert.equal(resolveRoute('/en/').view,'showcase');
 assert.deepEqual(resolveRoute('/es/work/forgotten-fortune/'),{view:'project',language:'es',project:'forgotten-fortune'});
 assert.equal(resolveRoute('/es/presentation/').view,'presentation');
 assert.equal(resolveRoute('/en/missing/').view,'not-found');
});
test('legacy PDF/deck links and portable file bundles remain presentations',()=>{
 for(const search of ['?print=1','?play=ff-ep01','?mode=present','?deck=full'])assert.equal(resolveRoute('/',search).view,'presentation');
 assert.equal(resolveRoute('/','','#series').view,'presentation');
 assert.equal(resolveRoute('/C:/bundle/index.html','','',true).view,'presentation');
 assert.equal(resolveRoute('/en/','','#contact').view,'showcase');
});
test('language links retain context, query parameters and slide/section',()=>{
 assert.equal(languageHref({view:'project',language:'en',project:'patient'},'es','?motion=off','#frames'),'/es/work/patient/?motion=off#frames');
 assert.equal(languageHref({view:'presentation',language:'en'},'es','?lang=en&mode=present','#case/forgotten-fortune'),'/es/presentation/?mode=present#case/forgotten-fortune');
 assert.equal(languageHref({view:'showcase',language:'es'},'en','?service=dramas&format=vertical','#work'),'/en/?service=dramas&format=vertical#work');
});
test('translation keeps structure, technical IDs and proper names stable',()=>{
 const value={id:'news-video',kind:'client',title:'Forgotten Fortune',label:'Editorial review',links:['Lingopie','media/news/full.mp4']};
 assert.deepEqual(translateTree(value),{...value,label:'Revisión editorial'});
});
