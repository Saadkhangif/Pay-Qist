import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import CustomerProfileForm from '../components/CustomerProfileForm';
import { useAuth } from '../context/AuthContext';
import { validateAuthForm } from '../lib/validation/authSchemas';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, completeProfile, logout, isLoading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get('returnTo') || '/home';

  if (!user) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ openAuth: 'login', returnTo: `/complete-profile?returnTo=${encodeURIComponent(returnTo)}` }}
      />
    );
  }

  if (user.role === 'admin' || user.profileComplete) {
    return <Navigate to={returnTo} replace />;
  }

  const handleSubmit = async (values) => {
    setError('');

    const validation = validateAuthForm('profile', values);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      await completeProfile(values);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-x-clip py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40 dark:opacity-60" />
      <div className="relative mx-auto max-w-lg px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            One step left
          </p>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-surface-overlay dark:hover:text-slate-200"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/95 dark:shadow-dark-card sm:p-8">
          <CustomerProfileForm
            title="Complete Your Profile"
            subtitle="Add your details to unlock cart and checkout."
            initialValues={{
              cnic: user.cnic || '',
              email: user.email || '',
              phone: user.phone || '',
            }}
            onSubmit={handleSubmit}
            submitLabel="Save & continue"
            loading={loading || authLoading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
}
