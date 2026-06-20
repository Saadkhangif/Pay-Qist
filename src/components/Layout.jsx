import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useStore } from '../context/StoreContext';
import Footer from './Footer';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import MobileBottomNav from './MobileBottomNav';
import MobileNav from './MobileNav';
import { getPageTitle, shouldHideBottomNav } from '../lib/navigation';

const navLinkClass = ({ isActive }) =>
  ['nav-link', isActive ? 'nav-link-active' : ''].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { cart = [], products = [] } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const hideBottomNav = shouldHideBottomNav(location.pathname);

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const closeMenu = useCallback(() => setIsMenuExpanded(false), []);

  const { items: displayedProducts, mode: searchMode } = useMemo(() => {
    const withUrl = products.map((p) => ({ ...p, url: `/product/${p.id}` }));
    const featuredFirst = [
      ...withUrl.filter((p) => p.featured),
      ...withUrl.filter((p) => !p.featured),
    ];

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return { items: featuredFirst.slice(0, 6), mode: 'suggested' };
    }

    const matches = withUrl.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query),
    );

    if (matches.length > 0) {
      return { items: matches.slice(0, 6), mode: 'results' };
    }

    return { items: featuredFirst.slice(0, 6), mode: 'browse' };
  }, [searchQuery, products]);

  const searchDropdownTitle =
    searchMode === 'suggested'
      ? 'Popular products'
      : searchMode === 'browse'
        ? 'No exact match — browse these products'
        : 'Search results';

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  // Close the search bar if the user clicks anywhere outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/80 pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-slate-900 dark:bg-transparent dark:text-slate-100 lg:pb-0">
      <header className="site-header transform-gpu">
        <div className="h-0.5 bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-400" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <Logo to="/home" size="xl" priority surface="auto" />

            {/* Expandable Search Component */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 transition hover:bg-brand-500/10 hover:text-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={() => {
                  setIsSearchExpanded(!isSearchExpanded);
                  if (isSearchExpanded) setSearchQuery(''); // Clear input if closing
                }}
                aria-label="Search products"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchExpanded ? 'w-32 opacity-100 sm:w-56 lg:w-64' : 'w-0 opacity-0'
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="search"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isSearchExpanded && (
                <div className="absolute top-full left-0 mt-4 w-[280px] sm:w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-emerald-500/15 dark:bg-surface-raised dark:shadow-dark-card">
                  <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {searchDropdownTitle}
                  </div>
                  {displayedProducts.length > 0 ? (
                    <div className="flex max-h-[300px] flex-col overflow-y-auto overscroll-contain scroll-touch p-2">
                      {displayedProducts.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-surface-overlay/80"
                          onClick={() => {
                            navigate(result.url);
                            setIsSearchExpanded(false);
                            setSearchQuery('');
                          }}
                        >
                          {result.imageUrl ? (
                            <div className="product-image-well-sm h-10 w-10 shrink-0">
                              <img src={result.imageUrl} alt={result.title} className="product-image h-full w-full" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-brand-500 dark:border-slate-700 dark:bg-slate-800">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{result.title}</div>
                            <div className="truncate text-xs text-slate-500 dark:text-slate-400">{result.category || 'Electronics'}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Products are loading...
                    </div>
                  )}
                  <div className="border-t border-slate-100 p-2 dark:border-slate-800">
                    <button
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 dark:hover:bg-brand-500/10"
                      onClick={() => {
                        navigate('/products');
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }}
                    >
                      View all products →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/home" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                Cart
                {cart.length > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                    {cart.length}
                  </span>
                ) : null}
              </span>
            </NavLink>
            {isAdmin ? (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <div className="hidden text-right lg:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                  <div className="text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</div>
                </div>
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
              cartCount={cart.length}
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

      <main className="flex-1">{children}</main>

      <Footer />

      <MobileBottomNav cartCount={cart.length} hidden={hideBottomNav} />
    </div>
  );
}