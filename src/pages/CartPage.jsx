// Import React hooks, routing, and shared context/lib helpers
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart = [], removeFromCart, updateCartMonths, clearCart } = useStore();

  // Calculate the total cart values dynamically
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const downPayment = useMemo(() => cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0), [cart]);

  // If the cart is empty, prompt the user to shop instead of showing a checkout form
  if (!cart.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-300 dark:border-slate-700 dark:bg-slate-900 mb-8">
           <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
           </svg>
         </div>
         <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Your cart is empty</h1>
         <p className="max-w-md text-lg text-slate-500 dark:text-slate-400 mb-10">You haven't added any products to your cart yet. Explore our storefront to find items you can buy on easy installments.</p>
         <Link className="button-primary px-8 py-3 text-lg" to="/products">
           Explore Products
         </Link>
      </div>
    );
  }

  // Render the cart items and the checkout sidebar
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review your items and complete your purchase.</p>
        </div>
        <div className="self-start sm:self-auto">
          <StatusPill tone="success">Secure Checkout</StatusPill>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Loop over every cart item and display a card for it */}
          {cart.map((item) => (
            <article key={item.id} className="surface-card p-5 transition hover:shadow-card-hover sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="product-image-well-sm h-40 w-full shrink-0 sm:w-40">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="product-image h-full w-full"
                  />
                </div>
                
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">Qty: {item.quantity}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-medium text-slate-600">{formatCurrency(item.price)} each</span>
                      </div>
                    </div>
                    <button 
                      className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition" 
                      type="button" 
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>

                  {/* Dynamic buttons to update the installment duration for this specific item */}
                  <div className="mt-4 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Installment Plan</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {[3, 6, 12].map((months) => (
                        <button
                          key={months}
                          type="button"
                          className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${(item.installmentMonths || 12) === months ? 'border border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                          onClick={() => updateCartMonths(item.id, months)}
                        >
                          {months} Mo
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:grid-cols-3 items-center">
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Total Item Price</div>
                      <div className="mt-1 font-bold text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Down Payment</div>
                      <div className="mt-1 font-bold text-slate-900 dark:text-white">{formatCurrency(getDownPayment(item.price) * item.quantity)}</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 border-t border-slate-200 pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-brand-500">Monthly Pay</div>
                      <div className="mt-1 text-lg font-black text-brand-500">
                        {formatCurrency(getMonthlyInstallment(item.price, item.installmentMonths || 12) * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          
          <div className="flex justify-end pt-2">
            <button 
              className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition" 
              type="button" 
              onClick={clearCart}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              Clear entire cart
            </button>
          </div>
        </div>

        {/* Checkout & Summary Sidebar */}
        <aside className="sticky top-24 h-fit space-y-6">
          <div className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Summary</h2>
            
            <div className="mt-6 space-y-4 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Processing Fee</span>
                <span className="font-bold text-slate-900">Free</span>
              </div>
              <div className="my-4 border-t border-slate-100"></div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total Down Payment</span>
                <span className="text-xl font-black text-brand-500">{formatCurrency(downPayment)}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium text-right">Due today to process order</p>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Next step</h3>

            <div className="space-y-5">
              <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 dark:border-brand-400/20 dark:bg-brand-500/10">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Continue to the installment application form. You&apos;ll upload your ID photos, fill in your
                  details, and add a referral before your application is submitted.
                </p>
              </div>

              <button
                className="button-primary w-full py-3.5 text-base"
                type="button"
                onClick={() => navigate('/apply')}
              >
                Apply for Installment
              </button>

              <Link
                to="/account"
                className="block text-center text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
              >
                View my orders & applications
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}