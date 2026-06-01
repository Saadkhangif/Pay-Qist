import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDownPayment, getMonthlyInstallment } from '../lib/currency';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateCartMonths, createOrderFromCart, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const downPayment = cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0);

  async function handleCheckout() {
    setProcessing(true);
    setSuccessMessage('');
    try {
      createOrderFromCart(user, paymentMethod);
      setSuccessMessage('Payment approved and installment request submitted.');
      setTimeout(() => navigate('/admin'), 700);
    } finally {
      setProcessing(false);
    }
  }

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white">Your cart is empty</h1>
        <p className="mt-3 text-slate-300">Add a product from the storefront to start an installment application.</p>
        <Link className="button-primary mt-8" to="/">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="glass rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-white">Cart & Checkout</h1>
                <p className="mt-2 text-sm text-slate-300">Review your items, adjust installment months, and complete the mock payment gateway.</p>
              </div>
              <StatusPill tone="success">Secure route</StatusPill>
            </div>
          </div>

          {cart.map((item) => (
            <article key={item.id} className="glass rounded-[32px] p-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <img src={item.imageUrl} alt={item.title} className="h-32 w-full rounded-3xl object-cover sm:w-40" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm text-slate-300">{formatCurrency(item.price)} total</p>
                    </div>
                    <button className="button-secondary px-4 py-2" type="button" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>

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
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      Monthly payment
                      <div className="mt-1 text-lg font-semibold text-white">
                        {formatCurrency(getMonthlyInstallment(item.price, item.installmentMonths))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      Down payment
                      <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(getDownPayment(item.price))}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                      Quantity
                      <div className="mt-1 text-lg font-semibold text-white">{item.quantity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="glass h-fit rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold text-white">Payment summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
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
            <label className="block text-sm font-semibold text-slate-200">Choose payment method</label>
            <select className="input" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>JazzCash</option>
              <option>EasyPaisa</option>
            </select>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              This is a dummy payment gateway integration that simulates a successful authorization.
            </div>

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