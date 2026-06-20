import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Star,
  Users,
  X,
} from 'lucide-react';
import AdminApplicationsPanel from '../components/AdminApplicationsPanel';
import SectionHeading from '../components/SectionHeading';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { apiFetch } from '../lib/api';
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

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const TAB_META = {
  overview: {
    title: 'Dashboard overview',
    description: 'Monitor store performance and jump into common admin tasks.',
  },
  products: {
    title: 'Product catalog',
    description: 'Add, edit, and manage products available for installment purchase.',
  },
  users: {
    title: 'User management',
    description: 'Review accounts and assign admin access.',
  },
  orders: {
    title: 'Order overview',
    description: 'Track installment orders and payment status.',
  },
  applications: {
    title: 'Installment applications',
    description: 'Review submitted application forms, ID photos, and referral details.',
  },
  payments: {
    title: 'Payment history',
    description: 'Review completed and pending payment records.',
  },
};

function AlertBanner({ message, type = 'success' }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
        isError
          ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
          : 'border-brand-500/20 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300'
      }`}
    >
      {isError ? (
        <svg className="h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {message}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = 'emerald' }) {
  const accents = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
    sky: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/20',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
    violet: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/20',
  };

  return (
    <div className="admin-panel p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-2xl border p-3 ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default function AdminPage() {
  const { user, users, updateUserRole, removeUserRole } = useAuth();
  const { products, orders, payments, addProduct, updateProduct, removeProduct, stats, uploadProductImage } = useStore();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [busy, setBusy] = useState(false);
  const [savingUserId, setSavingUserId] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [applicationCount, setApplicationCount] = useState(0);
  const [latestApplication, setLatestApplication] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    apiFetch('/api/applications')
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : [];
        setApplicationCount(list.length);
        setLatestApplication(list[0] || null);
      })
      .catch(() => {});
  }, [user]);

  const sortedOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders]);
  const sortedPayments = useMemo(() => [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [payments]);
  const featuredCount = useMemo(() => products.filter((p) => p.featured).length, [products]);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = productCategory === 'all' || product.category === productCategory;
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, productCategory, productSearch]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      (account) =>
        account.name?.toLowerCase().includes(query) ||
        account.email?.toLowerCase().includes(query) ||
        account.role?.toLowerCase().includes(query),
    );
  }, [users, userSearch]);

  const [previewObjectUrl, setPreviewObjectUrl] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setPreviewObjectUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewObjectUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const previewImage = previewObjectUrl || form.imageUrl;

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  function switchTab(nextTab) {
    setTab(nextTab);
    setSidebarOpen(false);
  }

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
        allowedInstallmentMonths: String(form.allowedInstallmentMonths || '')
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
        showMessage('Product updated successfully.');
      } else {
        await addProduct(payload);
        showMessage('Product added successfully.');
      }

      resetForm();
    } catch (error) {
      showMessage(error.message || 'Unable to save product right now.', 'error');
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
      allowedInstallmentMonths: Array.isArray(product.allowedInstallmentMonths) ? product.allowedInstallmentMonths.join(',') : '',
      featured: product.featured,
    });
    setImageFile(null);
    switchTab('products');
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
      showMessage('User role updated successfully.');
    } catch (error) {
      showMessage(error.message || 'Unable to update role right now.', 'error');
    } finally {
      setSavingUserId('');
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await removeProduct(deleteTarget.id);
      if (editingId === deleteTarget.id) resetForm();
      showMessage(`"${deleteTarget.title}" removed.`);
    } catch (error) {
      showMessage(error.message || 'Unable to remove product.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  const navCounts = {
    products: products.length,
    users: users.length,
    orders: orders.length,
    applications: applicationCount,
    payments: payments.length,
  };

  function renderSidebar() {
    return (
      <nav className="space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const count = navCounts[item.id];
          const isActive = tab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {count != null ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Admin portal</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Control center</h1>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside
          className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-72 transform border-r p-5 shadow-xl transition-transform lg:static lg:z-auto lg:w-auto lg:transform-none lg:rounded-3xl lg:border lg:shadow-sm ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Navigation</span>
            <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-4 hidden text-xs font-bold uppercase tracking-wider text-slate-400 lg:block">Menu</p>
          {renderSidebar()}
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="admin-panel p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <SectionHeading
                variant="light"
                eyebrow="Admin portal"
                title={TAB_META[tab].title}
                description={TAB_META[tab].description}
              />
              <StatusPill variant="light" tone="warning">
                Signed in as {user?.name || user?.role || 'admin'}
              </StatusPill>
            </div>
          </div>

          <AlertBanner message={message} type={messageType} />

          {tab === 'overview' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Products" value={stats.totalProducts} icon={Package} accent="emerald" />
                <StatCard label="Featured" value={featuredCount} icon={Star} accent="amber" />
                <StatCard label="Orders" value={stats.totalOrders} icon={ShoppingCart} accent="sky" />
                <StatCard label="Users" value={users.length} icon={Users} accent="violet" />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <article className="admin-panel p-6 md:p-8">
                  <SectionHeading
                    variant="light"
                    eyebrow="Quick actions"
                    title="Jump to a section"
                    description="Common admin tasks in one click."
                  />
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {NAV_ITEMS.filter((item) => item.id !== 'overview').map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-bold text-slate-700 transition hover:border-brand-500/30 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          onClick={() => switchTab(item.id)}
                        >
                          <Icon className="h-4 w-4 text-brand-500" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </article>

                <article className="admin-panel p-6 md:p-8">
                  <SectionHeading
                    variant="light"
                    eyebrow="Recent activity"
                    title="Latest updates"
                    description="Most recent products, orders, and payments."
                  />
                  <div className="mt-6 space-y-3">
                    <div className="admin-muted p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest product</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{products[0]?.title || 'No products yet'}</p>
                      {products[0] ? (
                        <p className="mt-1 text-sm text-slate-500">{formatCurrency(products[0].price)} · {products[0].category}</p>
                      ) : null}
                    </div>
                    <div className="admin-muted p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest application</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        {latestApplication?.applicantName || 'No applications yet'}
                      </p>
                      {latestApplication ? (
                        <p className="mt-1 text-sm text-slate-500">
                          {latestApplication.referralName} · {latestApplication.status}
                        </p>
                      ) : null}
                    </div>
                    <div className="admin-muted p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest order</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{sortedOrders[0]?.productTitle || 'No orders yet'}</p>
                      {sortedOrders[0] ? (
                        <p className="mt-1 text-sm text-slate-500">{sortedOrders[0].userName} · {sortedOrders[0].installmentMonths} months</p>
                      ) : null}
                    </div>
                    <div className="admin-muted p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest payment</p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{sortedPayments[0]?.orderTitle || 'No payments yet'}</p>
                      {sortedPayments[0] ? (
                        <p className="mt-1 text-sm text-slate-500">{formatCurrency(sortedPayments[0].amount)} · {sortedPayments[0].paymentMethod}</p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            </>
          ) : null}

          {tab === 'products' ? (
            <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
              <form className="admin-panel space-y-4 p-6 md:p-8" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingId ? 'Edit product' : 'Add product'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Paste an image URL or upload a file for preview.</p>

                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-40 w-full rounded-2xl border border-slate-200 object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    Image preview
                  </div>
                )}

                <input
                  className="input"
                  placeholder="Product title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                />
                <textarea
                  className="input min-h-28"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  required
                />
                <input
                  className="input"
                  type="number"
                  min="1"
                  placeholder="Price (PKR)"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                />
                <input
                  className="input"
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                />
                <input
                  className="input text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                />
                <select
                  className="input"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="Installment months, e.g. 3,6,12"
                  value={form.allowedInstallmentMonths}
                  onChange={(event) => setForm({ ...form, allowedInstallmentMonths: event.target.value })}
                />
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                  Featured on home page
                </label>
                <div className="flex gap-3">
                  <button
                    className="button-primary flex-1 py-3"
                    type="submit"
                    disabled={busy}
                  >
                    {busy ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
                  </button>
                  {editingId ? (
                    <button
                      className="button-secondary px-6 py-3"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-4">
                <div className="admin-panel flex flex-col gap-3 p-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="input py-2.5 pl-10 pr-4 text-sm"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                    />
                  </div>
                  <select
                    className="input py-2.5 text-sm font-semibold"
                    value={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                  >
                    <option value="all">All categories</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <article key={product.id} className="admin-panel overflow-hidden p-5">
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          loading="lazy"
                          decoding="async"
                          className="h-28 w-full rounded-2xl object-cover sm:w-36"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{product.title}</h3>
                                {product.featured ? (
                                  <StatusPill variant="light" tone="warning">
                                    Featured
                                  </StatusPill>
                                ) : null}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="font-semibold text-brand-500">{formatCurrency(product.price)}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-sm font-medium text-slate-500">{product.category || 'Uncategorized'}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="button-secondary px-4 py-1.5 text-sm"
                                type="button"
                                onClick={() => beginEdit(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="rounded-lg border border-rose-200 bg-white px-4 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                type="button"
                                onClick={() => setDeleteTarget(product)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <p className="text-sm leading-6 text-slate-500 line-clamp-2 dark:text-slate-400">{product.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(product.allowedInstallmentMonths) &&
                              product.allowedInstallmentMonths.map((months) => (
                                <StatusPill key={months} variant="light">
                                  {months} months
                                </StatusPill>
                              ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyState
                    icon={Package}
                    title="No products found"
                    description={productSearch || productCategory !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first product using the form.'}
                  />
                )}
              </div>
            </div>
          ) : null}

          {tab === 'users' ? (
            <div className="space-y-4">
              <div className="admin-panel relative p-4">
                <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input py-2.5 pl-10 pr-4 text-sm"
                  placeholder="Search users by name, email, or role..."
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </div>

              {filteredUsers.length ? (
                filteredUsers.map((account) => (
                  <article key={account.id} className="admin-panel p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{account.name}</h3>
                          <StatusPill variant="light" tone={account.role === 'admin' ? 'success' : 'slate'}>
                            {account.role}
                          </StatusPill>
                          {account.id === user?.id ? (
                            <StatusPill variant="light" tone="info">
                              You
                            </StatusPill>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">{account.email}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <select
                          className="input min-w-44 py-2.5 text-sm font-semibold"
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
                          className="button-secondary px-4 py-2.5 text-sm disabled:opacity-50"
                          type="button"
                          disabled={account.id === user?.id || savingUserId === account.id || account.role === 'customer'}
                          onClick={() => handleRoleChange(account.id, 'customer')}
                        >
                          Revoke admin
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState icon={Users} title="No users found" description="Try a different search term." />
              )}
            </div>
          ) : null}

          {tab === 'orders' ? (
            <div className="space-y-4">
              {sortedOrders.length ? (
                sortedOrders.map((order) => (
                  <article key={order.id} className="admin-panel p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        loading="lazy"
                        decoding="async"
                        className="h-28 w-full rounded-2xl object-cover sm:w-36"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{order.productTitle}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                              {order.userName} · {order.userEmail}
                            </p>
                          </div>
                          <StatusPill variant="light" tone="success">
                            {order.paymentStatus}
                          </StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          {[
                            ['Plan', `${order.installmentMonths} months`],
                            ['Monthly', formatCurrency(order.monthlyPayment)],
                            ['Down payment', formatCurrency(order.downPayment)],
                            ['Method', order.paymentMethod],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                              <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState
                  icon={ShoppingCart}
                  title="No orders yet"
                  description="Installment orders will appear here once customers complete their application."
                />
              )}
            </div>
          ) : null}

          {tab === 'applications' ? <AdminApplicationsPanel /> : null}

          {tab === 'payments' ? (
            <div className="space-y-4">
              {sortedPayments.length ? (
                sortedPayments.map((payment) => (
                  <article key={payment.id} className="admin-panel p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="grid h-28 w-full place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 text-sm font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 sm:w-36">
                        Payment
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{payment.orderTitle}</h3>
                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                              {payment.userName} · {payment.userEmail}
                            </p>
                          </div>
                          <StatusPill variant="light" tone="success">
                            {payment.paymentStatus}
                          </StatusPill>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4">
                          {[
                            ['Amount', formatCurrency(payment.amount)],
                            ['Method', payment.paymentMethod],
                            ['Reference', payment.paymentReference || 'n/a'],
                            ['Date', new Date(payment.createdAt).toLocaleDateString()],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                              <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState
                  icon={CreditCard}
                  title="No payments recorded"
                  description="Payment records will show up here after customers complete checkout."
                />
              )}
            </div>
          ) : null}
        </section>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="admin-panel w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Remove product?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              &ldquo;{deleteTarget.title}&rdquo; will be permanently removed from the catalog.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-rose-600 py-2.5 font-bold text-white transition hover:bg-rose-700"
                onClick={confirmDelete}
              >
                Remove
              </button>
              <button
                type="button"
                className="button-secondary flex-1 py-2.5"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
