import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass w-full max-w-md rounded-[32px] p-8">
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm leading-6 text-slate-300">Sign in to continue to checkout and your order history.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />

          {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button className="button-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button className="button-secondary w-full" type="button" onClick={handleGoogleSignIn} disabled={loading}>
          Sign in with Google
        </button>

        <p className="mt-6 text-sm text-slate-400">
          New here?{' '}
          <Link className="font-semibold text-cyan-300 hover:text-cyan-200" to="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}