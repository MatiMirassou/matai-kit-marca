import { useEffect } from 'react';
import { content } from './content';
import { LightboxProvider, useLightbox } from './components/Lightbox.tsx';
import { Deck } from './deck/Deck.tsx';
import { DeckChrome } from './deck/DeckChrome.tsx';
import { DeckProvider, useDeck } from './deck/DeckProvider.tsx';
import { media } from './lib/media.ts';
import {currentRoute} from './lib/routes.ts';
import {Showcase} from './showcase/Showcase.tsx';
import {PresentationNav} from './showcase/PresentationNav.tsx';

/** ?play=<project-id | media-id> opens that clip on load (used by PDF links / QR codes). */
function PlayDeepLink() {
  const { params, isPrint } = useDeck();
  const { open } = useLightbox();
  useEffect(() => {
    if (!params.play || isPrint) return;
    const project = content.projects.find((p) => p.id === params.play);
    if (project) {
      open({ title: project.title, media: project.media, episodes: project.episodes });
      return;
    }
    if (media(params.play)) open({ title: params.play, media: params.play });
  }, [params.play, isPrint, open]);
  return null;
}

export function App() {
  const route=currentRoute();
  if(route.view!=='presentation'&&route.view!=='brand')return <Showcase route={route}/>;
  return (
    <DeckProvider>
      <LightboxProvider>
        <PresentationNav />
        <Deck />
        <DeckChrome />
        <PlayDeepLink />
      </LightboxProvider>
    </DeckProvider>
  );
}
