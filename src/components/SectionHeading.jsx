export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <div className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</div> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description ? <p className="text-sm leading-7 text-slate-300 sm:text-base">{description}</p> : null}
    </div>
  );
}