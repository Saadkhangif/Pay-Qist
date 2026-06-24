import clsx from 'clsx';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  variant = 'light',
  align = 'left',
  className = '',
}) {
  const isLight = variant === 'light';
  const isCenter = align === 'center';

  return (
    <div
      className={clsx(
        'max-w-2xl space-y-4',
        isCenter && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <div className={clsx('section-badge', isCenter && 'mx-auto')}>
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={clsx(
          'text-2xl font-extrabold tracking-tight xs:text-3xl sm:text-4xl',
          isLight ? 'text-slate-900 dark:text-white' : 'text-white',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={clsx(
            'text-base leading-relaxed sm:text-lg',
            isLight ? 'text-slate-500 dark:text-slate-300' : 'text-slate-300',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
