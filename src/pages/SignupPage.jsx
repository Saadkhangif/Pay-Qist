// Import necessary hooks and functions for routing and authentication
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  // Initialize navigation and auth context
  const navigate = useNavigate();
  const { signup } = useAuth(); // Assuming signup logic is in your AuthContext

  // Manage local component state for the signup form and UI feedback
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Handle the form submission process
  async function handleSubmit(event) {
    event.preventDefault(); // Prevent default browser form submission
    setLoading(true);
    setError('');
    try {
      // Attempt to sign up the user via Firebase/AuthContext
      await signup(form);
      setVerificationSent(true);
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  }

  // If verification email is sent, show a success screen instead of the form
  if (verificationSent) {
    return (
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass w-full max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white mb-4">Check your email</h1>
          <p className="text-sm leading-6 text-earth-cream mb-8">
            We've sent a verification link to <strong className="text-white">{form.email}</strong>. 
            Please check your inbox and verify your email to continue.
          </p>
          <button className="button-secondary w-full" onClick={() => navigate('/login', { replace: true })}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render the default signup form
  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass w-full max-w-md rounded-[32px] p-8">
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-semibold text-white">Create an account</h1>
          <p className="text-sm leading-6 text-earth-cream">Sign up to buy now and pay in installments.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            className="input" 
            type="text" 
            name="name"
            autoComplete="name"
            placeholder="Full name" 
            value={form.name} 
            onChange={(event) => setForm({ ...form, name: event.target.value })} 
            required 
          />
          <input 
            className="input" 
            type="email" 
            name="email"
            autoComplete="email"
            placeholder="Email address" 
            value={form.email} 
            onChange={(event) => setForm({ ...form, email: event.target.value })} 
            required 
          />
          <input 
            className="input" 
            type="password" 
            name="password"
            autoComplete="new-password"
            placeholder="Password" 
            value={form.password} 
            onChange={(event) => setForm({ ...form, password: event.target.value })} 
            required 
          />

          {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button className="button-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-earth-cream/70">
          Already have an account?{' '}
          <Link className="font-semibold text-earth-gold hover:text-earth-gold/80" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}