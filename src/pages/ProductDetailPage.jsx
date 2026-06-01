import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [], addToCart } = useStore();
  
  // State for interactive UI
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [adding, setAdding] = useState(false);

  // Find the exact product
  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <p className="text-slate-500 mb-8">The item you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="px-6 py-3 bg-[#0F9D58] text-white font-bold rounded-xl shadow-lg shadow-[#0F9D58]/20 hover:-translate-y-0.5 hover:bg-emerald-600 transition-all">
          Return to Products
        </Link>
      </div>
    );
  }

  // Calculations for UI
  const downPayment = getDownPayment(product.price);
  const monthly = getMonthlyInstallment(product.price, selectedMonths);
  const availableDurations = product.allowedInstallmentMonths || [3, 6, 12];

  const handleAddToCart = () => {
    setAdding(true);
    // Add the item to cart with the selected installment plan
    addToCart({ ...product, installmentMonths: selectedMonths });
    
    // Simulate network delay for premium feel, then redirect
    setTimeout(() => {
      navigate('/cart');
    }, 600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0F9D58] transition-colors mb-8 group">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back to Catalog
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 xl:gap-16 items-start">
        
        {/* Left Column: Product Imagery */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-16 flex items-center justify-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white -z-10"></div>
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply transform-gpu"
            decoding="async"
          />
          {product.featured && (
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0F9D58] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
              Featured
            </div>
          )}
        </div>

        {/* Right Column: Checkout Widget */}
        <div className="space-y-8 sticky top-24">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              {product.title}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              {product.description || 'Experience premium quality and cutting-edge features. Purchase today with easy, transparent monthly installments.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-600">
              Total Value: <span className="line-through decoration-slate-400">{formatCurrency(product.price)}</span>
            </div>
          </div>

          {/* Installment Selector Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Select Installment Plan</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {availableDurations.map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedMonths === months
                      ? 'border-[#0F9D58] bg-emerald-50 text-[#0F9D58] shadow-md shadow-[#0F9D58]/10'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl font-black">{months}</span>
                  <span className="text-xs font-bold uppercase tracking-wider mt-1 opacity-80">Months</span>
                </button>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 border-t border-slate-100 pt-6 mb-8">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Down Payment</span>
                <span className="font-bold text-slate-900">{formatCurrency(downPayment)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Processing Fee</span>
                <span className="font-bold text-[#0F9D58]">0% (Free)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-slate-900">Monthly Payment</span>
                <span className="text-3xl font-black text-[#0F9D58]">{formatCurrency(monthly)}</span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button 
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 hover:-translate-y-1 hover:bg-slate-800 transition-all duration-200 active:translate-y-0 disabled:opacity-80 disabled:hover:translate-y-0"
            >
              {adding ? (
                <><svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating Plan...</>
              ) : (
                <>Apply Now</>
              )}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0F9D58] flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <div className="text-sm font-bold text-slate-900">Instant Approval</div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>
              <div className="text-sm font-bold text-slate-900">Secure Checkout</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}