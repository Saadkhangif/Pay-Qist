import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Select } from '../../components/Select';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/price';

const emptyForm = {
  id: '',
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  allowedInstallments: '3,6,12',
  featured: true,
};

export function ProductManagementPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(form.id);

  const normalizedInstallments = useMemo(
    () => form.allowedInstallments.split(',').map((item) => Number(item.trim())).filter(Boolean),
    [form.allowedInstallments],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const product = {
      id: form.id || crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      allowedInstallments: normalizedInstallments,
      featured: form.featured,
    };

    if (isEditing) {
      updateProduct(form.id, product);
    } else {
      addProduct(product);
    }

    setForm(emptyForm);
  };

  const startEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      allowedInstallments: product.allowedInstallments.join(','),
      featured: product.featured,
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-glow">
        <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit product' : 'Add new product'}</h2>
        <div className="mt-5 space-y-4">
          <FormField label="Title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </FormField>
          <FormField label="Description">
            <Textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </FormField>
          <FormField label="Price">
            <Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          </FormField>
          <FormField label="Image URL">
            <Input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          </FormField>
          <FormField label="Allowed installment months" hint="Comma-separated values like 3,6,12">
            <Input value={form.allowedInstallments} onChange={(event) => setForm({ ...form, allowedInstallments: event.target.value })} />
          </FormField>
          <FormField label="Featured">
            <Select value={String(form.featured)} onChange={(event) => setForm({ ...form, featured: event.target.value === 'true' })}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormField>
          <Button type="submit" className="w-full">
            {isEditing ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {products.map((product) => (
          <article key={product.id} className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-glow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <img src={product.imageUrl} alt={product.title} className="h-28 w-28 rounded-2xl object-cover" />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="text-sm text-slate-400">{product.description}</p>
                </div>
                <p className="text-sm text-slate-300">{formatCurrency(product.price)} | Plans: {product.allowedInstallments.join(', ')} months</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => startEdit(product)}>Edit</Button>
                  <Button variant="ghost" onClick={() => deleteProduct(product.id)}>Remove</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}