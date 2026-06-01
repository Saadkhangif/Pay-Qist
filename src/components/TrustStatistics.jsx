export default function TrustStatistics() {
  return (
    <section className="border-y border-slate-200/60 bg-white/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50">
          <div className="text-center px-4">
            <div className="text-3xl font-black text-[#0F9D58]">10,000+</div>
            <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Happy Customers</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-black text-[#0F9D58]">500+</div>
            <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Premium Products</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-black text-[#0F9D58]">98%</div>
            <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Approval Rate</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-black text-[#0F9D58]">24/7</div>
            <div className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}