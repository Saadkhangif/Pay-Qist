import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';
import SectionHeading from './SectionHeading';

export default function FeaturedProducts() {
  const { products = [] } = useStore();
  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products]);

  return (
    <section id="products" className="home-section home-section-spotlight relative py-20">
      <div className="home-glow-orb right-0 top-0 h-80 w-80 bg-brand-500/10 dark:bg-brand-500/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-100/80 via-slate-50/50 to-transparent dark:from-brand-500/12 dark:via-surface-overlay/40 dark:to-surface-raised/20" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-0 dark:opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Trending"
            title="Featured Products"
            description="Top electronics available on flexible plans."
          />
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-500 transition hover:gap-2 hover:text-brand-600 dark:text-brand-300 dark:hover:text-brand-200"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const downPayment = getDownPayment(product.price);
              const monthly = getMonthlyInstallment(product.price, 12);

              return (
                <article
                  key={product.id}
                  className="surface-card home-card-dark group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-200/60 hover:shadow-card-hover dark:hover:border-brand-400/40 dark:hover:shadow-dark-card-hover"
                >
                  <div className="product-image-well relative aspect-[4/3]">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="product-image h-full w-full group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Hot
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-500">
                      {product.category || 'Electronics'}
                    </span>
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-slate-100">{product.title}</h3>
                    <div className="mt-1 text-sm text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600">
                      Total: {formatCurrency(product.price)}
                    </div>

                    <div className="mt-4 pricing-highlight">
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-brand-500">{formatCurrency(monthly)}</span>
                        <span className="mb-1 text-sm font-medium text-slate-500">/mo</span>
                      </div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-500/70">
                        × 12 Months
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span>Down Payment:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(downPayment)}</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/product/${product.id}`}
                        className="button-secondary flex-1 py-3 text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/product/${product.id}`}
                        className="button-primary flex-1 py-3 text-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="surface-card home-card-dark py-20 text-center">
            <p className="text-lg text-slate-500 dark:text-slate-400">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
