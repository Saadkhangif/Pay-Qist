import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';
import EmiCalculator from '../components/EmiCalculator';
import Newsletter from '../components/Newsletter';
import Faq from '../components/Faq';
import TrustStatistics from '../components/TrustStatistics';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import PartnerBrands from '../components/PartnerBrands';

export default function HomePage() {
  const { products } = useStore();
  const { user } = useAuth();
  const { cart = [] } = useStore();
  
  // Get up to 6 featured products
  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#0F9D58] selection:text-white pb-20">
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-300/40 to-transparent rounded-full opacity-60 pointer-events-none transform-gpu"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 to-transparent rounded-full opacity-60 pointer-events-none transform-gpu"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F9D58]/10 border border-[#0F9D58]/20 text-[#0F9D58] text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F9D58] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F9D58]"></span>
                </span>
                0% Hidden Charges
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Buy Today. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F9D58] to-emerald-400">Pay in Easy</span> <br />
                Monthly Installments.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Get your favorite phones, laptops, appliances, and more delivered today with highly flexible, secure, and transparent payment plans.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a href="#products" className="w-full sm:w-auto rounded-full bg-[#0F9D58] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#0F9D58]/20 transition-all hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0F9D58]/30">
                  Shop Now
                </a>
                <a href="#calculator" className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-lg shadow-slate-200 border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                  Calculate Installment
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-[#0F9D58]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Fast Approval</div>
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-[#0F9D58]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> Secure Payments</div>
              </div>
            </div>
            
            {/* Abstract Hero Visual */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-tr from-emerald-100 to-white border border-white shadow-2xl p-8 flex items-center justify-center relative overflow-hidden transform-gpu">
                <div className="absolute inset-0 bg-white/60"></div>
                {/* Floating Mock Elements */}
                <div className="relative z-10 w-full max-w-xs space-y-4">
                  <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">📱</div>
                    <div>
                      <div className="h-4 w-24 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-3 w-16 bg-[#0F9D58]/20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-emerald-50 ml-8 transition hover:-translate-y-1">
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Due Today</div>
                      <div className="text-sm font-bold text-[#0F9D58] bg-[#0F9D58]/10 px-2 py-1 rounded-lg">Approved</div>
                    </div>
                    <div className="text-3xl font-black text-slate-800">Rs. 15,000</div>
                    <div className="mt-4 flex gap-2">
                      <div className="h-2 flex-1 bg-[#0F9D58] rounded-full"></div>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full"></div>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST STATISTICS */}
      <TrustStatistics />

      {/* 4. CATEGORIES */}
      <Categories />

      {/* 5. FEATURED PRODUCTS */}
      <section id="products" className="py-16 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
              <p className="text-slate-500 mt-2">Top electronics available on flexible plans.</p>
            </div>
            <Link to="/" className="hidden sm:inline-flex text-[#0F9D58] font-semibold hover:underline">View All →</Link>
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

      {/* 6. INSTALLMENT CALCULATOR */}
      <EmiCalculator />

      {/* 7. HOW IT WORKS */}
      <HowItWorks />

      {/* 8. WHY CHOOSE PAY QIST */}
      <Features />

      {/* 9. PARTNER BRANDS */}
      <PartnerBrands />

      {/* 10. FAQ SECTION */}
      <Faq />

      {/* 11. NEWSLETTER */}
      <Newsletter />

    </div>
  );
}