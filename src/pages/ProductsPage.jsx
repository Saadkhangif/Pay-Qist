import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function ProductsPage() {
  const { products = [] } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');

  // Dynamically extract unique categories from the products actually stored in your database
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((p) => p.category || 'Uncategorized'));
    return ['All', ...Array.from(uniqueCategories)];
  }, [products]);

  // Filter products based on selected category (mocking category logic if it doesn't exist)
  const displayedProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => (p.category || 'Uncategorized') === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Products</h1>
          <p className="mt-2 text-lg text-slate-500">Shop top brands with zero hidden fees and easy installments.</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-12 flex flex-wrap items-center justify-center md:justify-start gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
              activeCategory === category
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => {
            const downPayment = getDownPayment(product.price);
            const monthly = getMonthlyInstallment(product.price, 12);

            return (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-[#0F9D58]/10 hover:-translate-y-1 flex flex-col transform-gpu">
                <Link to={`/product/${product.id}`} className="relative aspect-[4/3] bg-slate-50 overflow-hidden p-6 flex items-center justify-center block">
                  <img src={product.imageUrl} alt={product.title} loading="lazy" decoding="async" className="object-contain h-full w-full transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" style={{ willChange: 'transform' }} />
                </Link>
                
                <div className="p-6 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 hover:text-[#0F9D58] transition-colors">{product.title}</h3>
                  </Link>
                  <div className="text-sm font-medium text-slate-400 mt-1 line-through decoration-slate-300">Total: {formatCurrency(product.price)}</div>
                  
                  <div className="mt-4 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-[#0F9D58]">{formatCurrency(monthly)}</span>
                      <span className="text-sm font-medium text-slate-500 mb-0.5">/mo</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs font-bold text-[#0F9D58]/70 uppercase tracking-wide">× 12 Months</div>
                      <div className="text-xs font-bold text-slate-500">Upfront: {formatCurrency(downPayment)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-900">No products found</h3>
          <p className="mt-2 text-slate-500">We couldn't find any products in the "{activeCategory}" category.</p>
        </div>
      )}
    </div>
  );
}