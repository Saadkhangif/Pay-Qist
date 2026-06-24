import { useCallback, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useCartCount } from '../stores/cartStore';
import Footer from './Footer';
import HeaderSearch from './HeaderSearch';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import MobileBottomNav from './MobileBottomNav';
import MobileNav from './MobileNav';
import { getHeaderNavItems, getPageTitle, isNavActive, shouldHideBottomNav } from '../lib/navigation';

const navLinkClass = ({ isActive }) =>
  ['nav-link', isActive ? 'nav-link-active' : ''].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { openAuthModal } = useAuthModal();
  const cartCount = useCartCount();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const hideBottomNav = shouldHideBottomNav(location.pathname);
  const headerNavItems = getHeaderNavItems({ user, isAdmin });
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const closeMenu = useCallback(() => setIsMenuExpanded(false), []);
  const footer = useMemo(() => <Footer />, []);

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-slate-50/80 pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-slate-900 dark:bg-transparent dark:text-slate-100 lg:pb-0">
      <header className="site-header transform-gpu">
        <div className="h-0.5 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <Logo to="/home" size="xl" priority surface="auto" />
            <HeaderSearch />
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {headerNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                isActive={() => isNavActive(location.pathname, item)}
              >
                {item.showCartBadge ? (
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {cartCount > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                        {cartCount}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  item.label
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/account" className="hidden text-right lg:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                  <div className="text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</div>
                </Link>
                <button className="button-ghost hidden px-5 py-2 lg:inline-flex" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="button-ghost hidden lg:inline-flex"
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </button>
                <Link to="/signup" className="button-primary hidden px-5 py-2.5 lg:inline-flex">
                  Sign Up
                </Link>
              </>
            )}

            <MobileNav
              user={user}
              isAdmin={isAdmin}
              cartCount={cartCount}
              isOpen={isMenuExpanded}
              onToggle={() => setIsMenuExpanded((open) => !open)}
              onClose={closeMenu}
              onOpenAuth={openAuthModal}
              onLogout={logout}
            />
          </div>
        </div>

        <div
          className="border-t border-slate-100 bg-slate-50/90 px-4 py-2 lg:hidden dark:border-slate-800 dark:bg-surface-overlay/50"
          aria-live="polite"
        >
          <p className="truncate text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
            {pageTitle}
          </p>
        </div>
      </header>

      <main className="min-w-0 flex-1">{children}</main>

      {footer}

      <MobileBottomNav cartCount={cartCount} hidden={hideBottomNav} user={user} />
    </div>
  );
}
