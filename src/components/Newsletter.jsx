export default function Newsletter() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0F9D58] to-emerald-700 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-[#0F9D58]/20">
          <h2 className="text-3xl font-bold text-white mb-4">Never Miss a Deal</h2>
          <p className="text-emerald-100 mb-8 max-w-lg mx-auto">Subscribe to our newsletter to get updates on new products, exclusive 0% markup deals, and promotions.</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />
            <button type="submit" className="px-8 py-4 rounded-full bg-white text-[#0F9D58] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}