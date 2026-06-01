import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function FeaturedProducts() {
  const { products = [] } = useStore();
  
  // Get up to 6 featured products
  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products]);

  return (
    <section id="products" className="py-16 bg-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-500 mt-2">Top electronics available on flexible plans.</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex text-[#0F9D58] font-semibold hover:underline">View All →</Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const downPayment = getDownPayment(product.price);
              const monthly = getMonthlyInstallment(product.price, 12); // Default to 12 mo display

              return (
                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 transition-all hover:shadow-xl hover:shadow-[#0F9D58]/10 hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden p-6 flex items-center justify-center">
                    <img src={product.imageUrl} alt={product.title} loading="lazy" decoding="async" className="object-contain h-full w-full transition duration-500 group-hover:scale-105 mix-blend-multiply" style={{ willChange: 'transform' }} />
                    <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Hot</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.title}</h3>
                    <div className="text-sm text-slate-400 mt-1 line-through decoration-slate-300">Total: {formatCurrency(product.price)}</div>
                    
                    <div className="mt-4 bg-[#0F9D58]/5 rounded-2xl p-4 border border-[#0F9D58]/10">
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-[#0F9D58]">{formatCurrency(monthly)}</span>
                        <span className="text-sm font-medium text-slate-500 mb-1">/mo</span>
                      </div>
                      <div className="text-xs font-semibold text-[#0F9D58]/70 mt-1 uppercase tracking-wide">× 12 Months</div>
                    </div>

                    <div className="mt-4 flex justify-between items-center text-sm font-medium text-slate-600">
                      <span>Down Payment:</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(downPayment)}</span>
                    </div>

                    <div className="mt-6 flex gap-3 pt-auto mt-auto">
                      <Link to={`/product/${product.id}`} className="flex-1 text-center py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition">
                        View Details
                      </Link>
                      <Link to={`/product/${product.id}`} className="flex-1 text-center py-3 px-4 rounded-xl bg-[#0F9D58] font-semibold text-white shadow-md shadow-[#0F9D58]/20 hover:bg-emerald-600 transition">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60">
            <p className="text-slate-500 text-lg">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}