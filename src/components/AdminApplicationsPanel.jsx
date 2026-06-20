import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ClipboardList, Search } from 'lucide-react';
import StatusPill from './StatusPill';
import { apiFetch } from '../lib/api';
import { formatCurrency } from '../lib/currency';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ImagePreview({ label, src }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      {src ? (
        <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <img src={src} alt={label} className="aspect-square w-full object-cover transition hover:scale-105" />
        </a>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
          No image
        </div>
      )}
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{value || '—'}</p>
    </div>
  );
}

function PersonReview({ title, person, extraFields = [] }) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/40">
      <h4 className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">{title}</h4>

      <div className="grid grid-cols-3 gap-3">
        <ImagePreview label="Picture" src={person.photo} />
        <ImagePreview label="ID Front" src={person.idFront} />
        <ImagePreview label="ID Back" src={person.idBack} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DetailField label="Full name" value={person.fullName} />
        <DetailField label="Phone" value={person.phone} />
        {extraFields.map(([label, value]) => (
          <DetailField key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function ApplicationCard({ summary }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);

    if (next && !detail && !loading) {
      setLoading(true);
      setError('');
      try {
        const payload = await apiFetch(`/api/applications/${summary.id}`);
        setDetail(payload);
      } catch (err) {
        setError(err.message || 'Unable to load application details.');
        setExpanded(false);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <article className="admin-panel overflow-hidden">
      <button
        type="button"
        onClick={toggleExpanded}
        className="flex w-full items-start justify-between gap-4 p-6 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
      >
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{summary.applicantName}</h3>
            <StatusPill variant="light" tone="info">
              {summary.status}
            </StatusPill>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {summary.applicantEmail} · {summary.applicantPhone}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Referral: <span className="font-semibold">{summary.referralName}</span> · {summary.referralPhone}
          </p>
          <p className="text-xs text-slate-400">
            Submitted {formatDate(summary.createdAt)} · {summary.orderCount} linked order
            {summary.orderCount === 1 ? '' : 's'}
          </p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded ? (
        <div className="border-t border-slate-100 p-6 dark:border-slate-800">
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading application details...</p>
          ) : null}
          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          ) : null}
          {detail ? (
            <div className="space-y-6">
              <PersonReview
                title="Applicant"
                person={detail.applicant}
                extraFields={[
                  ['CNIC', detail.applicant.cnic],
                  ['Email', detail.applicant.email],
                  ['Occupation', detail.applicant.occupation],
                  ['School', detail.applicant.school],
                ]}
              />

              <PersonReview title="Referral" person={detail.referral} />

              {detail.relatedOrders?.length ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Linked orders
                  </h4>
                  <div className="grid gap-3">
                    {detail.relatedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">{order.productTitle}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {order.installmentMonths} months · {formatCurrency(order.monthlyPayment)}/mo · Down{' '}
                            {formatCurrency(order.downPayment)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
        <ClipboardList className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applications yet</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Customer installment applications will appear here after they apply from the cart.
      </p>
    </div>
  );
}

export default function AdminApplicationsPanel() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError('');
      try {
        const payload = await apiFetch('/api/applications');
        if (!cancelled) setApplications(Array.isArray(payload) ? payload : []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load applications.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadApplications();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;

    return applications.filter(
      (entry) =>
        entry.applicantName?.toLowerCase().includes(query) ||
        entry.applicantEmail?.toLowerCase().includes(query) ||
        entry.applicantPhone?.includes(query) ||
        entry.referralName?.toLowerCase().includes(query) ||
        entry.referralPhone?.includes(query) ||
        entry.userName?.toLowerCase().includes(query),
    );
  }, [applications, search]);

  return (
    <div className="space-y-4">
      <div className="admin-panel p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by applicant, referral, email, or phone..."
            className="input w-full pl-11"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-panel p-8 text-center text-sm text-slate-500 dark:text-slate-400">Loading applications...</div>
      ) : filteredApplications.length ? (
        filteredApplications.map((summary) => <ApplicationCard key={summary.id} summary={summary} />)
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
