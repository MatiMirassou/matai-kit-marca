// Local review only. Copies original videos byte-for-byte; creates display
// images and extracted frames without modifying production sources.
// Output lives under the existing ignored public/media/ tree. No Git actions.
import {spawnSync} from 'node:child_process';
import {mkdir, readdir, stat, copyFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
const source=process.argv[2];
if(!source)throw new Error('Usage: node scripts/anime-media.mjs <AI Anime Presentation folder>');
const root=path.resolve(import.meta.dirname,'..');
const output=path.join(root,'public/media/anime-review');
const manifest={};
function run(cmd,args){const r=spawnSync(cmd,args,{encoding:'utf8',windowsHide:true,maxBuffer:8e6});if(r.status!==0)throw new Error(r.stderr||r.error?.message);return r.stdout;}
function probe(file){const p=JSON.parse(run('ffprobe',['-v','error','-show_entries','stream=codec_type,width,height:format=duration','-of','json',file]));const v=p.streams.find(s=>s.codec_type==='video');return {...v,duration:Number(p.format?.duration||0),hasAudio:p.streams.some(s=>s.codec_type==='audio')};}
function ff(args){run('ffmpeg',['-hide_banner','-loglevel','error','-y',...args]);}
async function asset(id,relative,video=false){
 const src=path.join(source,relative);const info=probe(src);const folder=path.join(output,id);await mkdir(folder,{recursive:true});
 const prefix=`media/anime-review/${id}/`;
 const scale="scale='min(1600,iw)':-2";
 const input=video?['-ss',String(Math.min(4,info.duration/4)),'-i',src]:['-i',src];
 ff([...input,'-frames:v','1','-vf',scale,'-q:v','2',path.join(folder,'poster.jpg')]);
 ff(['-i',path.join(folder,'poster.jpg'),'-frames:v','1','-quality','88',path.join(folder,'poster.webp')]);
 const entry={kind:video?'video':'image',width:info.width,height:info.height,aspect:info.width>info.height?'16:9':'9:16',poster:prefix+'poster.jpg',posterWebp:prefix+'poster.webp'};
 if(video){
  await copyFile(src,path.join(folder,'full.mp4'));
  Object.assign(entry,{duration:info.duration,hasAudio:info.hasAudio,full:prefix+'full.mp4',stills:[]});
  for(const [i,fraction] of [0.12,0.33,0.55,0.77].entries()){
   const jpg=`still-${i}.jpg`,webp=`still-${i}.webp`;
   ff(['-ss',String(info.duration*fraction),'-i',src,'-frames:v','1','-vf',scale,'-q:v','2',path.join(folder,jpg)]);
   ff(['-i',path.join(folder,jpg),'-frames:v','1','-quality','88',path.join(folder,webp)]);
   entry.stills.push({poster:prefix+jpg,posterWebp:prefix+webp,width:info.width,height:info.height});
  }
 }
 manifest[id]=entry;console.log(`${id}: ${info.width}×${info.height}${video?' / '+info.duration.toFixed(1)+'s':''}`);
}
await asset('anime-vamp-01','The Vamp/TheVamp_ep01 EDIT v3_MIX v1.mp4',true);
await asset('anime-vamp-02','The Vamp/TheVamp_ep02_EDIT v3_MIX v1.mp4',true);
await asset('anime-platform','Platform Zero/platform_zero_trailer_final.mp4',true);
for(const [id,file] of [['mission','Last Mission'],['ramen','Ramen'],['training','Training'],['volley','Volley']])await asset('anime-mars-'+id,`Love on Mars/Videos/Love on Mars_Edit_${file}.mp4`,true);
for(const [group,dir] of [['vamp','The Vamp/Characters'],['platform','Platform Zero/Characters'],['mars-female','Love on Mars/Females'],['mars-male','Love on Mars/Male'],['mars-test','Love on Mars/Testing']]){
 const files=(await readdir(path.join(source,dir))).filter(f=>f.endsWith('.png')).sort();
 for(const [index,file] of files.entries())await asset(`anime-${group}-art-${index+1}`,path.join(dir,file));
}
await writeFile(path.join(root,'src/generated/anime-media.json'),JSON.stringify(manifest,null,2)+'\n');
const records=[];
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())await walk(file);else records.push({file:path.relative(root,file).replaceAll('\\','/'),bytes:(await stat(file)).size});}}
await walk(output);await mkdir(path.join(root,'qa/anime'),{recursive:true});
await writeFile(path.join(root,'qa/anime/local-media-inventory.json'),JSON.stringify(records,null,2)+'\n');
console.log(`Prepared ${records.length} local files; no upload or video transcoding.`);
