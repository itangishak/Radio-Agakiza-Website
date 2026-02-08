import Link from "next/link";
import { notFound } from "next/navigation";
import EpisodeAudio from "../../../components/EpisodeAudio";
import { apiGet } from "../../../lib/api";

type Episode = {
  id: number;
  series_id: number;
  title: string;
  slug: string;
  description: string | null;
  audio_url: string;
  source?: "upload" | "external";
  duration_seconds: number | null;
  episode_number: number | null;
  status?: string;
  published_at: string | null;
};

type PageProps = {
  params: { id: string };
};

export default async function PodcastDetailPage({ params }: PageProps) {
  const episode = await apiGet<Episode>(`/podcasts/episodes/${params.id}`);

  if (!episode) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/30">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(120,182,64,0.18),transparent_50%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/podcasts" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
            <span>←</span>
            Subira ku rutonde
          </Link>
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <span className="text-lg">🎙️</span>
              Episode {episode.episode_number ?? "—"}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">{episode.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <span className="text-accent-300">📅</span>
                {episode.published_at?.slice(0, 10) ?? ""}
              </span>
              {Number.isFinite(episode.duration_seconds) && Number(episode.duration_seconds) > 0 && (
                <span className="flex items-center gap-2">
                  <span className="text-accent-300">⏱️</span>
                  {Math.round(Number(episode.duration_seconds ?? 0) / 60)} dakika
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-600">Umviriza episode</p>
              <p className="text-2xl font-bold text-brand-900">Wumve neza</p>
            </div>
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
              Audio
            </span>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-accent-50 to-brand-50 p-5 ring-1 ring-accent-200/50">
            <EpisodeAudio src={episode.audio_url} title={episode.title} />
          </div>
        </div>

        {episode.description && (
          <div className="rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold text-brand-900">Ibisobanuro</h2>
            <p className="text-base leading-relaxed text-brand-700">{episode.description}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 p-6 text-white shadow-xl shadow-accent-500/20">
          <h3 className="text-2xl font-semibold">Komeza wumve!</h3>
          <p className="text-white/90">
            Reba izindi podikasti nshasha maze ukomeze gukurikira ibiganiro byacu.
          </p>
          <Link
            href="/podcasts"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            Garuka ku rutonde
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
