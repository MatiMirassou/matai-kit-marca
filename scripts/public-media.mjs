// Verify the exact assets used by the public layouts. Never transcodes or edits media.
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projects,caseStudies,forgottenEvidence} from '../src/content/en/work.ts';
import {services} from '../src/content/en/offer.ts';
import {founder} from '../src/content/en/founder.ts';

const root=path.resolve(import.meta.dirname,'..');
const manifest={...JSON.parse(await readFile(path.join(root,'src/generated/media.json'),'utf8')),...JSON.parse(await readFile(path.join(root,'src/generated/anime-media.json'),'utf8'))};
const files=new Set();
function addFile(file){
 if(!file)return;
 if(!/^media\/(?:anime-review\/)?[a-z0-9-]+\/[a-z0-9.-]+$/.test(file)||file.includes('..'))throw new Error('Unsafe public media path: '+file);
 files.add('public/'+file);
}
function add(reference){
 if(!reference)return;
 const [id,index]=reference.split('@');const entry=manifest[id];
 if(!entry)throw new Error('Unknown public media reference: '+reference);
 if(index!==undefined){const still=entry.stills?.[Number(index)];if(!still)throw new Error('Missing still: '+reference);addFile(still.poster);addFile(still.posterWebp);return;}
 for(const field of ['poster','posterWebp','loop','full'])addFile(entry[field]);
}
for(const project of projects){add(project.media);add(project.keyArt);project.frames?.forEach(add);project.episodes?.forEach(episode=>add(episode.media));}
for(const service of services)add(service.media);
for(const study of caseStudies){study.frames?.forEach(frame=>add(frame.media));study.outputs?.forEach(output=>add(output.media));}
add(founder.portrait.media);
forgottenEvidence.anchors.forEach(anchor=>add(anchor.media));
// Additional frames explicitly used by the hero, production case and brand guide.
['ff-mix','ff-ep01@4','ff-ep01@5','lingopie-ugc@0','news-output@2','news-show@0','news-show@2',
 'ikea-story@3','maid-ep01@1','vamp-ep01@2','msf-ep01@0','sew-ep01@3'].forEach(add);

// Unlisted bilingual anime edition: only the media used by its slides/player.
['anime-vamp-01','anime-vamp-02','anime-platform','anime-mars-mission',
 'anime-mars-ramen','anime-mars-training','anime-mars-volley',
 'anime-vamp-art-2','anime-vamp-art-3','anime-vamp-art-4',
 'anime-platform-art-1','anime-platform-art-2','anime-platform-art-3',
 'anime-mars-test-art-1','anime-mars-test-art-2','anime-mars-test-art-3','anime-mars-test-art-5',
 'anime-mars-female-art-5','anime-mars-male-art-2',
 'anime-vamp-01@0','anime-vamp-01@1','anime-vamp-01@2','anime-vamp-02@1','anime-vamp-02@3',
 'anime-platform@1','anime-platform@3','anime-mars-mission@2','anime-mars-ramen@1',
 'anime-mars-training@1','anime-mars-volley@1','anime-mars-volley@2'].forEach(add);
addFile(manifest['vamp-ep01'].loop);

const list=[];
for(const file of [...files].sort()){
 const absolute=path.join(root,file);const info=await stat(absolute);
 if(!info.isFile())throw new Error('Missing public media file: '+file);
 const sha256=createHash('sha256').update(await readFile(absolute)).digest('hex');
 list.push({file,bytes:info.size,sha256});
}
const report={files:list,totalBytes:list.reduce((sum,item)=>sum+item.bytes,0),videoFiles:list.filter(item=>item.file.endsWith('.mp4')).length,audioFiles:list.filter(item=>item.file.endsWith('.mp3')).length,over10MB:list.filter(item=>item.bytes>10_000_000).map(item=>({file:item.file,bytes:item.bytes}))};
if(process.argv.includes('--json'))console.log(JSON.stringify(report));
else{
 const approved=JSON.parse(await readFile(path.join(root,'public-media.lock.json'),'utf8'));
 if(JSON.stringify(approved.files)!==JSON.stringify(list))throw new Error('Public media differs from the reviewed file/hash allowlist. Review the changes before updating public-media.lock.json and .gitignore.');
 console.log(`Public media verified: ${list.length} files / ${(report.totalBytes/1024/1024).toFixed(1)} MiB / ${report.videoFiles} videos / ${report.audioFiles} audio files.`);
 console.log('Existing file bytes retained; no encoding or optimization performed.');
 if(report.over10MB.length)console.log(`Note: ${report.over10MB.length} existing files exceed Netlify's 10 MB CDN guidance; deployment is being tried as-is at the owner's request.`);
}
