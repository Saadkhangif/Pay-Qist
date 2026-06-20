const brands = [
  { name: 'Apple', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80' },
  { name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80' },
  { name: 'HP', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80' },
  { name: 'Dell', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=200&q=80' },
  { name: 'Lenovo', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80' },
];

function BrandItem({ brand }) {
  return (
    <div className="mx-8 flex shrink-0 flex-col items-center gap-2">
      <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm grayscale transition-all duration-300 hover:grayscale-0 hover:shadow-md dark:border-slate-600 dark:bg-white">
        <img src={brand.image} alt={brand.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <span className="text-xs font-bold text-slate-400">{brand.name}</span>
    </div>
  );
}

export default function PartnerBrands() {
  const doubled = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-slate-200/50 bg-white py-14 dark-section">
      <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
        Trusted by top brands
      </p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent dark:from-surface-overlay/80" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-surface-overlay/80" />
        <div className="flex w-max animate-marquee items-center">
          {doubled.map((brand, i) => (
            <BrandItem key={`${brand.name}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
