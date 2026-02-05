import { apiGet } from "../../lib/api";

export const metadata = {
  title: "About — Radio Agakiza",
};

type AboutSettings = {
  hero?: { title_top?: string; title_bottom?: string; subtitle?: string; emoji?: string };
  mission?: { title?: string; body?: string; icon?: string };
  director?: {
    name?: string;
    title?: string;
    bio?: string;
    email?: string;
    phone?: string;
    image_url?: string;
    image_alt?: string;
  };
  values?: { title?: string; description?: string; icon?: string }[];
  contact?: { title?: string; email?: string; phone?: string; address?: string; icon?: string };
};

const fallbackContent: Required<AboutSettings> = {
  hero: {
    title_top: "Turi",
    title_bottom: "Bande",
    subtitle: "Menye Radio Agakiza n'umurimo wacu wo gutangaza Icizere",
    emoji: "📻",
  },
  mission: {
    title: "Umurimo Wacu",
    body:
      "Radio Agakiza ni radiyo y'Abakristo itangaza Ubutumwa Bwiza bw'Icizere. " +
      "Dutanga ibiganiro by'agaciro, amakuru, n'ivyemezo vyiza vyotangaza ukwizera no kwihangana.",
    icon: "✨",
  },
  director: {
    name: "[Izina ry'Umuyobozi]",
    title: "Umuyobozi wa Radio Agakiza",
    bio:
      "[Aha hazoshyirwa amakuru y'umuyobozi, ubunararibonye bwe, " +
      "n'uburyo yatangiye gukora muri Radio Agakiza. Amakuru menshi " +
      "azongera gushyirwa nyuma.]",
    email: "[Email y'umuyobozi]",
    phone: "[Nimero ya telefoni]",
    image_url: "",
    image_alt: "Umuyobozi wa Radio Agakiza",
  },
  values: [
    {
      title: "Icizere",
      description:
        "Dutangaza Ubutumwa Bwiza bw'Icizere kandi dushigikira abumva mu kwizera kwabo.",
      icon: "🙏",
    },
    {
      title: "Urukundo",
      description: "Dutanga ibiganiro bishingiye ku rukundo rw'Imana n'urw'abo turi kumwe.",
      icon: "❤️",
    },
    {
      title: "Ivyizigiro",
      description:
        "Dutanga ivyizigiro ku mitima myinshi kandi dushigikira abafite ibibazo.",
      icon: "🌟",
    },
  ],
  contact: {
    title: "Duhamagare",
    email: "info@radioagakiza.com",
    phone: "+257 XX XXX XXX",
    address: "Bujumbura, Burundi",
    icon: "📞",
  },
};

function parseAboutSettings(value?: string | null): Required<AboutSettings> {
  if (!value) return fallbackContent;
  try {
    const parsed = JSON.parse(value) as AboutSettings;
    return {
      hero: { ...fallbackContent.hero, ...parsed.hero },
      mission: { ...fallbackContent.mission, ...parsed.mission },
      director: { ...fallbackContent.director, ...parsed.director },
      values: Array.isArray(parsed.values) && parsed.values.length > 0 ? parsed.values : fallbackContent.values,
      contact: { ...fallbackContent.contact, ...parsed.contact },
    };
  } catch {
    return fallbackContent;
  }
}

export default async function AboutPage() {
  const settings = await apiGet<{ value: string }>("/settings/about.page");
  const content = parseAboutSettings(settings?.value);
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
          <div className="mb-6 text-6xl">{content.hero.emoji}</div>
          <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              {content.hero.title_top}
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              {content.hero.title_bottom}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            {content.hero.subtitle}
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
                {content.mission.title}
              </h2>
              <div className="text-4xl mb-4">{content.mission.icon}</div>
            </div>
            <div className="prose prose-lg max-w-none text-brand-800">
              <p className="text-xl leading-relaxed text-center">
                {content.mission.body}
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
                  {content.director.image_url ? (
                    <img
                      src={content.director.image_url}
                      alt={content.director.image_alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl text-brand-400 mb-2">👤</div>
                        <p className="text-sm text-brand-600 font-medium">Ifoto y'Umuyobozi</p>
                        <p className="text-xs text-brand-500">(Izongera gushyirwa)</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-50" />
              </div>
              
              {/* Director Info */}
              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                  <h3 className="text-2xl font-bold text-brand-900 mb-2">
                    {content.director.name}
                  </h3>
                  <p className="text-brand-600 font-medium mb-4">{content.director.title}</p>
                  <p className="text-brand-800 leading-relaxed">
                    {content.director.bio}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="text-2xl text-accent-500 mb-2">📧</div>
                    <p className="text-sm text-brand-600">Email</p>
                    <p className="text-xs text-brand-500">{content.director.email}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="text-2xl text-accent-500 mb-2">📱</div>
                    <p className="text-sm text-brand-600">Telefoni</p>
                    <p className="text-xs text-brand-500">{content.director.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="grid gap-8 md:grid-cols-3">
          {content.values.map((value, index) => (
            <div
              key={`${value.title ?? 'value'}-${index}`}
              className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-brand-900 mb-3">{value.title}</h3>
                <p className="text-brand-700 leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Contact Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent mb-4">
                {content.contact.title}
              </h2>
              <div className="text-4xl mb-4">{content.contact.icon}</div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📧</div>
                <h3 className="font-semibold text-brand-900 mb-2">Email</h3>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="text-brand-600 hover:text-accent-600 transition-colors"
                >
                  {content.contact.email}
                </a>
              </div>
              
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📱</div>
                <h3 className="font-semibold text-brand-900 mb-2">Telefoni</h3>
                <p className="text-brand-600">{content.contact.phone}</p>
              </div>
              
              <div className="text-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                <div className="text-3xl text-accent-500 mb-3">📍</div>
                <h3 className="font-semibold text-brand-900 mb-2">Aho duba</h3>
                <p className="text-brand-600">{content.contact.address}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
