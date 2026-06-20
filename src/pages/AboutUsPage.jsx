import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Products' },
  { value: '98%', label: 'Approval Rate' },
  { value: '24/7', label: 'Customer Support' },
];

const values = [
  {
    title: 'Transparency',
    description: 'Clear payment schedules, no hidden fees, and honest terms from day one.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Accessibility',
    description: 'Everyone deserves the products they need — we make that possible with flexible installments.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Trust',
    description: 'Bank-grade security and reliable support so you can shop with complete confidence.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const highlights = [
  {
    title: 'Flexible Plans',
    description: 'Choose 3, 6, or 12-month installments that fit your budget.',
  },
  {
    title: 'Fast Approval',
    description: 'Get approved in minutes with a simple online application.',
  },
  {
    title: 'Top Brands',
    description: 'Phones, laptops, appliances, and more from trusted partners.',
  },
  {
    title: 'Zero Hidden Fees',
    description: 'What you see at checkout is exactly what you pay — no surprises.',
  },
];

export default function AboutUsPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-bl from-emerald-300/40 to-transparent opacity-60" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/4 -translate-x-1/4 rounded-full bg-gradient-to-tr from-emerald-200/40 to-transparent opacity-60" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Logo to={null} size="lg" surface="auto" />
            </div>
            <div className="section-badge mb-6">
              Our Story
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Making installments{' '}
              <span className="gradient-text">simple & fair</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Pay Qist was built on a simple belief: everyone deserves access to the products they love.
              We created a platform that makes buying now and paying later transparent, flexible, and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200/60 bg-white/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 divide-x divide-slate-200/50 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 text-center">
                <div className="text-3xl font-black text-brand-500">{stat.value}</div>
                <div className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-white bg-gradient-to-tr from-emerald-100 to-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
                  alt="Customer shopping with Pay Qist"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:-right-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Founded on</div>
                <div className="mt-1 text-lg font-bold text-slate-900">Financial Freedom</div>
              </div>
            </div>

            <div className="space-y-6 lg:pl-4">
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              <p className="leading-relaxed text-slate-600">
                We empower consumers with financial flexibility. By offering manageable installment plans,
                we help you budget better and reach your purchasing goals without the burden of large upfront payments.
              </p>
              <p className="leading-relaxed text-slate-600">
                From smartphones to home appliances, we partner with leading brands to bring you quality products
                paired with payment options that actually work for real life.
              </p>
              <ul className="space-y-3 pt-2">
                {['Clear, upfront pricing on every product', 'Secure checkout and protected transactions', 'Dedicated support whenever you need help'].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-slate-200/50 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">What We Stand For</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              These principles guide every product we list and every payment plan we offer.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Pay Qist?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              We are rethinking consumer finance to give you the ultimate shopping freedom.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                  <div className="h-4 w-4 rounded-full bg-brand-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent" />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">Ready to shop smarter?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-400">
            Browse our catalog, pick an installment plan, and get your order delivered — all in a few simple steps.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/products" className="button-primary w-full px-8 py-4 text-base sm:w-auto">
              Browse Products
            </Link>
            <Link
              to="/contact-us"
              className="w-full rounded-full border border-slate-700 bg-slate-800 px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 hover:bg-slate-700 sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
