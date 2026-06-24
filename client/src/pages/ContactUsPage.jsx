import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { apiFetch } from '../lib/api';
import CommentForm from '../components/CommentForm';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../lib/contact';

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="page-panel space-y-8">
        <div>
          <h1 className="page-title">Contact Us</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            We&apos;d love to hear from you. Fill out the form below and our support team will get back
            to you within 24 hours.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-800 dark:text-emerald-300">
            <svg className="mx-auto mb-4 h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
            <p>Thank you for reaching out. We will get back to you shortly.</p>
            <button type="button" className="button-secondary mt-6" onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input
                className="input"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                className="input"
                type="email"
                placeholder="Your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea
                className="input min-h-[120px] py-3"
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            {errorMessage ? (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-300">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {errorMessage}
              </div>
            ) : null}

            <button type="submit" className="button-primary mt-4 w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        <CommentForm />
      </div>
    </div>
  );
}
