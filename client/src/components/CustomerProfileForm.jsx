import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Logo from './Logo';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from '../lib/contact';

function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'Enter a password', tone: 'neutral' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak — add letters and numbers', tone: 'weak' };
  if (score === 2) return { score: 2, label: 'Fair — almost there', tone: 'fair' };
  if (score === 3) return { score: 3, label: 'Good password', tone: 'good' };
  return { score: 4, label: 'Strong password', tone: 'strong' };
}

const strengthBarClass = {
  neutral: 'bg-slate-200 dark:bg-surface-muted',
  weak: 'bg-rose-400',
  fair: 'bg-amber-400',
  good: 'bg-brand-400',
  strong: 'bg-emerald-500',
};

function FormField({
  id,
  label,
  hint,
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly = false,
  autoComplete,
  icon: Icon,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required
          autoComplete={autoComplete}
          className={`min-h-[3rem] w-full rounded-2xl border border-slate-200 bg-white py-3 text-base font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-emerald-500/15 dark:bg-surface-overlay dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400/50 dark:focus:ring-brand-400/15 sm:text-sm ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${readOnly ? 'cursor-not-allowed bg-slate-50 text-slate-500 dark:bg-surface-muted/50' : ''}`}
        />
      </div>
      {hint ? <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p> : null}
    </div>
  );
}

function FormSection({ step, title, description, children }) {
  return (
    <section className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/50 p-4 dark:border-emerald-500/10 dark:bg-surface-overlay/30 sm:rounded-[1.5rem] sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-xs font-extrabold text-white shadow-md shadow-brand-500/25 dark:shadow-glow-brand">
          {step}
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function CustomerProfileForm({
  title = 'Sign Up',
  subtitle = 'Create your Pay Qist account to shop with easy installments.',
  initialValues = {},
  onSubmit,
  submitLabel = 'Sign Up',
  loading = false,
  error = '',
  showLoginSwitch = false,
  onSwitchToLogin,
  showContactInfo = true,
  compactHeader = false,
}) {
  const [cnic, setCnic] = useState(initialValues.cnic || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const completion = useMemo(() => {
    const fields = [cnic, email, phone, password, confirmPassword];
    const filled = fields.filter((value) => String(value).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [cnic, email, phone, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ cnic, email, phone, password, confirmPassword });
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {!compactHeader ? (
        <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-brand-500/15 bg-gradient-to-br from-brand-50 via-white to-emerald-50 px-6 py-7 text-center dark:border-emerald-500/10 dark:from-brand-500/10 dark:via-surface-raised dark:to-emerald-500/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,157,88,0.12),transparent_60%)]" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand-200/80 bg-white shadow-lg shadow-brand-500/10 ring-4 ring-brand-500/5 dark:border-emerald-500/20 dark:bg-white dark:shadow-glow-brand dark:ring-brand-500/10">
              <Logo to={null} size="lg" surface="light" />
            </div>
            <div className="section-badge mx-auto mb-3">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Quick setup
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mb-5 text-center sm:mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/15 bg-white shadow-md shadow-brand-500/10 dark:border-emerald-500/20 dark:bg-white dark:shadow-glow-brand sm:mb-4 sm:h-16 sm:w-16">
            <Logo to={null} size="md" surface="light" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          ) : null}
        </div>
      )}

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>Profile progress</span>
          <span className="text-brand-600 dark:text-brand-400">{completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSection
          step="1"
          title="Personal details"
          description="We use this to verify your identity and keep your account secure."
        >
          <FormField
            id="profile-cnic"
            label="CNIC number"
            hint="Format: 12345-1234567-1"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            placeholder="12345-1234567-1"
            autoComplete="off"
            icon={CreditCard}
          />
          <FormField
            id="profile-email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            autoComplete="email"
            icon={Mail}
          />
          <FormField
            id="profile-phone"
            label="Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0337-3338633"
            autoComplete="tel"
            icon={Phone}
          />
        </FormSection>

        <FormSection
          step="2"
          title="Secure your account"
          description="Choose a strong password — at least 8 characters with letters and numbers."
        >
          <FormField
            id="profile-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            icon={Lock}
          />

          {password ? (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength.score >= level
                        ? strengthBarClass[passwordStrength.tone]
                        : strengthBarClass.neutral
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-[11px] font-medium ${
                  passwordStrength.tone === 'weak'
                    ? 'text-rose-500'
                    : passwordStrength.tone === 'fair'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                {passwordStrength.label}
              </p>
            </div>
          ) : null}

          <FormField
            id="profile-confirm-password"
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            icon={ShieldCheck}
          />

          {confirmPassword ? (
            <p
              className={`flex items-center gap-1.5 text-[11px] font-medium ${
                passwordsMatch ? 'text-brand-600 dark:text-brand-400' : 'text-rose-500'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="inline-flex min-h-11 items-center px-1 text-xs font-semibold text-brand-600 transition active:text-brand-700 dark:text-brand-400 dark:active:text-brand-300"
          >
            {showPassword ? 'Hide passwords' : 'Show passwords'}
          </button>
        </FormSection>

        <button
          type="submit"
          disabled={loading}
          className="group flex min-h-[3rem] w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition active:scale-[0.98] sm:hover:-translate-y-0.5 sm:hover:bg-brand-600 sm:hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 sm:disabled:hover:translate-y-0 dark:shadow-glow-brand dark:hover:shadow-glow-brand-lg"
        >
          {loading && <Spinner />}
          {loading ? 'Submitting...' : submitLabel}
        </button>
      </form>

      {showLoginSwitch ? (
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex min-h-11 items-center font-bold text-brand-600 transition active:text-brand-700 dark:text-brand-400"
          >
            Sign in
          </button>
        </p>
      ) : null}

      {showContactInfo ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700 dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-200 dark:hover:border-brand-500/30"
          >
            Need help signing up?
            <span className="text-xs text-slate-400">{showHelp ? 'Hide' : 'Show'}</span>
          </button>

          {showHelp ? (
            <div className="mt-3 space-y-2.5 animate-fade-up">
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-emerald-600 transition group-hover:scale-110 dark:text-emerald-400" />
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-md dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-200 dark:hover:border-brand-500/30"
              >
                <Mail className="h-5 w-5 shrink-0 text-red-500 transition group-hover:scale-110" />
                {CONTACT_EMAIL.toLowerCase()}
              </a>
              <div className="flex items-start justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center text-sm font-medium text-slate-600 shadow-sm dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {CONTACT_ADDRESS}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
