import { ShoppingCart, FileText, CheckCircle, Truck } from 'lucide-react';
import SectionHeading from './SectionHeading';

const steps = [
  {
    title: 'Select Product',
    desc: 'Find your favorite item from our huge catalog.',
    icon: ShoppingCart,
  },
  {
    title: 'Apply Online',
    desc: 'Choose your installment plan and submit details.',
    icon: FileText,
  },
  {
    title: 'Get Approved',
    desc: 'Instant approval process with zero hidden fees.',
    icon: CheckCircle,
  },
  {
    title: 'Receive Product',
    desc: 'Get your item delivered right to your doorstep.',
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="home-section home-section-band home-section-grid border-y border-slate-200/50 bg-white py-20 dark-section">
      <div className="home-glow-orb left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 bg-brand-500/10 dark:bg-brand-500/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="How It Works"
          description="Get what you need today in four simple, hassle-free steps. No complicated paperwork."
          align="center"
          className="mb-16"
        />

        <div className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-0.5 bg-gradient-to-r from-transparent via-brand-200 to-transparent dark:via-brand-400/40 lg:block" />

          {steps.map((step, idx) => (
            <div key={step.title} className="group relative text-center">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-brand-50 bg-white shadow-xl shadow-slate-200/40 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:shadow-glow-brand dark:border-emerald-500/25 dark:bg-surface-raised dark:shadow-dark-card dark:ring-1 dark:ring-inset dark:ring-white/[0.05] dark:group-hover:border-brand-400/40 dark:group-hover:bg-surface-overlay dark:group-hover:shadow-dark-card-hover">
                <step.icon className="h-8 w-8 text-brand-500 dark:text-brand-300" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-md dark:shadow-glow-brand">
                  {idx + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="px-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
