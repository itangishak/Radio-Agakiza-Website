export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.1),transparent_50%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.08),transparent_50%)] opacity-40" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Radio Agakiza" className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
                  RADIO AGAKIZA
                </h3>
                <p className="text-sm text-white/70">Kw'isoko y'ukuri</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed max-w-md">
              Radio Agakiza n'iradiyo ifise intumbero y'ugukwiza ubutumwa bw'abamarayika batatu kubaba kw' isi yose.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                aria-label="Facebook" 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-accent-500 hover:scale-110"
              >
                <span className="text-sm font-semibold group-hover:text-white">Fb</span>
              </a>
              <a 
                href="#" 
                aria-label="YouTube" 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-red-500 hover:scale-110"
              >
                <span className="text-sm font-semibold group-hover:text-white">YT</span>
              </a>
              <a 
                href="#" 
                aria-label="Twitter" 
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-blue-500 hover:scale-110"
              >
                <span className="text-sm font-semibold group-hover:text-white">X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent-300">VUMUBURA</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-white/80 hover:text-accent-300 transition-colors">Iyakiriro</a>
              <a href="/programs" className="block text-white/80 hover:text-accent-300 transition-colors">Gahunda</a>
              <a href="/podcasts" className="block text-white/80 hover:text-accent-300 transition-colors">Ibiganiro</a>
              <a href="/news" className="block text-white/80 hover:text-accent-300 transition-colors">Ivyanditswe</a>
              <a href="/about" className="block text-white/80 hover:text-accent-300 transition-colors">Turi Bande</a>
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
              © {year} Radio Agakiza. Uburenganzira bwose kubiri k'uru rubuga ni bwa Radio Agakiza.
            </p>
            <div className="flex gap-6 text-sm text-white/70">
              <a href="#" className="hover:text-accent-300 transition-colors">Amategeko</a>
              <a href="#" className="hover:text-accent-300 transition-colors">Uko dukingira</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
