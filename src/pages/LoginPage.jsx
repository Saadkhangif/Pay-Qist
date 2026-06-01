import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Assuming login returns a promise
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 transform-gpu sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 font-medium">
            <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md focus:border-[#0F9D58] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-900" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md focus:border-[#0F9D58] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="rounded-xl bg-[#0F9D58] font-bold text-white flex w-full items-center justify-center gap-2 py-4 text-base shadow-lg shadow-[#0F9D58]/20 mt-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl hover:shadow-[#0F9D58]/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#0F9D58] transition hover:text-emerald-700 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}