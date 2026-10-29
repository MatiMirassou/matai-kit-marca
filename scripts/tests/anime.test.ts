import {test} from 'node:test';
import assert from 'node:assert/strict';
import {animeEdition,animeSlides,animeProjects} from '../../src/anime/deck.ts';
import {slides} from '../../src/content/en/deck.ts';
test('anime edition removes ads, adds eight anime slides and keeps the original deck intact',()=>{
 const edition=animeEdition(slides);
 assert.equal(edition.length,19);assert.equal(slides.length,12);
 assert.deepEqual(edition.filter(s=>!s.id.startsWith('anime')).map(s=>s.id),slides.filter(s=>s.id!=='ads').map(s=>s.id));
 assert.deepEqual(edition.slice(2,10),animeSlides);
 assert.equal(edition[1]?.kind,'anime-offer');assert.equal(edition.find(s=>s.id==='founder')?.kind,'anime-founder');
 const cast=edition.findIndex(s=>s.id==='anime/mars-characters');assert.equal(edition[cast+1]?.id,'anime/mars-results');
 assert.equal(edition[0]?.kind,'anime-cover');assert.equal(slides[0]?.kind,'cover');
 assert.equal(edition.at(-1)?.kind,'anime-contact');assert.equal(new Set(edition.map(s=>s.id)).size,19);
});
test('all seven generated videos remain available',()=>{
 assert.equal(animeProjects.length,3);assert.equal(animeProjects.flatMap(p=>p.episodes).length,7);
});
