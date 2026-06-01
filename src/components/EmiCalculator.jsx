import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function EmiCalculator() {
  // EMI Calculator State
  const [calcPrice, setCalcPrice] = useState(150000);
  const [calcDown, setCalcDown] = useState(45000);
  const [calcMonths, setCalcMonths] = useState(6);
  const calcMonthly = Math.max(0, (calcPrice - calcDown) / calcMonths);

  return (
    <section id="calculator" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-white transform-gpu">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0F9D58]/40 to-transparent opacity-30 rounded-full pointer-events-none transform-gpu"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">EMI Calculator</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Plan your purchase. Adjust the sliders to find an installment plan that perfectly fits your monthly budget.
              </p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Product Price (Rs.)</label>
                    <span className="font-bold text-[#0F9D58]">{calcPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0F9D58]" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Down Payment (Rs.)</label>
                    <span className="font-bold text-[#0F9D58]">{calcDown.toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max={calcPrice} step="5000" value={calcDown} onChange={(e) => setCalcDown(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0F9D58]" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Duration (Months)</label>
                  <div className="flex gap-4">
                    {[3, 6, 12].map((m) => (
                      <button key={m} onClick={() => setCalcMonths(m)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${calcMonths === m ? 'bg-[#0F9D58] text-white shadow-lg shadow-[#0F9D58]/30 border border-[#0F9D58]' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}>
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 transform-gpu">
              <h3 className="text-lg font-medium text-slate-300 mb-6 text-center">Your Estimated Plan</h3>
              <div className="text-center mb-8">
                <div className="text-5xl font-black text-white mb-2">Rs. {Math.ceil(calcMonthly).toLocaleString()}</div>
                <div className="text-sm font-medium text-[#0F9D58] uppercase tracking-widest">Per Month</div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="font-semibold text-white">Rs. {calcPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Upfront Payment:</span>
                  <span className="font-semibold text-white">Rs. {calcDown.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Financed Amount:</span>
                  <span className="font-semibold text-white">Rs. {Math.max(0, calcPrice - calcDown).toLocaleString()}</span>
                </div>
              </div>
              <Link to="/" className="mt-8 block w-full text-center py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-lg">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}