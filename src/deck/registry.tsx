import type { ComponentType } from 'react';
import type { SlideKind } from '../content/types.ts';
import type { SlideProps } from './SlideFrame.tsx';
import { Cover, Founder, Offer } from '../slides/Intro.tsx';
import { Series, Vertical } from '../slides/Dramas.tsx';
import { Ads, Craft } from '../slides/Ads.tsx';
import { Podcasts } from '../slides/Podcasts.tsx';
import { Systems } from '../slides/Systems.tsx';
import { CaseStudy } from '../slides/CaseStudy.tsx';
import { Contact, Credits, Fit } from '../slides/Exit.tsx';
import { BrandColor, BrandCover, BrandElements, BrandLogo, BrandMisuse, BrandType } from '../slides/Brand.tsx';
import {AnimeCover,AnimeOverview,AnimeProcess,AnimeResults,AnimeContact,AnimeOffer,AnimeFounder,AnimeCharacters} from '../anime/AnimeSlides.tsx';

/** Slide kind → component. A missing kind is a compile error. */
export const registry = {
  'anime-cover':AnimeCover,
  'anime-offer':AnimeOffer,
  'anime-founder':AnimeFounder,
  'anime-characters':AnimeCharacters,
  'anime-overview':AnimeOverview,
  'anime-process':AnimeProcess,
  'anime-results':AnimeResults,
  'anime-contact':AnimeContact,
  cover: Cover,
  founder: Founder,
  offer: Offer,
  series: Series,
  vertical: Vertical,
  case: CaseStudy,
  ads: Ads,
  craft: Craft,
  podcasts: Podcasts,
  systems: Systems,
  fit: Fit,
  contact: Contact,
  credits: Credits,
  'brand-cover': BrandCover,
  'brand-logo': BrandLogo,
  'brand-logo-misuse': BrandMisuse,
  'brand-color': BrandColor,
  'brand-type': BrandType,
  'brand-elements': BrandElements,
} satisfies Record<SlideKind, ComponentType<SlideProps>>;
