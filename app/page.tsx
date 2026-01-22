import Link from "next/link";
import { apiGet, type LiveNowNext } from "../lib/api";

type Article = { id: number; title: string; slug: string; cover_image_url: string | null; published_at: string | null };
type Testimonial = { id: number; author_name: string; message: string };

export default async function Home() {
  const [live, news, testimonials] = await Promise.all([
    apiGet<LiveNowNext>("/programs/live"),
    apiGet<Article[]>("/articles?status=published&limit=3"),
    apiGet<Testimonial[]>("/testimonials/public?limit=3"),
  ]);

  return (
    <div className="space-y-10">
      <section className="rounded-lg border p-6">
        <h2 className="mb-2 text-xl font-semibold">Live Now / Next</h2>
        {live?.live ? (
          <div className="text-sm">
            <div>Now: <span className="font-medium">{live.live.name}</span></div>
            <div className="text-zinc-500">{live.live.start_time}–{live.live.end_time} ({live.live.timezone})</div>
          </div>
        ) : (
          <div className="text-sm text-zinc-500">No live program at this moment.</div>
        )}
        {live?.next && (
          <div className="mt-3 text-sm">
            <div>Next: <span className="font-medium">{live.next.name}</span></div>
            <div className="text-zinc-500">{live.next.start_time}–{live.next.end_time} ({live.next.timezone})</div>
          </div>
        )}
        <div className="mt-4">
          <Link href="/programs" className="text-sm underline">See full schedule</Link>
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest News</h2>
          <Link href="/news" className="text-sm underline">All news</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(news ?? []).map((n) => (
            <Link key={n.id} href={`/news/${n.id}`} className="block rounded border p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <div className="font-medium line-clamp-2">{n.title}</div>
              <div className="text-xs text-zinc-500 mt-1">{n.published_at?.slice(0,10) ?? ''}</div>
            </Link>
          ))}
          {(!news || news.length === 0) && (
            <div className="text-sm text-zinc-500">No articles yet.</div>
          )}
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">What listeners say</h2>
          <Link href="/about" className="text-sm underline">About</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(testimonials ?? []).map((t) => (
            <blockquote key={t.id} className="rounded border p-3 text-sm">
              <p className="line-clamp-4">“{t.message}”</p>
              <div className="mt-2 text-xs text-zinc-500">— {t.author_name}</div>
            </blockquote>
          ))}
          {(!testimonials || testimonials.length === 0) && (
            <div className="text-sm text-zinc-500">No testimonials yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
