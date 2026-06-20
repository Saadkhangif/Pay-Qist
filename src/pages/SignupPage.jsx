import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Check, Shield, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import CustomerProfileForm from '../components/CustomerProfileForm';
import { useAuth } from '../context/AuthContext';
import { validateAuthForm } from '../lib/validation/authSchemas';

const perks = [
  {
    icon: ShoppingBag,
    title: 'Shop today, pay monthly',
    description: 'Split your purchase into easy installments with transparent pricing.',
  },
  {
    icon: Zap,
    title: 'Fast account setup',
    description: 'Create your profile in under two minutes and start browsing right away.',
  },
  {
    icon: Shield,
    title: 'Secure & verified',
    description: 'Your details are protected and used only to verify your identity.',
  },
];

const highlights = ['0% hidden fees', 'Flexible plans', 'Trusted by thousands'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signup, isLoading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.profileComplete) {
    return <Navigate to="/home" replace />;
  }

  if (user && !user.profileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  const handleSubmit = async (values) => {
    setError('');

    const validation = validateAuthForm('signup', values);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const profile = await signup(values);
      if (profile.profileComplete) {
        navigate('/home', { replace: true });
      } else {
        navigate('/complete-profile', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-x-clip py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50 dark:opacity-70" />
      <div className="dark-glow-orb -left-24 top-20 h-72 w-72 bg-brand-400/20 animate-glow-pulse dark:bg-brand-500/20" />
      <div className="dark-glow-orb -right-20 bottom-10 h-80 w-80 bg-emerald-300/15 dark:bg-teal-400/10" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_28rem] lg:gap-14 xl:grid-cols-[1fr_32rem]">
          <div className="animate-fade-up space-y-8 lg:sticky lg:top-24">
            <div className="section-badge">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Join Pay Qist
            </div>

            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Start shopping with{' '}
                <span className="gradient-text">easy installments</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                Create your free account and unlock flexible payment plans on phones, laptops,
                appliances, and more.
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/15 bg-brand-500/5 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              {perks.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group flex gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand-200/60 hover:shadow-md dark:border-emerald-500/10 dark:bg-surface-raised/60 dark:hover:border-brand-500/20 dark:hover:shadow-dark-card-hover"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-400 dark:group-hover:bg-brand-500">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up lg:animate-none">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/95 dark:shadow-dark-card sm:p-8">
              <CustomerProfileForm
                title="Create your account"
                subtitle="Fill in your details below — it only takes a minute."
                onSubmit={handleSubmit}
                submitLabel="Create account"
                loading={loading || authLoading}
                error={error}
                showLoginSwitch
                showContactInfo={false}
                compactHeader
                onSwitchToLogin={() => navigate('/home', { state: { openAuth: 'login' } })}
              />
              <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
                By signing up, you agree to our{' '}
                <Link
                  to="/terms-of-service"
                  className="underline transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy-policy"
                  className="underline transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
