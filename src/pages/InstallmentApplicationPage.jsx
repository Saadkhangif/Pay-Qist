import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Shield, Sparkles, Wallet } from 'lucide-react';
import InstallmentApplicationForm from '../components/InstallmentApplicationForm';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { validateApplicationForm } from '../lib/validation/applicationSchemas';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

const paymentMethods = [
  { id: 'Credit Card', icon: CreditCard },
  { id: 'Debit Card', icon: Wallet },
  { id: 'JazzCash', icon: Wallet },
  { id: 'EasyPaisa', icon: Wallet },
];

const steps = [
  { label: 'Your details', description: 'Personal info' },
  { label: 'Documents', description: 'CNIC & photo' },
  { label: 'Referral', description: 'Guarantor info' },
];

export default function InstallmentApplicationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart = [], submitInstallmentApplication } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const downPayment = useMemo(
    () => cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0),
    [cart],
  );

  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }

  async function handleSubmit({ applicant, referral }) {
    setError('');

    const validation = validateApplicationForm({ applicant, referral });
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      await submitInstallmentApplication({
        applicant: validation.data.applicant,
        referral: validation.data.referral,
        paymentMethod,
      });
      navigate('/account?tab=applications&submitted=1', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-x-clip py-10 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50 dark:opacity-70" />
      <div className="dark-glow-orb -left-24 top-16 h-72 w-72 bg-brand-400/20 animate-glow-pulse dark:bg-brand-500/20" />
      <div className="dark-glow-orb -right-20 bottom-10 h-80 w-80 bg-emerald-300/15 dark:bg-teal-400/10" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to cart
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="section-badge mb-3">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Installment checkout
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Apply for{' '}
                <span className="gradient-text">easy installments</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                Complete the three steps below to submit your application. Most approvals come through
                within 24 hours.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-brand-500/15 bg-brand-500/5 px-4 py-2.5 dark:border-brand-400/20 dark:bg-brand-500/10">
              <Shield className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                Secure & encrypted
              </span>
            </div>
          </div>

          <ol className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {steps.map(({ label, description }, index) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm dark:border-emerald-500/10 dark:bg-surface-raised/70 dark:text-slate-300"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-extrabold text-white">
                  {index + 1}
                </span>
                <span>
                  {label}
                  <span className="hidden font-normal text-slate-400 sm:inline"> · {description}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem] xl:gap-10">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/95 dark:shadow-dark-card sm:p-8">
            <InstallmentApplicationForm
              initialApplicant={{
                fullName: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                cnic: user?.cnic || '',
              }}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              showHeader={false}
            />
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/95 dark:shadow-dark-card sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Order summary
                </h2>

                <ul className="mt-4 space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-emerald-500/10 dark:bg-surface-overlay/50"
                    >
                      <div className="product-image-well-sm h-14 w-14 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="product-image h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Qty {item.quantity} · {item.installmentMonths || 12} months ·{' '}
                          {formatCurrency(getMonthlyInstallment(item.price, item.installmentMonths))}/mo
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-brand-600 dark:text-brand-400">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-2 border-t border-slate-200/80 pt-4 text-sm dark:border-emerald-500/10">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">Down payment due</dt>
                    <dd className="text-lg font-black text-brand-600 dark:text-brand-400">
                      {formatCurrency(downPayment)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/95 dark:shadow-dark-card sm:p-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Payment method
                </h2>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  How you'll pay the down payment
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {paymentMethods.map(({ id, icon: Icon }) => {
                    const selected = paymentMethod === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                          selected
                            ? 'border-brand-500 bg-brand-500/10 text-brand-700 shadow-sm dark:border-brand-400/40 dark:bg-brand-500/15 dark:text-brand-300'
                            : 'border-slate-200/80 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700 dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-300 dark:hover:border-brand-500/30'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {id}
                        {selected ? <Check className="ml-auto h-3.5 w-3.5" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-brand-500/15 bg-brand-500/5 px-4 py-3 dark:border-brand-400/20 dark:bg-brand-500/10">
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-brand-700 dark:text-brand-300">Tip:</span> Have your CNIC
                  and referral's details ready before you start — it makes the form much faster to complete.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
