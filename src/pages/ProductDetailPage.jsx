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
  const { products = [], addToCart } = useStore();
  
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
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/60 shadow-sm border border-earth-dark/10 text-earth-dark/30">
           <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a3 3 0 11-6 0 3 3 0 016 0z" />
           </svg>
        </div>
        <h1 className="text-3xl font-semibold text-earth-dark">Product not found</h1>
        <p className="mt-3 text-earth-dark/80">The requested product is no longer available.</p>
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
        <div className="overflow-hidden rounded-[36px] border border-earth-dark/10 bg-white/40 shadow-sm">
          <div className="relative aspect-[4/3]">
            <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-golden-green via-golden-green/20 to-transparent" />
          </div>
        </div>

        <div className="glass bg-white/60 border border-white/40 shadow-sm rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="info">Installment ready</StatusPill>
            <StatusPill>{product.allowedInstallmentMonths.join(' / ')} months available</StatusPill>
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-earth-dark">{product.title}</h1>
            <p className="text-base leading-8 text-earth-dark/80">{product.description}</p>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-earth-dark/10 bg-white/50 p-5 sm:grid-cols-2">
            <div>
              <div className="text-sm text-earth-dark/70">Total price</div>
              <div className="mt-2 text-2xl font-semibold text-earth-dark">{formatCurrency(product.price)}</div>
            </div>
            <div>
              <div className="text-sm text-earth-dark/70">Selected plan</div>
              <div className="mt-2 text-2xl font-semibold text-earth-dark">{formatCurrency(planPrice)}/month</div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-earth-dark/70">Choose a plan</div>
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