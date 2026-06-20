import { useMemo, useState } from 'react';
import {
  Briefcase,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import ImageUploadSlot from './ImageUploadSlot';
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

function FormField({
  id,
  label,
  hint,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon: Icon,
  colSpan = false,
}) {
  return (
    <div className={colSpan ? 'sm:col-span-2' : ''}>
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
            required
            className={`w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-emerald-500/15 dark:bg-surface-overlay dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-400/50 dark:focus:ring-brand-400/15 ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            }`}
          />
        </div>
        {hint ? <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}

function FormSection({ step, title, description, accent = false, children }) {
  return (
    <section
      className={`rounded-[1.5rem] border p-5 sm:p-6 ${
        accent
          ? 'border-brand-500/20 bg-gradient-to-br from-brand-50/80 via-white to-emerald-50/50 dark:border-emerald-500/15 dark:from-brand-500/10 dark:via-surface-overlay/40 dark:to-emerald-500/5'
          : 'border-slate-200/80 bg-slate-50/50 dark:border-emerald-500/10 dark:bg-surface-overlay/30'
      }`}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-xs font-extrabold text-white shadow-md shadow-brand-500/25 dark:shadow-glow-brand">
          {step}
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function DocumentUploadGroup({ title, hint, children }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">{title}</p>
        {hint ? <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{hint}</p> : null}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

const emptyPerson = {
  fullName: '',
  phone: '',
  cnic: '',
  email: '',
  occupation: '',
  school: '',
  photo: '',
  idFront: '',
  idBack: '',
};

const emptyReferral = {
  fullName: '',
  phone: '',
  photo: '',
  idFront: '',
  idBack: '',
};

const APPLICANT_TEXT_FIELDS = ['fullName', 'phone', 'cnic', 'email', 'occupation', 'school'];
const APPLICANT_IMAGE_FIELDS = ['photo', 'idFront', 'idBack'];
const REFERRAL_TEXT_FIELDS = ['fullName', 'phone'];
const REFERRAL_IMAGE_FIELDS = ['photo', 'idFront', 'idBack'];

function countFilled(person, textFields, imageFields) {
  const textFilled = textFields.filter((field) => String(person[field] || '').trim().length > 0).length;
  const imageFilled = imageFields.filter((field) => Boolean(person[field])).length;
  return textFilled + imageFilled;
}

export default function InstallmentApplicationForm({
  initialApplicant = {},
  onSubmit,
  loading = false,
  error = '',
  showHeader = true,
}) {
  const [uploadError, setUploadError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [applicant, setApplicant] = useState({
    ...emptyPerson,
    ...initialApplicant,
  });
  const [referral, setReferral] = useState({ ...emptyReferral });

  function updateApplicant(field, value) {
    setApplicant((current) => ({ ...current, [field]: value }));
  }

  function updateReferral(field, value) {
    setReferral((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setUploadError('');
    onSubmit({ applicant, referral });
  }

  const totalFields =
    APPLICANT_TEXT_FIELDS.length +
    APPLICANT_IMAGE_FIELDS.length +
    REFERRAL_TEXT_FIELDS.length +
    REFERRAL_IMAGE_FIELDS.length;

  const completion = useMemo(() => {
    const filled =
      countFilled(applicant, APPLICANT_TEXT_FIELDS, APPLICANT_IMAGE_FIELDS) +
      countFilled(referral, REFERRAL_TEXT_FIELDS, REFERRAL_IMAGE_FIELDS);
    return Math.round((filled / totalFields) * 100);
  }, [applicant, referral, totalFields]);

  const displayError = error || uploadError;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {showHeader ? (
        <header className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/15 bg-gradient-to-br from-brand-50 via-white to-emerald-50 px-6 py-7 text-center dark:border-emerald-500/10 dark:from-brand-500/10 dark:via-surface-raised dark:to-emerald-500/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,157,88,0.12),transparent_60%)]" />
          <div className="relative">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-200/80 bg-white shadow-lg shadow-brand-500/10 dark:border-emerald-500/20 dark:bg-surface-overlay dark:shadow-glow-brand">
              <Logo to={null} size="sm" surface="light" />
            </div>
            <div className="section-badge mx-auto mb-3">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Installment application
            </div>
            <p className="text-xl font-extrabold leading-snug text-slate-900 dark:text-white sm:text-2xl">
              جہاں خواب بنیں حقیقت
            </p>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Complete all three steps below to submit your application.
            </p>
          </div>
        </header>
      ) : null}

      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>Application progress</span>
          <span className="text-brand-600 dark:text-brand-400">{completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {displayError ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {displayError}
        </div>
      ) : null}

      <FormSection
        step="1"
        title="Your personal details"
        description="Tell us about yourself — we'll use this to process your installment plan."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="applicant-name"
            label="Full name"
            value={applicant.fullName}
            onChange={(e) => updateApplicant('fullName', e.target.value)}
            placeholder="Your full name"
            icon={User}
          />
          <FormField
            id="applicant-phone"
            label="Phone number"
            type="tel"
            value={applicant.phone}
            onChange={(e) => updateApplicant('phone', e.target.value)}
            placeholder="0337-3338633"
            hint="Format: 0337-3338633"
            icon={Phone}
          />
          <FormField
            id="applicant-cnic"
            label="CNIC number"
            value={applicant.cnic}
            onChange={(e) => updateApplicant('cnic', e.target.value)}
            placeholder="12345-1234567-1"
            hint="Format: 12345-1234567-1"
            icon={CreditCard}
          />
          <FormField
            id="applicant-email"
            label="Email address"
            type="email"
            value={applicant.email}
            onChange={(e) => updateApplicant('email', e.target.value)}
            placeholder="you@gmail.com"
            icon={Mail}
          />
          <FormField
            id="applicant-occupation"
            label="Occupation"
            value={applicant.occupation}
            onChange={(e) => updateApplicant('occupation', e.target.value)}
            placeholder="Teacher, engineer, etc."
            icon={Briefcase}
          />
          <FormField
            id="applicant-school"
            label="Address"
            value={applicant.school}
            onChange={(e) => updateApplicant('school', e.target.value)}
            placeholder="School / workplace / home address"
            icon={MapPin}
          />
        </div>
      </FormSection>

      <FormSection
        step="2"
        title="Your documents"
        description="Upload a clear photo and both sides of your CNIC. Good lighting helps speed up approval."
      >
        <DocumentUploadGroup title="Applicant photos" hint="Tap each box to upload · JPG, PNG, or WebP">
          <ImageUploadSlot
            id="applicant-photo"
            label="Your photo"
            value={applicant.photo}
            onChange={(value) => updateApplicant('photo', value)}
            onError={setUploadError}
          />
          <ImageUploadSlot
            id="applicant-id-front"
            label="CNIC front"
            value={applicant.idFront}
            onChange={(value) => updateApplicant('idFront', value)}
            onError={setUploadError}
          />
          <ImageUploadSlot
            id="applicant-id-back"
            label="CNIC back"
            value={applicant.idBack}
            onChange={(value) => updateApplicant('idBack', value)}
            onError={setUploadError}
          />
        </DocumentUploadGroup>
      </FormSection>

      <FormSection
        step="3"
        title="Referral guarantor"
        description="Provide a trusted contact who can vouch for you — a family member, colleague, or friend."
        accent
      >
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-brand-500/15 bg-brand-500/5 px-4 py-3 dark:border-brand-400/20 dark:bg-brand-500/10">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Your referral should be reachable by phone and willing to confirm your identity if needed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="referral-name"
            label="Referral full name"
            value={referral.fullName}
            onChange={(e) => updateReferral('fullName', e.target.value)}
            placeholder="Referral full name"
            icon={User}
          />
          <FormField
            id="referral-phone"
            label="Referral phone"
            type="tel"
            value={referral.phone}
            onChange={(e) => updateReferral('phone', e.target.value)}
            placeholder="0337-3338633"
            icon={Phone}
          />
        </div>

        <div className="mt-5">
          <DocumentUploadGroup title="Referral documents" hint="Same requirements as above">
            <ImageUploadSlot
              id="referral-photo"
              label="Referral photo"
              value={referral.photo}
              onChange={(value) => updateReferral('photo', value)}
              onError={setUploadError}
            />
            <ImageUploadSlot
              id="referral-id-front"
              label="CNIC front"
              value={referral.idFront}
              onChange={(value) => updateReferral('idFront', value)}
              onError={setUploadError}
            />
            <ImageUploadSlot
              id="referral-id-back"
              label="CNIC back"
              value={referral.idBack}
              onChange={(value) => updateReferral('idBack', value)}
              onError={setUploadError}
            />
          </DocumentUploadGroup>
        </div>
      </FormSection>

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 dark:shadow-glow-brand dark:hover:shadow-glow-brand-lg"
      >
        {loading && <Spinner />}
        {loading ? 'Submitting application...' : 'Submit application'}
      </button>

      <div>
        <button
          type="button"
          onClick={() => setShowHelp((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700 dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-200 dark:hover:border-brand-500/30"
        >
          Need help with your application?
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
    </form>
  );
}
