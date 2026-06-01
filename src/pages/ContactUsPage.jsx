import { useState } from 'react';

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass rounded-[32px] p-8 sm:p-12 text-earth-cream space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Contact Us</h1>
          <p className="mt-3 text-sm text-earth-cream/70">
            We'd love to hear from you. Fill out the form below and our support team will get back to you within 24 hours.
          </p>
        </div>
        
        {status === 'success' ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center text-emerald-100">
            <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
            <p>Thank you for reaching out. We will get back to you shortly.</p>
            <button 
              type="button" 
              className="button-secondary mt-6" 
              onClick={() => setStatus('idle')}
            >
              Send another message
            </button>
          </div>
        ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Name</label>
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
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Message</label>
            <textarea 
              className="input min-h-[120px] py-3" 
              placeholder="How can we help?" 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          
          {errorMessage && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</div>}

          <button type="submit" className="button-primary w-full mt-4" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}