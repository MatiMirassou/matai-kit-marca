import logo from '../assets/logo.json';

/**
 * The Mat.AI logo — vector paths traced from the original artwork
 * (Logo/Mat.AI Cinematic Brand Identity.png) by `npm run logo`.
 *
 * Base lettering follows the background. AI is always Signal Red.
 * The saffron fold and dot never change.
 */
type Variant = 'framed' | 'full' | 'mark';
export type LogoTone = 'light' | 'dark';

const COLORS: Record<LogoTone, { ink: string; saffron: string; red: string }> = {
  light: { ink: '#1C1917', saffron: '#F2B233', red: '#B3261E' },
  dark: { ink: '#FFF8EE', saffron: '#F2B233', red: '#B3261E' },
};

const data = logo as Record<Variant, { width: number; height: number; ink: string; saffron: string; red: string }>;

export function Logo({
  variant = 'full',
  tone = 'dark',
  className = '',
  title = 'Mat.AI',
  colors,
}: {
  variant?: Variant;
  tone?: LogoTone;
  className?: string;
  title?: string;
  /** Override colours (used only for the brand guide's "don't" examples). */
  colors?: Partial<{ ink: string; saffron: string; red: string }>;
}) {
  const v = data[variant];
  const c = { ...COLORS[tone], ...colors };
  return (
    <svg viewBox={`0 0 ${v.width} ${v.height}`} className={className} role="img" aria-label={title}>
      <path fillRule="evenodd" fill={c.ink} d={v.ink} />
      <path fillRule="evenodd" fill={c.saffron} d={v.saffron} />
      {v.red && <path fillRule="evenodd" fill={c.red} d={v.red} />}
    </svg>
  );
}

/** Aspect ratio (width / height) of a logo variant — for sizing boxes. */
export const logoAspect = (variant: Variant) => data[variant].width / data[variant].height;
