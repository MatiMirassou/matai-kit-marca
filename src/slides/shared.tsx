import { content } from '../content';
import type { Project } from '../content/types.ts';
import { useLightbox } from '../components/Lightbox.tsx';
import { media } from '../lib/media.ts';

/** Circular play affordance shown on hover/focus over playable media (hidden in print). */
export function PlayGlyph() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-ink/45 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pdf:hidden"
    >
      <span className="ml-[calc(var(--su)*4)] block h-0 w-0 border-y-[calc(var(--su)*8)] border-l-[calc(var(--su)*13)] border-y-transparent border-l-cream" />
    </span>
  );
}

/** Opens a project's video (with episodes, if any) in the lightbox. */
export function useOpenProject() {
  const { open } = useLightbox();
  return (p: Project) => {
    const m = media(p.media);
    if (!m || m.kind !== 'video') return;
    open({
      title: p.title,
      media: p.media,
      episodes: p.episodes,
      meta: [p.client ? `${content.kindLabel[p.kind]} · ${p.client}` : content.kindLabel[p.kind], m.aspect, p.year],
    });
  };
}

export const projectById = (id: string) => content.projects.find((p) => p.id === id);
