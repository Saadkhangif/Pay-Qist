import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

export default function ApplicationSuccessBanner({ onDismiss }) {
  return (
    <div
      className="animate-fade-up mb-8 rounded-2xl border border-brand-500/20 bg-brand-50 p-4 shadow-sm dark:border-brand-500/30 dark:bg-brand-500/10 sm:p-5"
      role="status"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-300" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-brand-900 dark:text-brand-100">Application submitted successfully</p>
          <p className="mt-1 text-sm text-brand-800/80 dark:text-brand-200/80">
            Your installment application is under review. Track your orders and application status in your account.
          </p>
          <Link
            to="/account?tab=applications"
            className="mt-3 inline-flex text-sm font-semibold text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
          >
            View my applications →
          </Link>
        </div>
        {onDismiss ? (
          <button
            type="button"
            className="rounded-lg p-1 text-brand-700/70 transition hover:bg-brand-500/10 hover:text-brand-800 dark:text-brand-300/70 dark:hover:text-brand-100"
            aria-label="Dismiss success message"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
