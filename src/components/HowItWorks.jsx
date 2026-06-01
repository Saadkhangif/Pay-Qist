const steps = [
  { title: 'Select Product', desc: 'Find your favorite item from our huge catalog.', icon: '🛒' },
  { title: 'Apply Online', desc: 'Choose your installment plan and submit details.', icon: '📝' },
  { title: 'Get Approved', desc: 'Instant approval process with zero hidden fees.', icon: '✅' },
  { title: 'Receive Product', desc: 'Get your item delivered right to your doorstep.', icon: '📦' },
];

export default function HowItWorks() {
  return (
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
  );
}