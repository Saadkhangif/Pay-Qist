import clsx from 'clsx';

export default function SectionHeading({ eyebrow, title, description, variant = 'dark' }) {
  const isLight = variant === 'light';

  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? (
        <div
          className={clsx(
            'text-xs font-semibold uppercase tracking-[0.3em]',
            isLight ? 'text-[#0F9D58]' : 'text-cyan-300',
          )}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={clsx(
          'text-3xl font-semibold tracking-tight sm:text-4xl',
          isLight ? 'text-slate-900' : 'text-white',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={clsx('text-sm leading-7 sm:text-base', isLight ? 'text-slate-500' : 'text-slate-300')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}