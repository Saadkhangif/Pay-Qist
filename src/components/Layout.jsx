import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import Footer from './Footer';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'text-earth-deep bg-earth-deep/10 border border-earth-deep/20 shadow-sm' : 'border border-transparent text-earth-dark/70 hover:bg-white/40 hover:text-earth-dark',
  ].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { cart = [], products = [] } = useStore();
  const navigate = useNavigate();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const menuRef = useRef(null);

  // Filter products and pages based on the search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    // Define standard pages that can be searched
    const sitePages = [
      { id: 'page-about', title: 'About Us', description: 'Learn more about Pay Qist and our mission', category: 'Page', url: '/about' },
      { id: 'page-contact', title: 'Contact Us', description: 'Get in touch with our support team', category: 'Page', url: '/contact-us' },
      { id: 'page-products', title: 'Products', description: 'Browse our complete collection of products', category: 'Page', url: '/products' },
      { id: 'page-privacy', title: 'Privacy Policy', description: 'Information on how we collect and use your data', category: 'Page', url: '/privacy-policy' },
      { id: 'page-terms', title: 'Terms of Service', description: 'Terms and conditions for using Pay Qist', category: 'Page', url: '/terms-of-service' },
      { id: 'page-refund', title: 'Refund & Return Policy', description: 'Our policy on returns and refunds', category: 'Page', url: '/refund-and-return-policy' },
    ];

    const matchedPages = sitePages.filter((p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));

    const matchedProducts = products
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
      .map((p) => ({ ...p, url: `/product/${p.id}` }));

    return [...matchedPages, ...matchedProducts].slice(0, 5); // Limit the dropdown to 5 results to keep it clean
  }, [searchQuery, products]);

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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-earth-dark/10 bg-white/60 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-earth-deep to-earth-sage text-sm font-black text-white">
                PQ
              </div>
              {/* Hide the logo text on small screens so the expanded search bar has room to breathe */}
              <div className="hidden sm:block">
                <div className="text-sm font-semibold tracking-[0.24em] text-earth-deep">PAY QIST</div>
                <div className="text-xs text-earth-dark/70">Installments made simple</div>
              </div>
            </Link>

            {/* Expandable Search Component */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                type="button"
                className="rounded-full p-2 text-earth-dark/70 hover:bg-earth-deep/10 hover:text-earth-deep focus:outline-none focus:ring-2 focus:ring-earth-deep transition"
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
                  type="text"
                  className="w-full rounded-full border border-earth-dark/10 bg-white/50 px-4 py-1.5 text-sm text-earth-dark placeholder-earth-dark/50 focus:border-earth-deep/50 focus:outline-none focus:ring-1 focus:ring-earth-deep/50"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchExpanded && searchQuery.trim() && (
                <div className="absolute top-full left-0 mt-4 w-[280px] sm:w-[320px] overflow-hidden rounded-2xl border border-earth-dark/10 bg-white/90 shadow-xl backdrop-blur-xl">
                  {searchResults.length > 0 ? (
                    <div className="flex max-h-[300px] flex-col overflow-y-auto p-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-black/5 transition"
                          onClick={() => {
                            navigate(result.url);
                            setIsSearchExpanded(false);
                            setSearchQuery('');
                          }}
                        >
                          {result.imageUrl ? (
                            <img src={result.imageUrl} alt={result.title} className="h-10 w-10 shrink-0 rounded-lg object-cover border border-earth-dark/10" />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-earth-dark/10 bg-white/50 text-earth-deep">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-earth-dark">{result.title}</div>
                            <div className="truncate text-xs text-earth-dark/70">{result.category || 'General'}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-earth-dark/70">
                      No results found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass} end>
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
                  <div className="text-sm font-semibold text-earth-dark">{user.name}</div>
                  <div className="text-xs text-earth-dark/70">{user.role}</div>
                </div>
                <button className="button-secondary px-4 py-2" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="button-secondary px-4 py-2" to="/login">
                  Login
                </Link>
                <Link className="button-primary px-4 py-2" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
            
            <div ref={menuRef} className="relative inline-block">
              <button 
                type="button" 
                className="ml-2 inline-flex items-center justify-center rounded-lg p-2 text-earth-dark/70 hover:bg-earth-deep/10 hover:text-earth-deep focus:outline-none focus:ring-2 focus:ring-earth-deep transition" 
                aria-label="Open main menu"
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {isMenuExpanded && (
                <div className="absolute right-0 top-full mt-4 w-48 overflow-hidden rounded-2xl border border-earth-dark/10 bg-white/90 p-2 shadow-xl backdrop-blur-xl">
                  <nav className="flex flex-col gap-1">
                    <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuExpanded(false)} end>Home</NavLink>
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