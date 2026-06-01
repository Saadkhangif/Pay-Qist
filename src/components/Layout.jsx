import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'text-earth-gold bg-earth-gold/10 border border-earth-gold/20 shadow-[0_0_15px_rgba(194,166,90,0.15)]' : 'border border-transparent text-earth-cream hover:bg-white/10 hover:text-white',
  ].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useStore();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-earth-dark/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-earth-gold to-earth-sage text-sm font-black text-earth-dark">
              PQ
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.24em] text-earth-gold">PAY QIST</div>
              <div className="text-xs text-earth-cream/70">Installments made simple</div>
            </div>
          </Link>

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
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-earth-cream/70">{user.role}</div>
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
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-white/10 bg-earth-dark/50 py-10 text-sm text-earth-cream/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link to="/" className="mb-4 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-earth-gold to-earth-sage text-xs font-black text-earth-dark">
                  PQ
                </div>
                <div className="text-sm font-semibold tracking-[0.24em] text-earth-gold">PAY QIST</div>
              </Link>
              <p className="max-w-xs text-earth-cream/70">
                Installments made simple. Buy your favorite products now and pay later with easy, flexible plans.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/products" className="hover:text-earth-gold transition">Shop</Link></li>
                <li><Link to="/cart" className="hover:text-earth-gold transition">Cart</Link></li>
                <li><Link to="/login" className="hover:text-earth-gold transition">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-earth-gold transition">Create Account</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="hover:text-earth-gold transition">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-earth-gold transition">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-earth-gold transition">Cookie Policy</a></li>
                <li><Link to="/contact-us" className="hover:text-earth-gold transition">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-white">Find Us</h3>
              <div className="h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-earth-deep opacity-80 transition hover:opacity-100">
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
          
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
            <div className="flex items-center gap-6 text-earth-cream/70">
              <a href="#" className="hover:text-earth-gold transition">Twitter</a>
              <a href="#" className="hover:text-earth-gold transition">Instagram</a>
              <a href="#" className="hover:text-earth-gold transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}