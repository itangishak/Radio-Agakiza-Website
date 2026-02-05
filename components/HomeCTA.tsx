export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.3),transparent_50%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.2),transparent_50%)] opacity-40" />
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-accent-400/30 blur-lg animate-pulse" style={{animationDelay: '1s'}} />
      
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
                Dushigikire
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                Umurimo
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/90 leading-relaxed">
              Twifatanye mu gutangaza Icizere. Ubutumwa bwiza burakenewe ku mitima myinshi.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a 
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-accent-500/30 transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-accent-500/40" 
              href="/about"
            >
              Turi bande
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a 
              className="group inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50" 
              href="#contact"
            >
              Dutume
              <span className="transition-transform group-hover:translate-x-1">✉</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
