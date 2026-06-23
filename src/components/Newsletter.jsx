import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <section className="home-section py-20">
      <div className="home-glow-orb left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-brand-500/5 dark:bg-brand-500/15" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 p-6 text-center shadow-2xl shadow-brand-500/25 ring-1 ring-white/10 dark:from-brand-600 dark:via-brand-700 dark:to-emerald-900 dark:shadow-[0_24px_80px_rgba(15,157,88,0.35)] dark:ring-brand-300/20 sm:rounded-[2.5rem] sm:p-10 md:rounded-[3rem] md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_55%)]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-emerald-300/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl dark:bg-brand-300/10" />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20 dark:opacity-30" />

          <div className="relative z-10">
            <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl">Never Miss a Deal</h2>
            <p className="mx-auto mb-8 max-w-lg text-emerald-100">
              Subscribe to get updates on new products, exclusive 0% markup deals, and promotions.
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder-emerald-200 transition focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-brand-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
            {status === 'success' ? (
              <p className="mt-4 text-sm font-semibold text-white">Thanks for subscribing!</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
