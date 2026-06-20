import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, ShoppingBag } from 'lucide-react';

const heroProducts = [
  {
    title: 'Nova X Pro 5G',
    price: 'Rs. 15,833/mo',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'SwiftBook Air M3',
    price: 'Rs. 24,166/mo',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'AirTone ANC Pro',
    price: 'Rs. 2,916/mo',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
];

const trustPoints = [
  { label: 'Fast Approval', icon: '⚡' },
  { label: 'Secure Payments', icon: '🔒' },
  { label: '0% Hidden Fees', icon: '✓' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-28 pt-16 md:pt-20">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60 dark:opacity-80" />
      <div className="dark-glow-orb -right-32 -top-32 h-[500px] w-[500px] bg-brand-400/20 animate-glow-pulse dark:bg-brand-500/25" />
      <div className="dark-glow-orb -bottom-32 -left-32 h-[400px] w-[400px] bg-emerald-300/20 dark:bg-teal-400/15" />
      <div className="dark-glow-orb right-1/4 top-1/3 hidden h-64 w-64 bg-brand-400/10 dark:block dark:bg-emerald-400/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up space-y-8 text-center lg:text-left">
            <div className="section-badge mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              0% Hidden Charges
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[3.75rem]">
              Buy Today.{' '}
              <span className="gradient-text">Pay in Easy</span>
              <br />
              Monthly Installments.
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0">
              Get your favorite phones, laptops, appliances, and more delivered today with
              flexible, secure, and transparent payment plans.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a href="#products" className="button-primary w-full gap-2 px-8 py-4 text-base sm:w-auto">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </a>
              <a href="#calculator" className="button-secondary w-full gap-2 px-8 py-4 text-base sm:w-auto">
                <Calculator className="h-5 w-5" />
                Calculate Installment
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
              {trustPoints.map((point) => (
                <div
                  key={point.label}
                  className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-overlay/70 dark:text-slate-200 dark:shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <span className="text-brand-500 dark:text-brand-300">{point.icon}</span>
                  {point.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none" style={{ animationDelay: '0.15s' }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-6 shadow-2xl shadow-brand-500/10 dark:border-emerald-500/20 dark:from-surface-overlay dark:via-surface-raised dark:to-surface-muted dark:shadow-[0_24px_64px_rgba(0,0,0,0.45),0_0_0_1px_rgba(52,211,153,0.08),inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-[0.07] dark:opacity-[0.04]" />
              <div className="pointer-events-none absolute -right-8 top-8 h-32 w-32 rounded-full bg-brand-400/20 blur-2xl dark:bg-brand-500/20" />

              <div className="relative z-10 mx-auto w-full max-w-sm space-y-4">
                {heroProducts.map((item, index) => (
                  <div key={item.title} className={clsxCard(index)}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-white dark:ring-emerald-500/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                      <div className="mt-0.5 text-xs font-bold text-brand-600 dark:text-brand-300">{item.price}</div>
                    </div>
                    <div className="shrink-0 rounded-lg bg-brand-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:shadow-glow-brand">
                      Approved
                    </div>
                  </div>
                ))}

                <div className="ml-3 rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-xl dark:border-emerald-500/20 dark:from-surface-muted dark:via-surface-overlay dark:to-surface-raised dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(52,211,153,0.1)]">
                  <div className="mb-2 flex items-end justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Down Payment</div>
                    <div className="text-xs font-bold text-brand-400">20% only</div>
                  </div>
                  <div className="text-2xl font-black">Pay the rest monthly</div>
                  <Link
                    to="/products"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-400 transition hover:text-brand-300"
                  >
                    Browse catalog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-white bg-white/90 px-5 py-3 shadow-lg backdrop-blur-sm dark:border-emerald-500/20 dark:bg-surface-overlay/95 dark:shadow-dark-card sm:block">
              <div className="text-2xl font-black text-brand-500 dark:text-brand-300">98%</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Approval Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function clsxCard(index) {
  const base =
    'flex items-center gap-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-emerald-500/12 dark:bg-surface-overlay/90 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]';
  if (index === 0) return `${base} animate-float`;
  if (index === 1) return `${base} ml-6 animate-float-delayed`;
  return `${base} ml-3`;
}
