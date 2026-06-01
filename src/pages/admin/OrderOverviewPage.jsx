import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { SectionTitle } from '../../components/SectionTitle';
import { formatCurrency } from '../../utils/price';

export function OrderOverviewPage() {
  const { orders } = useStore();

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Applications"
        title="All installment applications"
        description="Submitted orders appear here with plan details and payment status."
      />

      <div className="space-y-4">
        {sortedOrders.length ? (
          sortedOrders.map((order) => (
            <article key={order.id} className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-glow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={order.productImage} alt={order.productTitle} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{order.productTitle}</h3>
                    <StatusPill>{order.paymentStatus}</StatusPill>
                    <StatusPill tone="cyan">{order.applicationStatus}</StatusPill>
                  </div>
                  <p className="text-sm text-slate-400">Applicant: {order.customerName} ({order.customerEmail})</p>
                  <p className="text-sm text-slate-300">Plan: {order.months} months | Monthly: {formatCurrency(order.monthlyPayment)}</p>
                  <p className="text-sm text-slate-400">Payment reference: {order.paymentReference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(order.totalPrice)}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
            No orders have been submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ children, tone = 'slate' }) {
  const styles =
    tone === 'cyan'
      ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200'
      : 'border-white/10 bg-white/5 text-slate-300';

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>{children}</span>;
}