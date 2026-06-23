import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_MAPS_EMBED_URL,
  CONTACT_MAPS_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '../lib/contact';
import { getFooterQuickLinks } from '../lib/navigation';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

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
  const { user } = useAuth();
  const footerLinks = getFooterQuickLinks({ user });

  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-900 text-slate-300 dark:border-t dark:border-emerald-500/10 dark:bg-[#050809]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-emerald-500/5" />
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <Logo to="/home" size="lg" surface="dark" />
            <p className="text-sm font-semibold text-brand-400">پیسے بعد میں</p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Shop today, pay in easy monthly installments. Zero hidden fees, instant approval, and
            premium products delivered to your door.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-glow-brand"
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

        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <nav className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-brand-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-3 pt-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-brand-400"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-brand-400"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={CONTACT_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-slate-400 transition hover:text-brand-400"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{CONTACT_ADDRESS}</span>
            </a>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Find Us on Maps</h3>
            <a
              href={CONTACT_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 transition hover:text-brand-300"
            >
              Open in Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="h-44 overflow-hidden rounded-2xl border border-slate-700 shadow-lg">
            <iframe
              title="Pay Qist office location"
              src={CONTACT_MAPS_EMBED_URL}
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

      <div className="relative border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-sm text-slate-500 sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/privacy-policy" className="font-medium transition hover:text-brand-400">
              Privacy
            </Link>
            <Link to="/terms-of-service" className="font-medium transition hover:text-brand-400">
              Terms
            </Link>
            <Link to="/refund-and-return-policy" className="font-medium transition hover:text-brand-400">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
