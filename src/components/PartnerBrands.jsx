export default function PartnerBrands() {
  return (
    <section className="py-12 bg-white border-y border-slate-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by top brands</p>
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {['Apple', 'Samsung', 'Sony', 'HP', 'Dell', 'Lenovo'].map((brand) => (
            <span key={brand} className="text-2xl font-black text-slate-800">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}