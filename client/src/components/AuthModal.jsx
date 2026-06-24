import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Headphones,
  Laptop,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateAuthForm } from '../lib/validation/authSchemas';
import { useAuthModal } from '../context/AuthModalContext';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from '../lib/contact';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import Logo from './Logo';

const previewItems = [
  {
    icon: Smartphone,
    label: 'Phones & gadgets',
    amount: 'Rs. 15,833/mo',
    tone: 'from-violet-500/20 to-violet-600/10',
    iconTone: 'text-violet-600 dark:text-violet-300',
  },
  {
    icon: Laptop,
    label: 'Laptops & tech',
    amount: 'Rs. 24,166/mo',
    tone: 'from-sky-500/20 to-sky-600/10',
    iconTone: 'text-sky-600 dark:text-sky-300',
  },
  {
    icon: Headphones,
    label: 'Accessories',
    amount: 'Rs. 2,916/mo',
    tone: 'from-amber-500/20 to-amber-600/10',
    iconTone: 'text-amber-600 dark:text-amber-300',
  },
];

const unlockSteps = [
  { icon: ShoppingBag, label: 'Cart' },
  { icon: CreditCard, label: 'Apply' },
  { icon: CalendarDays, label: 'Pay monthly' },
];

const trustPills = [
  { icon: Zap, label: 'Fast approval' },
  { icon: ShieldCheck, label: 'Secure login' },
  { icon: TrendingUp, label: '0% hidden fees' },
];

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.481-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function LoginPreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-full md:max-w-[16rem] lg:max-w-[19rem]">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/15 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-3.5 lg:p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/90">After you sign in</p>
          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-50">Live</span>
        </div>

        <div className="space-y-2.5">
          {previewItems.map(({ icon: Icon, label, amount, tone, iconTone }, index) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-2xl border border-white/25 bg-white/90 p-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10 ${
                index === 1 ? 'ml-3' : index === 2 ? 'ml-1.5' : ''
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone} ring-1 ring-white/40`}
              >
                <Icon className={`h-5 w-5 ${iconTone}`} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800 dark:text-white">{label}</p>
                <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-300">{amount}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-brand-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                Ready
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-800/20 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-lg">
          <div className="flex items-end justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your plan</p>
            <p className="text-[10px] font-bold text-brand-400">20% down</p>
          </div>
          <p className="mt-1 text-xl font-black leading-tight">Pay the rest in easy monthly chunks</p>

          <div className="mt-3 flex items-center justify-between gap-1">
            {unlockSteps.map(({ icon: Icon, label }, index) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-3.5 w-3.5 text-emerald-200" aria-hidden="true" />
                  {index < unlockSteps.length - 1 ? (
                    <span className="pointer-events-none absolute left-full top-1/2 hidden h-px w-[calc(100%+0.25rem)] -translate-y-1/2 bg-white/20 sm:block" />
                  ) : null}
                </div>
                <span className="text-[9px] font-semibold text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-3 -left-3 rounded-2xl border border-white/40 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm dark:border-emerald-500/20 dark:bg-surface-overlay/95">
        <p className="text-xl font-black text-brand-600 dark:text-brand-300">98%</p>
        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Approval rate</p>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
  icon: Icon,
  trailing,
}) {
  return (
    <div className="group space-y-2">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 transition group-focus-within:text-brand-600 dark:text-slate-400 dark:group-focus-within:text-brand-400"
      >
        {label}
      </label>
      <div className="relative rounded-2xl bg-gradient-to-r from-brand-500/20 via-emerald-400/20 to-teal-400/20 p-[1.5px] transition duration-300 group-focus-within:from-brand-500 group-focus-within:via-emerald-400 group-focus-within:to-teal-400 group-focus-within:shadow-[0_0_24px_rgba(15,157,88,0.25)]">
        <div className="relative flex items-center rounded-[calc(1rem-1px)] bg-white dark:bg-surface-overlay">
          {Icon ? (
            <Icon
              className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400 transition group-focus-within:text-brand-500 dark:text-slate-500 dark:group-focus-within:text-brand-400"
              aria-hidden="true"
            />
          ) : null}
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required
            className={`min-h-[3rem] w-full bg-transparent py-3 text-base font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none sm:py-3.5 sm:text-sm dark:text-white dark:placeholder:text-slate-500 ${
              Icon ? 'pl-11 pr-4' : 'px-4'
            } ${trailing ? 'pr-14 sm:pr-12' : ''}`}
          />
          {trailing}
        </div>
      </div>
    </div>
  );
}

export default function AuthModal() {
  const { isOpen, closeAuthModal, returnTo } = useAuthModal();
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const busy = loading || authLoading;

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal();
    };

    lockScroll();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeAuthModal]);

  const finishAuth = (destination) => {
    closeAuthModal();
    if (destination) navigate(destination);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const validation = validateAuthForm('login', { email, password });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      const profile = await login({ email, password });
      const nextPath = returnTo || '/home';

      if (profile.role !== 'admin' && !profile.profileComplete) {
        finishAuth(`/complete-profile?returnTo=${encodeURIComponent(nextPath)}`);
        return;
      }

      finishAuth(nextPath);
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.open(
      `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent('Hello, I forgot my Pay Qist password and need help resetting it.')}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const goToSignup = () => {
    closeAuthModal();
    navigate('/signup');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overscroll-none touch-manipulation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm sm:backdrop-blur-md"
        onClick={closeAuthModal}
        aria-label="Close dialog"
      />

      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />

      <div className="relative flex h-full max-h-[100dvh] items-center justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] xs:p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="animate-fade-up relative flex min-h-0 w-full max-w-[min(100%,42rem)] max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-[0_32px_80px_rgba(15,157,88,0.18)] dark:border-emerald-500/20 dark:bg-surface-raised/95 dark:shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:rounded-[2rem] md:max-w-[min(100%,56rem)] lg:max-w-5xl lg:rounded-[2.5rem]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400 sm:rounded-t-[2rem] lg:rounded-t-[2.5rem]" />

          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 shadow-sm transition active:scale-95 hover:text-slate-800 sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:hover:scale-105 dark:border-emerald-500/15 dark:bg-surface-overlay/90 dark:text-slate-400 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid min-h-0 min-w-0 flex-1 overflow-hidden md:grid-cols-[1fr_1fr] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Visual panel — tablets and desktop */}
            <div className="relative hidden min-h-0 min-w-0 flex-col justify-between overflow-hidden md:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-600" />
            <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_50%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,0.12),transparent_45%)]" />

            <div className="relative p-5 pb-0 md:p-6 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Member access
              </div>
              <h2 className="mt-3 max-w-xs text-xl font-extrabold leading-[1.12] tracking-tight text-white md:mt-4 md:text-2xl lg:mt-5 lg:text-3xl">
                Everything you need,{' '}
                <span className="text-emerald-100">waiting inside.</span>
              </h2>
            </div>

            <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-visible px-4 py-3 md:px-6 lg:px-10 lg:py-6">
              <LoginPreviewCard />
            </div>

            <div className="relative space-y-2 p-5 pt-0 md:space-y-3 md:p-6 lg:space-y-4 lg:p-10">
              <div className="flex flex-wrap gap-2">
                {trustPills.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-emerald-100" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-start gap-2 text-xs text-brand-50/75">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{CONTACT_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="relative flex min-h-0 min-w-0 flex-col overflow-y-auto overscroll-contain scroll-touch scroll-pb-4 px-4 py-5 pt-12 sm:px-6 sm:py-7 sm:pt-14 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl dark:bg-brand-500/15" />

            {/* Mobile accent strip — hidden on md+ and short viewports */}
            <div className="auth-modal-compact-hide relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-600 p-3 sm:mb-4 sm:p-3.5 md:hidden">
              <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />
              <p className="relative text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 sm:text-xs">
                Member access
              </p>
              <p className="relative mt-1 text-sm font-extrabold leading-snug text-white sm:text-base">
                Unlock checkout, orders &amp; installments
              </p>
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {trustPills.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-[11px]"
                  >
                    <Icon className="h-3 w-3 text-emerald-100" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto min-w-0 w-full max-w-md">
              <div className="mb-4 text-center sm:mb-5 lg:mb-8 lg:text-left">
                <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center sm:mb-4 sm:h-16 sm:w-16 lg:mx-0">
                  <div className="absolute inset-0 animate-pulse-soft rounded-full bg-brand-500/15" />
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-500/20 to-emerald-400/10 blur-sm" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-500/20 bg-white shadow-lg shadow-brand-500/15 ring-4 ring-brand-500/10 sm:h-14 sm:w-14 dark:border-emerald-500/25 dark:bg-white dark:shadow-glow-brand dark:ring-brand-500/15">
                    <Logo to={null} size="md" surface="light" />
                  </div>
                </div>

                <div className="section-badge mx-auto lg:mx-0">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Welcome back
                </div>

                <h2
                  id="auth-modal-title"
                  className="mt-2.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:mt-3 sm:text-2xl lg:mt-4 lg:text-4xl"
                >
                  Sign in to{' '}
                  <span className="gradient-text">Pay Qist</span>
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:mt-2">
                  Use your email and password to unlock checkout, orders, and installment applications.
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
                >
                  {error}
                </div>
              ) : null}

              <div className="trust-glass-panel !rounded-2xl !p-4 sm:!rounded-[1.75rem] sm:!p-5 lg:!p-6">
                <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 lg:space-y-5">
                  <FormField
                    id="auth-email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    icon={Mail}
                  />

                  <FormField
                    id="auth-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    icon={Lock}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition active:bg-slate-100 active:text-brand-600 sm:right-3 sm:h-auto sm:w-auto sm:rounded-lg sm:p-1 sm:hover:bg-slate-100 sm:hover:text-brand-600 dark:active:bg-surface-muted dark:active:text-brand-400 sm:dark:hover:bg-surface-muted sm:dark:hover:text-brand-400"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    }
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="min-h-11 px-1 text-xs font-bold text-brand-600 transition active:text-brand-700 dark:text-brand-400"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative flex min-h-[3rem] w-full touch-manipulation items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.98] sm:py-4 sm:hover:-translate-y-0.5 sm:hover:shadow-xl sm:hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 sm:disabled:hover:translate-y-0 dark:shadow-glow-brand"
                  >
                    <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                    {loading && <Spinner />}
                    <span>{loading ? 'Signing in...' : 'Sign in & continue'}</span>
                    {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
                  </button>
                </form>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-brand-500/15 bg-gradient-to-br from-brand-500/5 via-white to-emerald-500/5 p-4 sm:mt-6 sm:rounded-[1.75rem] sm:p-5 dark:border-emerald-500/15 dark:from-brand-500/10 dark:via-surface-overlay/40 dark:to-emerald-500/5">
                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                  New to Pay Qist?{' '}
                  <button
                    type="button"
                    onClick={goToSignup}
                    className="min-h-11 font-extrabold text-brand-600 underline decoration-brand-500/30 underline-offset-2 transition active:text-brand-700 dark:text-brand-400"
                  >
                    Create a free account
                  </button>
                </p>

                <div className="mt-3 flex min-w-0 flex-col gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
                  <a
                    href={CONTACT_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 transition active:scale-[0.98] sm:w-auto sm:text-[11px] sm:hover:-translate-y-0.5 sm:hover:shadow-md dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    <WhatsAppIcon />
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition active:scale-[0.98] sm:w-auto sm:max-w-full sm:text-[11px] sm:hover:-translate-y-0.5 sm:hover:border-brand-200 sm:hover:text-brand-700 sm:hover:shadow-md dark:border-emerald-500/15 dark:bg-surface-overlay dark:text-slate-300"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    <span className="min-w-0 truncate">{CONTACT_EMAIL.toLowerCase()}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
