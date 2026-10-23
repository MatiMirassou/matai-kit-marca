import { StrictMode } from 'react';
import { createRoot,hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/newsreader/latin-400-italic.css';
import '@fontsource/newsreader/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles/app.css';
import './styles/hybrid-review.css';
import './styles/showcase.css';
import { App } from './App.tsx';
import {currentRoute} from './lib/routes.ts';

const root=document.getElementById('root')!;
if(location.pathname==='/'&&!location.search&&!location.hash){
 let lang='en';try{if(localStorage.getItem('matai-language')==='es')lang='es';}catch{/* Storage can be unavailable. */}
 location.replace('/'+lang+'/');
}else{
 const app=<StrictMode><App/></StrictMode>;
 if(root.dataset.rendered==='true'&&root.dataset.route?.replace(/\/$/,'')===location.pathname.replace(/\/$/,'')&&document.documentElement.lang===currentRoute().language&&['showcase','project','not-found'].includes(currentRoute().view))hydrateRoot(root,app);
 else{root.innerHTML='';createRoot(root).render(app);}
}
