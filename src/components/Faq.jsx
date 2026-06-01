import { useState } from 'react';

const faqs = [
  { q: 'How do installments work?', a: 'Simply choose a product, select your preferred duration (3, 6, or 12 months), pay the down payment, and the rest is divided into equal monthly chunks.' },
  { q: 'What documents are required?', a: 'You only need a valid ID card, a recent utility bill, and proof of income.' },
  { q: 'Can I pay early?', a: 'Yes! You can clear your remaining balance at any time without any early repayment penalties.' },
  { q: 'Is there any hidden fee?', a: 'Absolutely not. We pride ourselves on 100% transparency. 0% hidden charges.' },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
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
  );
}