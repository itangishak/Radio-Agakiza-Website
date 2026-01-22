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
  const episodes = (await apiGet<Episode[]>("/podcasts/episodes?status=published&limit=20")) ?? [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Podcasts</h1>
      {episodes.length === 0 && (
        <div className="text-sm text-zinc-500">No episodes yet.</div>
      )}
      <ul className="space-y-4">
        {episodes.map((e) => (
          <li key={e.id} className="rounded border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{e.title}</h2>
                <div className="text-xs text-zinc-500">{e.published_at?.slice(0,10) ?? ''}</div>
              </div>
              {e.duration_seconds && (
                <div className="text-xs text-zinc-500">{Math.round(e.duration_seconds/60)} min</div>
              )}
            </div>
            {e.description && (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">{e.description}</p>
            )}
            <div className="mt-3">
              <EpisodeAudio src={e.audio_url} title={e.title} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
