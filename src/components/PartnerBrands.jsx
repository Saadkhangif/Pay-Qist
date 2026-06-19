const brands = [
  {
    name: 'Apple',
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Samsung',
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sony',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'HP',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Dell',
    image:
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Lenovo',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=200&q=80',
  },
];

export default function PartnerBrands() {
  return (
    <section className="py-12 bg-white border-y border-slate-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by top brands</p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {brands.map((brand) => (
            <div key={brand.name} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm grayscale group-hover:grayscale-0 transition-all duration-300">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
