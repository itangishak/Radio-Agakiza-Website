export const metadata = {
  title: "About — Radio Agakiza",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.15),transparent_50%)]" />
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-accent-400/30 blur-lg animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 text-6xl">📻</div>
          <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Turi
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Bande
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            Menye Radio Agakiza n'umurimo wacu wo gutangaza Icizere
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent mb-4">
                Umurimo Wacu
              </h2>
              <div className="text-4xl mb-4">✨</div>
            </div>
            <div className="prose prose-lg max-w-none text-brand-800">
              <p className="text-xl leading-relaxed text-center">
                Radio Agakiza ni radiyo y'Abakristo itangaza Ubutumwa Bwiza bw'Icizere. 
                Dutanga ibiganiro by'agaciro, amakuru, n'ivyemezo vyiza vyotangaza ukwizera no kwihangana.
              </p>
            </div>
          </div>
        </section>

        {/* Director Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-accent-500/10 via-brand-500/5 to-accent-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent mb-4">
                Umuyobozi Wacu
              </h2>
              <div className="text-4xl mb-4">👨‍💼</div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 items-center">
              {/* Director Image */}
              <div className="relative">
                <div className="relative mx-auto w-64 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/20 ring-4 ring-white">
                  {/* Placeholder for Director's image */}
                  <div className="w-full h-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl text-brand-400 mb-2">👤</div>
                      <p className="text-sm text-brand-600 font-medium">Ifoto y'Umuyobozi</p>
                      <p className="text-xs text-brand-500">(Izongera gushyirwa)</p>
                    </div>
                  </div>
                  {/* When you have the image, replace the div above with: */}
                  {/* <img src="/director-photo.jpg" alt="Umuyobozi wa Radio Agakiza" className="w-full h-full object-cover" /> */}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-50" />
              </div>
              
              {/* Director Info */}
              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                  <h3 className="text-2xl font-bold text-brand-900 mb-2">
                    [Izina ry'Umuyobozi]
                  </h3>
                  <p className="text-brand-600 font-medium mb-4">Umuyobozi wa Radio Agakiza</p>
                  <p className="text-brand-800 leading-relaxed">
                    [Aha hazoshyirwa amakuru y'umuyobozi, ubunararibonye bwe, 
                    n'uburyo yatangiye gukora muri Radio Agakiza. Amakuru menshi 
                    azongera gushyirwa nyuma.]
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="text-2xl text-accent-500 mb-2">📧</div>
                    <p className="text-sm text-brand-600">Email</p>
                    <p className="text-xs text-brand-500">[Email y'umuyobozi]</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="text-2xl text-accent-500 mb-2">📱</div>
                    <p className="text-sm text-brand-600">Telefoni</p>
                    <p className="text-xs text-brand-500">[Nimero ya telefoni]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative text-center">
              <div className="text-4xl mb-4">🙏</div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">Icizere</h3>
              <p className="text-brand-700 leading-relaxed">
                Dutangaza Ubutumwa Bwiza bw'Icizere kandi dushigikira abumva mu kwizera kwabo.
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-brand-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">Urukundo</h3>
              <p className="text-brand-700 leading-relaxed">
                Dutanga ibiganiro bishingiye ku rukundo rw'Imana n'urw'abo turi kumwe.
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">Ivyizigiro</h3>
              <p className="text-brand-700 leading-relaxed">
                Dutanga ivyizigiro ku mitima myinshi kandi dushigikira abafite ibibazo.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent mb-4">
                Duhamagare
              </h2>
              <div className="text-4xl mb-4">📞</div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📧</div>
                <h3 className="font-semibold text-brand-900 mb-2">Email</h3>
                <a href="mailto:info@radioagakiza.com" className="text-brand-600 hover:text-accent-600 transition-colors">
                  info@radioagakiza.com
                </a>
              </div>
              
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📱</div>
                <h3 className="font-semibold text-brand-900 mb-2">Telefoni</h3>
                <p className="text-brand-600">+257 XX XXX XXX</p>
              </div>
              
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📍</div>
                <h3 className="font-semibold text-brand-900 mb-2">Aho duba</h3>
                <p className="text-brand-600">Bujumbura, Burundi</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
