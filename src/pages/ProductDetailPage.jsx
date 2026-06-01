// Import necessary hooks, router utilities, components, and helpers
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InstallmentBadge from '../components/InstallmentBadge';
import StatusPill from '../components/StatusPill';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getMonthlyInstallment } from '../lib/currency';

export default function ProductDetailPage() {
  // Retrieve the productId from the URL parameters
  const { productId } = useParams();
  const navigate = useNavigate();
  // Extract global products list and the specific cart action
  const { products, addToCart } = useStore();
  
  // Find the specific product being requested based on the URL parameter
  const product = products.find((currentProduct) => currentProduct.id === productId);
  
  // Initialize local state for the selected installment plan
  const [selectedMonths, setSelectedMonths] = useState(product?.allowedInstallmentMonths?.[0] || 3);

  // Calculate the monthly installment price dynamically to optimize performance
  const planPrice = useMemo(() => getMonthlyInstallment(product?.price || 0, selectedMonths), [product?.price, selectedMonths]);

  // Synchronize selected plan if a product loads and restricts allowed months
  useEffect(() => {
    if (product?.allowedInstallmentMonths && !product.allowedInstallmentMonths.includes(selectedMonths)) {
      setSelectedMonths(product.allowedInstallmentMonths[0]);
    }
  }, [product, selectedMonths]);

  // Render a not found page if the product does not exist
  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Product not found</h1>
        <p className="mt-3 text-slate-300">The requested product is no longer available.</p>
        <Link className="button-primary mt-8" to="/">
          Back to home
        </Link>
      </div>
    );
  }

  // Handle adding the product to the cart and redirecting to checkout
  function handleApply() {
    addToCart(product, selectedMonths);
    navigate('/cart');
  }

  // Render the product details, price, and available installment plans
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-glow">
          <div className="relative aspect-[4/3]">
            <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          </div>
        </div>

        <div className="glass rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="info">Installment ready</StatusPill>
            <StatusPill>{product.allowedInstallmentMonths.join(' / ')} months available</StatusPill>
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white">{product.title}</h1>
            <p className="text-base leading-8 text-slate-300">{product.description}</p>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 p-5 sm:grid-cols-2">
            <div>
              <div className="text-sm text-slate-400">Total price</div>
              <div className="mt-2 text-2xl font-semibold text-white">{formatCurrency(product.price)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Selected plan</div>
              <div className="mt-2 text-2xl font-semibold text-white">{formatCurrency(planPrice)}/month</div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Choose a plan</div>
            <div className="flex flex-wrap gap-3">
              {product.allowedInstallmentMonths.map((months) => (
                <button
                  key={months}
                  type="button"
                  className={months === selectedMonths ? 'button-primary' : 'button-secondary'}
                  onClick={() => setSelectedMonths(months)}
                >
                  {months} months
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <InstallmentBadge price={product.price} months={selectedMonths} />
          </div>

          <button className="button-primary mt-8 w-full" type="button" onClick={handleApply}>
            Apply for Installment
          </button>
        </div>
      </div>
    </div>
  );
}