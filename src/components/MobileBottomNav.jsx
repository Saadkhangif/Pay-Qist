import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Package, ShoppingCart } from 'lucide-react';
import { BOTTOM_NAV_ITEMS, isNavActive } from '../lib/navigation';

const iconMap = {
  Home,
  Package,
  Info,
  ShoppingCart,
};

function bottomNavLinkClass(isActive) {
  return [
    'relative flex flex-1 flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-semibold transition-colors',
    isActive
      ? 'text-brand-600 dark:text-brand-300'
      : 'text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-300',
  ].join(' ');
}

export default function MobileBottomNav({ cartCount, hidden }) {
  const { pathname } = useLocation();

  if (hidden) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/90 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden dark:border-emerald-500/10 dark:bg-surface-raised/90 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]"
      aria-label="Primary navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = isNavActive(pathname, item);

          return (
            <li key={item.to} className="flex min-w-0 flex-1">
              <Link
                to={item.to}
                className={bottomNavLinkClass(active)}
                aria-current={active ? 'page' : undefined}
              >
                {active ? (
                  <span
                    className="absolute top-0 h-0.5 w-10 rounded-full bg-brand-500 dark:bg-brand-400"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
                  {item.showCartBadge && cartCount > 0 ? (
                    <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold leading-none text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span className="truncate">{item.shortLabel || item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
