export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass rounded-[32px] p-8 sm:p-12 text-earth-cream space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Contact Us</h1>
          <p className="mt-3 text-sm text-earth-cream/70">
            We'd love to hear from you. Fill out the form below and our support team will get back to you within 24 hours.
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Name</label>
            <input className="input" type="text" placeholder="Your name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Email</label>
            <input className="input" type="email" placeholder="Your email address" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-cream/70 mb-1">Message</label>
            <textarea className="input min-h-[120px] py-3" placeholder="How can we help?" required></textarea>
          </div>
          <button type="submit" className="button-primary w-full mt-4">Send Message</button>
        </form>
      </div>
    </div>
  );
}