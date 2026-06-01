import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getMonthlyInstallment } from '../lib/currency';

export default function HomePage() {
  const { products, stats } = useStore();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/70 px-6 py-12 shadow-glow sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-hero-grid bg-[length:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Buy now, pay in parts
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The storefront for installment shopping, built for modern payments.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Browse featured products, select a repayment plan, and apply for installment checkout in a secure, role-aware experience.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" to="/signup">
                Start shopping
              </Link>
              <Link className="button-secondary" to="/login">
                Sign in
              </Link>
            </div>
          </div>

          <div className="glass space-y-5 rounded-[30px] p-6">
            <SectionHeading
              eyebrow="Live pricing"
              title="Installment snapshot"
              description="Examples shown here use a 4-month teaser plan to make the savings easy to scan."
            />
            <div className="space-y-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="text-sm font-semibold text-white">{product.title}</div>
                  <div className="mt-1 text-sm text-slate-300">
                    {formatCurrency(product.price)} or {formatCurrency(getMonthlyInstallment(product.price, 4))}/month for 4 months
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-[28px] p-6">
          <div className="text-sm text-slate-400">Featured products</div>
          <div className="mt-2 text-3xl font-semibold text-white">{stats.totalProducts}</div>
        </div>
        <div className="glass rounded-[28px] p-6">
          <div className="text-sm text-slate-400">Active applications</div>
          <div className="mt-2 text-3xl font-semibold text-white">{stats.totalOrders}</div>
        </div>
        <div className="glass rounded-[28px] p-6">
          <div className="text-sm text-slate-400">Cart down payment</div>
          <div className="mt-2 text-3xl font-semibold text-white">{formatCurrency(stats.cartDownPayment)}</div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured products"
          title="Popular items on installment"
          description="Each product includes a total price and a fast installment estimate to help shoppers compare options quickly."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}