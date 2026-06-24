import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChevronDown,
  Mail,
  MapPin,
  Percent,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  User,
  Zap,
} from 'lucide-react';
import Logo from './Logo';
import SectionHeading from './SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from '../lib/contact';
import { calculateInstallmentPlan, formatCurrency } from '../lib/currency';

const MONTH_OPTIONS = [3, 6, 9, 12, 18, 24];
const ADVANCE_PRESETS = [20, 30, 40, 50];
const PRICE_STEP = 5000;
const MAX_PRICE = 500000;

const TRUST_BADGES = [
  { icon: BadgeCheck, label: 'No hidden fees' },
  { icon: Zap, label: 'Instant estimate' },
  { icon: TrendingDown, label: 'Flexible terms' },
];

function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SliderField = memo(function SliderField({
  id,
  label,
  hint,
  value,
  onNumberChange,
  onRangeInput,
  onRangeCommit,
  min,
  max,
  step,
  prefix,
  accent = 'brand',
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const trackClass =
    accent === 'emerald'
      ? 'from-emerald-400 to-brand-500'
      : 'from-brand-400 to-brand-600';

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-5 transition-all duration-300 hover:border-brand-200/80 hover:shadow-md hover:shadow-brand-500/5 dark:border-emerald-500/10 dark:from-surface-overlay/80 dark:to-surface-muted/40 dark:hover:border-brand-500/25 dark:hover:shadow-glow-brand">
      <div className="mb-4 flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {label}
        </label>
        {hint ? (
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:text-brand-300">
            {hint}
          </span>
        ) : null}
      </div>

      <div className="relative mb-4">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-500 dark:text-brand-400">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onNumberChange}
          className={`input w-full py-3 text-lg font-bold tabular-nums ${prefix ? 'pl-12' : ''}`}
        />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200 dark:bg-surface-muted">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${trackClass} transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={onRangeInput}
          onChange={onRangeInput}
          onPointerUp={onRangeCommit}
          onKeyUp={onRangeCommit}
          aria-label={label}
          className="range-slider relative z-10 bg-transparent"
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
});

const ResultTile = memo(function ResultTile({ label, value, icon: Icon, highlight = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        highlight
          ? 'border-brand-500/30 bg-gradient-to-br from-brand-500/15 to-emerald-500/10 dark:border-brand-400/25 dark:from-brand-500/15 dark:to-emerald-500/5'
          : 'border-slate-200/80 bg-white/80 dark:border-emerald-500/10 dark:bg-surface-overlay/70'
      }`}
    >
      {highlight ? (
        <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-brand-400/20 blur-xl" />
      ) : null}
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-brand-500 dark:text-brand-400" /> : null}
      </div>
      <p
        className={`relative mt-1.5 font-extrabold tabular-nums tracking-tight ${
          highlight ? 'text-xl text-brand-700 dark:text-brand-300' : 'text-lg text-slate-900 dark:text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
});

const PaymentBreakdownBar = memo(function PaymentBreakdownBar({ advance, productPrice }) {
  const advancePct = productPrice > 0 ? Math.round((advance / productPrice) * 100) : 0;
  const financedPct = 100 - advancePct;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Advance {advancePct}%</span>
        <span>Financed {financedPct}%</span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-200/80 dark:bg-surface-muted">
        <div
          className="rounded-l-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${advancePct}%` }}
        />
        <div
          className="rounded-r-full bg-gradient-to-r from-slate-300 to-slate-400 transition-all duration-500 ease-out dark:from-slate-600 dark:to-slate-500"
          style={{ width: `${financedPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-brand-700 dark:text-brand-300">{formatCurrency(advance)} upfront</span>
        <span className="text-slate-600 dark:text-slate-300">{formatCurrency(productPrice - advance)} later</span>
      </div>
    </div>
  );
});

const CalculatorActions = memo(function CalculatorActions() {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <div className="mt-auto grid gap-3 sm:grid-cols-2">
      {user ? (
        <Link to="/account" className="button-secondary gap-2 py-3.5">
          <User className="h-4 w-4" />
          My Account
        </Link>
      ) : (
        <button type="button" onClick={() => openAuthModal('login')} className="button-secondary gap-2 py-3.5">
          <User className="h-4 w-4" />
          Sign In
        </button>
      )}
      <Link to="/products" className="button-primary gap-2 py-3.5">
        <ShoppingBag className="h-4 w-4" />
        Shop Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
});

export default function EmiCalculator() {
  const [draftPrice, setDraftPrice] = useState(150000);
  const [committedPrice, setCommittedPrice] = useState(150000);
  const [draftAdvance, setDraftAdvance] = useState(45000);
  const [committedAdvance, setCommittedAdvance] = useState(45000);
  const [months, setMonths] = useState(6);
  const [showDetails, setShowDetails] = useState(false);

  const plan = useMemo(
    () => calculateInstallmentPlan(committedPrice, committedAdvance, months),
    [committedPrice, committedAdvance, months],
  );

  const advancePercent = committedPrice > 0 ? Math.round((draftAdvance / committedPrice) * 100) : 0;
  const whatsappMessage = encodeURIComponent(
    `Hi Pay Qist, I calculated ${formatCurrency(plan.installment)}/month for ${months} months on a product priced at ${formatCurrency(committedPrice)}.`,
  );

  function setAdvanceFromPreset(percent) {
    const nextAdvance = Math.round((committedPrice * percent) / 100);
    setDraftAdvance(nextAdvance);
    setCommittedAdvance(nextAdvance);
  }

  function handlePriceNumberChange(event) {
    const price = Math.max(0, Number(event.target.value) || 0);
    setDraftPrice(price);
    setCommittedPrice(price);
    setDraftAdvance((current) => {
      const next = Math.min(current, price);
      setCommittedAdvance(next);
      return next;
    });
  }

  function handleAdvanceNumberChange(event) {
    const next = Math.min(Math.max(0, Number(event.target.value) || 0), committedPrice);
    setDraftAdvance(next);
    setCommittedAdvance(next);
  }

  return (
    <section id="calculator" className="home-section home-section-spotlight relative overflow-hidden py-16 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40 dark:opacity-50" />
      <div className="dark-glow-orb -left-24 top-16 h-72 w-72 bg-brand-400/15 animate-glow-pulse dark:bg-brand-500/20" />
      <div className="dark-glow-orb -right-16 bottom-8 h-80 w-80 bg-emerald-300/15 dark:bg-teal-400/10" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plan Calculator"
          title={
            <>
              See Your <span className="gradient-text">Monthly Payment</span> Instantly
            </>
          }
          description="Slide to adjust price and advance — get a clear installment estimate in seconds. 4.5% per month, fully transparent."
          align="center"
          className="mb-8"
        />

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/15 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-overlay/60 dark:text-slate-200"
            >
              <Icon className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
              {label}
            </span>
          ))}
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-card backdrop-blur-sm dark:border-emerald-500/15 dark:bg-surface-raised/90 dark:shadow-dark-card">
          <div className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-r from-brand-50 via-white to-emerald-50 px-6 py-10 text-center dark:border-emerald-500/10 dark:from-brand-500/10 dark:via-surface-raised dark:to-emerald-500/5 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,157,88,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.1),transparent_55%)]" />
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-200/80 bg-white shadow-lg shadow-brand-500/10 ring-4 ring-brand-500/10 dark:border-emerald-500/20 dark:bg-white dark:shadow-glow-brand dark:ring-brand-500/15">
              <Logo to={null} size="md" surface="light" />
            </div>
            <p className="relative text-2xl font-extrabold leading-snug text-slate-900 dark:text-white sm:text-3xl">
              جہاں خواب بنیں حقیقت
            </p>
            <p className="relative mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Where dreams become reality — plan your purchase today
            </p>
          </div>

          <div className="grid gap-6 p-4 sm:gap-8 sm:p-6 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <Calculator className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Customize your plan</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Drag sliders or type exact amounts</p>
                </div>
              </div>

              <SliderField
                id="calc-product-price"
                label="Product Price"
                prefix="Rs."
                value={draftPrice}
                min={10000}
                max={MAX_PRICE}
                step={PRICE_STEP}
                onNumberChange={handlePriceNumberChange}
                onRangeInput={(event) => {
                  const price = Math.max(0, Number(event.target.value) || 0);
                  setDraftPrice(price);
                }}
                onRangeCommit={() => {
                  setCommittedPrice(draftPrice);
                  setDraftAdvance((current) => {
                    const next = Math.min(current, draftPrice);
                    setCommittedAdvance(next);
                    return next;
                  });
                }}
              />

              <SliderField
                id="calc-advance"
                label="Advance Payment"
                hint={`${advancePercent}% down`}
                prefix="Rs."
                value={draftAdvance}
                min={0}
                max={committedPrice || MAX_PRICE}
                step={1000}
                accent="emerald"
                onNumberChange={handleAdvanceNumberChange}
                onRangeInput={(event) => {
                  setDraftAdvance(Math.min(Math.max(0, Number(event.target.value) || 0), committedPrice));
                }}
                onRangeCommit={() => setCommittedAdvance(draftAdvance)}
              />

              <PaymentBreakdownBar advance={committedAdvance} productPrice={committedPrice} />

              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Quick advance
                </p>
                <div className="flex flex-wrap gap-2">
                  {ADVANCE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAdvanceFromPreset(preset)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                        advancePercent === preset
                          ? 'scale-105 bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                          : 'border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-surface-overlay dark:text-slate-300 dark:hover:border-brand-500/40'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-emerald-500/10 dark:bg-surface-muted/30">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Plan Duration</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                    <Percent className="h-3 w-3" />
                    4.5% / month
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {MONTH_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMonths(option)}
                      className={`rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                        months === option
                          ? 'scale-105 bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                          : 'border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-surface-overlay dark:text-slate-300 dark:hover:border-brand-500/40'
                      }`}
                    >
                      {option}
                      <span className="mt-0.5 block text-[10px] font-semibold opacity-80">mo</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div
                aria-live="polite"
                className="relative overflow-hidden rounded-2xl border border-brand-500/25 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-5 text-white shadow-2xl shadow-brand-900/30 dark:border-emerald-500/25 dark:from-surface-muted dark:via-surface-overlay dark:to-brand-950/80 dark:shadow-glow-brand-lg sm:rounded-3xl sm:p-7"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/25 blur-3xl animate-glow-pulse" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

                <div className="relative flex items-center gap-2 text-brand-300">
                  <Sparkles className="h-4 w-4 animate-pulse-soft" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em]">Your Monthly Installment</p>
                </div>

                <p
                  key={plan.installment}
                  className="relative mt-3 animate-installment-pop bg-gradient-to-r from-white via-brand-100 to-emerald-200 bg-clip-text text-3xl font-black tabular-nums tracking-tight text-transparent xs:text-4xl sm:text-5xl md:text-6xl"
                >
                  {formatCurrency(plan.installment)}
                </p>

                <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                  Pay just this amount every month for{' '}
                  <span className="font-bold text-white">{months} months</span> after your{' '}
                  <span className="font-bold text-brand-300">{formatCurrency(committedAdvance)}</span> advance.
                </p>

                <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
                  {[
                    { label: 'Upfront', value: formatCurrency(committedAdvance) },
                    { label: 'Monthly', value: formatCurrency(plan.installment) },
                    { label: 'Total', value: formatCurrency(plan.totalAmount) },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                      <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ResultTile label="Total Profit" value={formatCurrency(plan.totalProfit)} icon={Percent} />
                <ResultTile label="Grand Total" value={formatCurrency(plan.totalAmount)} icon={Sparkles} highlight />
              </div>

              <button
                type="button"
                onClick={() => setShowDetails((open) => !open)}
                aria-expanded={showDetails}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 text-left text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:shadow-md dark:border-emerald-500/10 dark:from-surface-overlay/70 dark:to-surface-muted/40 dark:text-slate-200 dark:hover:border-brand-500/30"
              >
                View full breakdown
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
              </button>

              {showDetails ? (
                <div className="animate-fade-up space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 text-sm dark:border-emerald-500/10 dark:bg-surface-overlay/50">
                  {[
                    ['Financed amount', formatCurrency(plan.principal)],
                    ['Monthly rate', '4.5%'],
                    ['Plan duration', `${months} months`],
                    ['You pay upfront', formatCurrency(committedAdvance)],
                    ['Then monthly', formatCurrency(plan.installment)],
                  ].map(([label, val], i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between gap-4 ${i === arr.length - 1 ? '' : ''} ${i >= 3 ? 'pt-1' : ''}`}
                    >
                      <span className="text-slate-500 dark:text-slate-400">{label}</span>
                      <span
                        className={`font-bold tabular-nums ${
                          i === arr.length - 1 ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200/80 pt-3 dark:border-emerald-500/10" />
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Total amount payable</span>
                    <span className="font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                      {formatCurrency(plan.totalAmount)}
                    </span>
                  </div>
                </div>
              ) : null}

              <CalculatorActions />
            </div>
          </div>

          <div className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white px-6 py-7 dark:border-emerald-500/10 dark:from-surface-muted/40 dark:to-surface-raised/80 sm:px-10">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Questions? We&apos;re here to help
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-md dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-200 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-red-500 transition group-hover:scale-110" />
                {CONTACT_EMAIL.toLowerCase()}
              </a>
              <a
                href={`${CONTACT_WHATSAPP_URL}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-500/40"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-emerald-600 transition group-hover:scale-110 dark:text-emerald-400" />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div className="mt-3 flex items-start justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-center text-sm font-medium text-slate-600 shadow-sm dark:border-emerald-500/10 dark:bg-surface-overlay dark:text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {CONTACT_ADDRESS}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
