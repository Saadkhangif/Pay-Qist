import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const linkColumns = [
    {
      title: 'Shop',
      links: ['Smartphones', 'Laptops', 'Home Appliances', 'Gaming', 'Electronics', 'Featured Products', 'New Arrivals']
    },
    {
      title: 'Support',
      links: ['Help Center', 'FAQs', 'Track Application', 'Contact Us', 'Live Chat', 'Payment Assistance', 'Installment Guide']
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Blog', 'Press', 'Partner With Us', 'Affiliate Program']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy', 'Security Policy']
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
    { name: 'Instagram', icon: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M6.5 2h11A4.5 4.5 0 0 1 22 6.5v11a4.5 4.5 0 0 1-4.5 4.5h-11A4.5 4.5 0 0 1 2 17.5v-11A4.5 4.5 0 0 1 6.5 2z" /> },
    { name: 'X', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16M4 20L20 4" /> },
    { name: 'LinkedIn', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /> },
    { name: 'YouTube', icon: <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.42-5.58zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" /> },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 overflow-hidden mt-auto">
      
      {/* PRE-FOOTER CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#0F9D58] rounded-3xl p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl shadow-[#0F9D58]/20 text-white">
          {/* Abstract floating shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none transform-gpu"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-48 h-48 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none transform-gpu"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-extrabold mb-1 tracking-tight">Ready to Shop Smarter?</h2>
            <p className="text-emerald-50 text-base leading-relaxed">
              Get your favorite products today and pay conveniently in monthly installments. Fast approval, zero hidden fees.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <Link to="/products" className="px-5 py-2.5 bg-white text-[#0F9D58] rounded-xl font-bold text-center transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-white/10">
              Browse Products
            </Link>
            <a href="/#calculator" className="px-5 py-2.5 bg-emerald-800/40 text-white border border-emerald-700/50 rounded-xl font-bold text-center transition-all duration-200 hover:bg-emerald-800 hover:-translate-y-1 shadow-lg backdrop-blur-sm">
              Calculate Installment
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NEWSLETTER & APP DOWNLOAD ROW */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Get Exclusive Deals</h3>
            <p className="text-slate-500 mb-4 text-sm">Receive product launches, discounts, and installment offers directly to your inbox.</p>
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 outline-none focus:border-[#0F9D58] focus:ring-2 focus:ring-[#0F9D58]/20 transition-all shadow-sm text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#0F9D58] text-white px-4 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#0F9D58]/20 flex items-center justify-center min-w-[100px]"
              >
                {subscribed ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Done
                  </span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>

          {/* App Download */}
          <div className="lg:pl-12 lg:border-l border-slate-100 flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-between">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Download Our App</h3>
              <p className="text-slate-500 mb-4 text-sm">Manage your installments on the go.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* App Store Button */}
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:-translate-y-1 transition-transform duration-200 shadow-lg group">
                  <svg className="w-5 h-5 group-hover:text-[#0F9D58] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.365 14.542c0-1.84.441-3.13 1.258-3.87 1.056-.96 2.502-1.25 4.383-1.12-1.077-1.57-2.613-2.35-4.613-2.35-1.921 0-3.376.62-4.364 1.87-1.134 1.4-2.642 1.34-4.524 1.34-1.882 0-3.39.06-4.524-1.34C2.993 7.822 1.538 7.202-.383 7.202c-2.001 0-3.537.78-4.614 2.35 1.882-.13 3.328.16 4.383 1.12.818.74 1.259 2.03 1.259 3.87 0 2.23-.74 3.73-2.222 4.51C-.238 20.312 1.4 22.022 3.1 22.022c1.7 0 2.652-.89 4.882-.89 2.23 0 3.181.89 4.882.89 1.7 0 3.337-1.71 4.723-2.97-1.482-.78-2.222-2.28-2.222-4.51zm-7.643-7.55c0-1.63 1.29-3.2 2.92-3.83 1.63-.63 3.4-.41 4.54.85 1.14 1.26 1.41 3.01.62 4.56-.79 1.55-2.52 2.58-4.15 2.58-1.63 0-3.04-1.03-3.93-4.16z" transform="translate(4, -1)" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-slate-400 font-medium">Download on the</div>
                    <div className="text-sm font-bold leading-tight mt-0.5">App Store</div>
                  </div>
                </button>
                {/* Google Play Button */}
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:-translate-y-1 transition-transform duration-200 shadow-lg group">
                  <svg className="w-5 h-5 group-hover:text-[#0F9D58] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.34 0 .67.11.94.32l13.06 9.8c.67.5.8 1.44.3 2.11-.13.18-.3.32-.49.42l-13.06 7.35C4.85 22.22 4 21.84 4 21.03c0-.18.04-.36.11-.53z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-slate-400 font-medium">GET IT ON</div>
                    <div className="text-sm font-bold leading-tight mt-0.5">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            {/* Minimal Mobile Mockup UI */}
            <div className="relative w-28 h-40 hidden sm:block shrink-0 transform-gpu group cursor-default">
              <div className="absolute inset-0 bg-slate-900 rounded-[2rem] border-4 border-slate-200 shadow-xl overflow-hidden flex flex-col group-hover:-translate-y-2 transition-transform duration-500">
                 <div className="h-4 bg-slate-800 w-full flex justify-center pt-1.5">
                   <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
                 </div>
                 <div className="flex-1 bg-gradient-to-br from-[#0F9D58] to-emerald-800 p-2 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-2xl text-[#0F9D58] shadow-lg relative z-10">Q</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-COLUMN FOOTER NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-[2fr_1fr_1fr_1fr_1fr_2fr] gap-8 lg:gap-6 mb-16">
          
          {/* Col 1: Branding */}
          <div className="space-y-6 lg:pr-8">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F9D58] to-emerald-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                Q
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Pay <span className="text-[#0F9D58]">Qist</span></span>
            </Link>
            <p className="text-[#0F9D58] font-bold text-sm uppercase tracking-wider">Buy Now, Pay Later.</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Pakistan's trusted installment marketplace helping customers purchase products with flexible payment plans.
            </p>
            <div className="space-y-2.5 pt-2">
              {['Secure Payments', 'Verified Products', 'Easy Installments', 'Customer Protection'].map((badge) => (
                <div key={badge} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#0F9D58] flex items-center justify-center text-[10px] border border-emerald-100">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns (Cols 2-5) */}
          {linkColumns.map((col, idx) => (
            <div key={col.title} className="border-b border-slate-100 lg:border-none pb-2 lg:pb-0">
              <button
                className="w-full flex justify-between items-center lg:cursor-auto group focus:outline-none"
                onClick={() => toggleSection(idx)}
              >
                <h4 className="font-bold text-slate-900">{col.title}</h4>
                <span className={`lg:hidden text-slate-400 transition-transform duration-300 ${openSection === idx ? 'rotate-180 text-[#0F9D58]' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </span>
              </button>
              <ul className={`mt-2.5 space-y-2 overflow-hidden transition-all duration-300 lg:h-auto lg:opacity-100 ${openSection === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-full'}`}>
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition-all duration-200 hover:translate-x-1.5 inline-block font-medium">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 6: Contact Info */}
          <div className="space-y-3 lg:pl-4">
            <h4 className="font-bold text-slate-900">Get In Touch</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <span className="text-[#0F9D58] mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></span>
                <span>Islamabad, Pakistan</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <span className="text-[#0F9D58] mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.09-7.074-7.07l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg></span>
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <span className="text-[#0F9D58] mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></span>
                <span>support@payqist.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <span className="text-[#0F9D58] mt-0.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                <span>Mon-Sat<br />9:00 AM - 6:00 PM</span>
              </li>
            </ul>
            {/* Google Map */}
            <div className="w-full h-16 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 shadow-sm">
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
        
        {/* TRUST & PAYMENT ROW */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 border-y border-slate-100">
          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Trust & Security</span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {['SSL Secured', '256-bit Encryption', 'Verified Business', 'Protected Transactions'].map((badge) => (
                <span key={badge} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100/50 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">100% Secure Payments</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Visa', 'Mastercard', 'UnionPay', 'Easypaisa', 'JazzCash', 'Bank Transfer'].map((pay) => (
                <div key={pay} className="h-9 px-3.5 bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-600 hover:border-[#0F9D58] hover:text-[#0F9D58] transition-colors cursor-default">
                  {pay}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR & SOCIAL MEDIA */}
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} Pay Qist. All Rights Reserved.</p>
          
          <div className="text-sm text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            Made with <span className="text-rose-500 animate-pulse text-lg">❤️</span> in Pakistan
          </div>

          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm font-semibold text-slate-500 hover:text-[#0F9D58] transition-colors duration-200">Privacy</Link>
            <span className="text-slate-300">•</span>
            <Link to="#" className="text-sm font-semibold text-slate-500 hover:text-[#0F9D58] transition-colors duration-200">Terms</Link>
            <span className="text-slate-300">•</span>
            <Link to="#" className="text-sm font-semibold text-slate-500 hover:text-[#0F9D58] transition-colors duration-200">Sitemap</Link>
          </div>
        </div>

        {/* SOCIAL ICONS */}
        <div className="pb-4 flex justify-center gap-4">
          {socialLinks.map((social) => (
            <a 
              key={social.name} 
              href="#" 
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-[#0F9D58] hover:text-white hover:border-[#0F9D58] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(15,157,88,0.4)]" 
              aria-label={social.name}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}