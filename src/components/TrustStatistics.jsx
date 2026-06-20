import { Users, Package, TrendingUp, Headphones } from 'lucide-react';

const stats = [
  {
    value: '10,000+',
    label: 'Happy Customers',
    icon: Users,
    accent: 'from-blue-500/15 to-blue-600/5 text-blue-500 dark:from-blue-400/20 dark:to-blue-600/10 dark:text-blue-300',
    glow: 'group-hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]',
  },
  {
    value: '500+',
    label: 'Premium Products',
    icon: Package,
    accent: 'from-brand-500/15 to-emerald-600/5 text-brand-500 dark:from-brand-400/20 dark:to-emerald-600/10 dark:text-brand-300',
    glow: 'group-hover:shadow-glow-brand',
  },
  {
    value: '98%',
    label: 'Approval Rate',
    icon: TrendingUp,
    accent: 'from-amber-500/15 to-amber-600/5 text-amber-500 dark:from-amber-400/20 dark:to-amber-600/10 dark:text-amber-300',
    glow: 'group-hover:shadow-[0_0_24px_rgba(245,158,11,0.22)]',
  },
  {
    value: '24/7',
    label: 'Customer Support',
    icon: Headphones,
    accent: 'from-violet-500/15 to-violet-600/5 text-violet-500 dark:from-violet-400/20 dark:to-violet-600/10 dark:text-violet-300',
    glow: 'group-hover:shadow-[0_0_24px_rgba(139,92,246,0.22)]',
  },
];

export default function TrustStatistics() {
  return (
    <section className="trust-glass-band home-section home-section-grid">
      <div className="home-glow-orb -left-20 top-0 h-72 w-72 bg-brand-500/10 dark:bg-brand-500/25" />
      <div className="home-glow-orb -right-16 bottom-0 h-64 w-64 bg-emerald-400/10 dark:bg-teal-400/15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(15,157,88,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(52,211,153,0.16),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-brand-400/30 via-emerald-300/20 to-teal-400/30 p-px dark:from-brand-400/40 dark:via-emerald-400/25 dark:to-teal-400/35">
          <div className="trust-glass-panel">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,transparent_45%,rgba(15,157,88,0.06)_100%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_40%,rgba(52,211,153,0.08)_100%)]" />
            <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30 dark:opacity-40" />

            <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`trust-stat-tile group ${stat.glow}`}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm transition-all duration-300 group-hover:scale-110 ${stat.accent}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="gradient-text text-3xl font-black">{stat.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
