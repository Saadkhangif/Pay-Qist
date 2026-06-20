import { Shield, Calendar, Zap, Eye } from 'lucide-react';
import SectionHeading from './SectionHeading';

const features = [
  {
    title: 'Secure Transactions',
    desc: 'Bank-grade security for all your payments.',
    icon: Shield,
    color: 'from-blue-500/10 to-blue-600/5 dark:from-blue-500/15 dark:to-blue-600/5',
    iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-500/15 dark:text-blue-300',
  },
  {
    title: 'Flexible Plans',
    desc: 'Choose between 3, 6, or 12 months.',
    icon: Calendar,
    color: 'from-brand-500/10 to-emerald-600/5 dark:from-brand-500/15 dark:to-emerald-600/5',
    iconColor: 'text-brand-500 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-300',
  },
  {
    title: 'Fast Approval',
    desc: 'Get approved in minutes, not days.',
    icon: Zap,
    color: 'from-amber-500/10 to-amber-600/5 dark:from-amber-500/15 dark:to-amber-600/5',
    iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300',
  },
  {
    title: 'No Hidden Charges',
    desc: 'What you see is exactly what you pay.',
    icon: Eye,
    color: 'from-violet-500/10 to-violet-600/5 dark:from-violet-500/15 dark:to-violet-600/5',
    iconColor: 'text-violet-500 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300',
  },
];

export default function Features() {
  return (
    <section className="home-section home-section-grid py-20">
      <div className="home-glow-orb -right-16 top-1/3 h-72 w-72 bg-violet-500/5 dark:bg-brand-500/15" />
      <div className="home-glow-orb -left-20 bottom-0 h-64 w-64 bg-blue-500/5 dark:bg-emerald-400/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefits"
          title="Why Choose Pay Qist?"
          description="We are rethinking consumer finance to give you the ultimate shopping freedom."
          align="center"
          className="mb-16"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`home-card-dark group relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br ${feature.color} p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover dark:border-emerald-500/15 dark:shadow-dark-card dark:hover:border-brand-400/35 dark:hover:shadow-dark-card-hover`}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/0 blur-2xl transition-all duration-500 group-hover:bg-brand-500/10 dark:group-hover:bg-brand-400/15" />
              <div
                className={`relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.iconColor}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
