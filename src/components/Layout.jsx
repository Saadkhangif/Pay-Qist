import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useStore } from '../context/StoreContext';
import Footer from './Footer';
import Logo from './Logo';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'text-[#0F9D58] bg-[#0F9D58]/10 border border-[#0F9D58]/20 shadow-sm' : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#0F9D58]',
  ].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { cart = [], products = [] } = useStore();
  const navigate = useNavigate();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const menuRef = useRef(null);

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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-[#0F9D58] selection:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm transform-gpu">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <Logo to="/home" size="xl" />

            {/* Expandable Search Component */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:bg-[#0F9D58]/10 hover:text-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58] transition"
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
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/20 transition-all"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isSearchExpanded && (
                <div className="absolute top-full left-0 mt-4 w-[280px] sm:w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {searchDropdownTitle}
                  </div>
                  {displayedProducts.length > 0 ? (
                    <div className="flex max-h-[300px] flex-col overflow-y-auto p-2">
                      {displayedProducts.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition"
                          onClick={() => {
                            navigate(result.url);
                            setIsSearchExpanded(false);
                            setSearchQuery('');
                          }}
                        >
                          {result.imageUrl ? (
                            <img src={result.imageUrl} alt={result.title} className="h-10 w-10 shrink-0 rounded-lg object-cover border border-slate-100" />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-[#0F9D58]">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-slate-900">{result.title}</div>
                            <div className="truncate text-xs text-slate-500">{result.category || 'Electronics'}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Products are loading...
                    </div>
                  )}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-[#0F9D58] transition hover:bg-emerald-50"
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

          <nav className="hidden items-center gap-2 md:flex">
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
              Cart {cart.length > 0 ? `(${cart.length})` : ''}
            </NavLink>
            {isAdmin ? (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                </div>
                <button className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 sm:block"
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#0F9D58] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0F9D58]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600"
                  onClick={() => openAuthModal('signup')}
                >
                  Sign Up
                </button>
              </>
            )}
            
            <div ref={menuRef} className="relative inline-block">
              <button 
                type="button" 
                className="ml-2 inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-[#0F9D58]/10 hover:text-[#0F9D58] focus:outline-none focus:ring-2 focus:ring-[#0F9D58] transition" 
                aria-label="Open main menu"
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {isMenuExpanded && (
                <div className="absolute right-0 top-full mt-4 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <nav className="flex flex-col gap-1">
                    <NavLink to="/home" className={navLinkClass} onClick={() => setIsMenuExpanded(false)} end>Home</NavLink>
                    <NavLink to="/products" className={navLinkClass} onClick={() => setIsMenuExpanded(false)}>Products</NavLink>
                    <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuExpanded(false)}>About Us</NavLink>
                    <NavLink to="/cart" className={navLinkClass} onClick={() => setIsMenuExpanded(false)}>Cart {cart.length > 0 ? `(${cart.length})` : ''}</NavLink>
                    {isAdmin ? <NavLink to="/admin" className={navLinkClass} onClick={() => setIsMenuExpanded(false)}>Admin</NavLink> : null}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}