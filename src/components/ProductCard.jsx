import { Link } from 'react-router-dom';
import { formatCurrency, getMonthlyInstallment } from '../lib/currency';

export default function ProductCard({ product }) {
  const teaserMonths = 4;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-glow transition hover:-translate-y-1 hover:bg-white/7">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur">
          Featured
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{product.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-300">{product.description}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
          <div className="font-semibold text-white">{formatCurrency(product.price)}</div>
          <div className="text-slate-400">
            or {formatCurrency(getMonthlyInstallment(product.price, teaserMonths))}/month for {teaserMonths} months
          </div>
        </div>

        <Link className="button-primary w-full" to={`/product/${product.id}`}>
          View product
        </Link>
      </div>
    </article>
  );
}