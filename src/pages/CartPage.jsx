// Import React hooks, routing, and shared context/lib helpers
import { useState } from 'react';
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
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const downPayment = cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0);

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
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Your cart is empty</h1>
        <p className="mt-3 text-earth-cream">Add a product from the storefront to start an installment application.</p>
        <Link className="button-primary mt-8" to="/">
          Shop products
        </Link>
      </div>
    );
  }

  // Render the cart items and the checkout sidebar
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="glass rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-white">Cart & Checkout</h1>
                <p className="mt-2 text-sm text-earth-cream">Review your items, adjust installment months, and complete the mock payment gateway.</p>
              </div>
              <StatusPill tone="success">Secure route</StatusPill>
            </div>
          </div>

          {/* Loop over every cart item and display a card for it */}
          {cart.map((item) => (
            <article key={item.id} className="glass rounded-[32px] p-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <img src={item.imageUrl} alt={item.title} className="h-32 w-full rounded-3xl object-cover sm:w-40" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm text-earth-cream">{formatCurrency(item.price)} total</p>
                    </div>
                    <button className="button-secondary px-4 py-2" type="button" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>

                  {/* Dynamic buttons to update the installment duration for this specific item */}
                  <div className="flex flex-wrap items-center gap-3">
                    {[3, 6, 12].map((months) => (
                      <button
                        key={months}
                        type="button"
                        className={months === item.installmentMonths ? 'button-primary px-4 py-2' : 'button-secondary px-4 py-2'}
                        onClick={() => updateCartMonths(item.id, months)}
                      >
                        {months} months
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-earth-dark/70 p-4 text-sm text-earth-cream">
                      Monthly payment
                      <div className="mt-1 text-lg font-semibold text-white">
                        {formatCurrency(getMonthlyInstallment(item.price, item.installmentMonths))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-earth-dark/70 p-4 text-sm text-earth-cream">
                      Down payment
                      <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(getDownPayment(item.price))}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-earth-dark/70 p-4 text-sm text-earth-cream">
                      Quantity
                      <div className="mt-1 text-lg font-semibold text-white">{item.quantity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Checkout & Summary Sidebar */}
        <aside className="glass h-fit rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold text-white">Payment summary</h2>
          <div className="mt-6 space-y-4 text-sm text-earth-cream">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Down payment due</span>
              <span className="font-semibold text-white">{formatCurrency(downPayment)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gateway</span>
              <span className="font-semibold text-white">Mock processor</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-earth-cream">Choose payment method</label>
            <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>JazzCash</option>
              <option>EasyPaisa</option>
            </select>

            <div className="rounded-3xl border border-white/10 bg-earth-dark/70 p-4 text-sm text-earth-cream">
              This is a dummy payment gateway integration that simulates a successful authorization.
            </div>

            {errorMessage ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</div> : null}
            {successMessage ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{successMessage}</div> : null}

            <button className="button-primary w-full" type="button" onClick={handleCheckout} disabled={processing}>
              {processing ? 'Processing payment...' : 'Pay down payment and submit'}
            </button>

            <button className="button-secondary w-full" type="button" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}