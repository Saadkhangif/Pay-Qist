import { Link } from 'react-router-dom';

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

export default function Hero() {
  return (
    <section className="relative pt-20 pb-28 overflow-hidden">
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

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-tr from-emerald-100 to-white border border-white shadow-2xl p-6 sm:p-8 relative overflow-hidden transform-gpu">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                aria-hidden="true"
              />
              <div className="relative z-10 w-full max-w-sm mx-auto space-y-4">
                {heroProducts.map((item, index) => (
                  <div
                    key={item.title}
                    className={`bg-white/95 backdrop-blur p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-white/80 ${
                      index === 0 ? 'animate-bounce' : 'ml-6'
                    }`}
                    style={index === 0 ? { animationDuration: '3s' } : undefined}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-xs font-bold text-[#0F9D58] mt-0.5">{item.price}</div>
                    </div>
                    <div className="ml-auto text-xs font-bold text-white bg-[#0F9D58] px-2.5 py-1 rounded-lg shrink-0">
                      Approved
                    </div>
                  </div>
                ))}
                <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl ml-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Down Payment</div>
                    <div className="text-xs font-bold text-emerald-400">20% only</div>
                  </div>
                  <div className="text-2xl font-black">Pay the rest monthly</div>
                  <Link to="/products" className="mt-3 inline-block text-sm font-bold text-emerald-400 hover:text-emerald-300">
                    Browse catalog →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
