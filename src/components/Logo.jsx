import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import logoUrl from '../assets/logo.png';

const heights = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-12 sm:h-[3.25rem]',
};

const maxWidths = {
  sm: 'max-w-[5.5rem]',
  md: 'max-w-[7.5rem]',
  lg: 'max-w-[9rem]',
  xl: 'max-w-[8.5rem] sm:max-w-[9.5rem]',
};

/**
 * @param {'auto' | 'light' | 'dark'} surface
 *   - light: transparent white knock-out on light backgrounds (header light mode)
 *   - dark: white brand plate so full-color logo reads on dark backgrounds (footer, dark header)
 *   - auto: follows theme
 */
export default function Logo({
  to = '/home',
  size = 'md',
  surface = 'auto',
  className = '',
  priority = false,
}) {
  const { isDark } = useTheme();
  const effectiveSurface =
    surface === 'auto'
      ? isDark
        ? 'dark'
        : 'light'
      : surface === 'light' && isDark
        ? 'dark'
        : surface;
  const onDarkSurface = effectiveSurface === 'dark';

  const image = (
    <img
      src={logoUrl}
      alt="Pay Qist"
      width={220}
      height={88}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={clsx(
        'w-auto object-contain object-left',
        heights[size],
        maxWidths[size],
        !onDarkSurface && 'mix-blend-multiply',
        className,
      )}
    />
  );

  const mark = onDarkSurface ? (
    <span
      className={clsx(
        'inline-flex items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/90',
        size === 'sm' && 'px-2 py-0.5',
        size === 'md' && 'px-2.5 py-1',
        size === 'lg' && 'px-3 py-1.5',
        size === 'xl' && 'px-2.5 py-1 sm:px-3 sm:py-1.5',
      )}
    >
      {image}
    </span>
  ) : (
    image
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex shrink-0 items-center rounded-lg transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        aria-label="Pay Qist home"
      >
        {mark}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{mark}</span>;
}
