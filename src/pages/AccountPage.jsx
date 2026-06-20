import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardList, Package, ShoppingBag } from 'lucide-react';
import ApplicationSuccessBanner from '../components/ApplicationSuccessBanner';
import SectionHeading from '../components/SectionHeading';
import StatusPill from '../components/StatusPill';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../lib/api';
import { formatCurrency } from '../lib/currency';

const TABS = [
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statusTone(status) {
  if (status === 'approved' || status === 'completed' || status === 'submitted') return 'success';
  if (status === 'pending') return 'warning';
  return 'info';
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders = [], payments = [] } = useStore();
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState('');

  const tabParam = searchParams.get('tab');
  const activeTab = TABS.some((item) => item.id === tabParam) ? tabParam : 'orders';
  const showSuccessBanner = searchParams.get('submitted') === '1';

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  );

  const paymentsByOrderId = useMemo(() => {
    const map = new Map();
    payments.forEach((payment) => {
      map.set(payment.orderId, payment);
    });
    return map;
  }, [payments]);

  useEffect(() => {
    let cancelled = false;

    setLoadingApplications(true);
    apiFetch('/api/applications/mine')
      .then((payload) => {
        if (!cancelled) {
          setApplications(Array.isArray(payload) ? payload : []);
          setApplicationsError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setApplications([]);
          setApplicationsError(err.message || 'Unable to load your applications.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingApplications(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orders.length]);

  function switchTab(nextTab) {
    const next = new URLSearchParams(searchParams);
    next.set('tab', nextTab);
    next.delete('submitted');
    setSearchParams(next, { replace: true });
  }

  function dismissSuccessBanner() {
    const next = new URLSearchParams(searchParams);
    next.delete('submitted');
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Your account"
        title="Orders & applications"
        description="Track installment orders, down payments, and application status in one place."
      />

      {showSuccessBanner ? <ApplicationSuccessBanner onDismiss={dismissSuccessBanner} /> : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => switchTab(id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-brand-500/30 bg-brand-500/10 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-500/20 hover:text-brand-600 dark:border-slate-700 dark:bg-surface-raised dark:text-slate-300 dark:hover:text-brand-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {id === 'orders' && sortedOrders.length ? (
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">
                  {sortedOrders.length}
                </span>
              ) : null}
              {id === 'applications' && applications.length ? (
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">
                  {applications.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeTab === 'orders' ? (
        <div className="mt-8 space-y-4">
          {sortedOrders.length ? (
            sortedOrders.map((order) => {
              const payment = paymentsByOrderId.get(order.id);

              return (
                <article key={order.id} className="surface-card p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="product-image-well-sm h-32 w-full shrink-0 sm:w-36">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt={order.productTitle}
                          loading="lazy"
                          decoding="async"
                          className="product-image h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-500">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{order.productTitle}</h2>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Placed {formatDate(order.createdAt)} · Qty {order.quantity}
                          </p>
                        </div>
                        <StatusPill tone={statusTone(order.paymentStatus)} variant="light">
                          {order.paymentStatus}
                        </StatusPill>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-surface-overlay/60">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Down payment</p>
                          <p className="mt-1 font-bold text-slate-900 dark:text-white">
                            {formatCurrency(order.downPayment)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-surface-overlay/60">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly</p>
                          <p className="mt-1 font-bold text-brand-600 dark:text-brand-300">
                            {formatCurrency(order.monthlyPayment)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-surface-overlay/60">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</p>
                          <p className="mt-1 font-bold text-slate-900 dark:text-white">
                            {order.installmentMonths} months
                          </p>
                        </div>
                      </div>

                      {payment ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Down payment paid via {payment.paymentMethod} · {formatCurrency(payment.amount)}
                        </p>
                      ) : null}

                      {order.applicationId ? (
                        <button
                          type="button"
                          className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
                          onClick={() => switchTab('applications')}
                        >
                          View linked application →
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No orders yet</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Browse products, add them to your cart, and submit an installment application to create your first order.
              </p>
              <Link to="/products" className="button-primary mt-6 inline-flex px-6 py-3">
                Browse products
              </Link>
            </div>
          )}
        </div>
      ) : null}

      {activeTab === 'applications' ? (
        <div className="mt-8 space-y-4">
          {loadingApplications ? (
            <div className="surface-card p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading your applications...
            </div>
          ) : applicationsError ? (
            <div className="surface-card p-8 text-center text-sm text-rose-600 dark:text-rose-300">
              {applicationsError}
            </div>
          ) : applications.length ? (
            applications.map((application) => (
              <article key={application.id} className="surface-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{application.applicantName}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Submitted {formatDate(application.createdAt)} · {application.orderCount} linked order
                      {application.orderCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <StatusPill tone={statusTone(application.status)} variant="light">
                    {application.status}
                  </StatusPill>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  Application ID: <span className="font-mono text-xs">{application.id}</span>
                </p>
              </article>
            ))
          ) : (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <ClipboardList className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No applications yet</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Add products to your cart and complete the installment application form to get started.
              </p>
              <button
                type="button"
                className="button-primary mt-6 inline-flex px-6 py-3"
                onClick={() => navigate('/cart')}
              >
                Go to cart
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
