import Link from "next/link";
import EpisodeAudio from "../../components/EpisodeAudio";
import { apiGet } from "../../lib/api";

export const metadata = {
  title: "Podcasts — Radio Agakiza",
};

type Episode = {
  id: number;
  series_id: number;
  title: string;
  slug: string;
  description: string | null;
  audio_url: string;
  source: 'upload' | 'external';
  duration_seconds: number | null;
  episode_number: number | null;
  status: string;
  published_at: string | null;
};

export default async function PodcastsPage() {
  const response = await apiGet<Episode[]>("/podcasts/episodes?status=published&limit=20");
  const episodes = Array.isArray(response) ? response : [];
  
  if (episodes.length === 0) {
    console.error('No episodes found or error fetching episodes');
  }
  
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
          <div className="mb-6 text-6xl">🎧</div>
          <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Podikasti
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Zacu
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            Wumva ibiganiro byiza n'amakuru y'agaciro mu buryo bworoshye
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Card */}
        <div className="mb-12 rounded-2xl bg-white/80 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-lg font-semibold text-brand-700">Ibice byose</h2>
                <p className="text-brand-600">{episodes.length} episodes ziraboneka</p>
              </div>
            </div>
            <div className="rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2 text-white font-semibold">
              {episodes.length}
            </div>
          </div>
        </div>

        {/* Episodes List */}
        {episodes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">Nta podikasti ziraboneka</h3>
            <p className="text-brand-600">Subira vuba, tuzongera podikasti nshasha!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {episodes.map((e, index) => (
              <article 
                key={e.id} 
                className="group relative overflow-hidden rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-brand-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative">
                  {/* Episode Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold text-sm">
                          {e.episode_number || '#'}
                        </div>
                        <div>
                          <Link
                            href={`/podcasts/${e.id}`}
                            className="text-xl font-bold text-brand-900 transition-colors hover:text-brand-700 line-clamp-2"
                          >
                            {e.title}
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-brand-600">
                            <span className="flex items-center gap-1">
                              <span className="text-accent-500">📅</span>
                              {e.published_at?.slice(0,10) ?? ''}
                            </span>
                            {e.duration_seconds && (
                              <span className="flex items-center gap-1">
                                <span className="text-accent-500">⏱️</span>
                                {Math.round(e.duration_seconds/60)} dakika
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Episode Description */}
                  {e.description && (
                    <div className="mb-6 rounded-xl bg-brand-50/50 p-4 ring-1 ring-brand-100">
                      <p className="text-brand-800 leading-relaxed line-clamp-3">
                        {e.description}
                      </p>
                    </div>
                  )}

                  {/* Audio Player */}
                  <div className="rounded-xl bg-gradient-to-r from-accent-50 to-brand-50 p-4 ring-1 ring-accent-200/50">
                    <EpisodeAudio src={e.audio_url} title={e.title} />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/podcasts/${e.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-500/20 transition-transform hover:scale-105"
                    >
                      Soma ibisobanuro
                      <span>→</span>
                    </Link>
                    <span className="text-xs font-medium text-brand-500">
                      Imbere y&apos;amakuru yose
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-brand-500/10 px-6 py-3 ring-1 ring-accent-200">
            <span className="text-2xl">🎧</span>
            <span className="text-brand-700 font-medium">
              Komeza wumve podikasti zacu nshasha!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
