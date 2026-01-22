import Link from "next/link";
import { apiGet } from "../../lib/api";

export const metadata = {
  title: "News — Radio Agakiza",
};

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export default async function NewsPage() {
  const articles = (await apiGet<Article[]>("/articles?status=published&limit=30")) ?? [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">News</h1>
      {articles.length === 0 && (
        <div className="text-sm text-zinc-500">No articles yet.</div>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <li key={a.id} className="rounded border p-4">
            <Link href={`/news/${a.id}`} className="block">
              <h2 className="font-medium line-clamp-2">{a.title}</h2>
              <div className="text-xs text-zinc-500 mt-1">{a.published_at?.slice(0,10) ?? ''}</div>
              {a.excerpt && <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">{a.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
