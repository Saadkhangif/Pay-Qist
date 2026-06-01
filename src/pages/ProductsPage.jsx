import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useStore } from '../context/StoreContext';

export default function ProductsPage() {
  const { products = [] } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from products, defaulting to 'General' if no category is defined
  const categories = useMemo(() => {
    const allCategories = products.map((p) => p.category || 'General');
    return ['All', ...new Set(allCategories)];
  }, [products]);

  // Filter products based on search input and selected category tab
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const productCategory = product.category || 'General';
      const matchesCategory = selectedCategory === 'All' || productCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Catalog" title="All Products" description="Browse our complete collection of products available for installment plans." />

          <div className="w-full md:max-w-xs">
            <input type="text" className="input w-full" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? 'button-primary px-4 py-2 text-sm' : 'button-secondary px-4 py-2 text-sm'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[32px] p-16 text-center">
            <h3 className="text-xl font-semibold text-white">No products found</h3>
            <p className="mt-2 text-earth-cream/70">Try adjusting your search query or category filter.</p>
            <button className="button-secondary mt-6" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}