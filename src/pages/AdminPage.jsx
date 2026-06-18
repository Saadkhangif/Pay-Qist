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
  category: 'Smartphones',
  allowedInstallmentMonths: '3,6,12',
  featured: true,
};

const roleOptions = [
  { label: 'Customer', value: 'customer' },
  { label: 'Support', value: 'support' },
  { label: 'Admin', value: 'admin' },
];

const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Gaming',
  'Appliances',
  'Electronics',
  'Furniture',
  'Uncategorized',
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
        category: form.category,
        allowedInstallmentMonths: form.allowedInstallmentMonths
        allowedInstallmentMonths: String(form.allowedInstallmentMonths || '')
          .split(',')
          .map((value) => Number(value.trim()))
          .map((value) => Number(value?.trim()))
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
      category: product.category || 'Smartphones',
      allowedInstallmentMonths: product.allowedInstallmentMonths.join(','),
      allowedInstallmentMonths: Array.isArray(product.allowedInstallmentMonths) ? product.allowedInstallmentMonths.join(',') : '',
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
        <aside className="bg-white border border-slate-200 shadow-sm h-fit rounded-3xl p-4">
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                className={`w-full justify-start rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 text-left ${tab === link.id ? 'bg-[#0F9D58] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                type="button"
                onClick={() => setTab(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionHeading
                eyebrow="Admin portal"
                title="Merchant control center"
                description="Add products, manage user roles, review installment applications, and inspect payment records in one place."
              />
              <StatusPill tone="warning">Signed in as {user?.role || 'admin'}</StatusPill>
            </div>
          </div>

          {message ? <div className="rounded-2xl border border-[#0F9D58]/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-medium flex items-center gap-3"><svg className="h-5 w-5 text-[#0F9D58]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{message}</div> : null}

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Products</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{stats.totalProducts}</div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Users</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{users.length}</div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Orders</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{stats.totalOrders}</div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Payments</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{stats.totalPayments}</div>
            </div>
          </div>

          {tab === 'overview' ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <article className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
                <SectionHeading eyebrow="Overview" title="What you can manage here" description="A single admin workspace for the whole platform." />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {quickLinks.slice(1).map((link) => (
                    <button key={link.id} type="button" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-bold text-slate-700 transition hover:bg-white hover:shadow-md hover:border-[#0F9D58]/30" onClick={() => setTab(link.id)}>
                      {link.label}
                    </button>
                  ))}
                </div>
              </article>

              <article className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
                <SectionHeading eyebrow="Recent activity" title="Latest records" description="Quick access to the most recent product, order, and payment entries." />
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Latest product</p>
                    <p className="mt-1 font-bold text-slate-900 text-lg">{products[0]?.title || 'No products yet'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Latest order</p>
                    <p className="mt-1 font-bold text-slate-900 text-lg">{sortedOrders[0]?.productTitle || 'No orders yet'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Latest payment</p>
                    <p className="mt-1 font-bold text-slate-900 text-lg">{sortedPayments[0]?.orderTitle || 'No payments yet'}</p>
                  </div>
                </div>
              </article>
            </div>
          ) : tab === 'products' ? (
            <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
              <form className="bg-white border border-slate-200 shadow-sm space-y-4 rounded-3xl p-6 md:p-8" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <p className="text-sm text-slate-500 mb-4">
                  {storeMode === 'firebase'
                    ? 'Upload an image file to Firebase Storage or paste a hosted URL.'
                    : 'Demo mode uses local preview URLs and object URLs for file uploads.'}
                </p>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                <textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium min-h-32" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium" type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium" placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all font-medium" placeholder="Allowed installment months e.g. 3,6,12" value={form.allowedInstallmentMonths} onChange={(event) => setForm({ ...form, allowedInstallmentMonths: event.target.value })} />

                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                  Featured on home page
                </label>

                <div className="flex gap-3">
                  <button className="rounded-xl bg-[#0F9D58] text-white font-bold flex-1 py-3 shadow-md hover:bg-emerald-600 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0" type="submit" disabled={busy}>
                    {busy ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
                  </button>
                  {editingId ? (
                    <button className="rounded-xl border border-slate-200 bg-white text-slate-700 font-bold px-6 py-3 hover:bg-slate-50 transition-all duration-200" type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-4">
                {products.map((product) => (
                  <article key={product.id} className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-3xl p-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <img src={product.imageUrl} alt={product.title} loading="lazy" decoding="async" className="h-28 w-full rounded-3xl object-cover sm:w-36" />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-semibold text-[#0F9D58]">{formatCurrency(product.price)}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-sm font-medium text-slate-500">{product.category || 'Uncategorized'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold px-4 py-1.5 text-sm hover:bg-slate-50 hover:text-slate-900 transition" type="button" onClick={() => beginEdit(product)}>
                              Edit
                            </button>
                            <button className="rounded-lg border border-rose-200 bg-white text-rose-600 font-semibold px-4 py-1.5 text-sm hover:bg-rose-50 transition" type="button" onClick={() => removeProduct(product.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-500">{product.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {product.allowedInstallmentMonths.map((months) => (
                    {Array.isArray(product.allowedInstallmentMonths) && product.allowedInstallmentMonths.map((months) => (
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
                <article key={account.id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">{account.name}</h3>
                        <StatusPill tone={account.role === 'admin' ? 'success' : account.role === 'support' ? 'info' : 'slate'}>
                          {account.role}
                        </StatusPill>
                        {account.id === user?.id ? <StatusPill tone="warning">Current account</StatusPill> : null}
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-600">{account.email}</p>
                      <p className="mt-1 text-xs uppercase font-bold tracking-wider text-slate-400">Provider: {account.provider || 'local'}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 min-w-44 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition"
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
                        className="rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
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
                  <article key={order.id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <img src={order.productImage} alt={order.productTitle} loading="lazy" decoding="async" className="h-28 w-full rounded-3xl object-cover sm:w-36" />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{order.productTitle}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {order.userName} · {order.userEmail}
                            </p>
                          </div>
                          <StatusPill tone="success">{order.paymentStatus}</StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Plan
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{order.installmentMonths} months</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Monthly
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{formatCurrency(order.monthlyPayment)}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Down payment
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{formatCurrency(order.downPayment)}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Payment method
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{order.paymentMethod}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center font-medium text-slate-500">No installment applications yet.</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPayments.length ? (
                sortedPayments.map((payment) => (
                  <article key={payment.id} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="grid h-28 w-full place-items-center rounded-2xl bg-emerald-50 text-sm font-bold uppercase tracking-wider text-emerald-600 sm:w-36 border border-emerald-100">
                        Payment<br/>Record
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{payment.orderTitle}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {payment.userName} · {payment.userEmail}
                            </p>
                          </div>
                          <StatusPill tone="success">{payment.paymentStatus}</StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Amount
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{formatCurrency(payment.amount)}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Method
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{payment.paymentMethod}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Reference
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{payment.paymentReference || 'n/a'}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Date
                            <div className="mt-1 text-lg font-black text-slate-900 normal-case tracking-normal">{new Date(payment.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center font-medium text-slate-500">No payments recorded yet.</div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}