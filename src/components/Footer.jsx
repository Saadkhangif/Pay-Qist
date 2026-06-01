import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F9D58] to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
                Q
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Pay <span className="text-[#0F9D58]">Qist</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
              Empowering your lifestyle with flexible, transparent, and instant installment plans. Shop smart, pay easy.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">f</div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">t</div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0F9D58] hover:text-white transition cursor-pointer">in</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Products</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Smartphones</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Laptops</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Appliances</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Gaming</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Store Locator</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Terms & Conditions</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Return Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#0F9D58] transition">Installment Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Pay Qist. All rights reserved.</p>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-slate-100 text-xs font-bold text-slate-400 rounded">VISA</div>
            <div className="px-3 py-1 bg-slate-100 text-xs font-bold text-slate-400 rounded">MASTERCARD</div>
          </div>
        </div>
      </div>
    </footer>
  );
}