import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';

const faqs = [
  {
    q: 'How do installments work?',
    a: 'Simply choose a product, select your preferred duration (3, 6, or 12 months), pay the down payment, and the rest is divided into equal monthly chunks.',
  },
  {
    q: 'What documents are required?',
    a: 'You only need a valid ID card, a recent utility bill, and proof of income.',
  },
  {
    q: 'Can I pay early?',
    a: 'Yes! You can clear your remaining balance at any time without any early repayment penalties.',
  },
  {
    q: 'Is there any hidden fee?',
    a: 'Absolutely not. We pride ourselves on 100% transparency. 0% hidden charges.',
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section id="faq" className="home-section home-section-band home-section-grid py-24">
      <div className="home-glow-orb right-8 top-12 h-64 w-64 bg-brand-500/5 dark:bg-brand-500/15" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about our installment plans."
          align="center"
          className="mb-12"
        />

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className={`home-card-dark overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-brand-200 bg-white shadow-card-hover dark:border-brand-400/35 dark:bg-surface-overlay dark:shadow-dark-card-hover dark:ring-1 dark:ring-brand-400/20'
                    : 'surface-card hover:border-brand-100 dark:hover:border-brand-500/35'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span className="pr-4 font-semibold text-slate-900 dark:text-slate-100">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
