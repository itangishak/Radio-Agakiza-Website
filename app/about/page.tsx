import { apiGet } from "../../lib/api";

export const metadata = {
  title: "About — Radio Agakiza",
};

type AboutSettings = {
  hero?: {
    title_top?: string;
    title_bottom?: string;
    subtitle?: string;
    emoji?: string;
  };
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
  projects?: {
    title?: string;
    subtitle?: string;
    items?: {
      name?: string;
      description?: string;
      image_url?: string;
      image_alt?: string;
      donate_label?: string;
      donate_link?: string;
      icon?: string;
    }[];
  };
};

const fallbackContent: Required<AboutSettings> = {
  hero: {
    title_top: "Turi",
    title_bottom: "Bande",
    subtitle:
      "Menya Radio Agakiza n'igikorwa cacu co kwamamaza Inkuru Nziza y'Icizere",
    emoji: "📻",
  },
  mission: {
    title: "Igikorwa Cacu",
    body:
      "Radio Agakiza ni radiyo ya gikirisu ivuga Inkuru Nziza y'Icizere. " +
      "Dutanga ibiganiro vyubaka, amakuru y'akamaro, n'ivyabona bikomeza ukwizera n'ukwihangana.",
    icon: "✨",
  },
  director: {
    name: "[Izina ry'Umuyobozi]",
    title: "Umuyobozi wa Radio Agakiza",
    bio: "[Hano hazoshirwa amakuru y'umuyobozi, uburambe afise, n'ukuntu yatanguye gukorera Radio Agakiza. Ayandi makuru azokwongerwako inyuma.]",
    email: "[Imeyili y'umuyobozi]",
    phone: "[Inomero ya terefone]",
    image_url: "",
    image_alt: "Umuyobozi wa Radio Agakiza",
  },
  values: [
    {
      title: "Icizere",
      description:
        "Turamamaza Inkuru Nziza y'Icizere kandi dushigikira abumviriza mu kwizera kwabo.",
      icon: "🙏",
    },
    {
      title: "Urukundo",
      description:
        "Dutanga ibiganiro bishimikiye ku rukundo rw'Imana no ku gukundana hagati yacu.",
      icon: "❤️",
    },
    {
      title: "Ivyizigiro",
      description:
        "Turatanga ivyizigiro ku mitima myinshi kandi tugafata mu mugongo abafise ingorane.",
      icon: "🌟",
    },
  ],
  projects: {
    title: "Imigambi Yacu",
    subtitle:
      "Ubu dufise imigambi ibiri y'ingenzi yo gufasha amashengero n'imiryango biciye ku butumwa n'ubufasha ngirakamaro.",
    items: [
      {
        name: "Umugambi w'Ubutumwa bwo ku Mihana",
        description:
          "Turashikana ibiganiro n'inyigisho zo kwizera mu mihana itandukanye, cane cane ahagoye gushika. Uyu mugambi urafasha imiryango myinshi kuronka ivyubaka umutima n'ukwizera kwa misi yose.",
        image_url: "",
        image_alt: "Umugambi w'Ubutumwa bwo ku Mihana",
        donate_label: "Tanga intererano kuri uyu mugambi",
        donate_link: "/contact",
        icon: "🏘️",
      },
      {
        name: "Umugambi wo Gufasha Urwaruka",
        description:
          "Uyu mugambi ufasha urwaruka kuronka ibiganiro bibafasha mu buzima, impanuro zubaka, n'inyigisho zibashira ku nzira nziza. Turashigikira urwaruka ngo rube inkomezi z'ejo hazaza.",
        image_url: "",
        image_alt: "Umugambi wo Gufasha Urwaruka",
        donate_label: "Shigikira urwaruka ukoresheje intererano",
        donate_link: "/contact",
        icon: "🎓",
      },
    ],
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
      values:
        Array.isArray(parsed.values) && parsed.values.length > 0
          ? parsed.values
          : fallbackContent.values,
      projects: {
        ...fallbackContent.projects,
        ...parsed.projects,
        items:
          Array.isArray(parsed.projects?.items) &&
          parsed.projects.items.length > 0
            ? parsed.projects.items
            : fallbackContent.projects.items,
      },
    };
  } catch {
    return fallbackContent;
  }
}

export default async function AboutPage() {
  const settings = await apiGet<{ value: string }>("/settings/about.page");
  const content = parseAboutSettings(settings?.value);
  const projects = content.projects.items ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.15),transparent_50%)]" />

        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-accent-400/30 blur-lg animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 text-6xl">{content.hero.emoji}</div>
          <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              {content.hero.title_top}
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              {content.hero.title_bottom}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90">
            {content.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h2 className="mb-4 bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-3xl font-bold text-transparent">
                {content.mission.title}
              </h2>
              <div className="mb-4 text-4xl">{content.mission.icon}</div>
            </div>
            <div className="prose prose-lg max-w-none text-brand-800">
              <p className="text-center text-xl leading-relaxed">
                {content.mission.body}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="grid gap-8 md:grid-cols-3">
          {content.values.map((value, index) => (
            <div
              key={`${value.title ?? "value"}-${index}`}
              className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative text-center">
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-brand-900">
                  {value.title}
                </h3>
                <p className="leading-relaxed text-brand-700">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Director Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-accent-500/10 via-brand-500/5 to-accent-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h2 className="mb-4 bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-3xl font-bold text-transparent">
                Umuyobozi Wacu
              </h2>
              <div className="mb-4 text-4xl">👨‍💼</div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative">
                <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-2xl shadow-2xl shadow-brand-900/20 ring-4 ring-white">
                  {content.director.image_url ? (
                    <img
                      src={content.director.image_url}
                      alt={content.director.image_alt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-accent-100">
                      <div className="text-center">
                        <div className="mb-2 text-6xl text-brand-400">👤</div>
                        <p className="text-sm font-medium text-brand-600">
                          Ifoto y'Umuyobozi
                        </p>
                        <p className="text-xs text-brand-500">
                          (Izokwongerwako)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-brand-500/20 to-accent-500/20 opacity-50 blur-xl" />
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/50 p-6 ring-1 ring-brand-200">
                  <h3 className="mb-2 text-2xl font-bold text-brand-900">
                    {content.director.name}
                  </h3>
                  <p className="mb-4 font-medium text-brand-600">
                    {content.director.title}
                  </p>
                  <p className="leading-relaxed text-brand-800">
                    {content.director.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="mb-2 text-2xl text-accent-500">📧</div>
                    <p className="text-sm text-brand-600">Imeyili</p>
                    <p className="text-xs text-brand-500">
                      {content.director.email}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-4 text-center shadow-lg">
                    <div className="mb-2 text-2xl text-accent-500">📱</div>
                    <p className="text-sm text-brand-600">Terefone</p>
                    <p className="text-xs text-brand-500">
                      {content.director.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
          <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h2 className="mb-4 bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-3xl font-bold text-transparent">
                {content.projects.title}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-brand-700">
                {content.projects.subtitle}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={`${project.name ?? "project"}-${index}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-xl shadow-brand-900/10 ring-1 ring-brand-100"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-brand-100 to-accent-100">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.image_alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <div className="mb-2 text-6xl">
                            {project.icon ?? "📷"}
                          </div>
                          <p className="text-sm font-medium text-brand-600">
                            Ifoto y'umugambi
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-6">
                    <h3 className="text-2xl font-bold text-brand-900">
                      {project.name}
                    </h3>
                    <p className="leading-relaxed text-brand-700">
                      {project.description}
                    </p>

                    <a
                      href={project.donate_link ?? "/contact"}
                      className="inline-flex items-center rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:from-accent-600 hover:to-accent-700"
                    >
                      💚 {project.donate_label ?? "Tanga intererano"}
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-center text-white shadow-lg">
              <p className="text-sm sm:text-base">
                Intererano yawe ifasha iyi migambi ibiri kubandanya no kugirira
                akamaro benshi.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
