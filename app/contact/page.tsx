export const metadata = {
  title: "Contact Us — Radio Agakiza",
};

const contactMethods = [
  {
    title: "Email",
    value: "info@radioagakiza.com",
    href: "mailto:info@radioagakiza.com",
    icon: "📧",
  },
  {
    title: "Telephone",
    value: "+257 77 545 151",
    href: "tel:+25777545151",
    icon: "📱",
  },
  {
    title: "Address",
    value: "P.O. Box 1710, Bujumbura, Burundi",
    href: "https://maps.google.com/?q=Bujumbura+Burundi",
    icon: "📍",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/40 via-white to-accent-50/20">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,182,64,0.2),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_80%,rgba(120,182,64,0.18),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
            ✨ Let&apos;s stay connected
          </p>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
            We are happy to hear from you! Reach us for prayer requests, partnership,
            program details, or any question about Radio Agakiza.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          {contactMethods.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group block rounded-2xl bg-white/90 p-5 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
              target={item.title === "Address" ? "_blank" : undefined}
              rel={item.title === "Address" ? "noreferrer" : undefined}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-2xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">{item.title}</p>
                  <p className="mt-1 text-brand-900 group-hover:text-accent-600">{item.value}</p>
                </div>
              </div>
            </a>
          ))}

          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white shadow-xl shadow-brand-900/20">
            <h2 className="text-xl font-semibold">Office Hours</h2>
            <p className="mt-3 text-white/90">Monday - Friday: 08:00 - 17:00</p>
            <p className="text-white/90">Saturday: 09:00 - 13:00</p>
            <p className="mt-4 text-sm text-accent-100">Sunday services and live broadcasts are available online all day.</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 lg:col-span-3 sm:p-8">
          <h2 className="text-2xl font-bold text-brand-900">Send us a message</h2>
          <p className="mt-2 text-brand-700">Fill this form and our team will get back to you shortly.</p>

          <form className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-700">Full Name</span>
              <input type="text" placeholder="Your name" className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-brand-700">Email Address</span>
              <input type="email" placeholder="you@example.com" className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200" />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-700">Subject</span>
              <input type="text" placeholder="How can we help you?" className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200" />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-brand-700">Message</span>
              <textarea rows={5} placeholder="Write your message..." className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-200" />
            </label>
            <button type="submit" className="sm:col-span-2 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-3 font-semibold text-white transition hover:from-brand-600 hover:to-brand-500">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-900">Find us on the map</h2>
            <a
              href="https://maps.google.com/?q=Bujumbura+Burundi"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-brand-100">
            <iframe
              title="Radio Agakiza location map"
              src="https://www.google.com/maps?q=Bujumbura%2CBurundi&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
