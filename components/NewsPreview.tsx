import Link from "next/link";
import { apiGet } from "../lib/api";
import { formatKirundiMonthDay } from "../lib/time";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  preview_text?: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

export default async function NewsPreview() {
  const articles = (await apiGet<Article[]>("/articles?status=published&limit=3")) ?? [];
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
          Inkuru nshasha
        </h2>
        <Link 
          href="/news" 
          className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-xl"
        >
          Raba zose
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <article 
            key={a.id} 
            className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10"
            style={{animationDelay: `${i * 100}ms`}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            
            {a.cover_image_url && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={a.cover_image_url} 
                  alt="" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            
            <div className="relative p-6 space-y-4">
              <h3 className="text-lg font-bold text-brand-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                {a.title}
              </h3>
              
              <p className="text-sm text-brand-600 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {a.preview_text ?? a.excerpt ?? ''}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                <span className="text-xs text-brand-500 font-medium">
                  {a.published_at ? formatKirundiMonthDay(a.published_at) : ''}
                </span>
                <Link 
                  href={`/news/${a.id}`} 
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors"
                >
                  Soma vyinshi
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
        
        {articles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-brand-600">Nta nkuru ziraboneka ubu.</div>
          </div>
        )}
      </div>
    </section>
  );
}
