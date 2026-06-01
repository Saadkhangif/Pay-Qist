// Import React hooks, routing, and shared context/lib helpers
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function CartPage() {
  // Setup navigation and fetch user context
  const navigate = useNavigate();
  const { user } = useAuth();
  // Destructure required functions and state from the global store
  const { cart = [], removeFromCart, updateCartMonths, createOrderFromCart, clearCart } = useStore();
  
  // Local state for payment methods and UI processing feedback
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate the total cart values dynamically
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const downPayment = useMemo(() => cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0), [cart]);

  // Handle the checkout flow
  async function handleCheckout() {
    setProcessing(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // Attempt to generate an order out of the current cart contents
      await createOrderFromCart(user, paymentMethod);
      setSuccessMessage('Payment approved and installment request submitted.');
      // Wait briefly so the user sees the success message before redirecting
      setTimeout(() => navigate('/admin'), 700);
    } catch (err) {
      setErrorMessage(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  // If the cart is empty, prompt the user to shop instead of showing a checkout form
  if (!cart.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="glass flex h-32 w-32 items-center justify-center rounded-full border border-white/40 bg-white/60 shadow-sm text-earth-dark/20 mb-8">
           <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
           </svg>
         </div>
         <h1 className="text-4xl font-bold tracking-tight text-earth-dark mb-4">Your cart is empty</h1>
         <p className="max-w-md text-lg text-earth-dark/70 mb-10">You haven't added any products to your cart yet. Explore our storefront to find items you can buy on easy installments.</p>
         <Link className="button-primary px-8 py-3 text-lg" to="/">
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
          <h1 className="text-3xl font-bold text-earth-dark">Checkout</h1>
          <p className="mt-1 text-sm text-earth-dark/70">Review your items and complete your purchase.</p>
        </div>
        <div className="self-start sm:self-auto">
          <StatusPill tone="success">Secure Checkout</StatusPill>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Loop over every cart item and display a card for it */}
          {cart.map((item) => (
            <article key={item.id} className="glass bg-white/60 border border-white/40 shadow-sm rounded-3xl p-5 sm:p-6 transition hover:shadow-md">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="shrink-0">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" className="h-40 w-full rounded-2xl object-cover sm:w-40 border border-earth-dark/5" />
                </div>
                
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-earth-dark">{item.title}</h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-earth-dark/70">Qty: {item.quantity}</span>
                        <span className="text-earth-dark/30">•</span>
                        <span className="text-sm font-medium text-earth-dark/70">{formatCurrency(item.price)} each</span>
                      </div>
                    </div>
                    <button 
                      className="rounded-full p-2 text-earth-dark/40 hover:bg-rose-50 hover:text-rose-600 transition" 
                      type="button" 
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>

                  {/* Dynamic buttons to update the installment duration for this specific item */}
                  <div className="mt-4 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-earth-dark/50 mb-2">Installment Plan</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {[3, 6, 12].map((months) => (
                        <button
                          key={months}
                          type="button"
                          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${months === item.installmentMonths ? 'bg-earth-deep text-white shadow-md' : 'bg-white/50 text-earth-dark/70 hover:bg-white hover:text-earth-dark border border-earth-dark/10'}`}
                          onClick={() => updateCartMonths(item.id, months)}
                        >
                          {months} Mo
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/40 p-4 border border-earth-dark/5 sm:grid-cols-3 items-center">
                    <div>
                      <div className="text-xs text-earth-dark/60">Total Item Price</div>
                      <div className="mt-1 font-semibold text-earth-dark">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-earth-dark/60">Down Payment</div>
                      <div className="mt-1 font-semibold text-earth-dark">{formatCurrency(getDownPayment(item.price) * item.quantity)}</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 border-t border-earth-dark/5 pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
                      <div className="text-xs font-semibold text-earth-deep">Monthly Pay</div>
                      <div className="mt-1 text-lg font-bold text-earth-deep">
                        {formatCurrency(getMonthlyInstallment(item.price, item.installmentMonths) * item.quantity)}
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
          <div className="glass bg-white/60 border border-white/40 shadow-sm rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-earth-dark">Order Summary</h2>
            
            <div className="mt-6 space-y-4 text-earth-dark/80">
              <div className="flex items-center justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Processing Fee</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="my-4 border-t border-earth-dark/10"></div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-earth-dark">Total Down Payment</span>
                <span className="text-xl font-black text-earth-deep">{formatCurrency(downPayment)}</span>
              </div>
              <p className="text-xs text-earth-dark/60 text-right">Due today to process order</p>
            </div>
          </div>

          <div className="glass bg-white/60 border border-white/40 shadow-sm rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-earth-dark mb-4">Payment Details</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-earth-dark/80 mb-2">Select Method</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none rounded-2xl border border-earth-dark/20 bg-white/80 px-4 py-3 text-earth-dark focus:border-earth-deep focus:outline-none focus:ring-2 focus:ring-earth-deep/20 transition" 
                    value={paymentMethod} 
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  >
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>JazzCash</option>
                    <option>EasyPaisa</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-earth-dark/50">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    This is a demo environment. No real charges will be made. The mock processor simulates a successful transaction.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-50 p-4 flex items-center gap-3 text-sm text-rose-800">
                  <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {errorMessage}
                </div>
              )}
              
              {successMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 flex items-center gap-3 text-sm text-emerald-800">
                  <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {successMessage}
                </div>
              )}

              <button 
                className="button-primary w-full py-3.5 text-base shadow-lg shadow-earth-deep/20 flex items-center justify-center gap-2" 
                type="button" 
                onClick={handleCheckout} 
                disabled={processing}
              >
                {processing ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(downPayment)}
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}