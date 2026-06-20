import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Info,
  ShoppingCart,
  Shield,
  LogIn,
  UserPlus,
  LogOut,
  X,
} from 'lucide-react';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import Logo from './Logo';

const navItems = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, showCartBadge: true },
  { to: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

function mobileNavLinkClass({ isActive }) {
  return [
    'group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all duration-200',
    isActive
      ? 'bg-brand-500/10 text-brand-600 shadow-sm ring-1 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/25'
      : 'text-slate-700 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-200 dark:hover:bg-surface-overlay/80 dark:hover:text-brand-300',
  ].join(' ');
}

function MenuIcon({ open }) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? 'translate-y-0 rotate-45' : '-translate-y-[6px]'
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
          open ? 'translate-y-0 -rotate-45' : 'translate-y-[6px]'
        }`}
      />
    </span>
  );
}

export default function MobileNav({
  user,
  isAdmin,
  cartCount,
  isOpen,
  onToggle,
  onClose,
  onOpenAuth,
  onLogout,
}) {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    lockScroll();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
    };
  }, [isOpen, onClose]);

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const menuOverlay = (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />

      <aside
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={`absolute inset-y-0 right-0 flex w-[min(100vw-3rem,22rem)] flex-col border-l border-slate-200/80 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-emerald-500/15 dark:bg-surface-raised dark:shadow-dark-card ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <Logo to="/home" size="lg" priority surface="auto" />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-surface-overlay dark:hover:text-slate-100"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {user ? (
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-sm font-bold text-white shadow-glow-brand">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                <div className="truncate text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</div>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 overflow-y-auto overscroll-contain scroll-touch px-3 py-4">
          <ul className="space-y-1">
            {visibleItems.map(({ to, label, icon: Icon, end, showCartBadge }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={mobileNavLinkClass} onClick={onClose}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:bg-surface-overlay dark:text-slate-300 dark:group-hover:text-brand-300">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  <span className="flex-1">{label}</span>
                  {showCartBadge && cartCount > 0 ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-2 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          {user ? (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="button-ghost flex w-full items-center justify-center gap-2 py-3"
                onClick={() => {
                  onOpenAuth('login');
                  onClose();
                }}
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <Link
                to="/signup"
                className="button-primary flex w-full items-center justify-center gap-2 py-3 text-center"
                onClick={onClose}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-raised ${
          isOpen
            ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
            : 'text-slate-500 hover:bg-brand-500/10 hover:text-brand-500'
        }`}
        aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        onClick={onToggle}
      >
        <MenuIcon open={isOpen} />
      </button>

      {createPortal(menuOverlay, document.body)}
    </div>
  );
}
