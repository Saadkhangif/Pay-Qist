const features = [
  { title: 'Secure Transactions', desc: 'Bank-grade security for all your payments.' },
  { title: 'Flexible Plans', desc: 'Choose between 3, 6, or 12 months.' },
  { title: 'Fast Approval', desc: 'Get approved in minutes, not days.' },
  { title: 'No Hidden Charges', desc: 'What you see is exactly what you pay.' },
];

export default function Features() {
  return (
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
  );
}