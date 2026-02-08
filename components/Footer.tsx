const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    hoverClass: "hover:border-blue-300/60 hover:bg-blue-500/20 hover:text-blue-100",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.28 10.44 22v-7.03H7.9v-2.9h2.54V9.84c0-2.52 1.5-3.92 3.8-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.77l-.44 2.9h-2.33V22C18.34 21.28 22 17.1 22 12.07Z" />
      </svg>
    )
  },
  {
    name: "YouTube",
    href: "#",
    hoverClass: "hover:border-red-300/60 hover:bg-red-500/20 hover:text-red-100",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.51 3.5 12 3.5 12 3.5s-7.5 0-9.38.57A3.01 3.01 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13c1.88.57 9.38.57 9.38.57s7.5 0 9.38-.57a3.01 3.01 0 0 0 2.12-2.13A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z" />
      </svg>
    )
  },
  {
    name: "X (Twitter)",
    href: "#",
    hoverClass: "hover:border-slate-300/60 hover:bg-slate-500/20 hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M18.9 2H22l-6.77 7.73L23 22h-6.1l-4.78-6.26L6.64 22H3.52l7.25-8.29L1 2h6.25l4.32 5.68L18.9 2Zm-1.07 18h1.69L6.33 3.9H4.5L17.83 20Z" />
      </svg>
    )
  }
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.1),transparent_50%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.08),transparent_50%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-8 py-12 md:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Radio Agakiza" className="h-12 w-12" />
              <div>
                <h3 className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-xl font-bold text-transparent">
                  RADIO AGAKIZA
                </h3>
                <p className="text-sm text-white/70">Kw&apos;isoko y&apos;ukuri</p>
              </div>
            </div>
            <p className="max-w-md leading-relaxed text-white/80">
              Radio Agakiza n&apos;iradiyo ifise intumbero y&apos;ugukwiza ubutumwa bw&apos;abamarayika batatu kubaba kw&apos; isi yose.
            </p>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-accent-200/90">Dukurikire ku mbuga ngurukanabumenyi</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className={`group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.45)] ${social.hoverClass}`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition group-hover:bg-white/20">
                      {social.icon}
                    </span>
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent-300">VUMUBURA</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-white/80 transition-colors hover:text-accent-300">Iyakiriro</a>
              <a href="/programs" className="block text-white/80 transition-colors hover:text-accent-300">Gahunda</a>
              <a href="/podcasts" className="block text-white/80 transition-colors hover:text-accent-300">Ibiganiro</a>
              <a href="/news" className="block text-white/80 transition-colors hover:text-accent-300">Ivyanditswe</a>
              <a href="/about" className="block text-white/80 transition-colors hover:text-accent-300">Turi Bande</a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent-300">TURONDERE</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-accent-400">📧</span>
                <span className="text-sm">info@radioagakiza.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-400">📱</span>
                <span className="text-sm">+257 77545151</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-400">📍</span>
                <span className="text-sm">P.O. Box 1710, Bujumbura, Burundi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/70">
              © {year} Radio Agakiza. Uburenganzira bwose kubiri k&apos;uru rubuga ni bwa Radio Agakiza.
            </p>
            <div className="flex gap-6 text-sm text-white/70">
              <a href="#" className="transition-colors hover:text-accent-300">Amategeko</a>
              <a href="#" className="transition-colors hover:text-accent-300">Uko dukingira</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
