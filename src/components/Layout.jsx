import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

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

      <footer className="mt-auto border-t border-earth-dark/10 bg-white/40 py-10 text-sm text-earth-dark/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link to="/" className="mb-4 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-earth-deep to-earth-sage text-xs font-black text-white">
                  PQ
                </div>
                <div className="text-sm font-semibold tracking-[0.24em] text-earth-deep">PAY QIST</div>
              </Link>
              <p className="max-w-xs text-earth-dark/80">
                Installments made simple. Buy your favorite products now and pay later with easy, flexible plans.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-earth-dark">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/products" className="hover:text-earth-deep transition">Shop</Link></li>
                <li><Link to="/cart" className="hover:text-earth-deep transition">Cart</Link></li>
                <li><Link to="/login" className="hover:text-earth-deep transition">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-earth-deep transition">Create Account</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-earth-dark">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="hover:text-earth-deep transition">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-earth-deep transition">Terms of Service</Link></li>
                <li><Link to="/refund-and-return-policy" className="hover:text-earth-deep transition">Refund & Return</Link></li>
                <li><a href="#" className="hover:text-earth-deep transition">Cookie Policy</a></li>
                <li><Link to="/contact-us" className="hover:text-earth-deep transition">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-earth-dark">Find Us</h3>
              <div className="h-32 w-full overflow-hidden rounded-xl border border-earth-dark/10 bg-white/50 opacity-80 transition hover:opacity-100">
                <iframe
                  title="Shop Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.551513222476!2d74.34114401514936!3d31.520369581369324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045b34005b63%3A0x62957e84931a2936!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1628148816401!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-earth-dark/10 pt-8 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
            <div className="flex items-center gap-6 text-earth-dark/80">
              <a href="#" className="hover:text-earth-deep transition" aria-label="Twitter">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="hover:text-earth-deep transition" aria-label="Instagram">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/></svg>
              </a>
              <a href="#" className="hover:text-earth-deep transition" aria-label="GitHub">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}