import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const categories = [
  {
    name: 'Smartphones',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Laptops',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gaming',
    image:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Appliances',
    image:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Categories() {
  return (
    <section className="home-section home-section-grid py-20">
      <div className="home-glow-orb -left-24 top-8 h-72 w-72 bg-brand-500/10 dark:bg-brand-500/25" />
      <div className="home-glow-orb -right-20 bottom-0 h-64 w-64 bg-emerald-400/10 dark:bg-emerald-400/15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Shop by Category"
          description="Browse our curated collections and find the perfect product on your terms."
          className="mb-10"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-emerald-500/20 dark:shadow-dark-card dark:ring-1 dark:ring-inset dark:ring-white/[0.06] dark:hover:border-brand-400/35 dark:hover:shadow-dark-card-hover dark:hover:ring-brand-400/20"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-slate-900/10 transition-opacity group-hover:from-brand-900/95 dark:from-slate-950/95 dark:via-brand-950/50 dark:to-brand-500/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="text-sm font-bold text-white transition-colors group-hover:text-brand-300">
                  {cat.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/0 transition-all group-hover:text-brand-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
