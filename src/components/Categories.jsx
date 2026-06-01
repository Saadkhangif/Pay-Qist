const categories = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Appliances', icon: '🏠' },
  { name: 'Electronics', icon: '🔌' },
  { name: 'Furniture', icon: '🛋️' },
];

export default function Categories() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 cursor-pointer group transition hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100">
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-[#0F9D58] text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}