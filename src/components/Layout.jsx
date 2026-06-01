import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white',
  ].join(' ');

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useStore();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-black text-slate-950">
              PQ
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.24em] text-cyan-300">PAY QIST</div>
              <div className="text-xs text-slate-400">Installments made simple</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
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
                  <div className="text-xs text-slate-400">{user.role}</div>
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

      <main>{children}</main>
    </div>
  );
}