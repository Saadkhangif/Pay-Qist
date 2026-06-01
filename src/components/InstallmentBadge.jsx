import { formatCurrency, getMonthlyInstallment } from '../lib/currency';

export default function InstallmentBadge({ price, months }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
      {formatCurrency(price)} or {formatCurrency(getMonthlyInstallment(price, months))}/month for {months} months
    </span>
  );
}