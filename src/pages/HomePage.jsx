import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

// --- Static Data ---
const categories = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Appliances', icon: '🏠' },
  { name: 'Electronics', icon: '🔌' },
  { name: 'Furniture', icon: '🛋️' },
];

const steps = [
  { title: 'Select Product', desc: 'Find your favorite item from our huge catalog.', icon: '🛒' },
  { title: 'Apply Online', desc: 'Choose your installment plan and submit details.', icon: '📝' },
  { title: 'Get Approved', desc: 'Instant approval process with zero hidden fees.', icon: '✅' },
  { title: 'Receive Product', desc: 'Get your item delivered right to your doorstep.', icon: '📦' },
];

const features = [
  { title: 'Secure Transactions', desc: 'Bank-grade security for all your payments.' },
  { title: 'Flexible Plans', desc: 'Choose between 3, 6, or 12 months.' },
  { title: 'Fast Approval', desc: 'Get approved in minutes, not days.' },
  { title: 'No Hidden Charges', desc: 'What you see is exactly what you pay.' },
];

const faqs = [
  { q: 'How do installments work?', a: 'Simply choose a product, select your preferred duration (3, 6, or 12 months), pay the down payment, and the rest is divided into equal monthly chunks.' },
  { q: 'What documents are required?', a: 'You only need a valid ID card, a recent utility bill, and proof of income.' },
  { q: 'Can I pay early?', a: 'Yes! You can clear your remaining balance at any time without any early repayment penalties.' },
  { q: 'Is there any hidden fee?', a: 'Absolutely not. We pride ourselves on 100% transparency. 0% hidden charges.' },
];

export default function HomePage() {
  const { products } = useStore();
  const { user } = useAuth();
  const { cart = [] } = useStore();
  
  // Get up to 6 featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  // EMI Calculator State
  const [calcPrice, setCalcPrice] = useState(150000);
  const [calcDown, setCalcDown] = useState(45000);
  const [calcMonths, setCalcMonths] = useState(6);
  const calcMonthly = Math.max(0, (calcPrice - calcDown) / calcMonths);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#0F9D58] selection:text-white pb-20">
      
      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

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
              <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-tr from-emerald-100 to-white border border-white shadow-2xl p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
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
      <section className="border-y border-slate-200/60 bg-white/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50">
            <div className="text-center px-4">
              <div className="text-3xl font-black text-[#0F9D58]">10,000+</div>
              <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Happy Customers</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-[#0F9D58]">500+</div>
              <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Premium Products</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-[#0F9D58]">98%</div>
              <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Approval Rate</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-black text-[#0F9D58]">24/7</div>
              <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 cursor-pointer group transition hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100">
                <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0F9D58] text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                      <img src={product.imageUrl} alt={product.title} loading="lazy" className="object-contain h-full w-full transition duration-500 group-hover:scale-105 mix-blend-multiply" />
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
      <section id="calculator" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F9D58] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">EMI Calculator</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Plan your purchase. Adjust the sliders to find an installment plan that perfectly fits your monthly budget.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">Product Price (Rs.)</label>
                      <span className="font-bold text-[#0F9D58]">{calcPrice.toLocaleString()}</span>
                    </div>
                    <input type="range" min="10000" max="500000" step="5000" value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0F9D58]" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">Down Payment (Rs.)</label>
                      <span className="font-bold text-[#0F9D58]">{calcDown.toLocaleString()}</span>
                    </div>
                    <input type="range" min="0" max={calcPrice} step="5000" value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0F9D58]" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-3">Duration (Months)</label>
                    <div className="flex gap-4">
                      {[3, 6, 12].map((m) => (
                        <button key={m} onClick={() => setCalcMonths(m)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${calcMonths === m ? 'bg-[#0F9D58] text-white shadow-lg shadow-[#0F9D58]/30 border border-[#0F9D58]' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}>
                          {m} Months
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700">
                <h3 className="text-lg font-medium text-slate-300 mb-6 text-center">Your Estimated Plan</h3>
                <div className="text-center mb-8">
                  <div className="text-5xl font-black text-white mb-2">Rs. {Math.ceil(calcMonthly).toLocaleString()}</div>
                  <div className="text-sm font-medium text-[#0F9D58] uppercase tracking-widest">Per Month</div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Price:</span>
                    <span className="font-semibold text-white">Rs. {calcPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Upfront Payment:</span>
                    <span className="font-semibold text-white">Rs. {calcDown.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Financed Amount:</span>
                    <span className="font-semibold text-white">Rs. {Math.max(0, calcPrice - calcDown).toLocaleString()}</span>
                  </div>
                </div>
                <Link to="/" className="mt-8 block w-full text-center py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-lg">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto">Get what you need today in four simple, hassle-free steps. No complicated paperwork.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/4 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="w-20 h-20 mx-auto bg-white border-[4px] border-emerald-50 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-slate-200/40 mb-6 transition-transform group-hover:-translate-y-2 group-hover:border-[#0F9D58]/20 group-hover:bg-emerald-50">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{idx + 1}. {step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE PAY QIST */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Pay Qist?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We are rethinking consumer finance to give you the ultimate shopping freedom.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 hover:border-emerald-200">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-[#0F9D58]"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PARTNER BRANDS */}
      <section className="py-12 bg-white border-y border-slate-200/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by top brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Apple', 'Samsung', 'Sony', 'HP', 'Dell', 'Lenovo'].map((brand) => (
              <span key={brand} className="text-2xl font-black text-slate-800">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about our installment plans.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-200">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                  className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <span className={`text-[#0F9D58] transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0F9D58] to-emerald-700 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-[#0F9D58]/20">
            <h2 className="text-3xl font-bold text-white mb-4">Never Miss a Deal</h2>
            <p className="text-emerald-100 mb-8 max-w-lg mx-auto">Subscribe to our newsletter to get updates on new products, exclusive 0% markup deals, and promotions.</p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition backdrop-blur-sm"
              />
              <button type="button" className="px-8 py-4 rounded-full bg-white text-[#0F9D58] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 12. PREMIUM FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F9D58] to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
                  Q
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">Pay <span className="text-[#0F9D58]">Qist</span></span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
                Empowering your lifestyle with flexible, transparent, and instant installment plans. Shop smart, pay easy.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">f</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">t</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">in</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Products</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Smartphones</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Laptops</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Appliances</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Gaming</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">About Us</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Store Locator</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Terms & Conditions</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Return Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Installment Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-slate-100 text-xs font-bold text-slate-400 rounded">VISA</div>
              <div className="px-3 py-1 bg-slate-100 text-xs font-bold text-slate-400 rounded">MASTERCARD</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}