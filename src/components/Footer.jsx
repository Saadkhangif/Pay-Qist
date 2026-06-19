import { Link } from 'react-router-dom';
import Logo from './Logo';

const footerLinks = [
  { label: 'Products', to: '/products' },
  { label: 'How It Works', to: '/home#how-it-works' },
  { label: 'FAQ', to: '/home#faq' },
  { label: 'Contact', to: 'mailto:support@payqist.com' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: <path d="M4 4l16 16M4 20L20 4" />,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.42-5.58zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <Logo to="/home" size="md" />
          <p className="max-w-xs text-sm text-slate-500">
            Shop today, pay in easy monthly installments. Zero hidden fees.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill={social.name === 'YouTube' ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Quick Links</h3>
          <nav className="flex flex-col gap-2">
            {footerLinks.map((link) =>
              link.to.startsWith('mailto:') ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#0F9D58]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#0F9D58]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">support@payqist.com</span>
            <br />
            +92 300 1234567
          </p>
        </div>

        <div className="space-y-3 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Find Us</h3>
          <p className="text-sm text-slate-500">Islamabad, Pakistan</p>
          <div className="h-40 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <iframe
              title="Pay Qist location"
              src="https://maps.google.com/maps?q=Islamabad,Pakistan&hl=en&z=12&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="font-medium hover:text-[#0F9D58]">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="font-medium hover:text-[#0F9D58]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
