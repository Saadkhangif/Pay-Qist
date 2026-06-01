export default function Hero() {
  return (
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
  );
}