import clsx from 'clsx';

const darkToneClasses = {
  slate: 'border-white/10 bg-white/5 text-slate-200',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  info: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
};

const lightToneClasses = {
  slate: 'border-slate-200 bg-slate-50 text-slate-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
};

export default function StatusPill({ children, tone = 'slate', variant = 'dark' }) {
  const toneClasses = variant === 'light' ? lightToneClasses : darkToneClasses;

  return (
    <span className={clsx('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', toneClasses[tone])}>
      {children}
    </span>
  );
}