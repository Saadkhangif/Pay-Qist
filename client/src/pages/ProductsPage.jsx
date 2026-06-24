import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import VirtualProductGrid from '../components/VirtualProductGrid';
import { useProducts } from '../hooks/useStoreQueries';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

function ProductCard({ product }) {
  const downPayment = getDownPayment(product.price);
  const monthly = getMonthlyInstallment(product.price, 12);

  return (
    <article className="surface-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-200/60 hover:shadow-card-hover dark:hover:border-brand-500/40">
      <Link to={`/product/${product.id}`} className="product-image-well relative block aspect-[4/3]">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="product-image h-full w-full group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link to={`/product/${product.id}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            {product.category || 'Electronics'}
          </span>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400">
            {product.title}
          </h3>
        </Link>
        <div className="mt-1 text-sm font-medium text-slate-400 line-through decoration-slate-300">
          Total: {formatCurrency(product.price)}
        </div>

        <div className="mt-4 rounded-2xl border border-brand-500/10 bg-brand-500/5 p-4">
          <div className="flex items-end gap-1">
            <span className="text-xl font-black text-brand-500">{formatCurrency(monthly)}</span>
            <span className="mb-0.5 text-sm font-medium text-slate-500">/mo</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-brand-500/70">× 12 Months</div>
            <div className="text-xs font-bold text-slate-500">Upfront: {formatCurrency(downPayment)}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const { data: products = [] } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'All');

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((p) => p.category || 'Uncategorized'));
    return ['All', ...Array.from(uniqueCategories)];
  }, [products]);

  const displayedProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => (p.category || 'Uncategorized') === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mb-12 overflow-hidden rounded-[2rem]">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-brand-900/60" />
        <div className="relative px-5 py-10 text-center sm:px-8 sm:py-14 md:px-8 md:py-16 md:text-left">
          <div className="section-badge mb-4 border-white/20 bg-white/10 text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Catalog
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">Our Products</h1>
          <p className="mt-3 max-w-xl text-lg text-slate-200">
            Shop top brands with zero hidden fees and easy installments.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:justify-start">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 sm:px-5 sm:py-2.5 ${
              activeCategory === category
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:bg-slate-700 dark:hover:text-brand-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {displayedProducts.length > 0 ? (
        <VirtualProductGrid
          products={displayedProducts}
          renderProduct={(product) => <ProductCard key={product.id} product={product} />}
        />
      ) : (
        <div className="surface-card mt-8 flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No products found</h3>
          <p className="mt-2 text-slate-500">
            We couldn&apos;t find any products in the &quot;{activeCategory}&quot; category.
          </p>
        </div>
      )}
    </div>
  );
}
