import clsx from 'clsx';

export default function StatusPill({ children, tone = 'slate' }) {
  const toneClasses = {
    slate: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    warning: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
    info: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  };

  return <span className={clsx('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', toneClasses[tone])}>{children}</span>;
}