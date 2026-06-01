import { useMemo, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/currency';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  allowedInstallmentMonths: '3,6,12',
  featured: true,
};

const roleOptions = [
  { label: 'Customer', value: 'customer' },
  { label: 'Support', value: 'support' },
  { label: 'Admin', value: 'admin' },
];

export default function AdminPage() {
  const { user, users, updateUserRole, removeUserRole } = useAuth();
  const { products, orders, payments, addProduct, updateProduct, removeProduct, stats, uploadProductImage, storeMode } = useStore();
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [savingUserId, setSavingUserId] = useState('');

  const sortedOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders]);
  const sortedPayments = useMemo(() => [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [payments]);

  const quickLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Add Products' },
    { id: 'users', label: 'User Roles' },
    { id: 'orders', label: 'Order Overview' },
    { id: 'payments', label: 'Payment History' },
  ];

  function resetForm() {
    setForm(emptyForm);
    setEditingId('');
    setImageFile(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        allowedInstallmentMonths: form.allowedInstallmentMonths
          .split(',')
          .map((value) => Number(value.trim()))
          .filter(Boolean),
        featured: form.featured,
      };

      if (imageFile) {
        payload.imageUrl = await uploadProductImage(imageFile, editingId || form.title || 'product');
      }

      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated successfully.');
      } else {
        await addProduct(payload);
        setMessage('Product added successfully.');
      }

      resetForm();
    } catch (error) {
      setMessage(error.message || 'Unable to save product right now.');
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      allowedInstallmentMonths: product.allowedInstallmentMonths.join(','),
      featured: product.featured,
    });
    setImageFile(null);
    setTab('products');
  }

  async function handleRoleChange(userId, role) {
    setSavingUserId(userId);
    setMessage('');

    try {
      if (role === 'customer') {
        await removeUserRole(userId);
      } else {
        await updateUserRole(userId, role);
      }
      setMessage('User role updated successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to update role right now.');
    } finally {
      setSavingUserId('');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="glass h-fit rounded-[32px] p-4">
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                className={tab === link.id ? 'button-primary w-full justify-start' : 'button-secondary w-full justify-start'}
                type="button"
                onClick={() => setTab(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-8">
          <div className="glass rounded-[32px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionHeading
                eyebrow="Admin portal"
                title="Merchant control center"
                description="Add products, manage user roles, review installment applications, and inspect payment records in one place."
              />
              <StatusPill tone="warning">Signed in as {user?.role || 'admin'}</StatusPill>
            </div>
          </div>

          {message ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="glass rounded-[28px] p-6">
              <div className="text-sm text-slate-400">Products</div>
              <div className="mt-2 text-3xl font-semibold text-white">{stats.totalProducts}</div>
            </div>
            <div className="glass rounded-[28px] p-6">
              <div className="text-sm text-slate-400">Users</div>
              <div className="mt-2 text-3xl font-semibold text-white">{users.length}</div>
            </div>
            <div className="glass rounded-[28px] p-6">
              <div className="text-sm text-slate-400">Orders</div>
              <div className="mt-2 text-3xl font-semibold text-white">{stats.totalOrders}</div>
            </div>
            <div className="glass rounded-[28px] p-6">
              <div className="text-sm text-slate-400">Payments</div>
              <div className="mt-2 text-3xl font-semibold text-white">{stats.totalPayments}</div>
            </div>
          </div>

          {tab === 'overview' ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <article className="glass rounded-[32px] p-6">
                <SectionHeading eyebrow="Overview" title="What you can manage here" description="A single admin workspace for the whole platform." />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {quickLinks.slice(1).map((link) => (
                    <button key={link.id} type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-white transition hover:bg-white/10" onClick={() => setTab(link.id)}>
                      {link.label}
                    </button>
                  ))}
                </div>
              </article>

              <article className="glass rounded-[32px] p-6">
                <SectionHeading eyebrow="Recent activity" title="Latest records" description="Quick access to the most recent product, order, and payment entries." />
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Latest product</p>
                    <p className="mt-2 font-semibold text-white">{products[0]?.title || 'No products yet'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Latest order</p>
                    <p className="mt-2 font-semibold text-white">{sortedOrders[0]?.productTitle || 'No orders yet'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Latest payment</p>
                    <p className="mt-2 font-semibold text-white">{sortedPayments[0]?.orderTitle || 'No payments yet'}</p>
                  </div>
                </div>
              </article>
            </div>
          ) : tab === 'products' ? (
            <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
              <form className="glass space-y-4 rounded-[32px] p-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-white">{editingId ? 'Edit product' : 'Add product'}</h2>
                <p className="text-sm text-slate-400">
                  {storeMode === 'firebase'
                    ? 'Upload an image file to Firebase Storage or paste a hosted URL.'
                    : 'Demo mode uses local preview URLs and object URLs for file uploads.'}
                </p>
                <input className="input" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                <textarea className="input min-h-32" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                <input className="input" type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
                <input className="input" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                <input className="input" placeholder="Allowed installment months e.g. 3,6,12" value={form.allowedInstallmentMonths} onChange={(event) => setForm({ ...form, allowedInstallmentMonths: event.target.value })} />

                <label className="flex items-center gap-3 text-sm text-slate-200">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                  Featured on home page
                </label>

                <div className="flex gap-3">
                  <button className="button-primary flex-1" type="submit" disabled={busy}>
                    {busy ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
                  </button>
                  {editingId ? (
                    <button className="button-secondary" type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-4">
                {products.map((product) => (
                  <article key={product.id} className="glass overflow-hidden rounded-[32px] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <img src={product.imageUrl} alt={product.title} className="h-28 w-full rounded-3xl object-cover sm:w-36" />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                            <p className="mt-1 text-sm text-slate-300">{formatCurrency(product.price)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="button-secondary px-4 py-2" type="button" onClick={() => beginEdit(product)}>
                              Edit
                            </button>
                            <button className="button-secondary px-4 py-2" type="button" onClick={() => removeProduct(product.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-300">{product.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {product.allowedInstallmentMonths.map((months) => (
                            <StatusPill key={months}>{months} months</StatusPill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : tab === 'users' ? (
            <div className="space-y-4">
              {users.map((account) => (
                <article key={account.id} className="glass rounded-[32px] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">{account.name}</h3>
                        <StatusPill tone={account.role === 'admin' ? 'success' : account.role === 'support' ? 'info' : 'slate'}>
                          {account.role}
                        </StatusPill>
                        {account.id === user?.id ? <StatusPill tone="warning">Current account</StatusPill> : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{account.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Provider: {account.provider || 'local'}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        className="input min-w-44"
                        value={account.role}
                        disabled={account.id === user?.id || savingUserId === account.id}
                        onChange={(event) => handleRoleChange(account.id, event.target.value)}
                      >
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="button-secondary"
                        type="button"
                        disabled={account.id === user?.id || savingUserId === account.id}
                        onClick={() => handleRoleChange(account.id, 'customer')}
                      >
                        Remove role
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : tab === 'orders' ? (
            <div className="space-y-4">
              {sortedOrders.length ? (
                sortedOrders.map((order) => (
                  <article key={order.id} className="glass rounded-[32px] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <img src={order.productImage} alt={order.productTitle} className="h-28 w-full rounded-3xl object-cover sm:w-36" />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{order.productTitle}</h3>
                            <p className="mt-1 text-sm text-slate-300">
                              {order.userName} · {order.userEmail}
                            </p>
                          </div>
                          <StatusPill tone="success">{order.paymentStatus}</StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Plan
                            <div className="mt-1 text-lg font-semibold text-white">{order.installmentMonths} months</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Monthly
                            <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(order.monthlyPayment)}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Down payment
                            <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(order.downPayment)}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Payment method
                            <div className="mt-1 text-lg font-semibold text-white">{order.paymentMethod}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="glass rounded-[32px] p-8 text-center text-slate-300">No installment applications yet.</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPayments.length ? (
                sortedPayments.map((payment) => (
                  <article key={payment.id} className="glass rounded-[32px] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="grid h-28 w-full place-items-center rounded-3xl bg-cyan-400/10 text-sm font-semibold text-cyan-200 sm:w-36">
                        Payment
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{payment.orderTitle}</h3>
                            <p className="mt-1 text-sm text-slate-300">
                              {payment.userName} · {payment.userEmail}
                            </p>
                          </div>
                          <StatusPill tone="success">{payment.paymentStatus}</StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Amount
                            <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(payment.amount)}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Method
                            <div className="mt-1 text-lg font-semibold text-white">{payment.paymentMethod}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Reference
                            <div className="mt-1 text-lg font-semibold text-white">{payment.paymentReference || 'n/a'}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                            Date
                            <div className="mt-1 text-lg font-semibold text-white">{new Date(payment.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="glass rounded-[32px] p-8 text-center text-slate-300">No payments recorded yet.</div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}