import Link from "next/link";
import { apiGet } from "../../lib/api";
import { formatKirundiDateFull, formatKirundiMonthDay } from "../../lib/time";

export const metadata = {
  title: "News — Radio Agakiza",
};

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  preview_text?: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  author_name?: string | null;
};

export default async function NewsPage() {
  const articles = (await apiGet<Article[]>("/articles?status=published&limit=30")) ?? [];
  
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
          <div className="mb-6 text-6xl">📰</div>
          <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Inkuru
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Nshasha
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            Soma amakuru mashasha y'agaciro kandi wumenyeshe ibintu by'ingenzi
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Card */}
        <div className="mb-12 rounded-2xl bg-white/80 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-lg font-semibold text-brand-700">Inkuru zose</h2>
                <p className="text-brand-600">{articles.length} inkuru ziraboneka</p>
              </div>
            </div>
            <div className="rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2 text-white font-semibold">
              {articles.length}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">Nta nkuru ziraboneka</h3>
            <p className="text-brand-600">Subira vuba, tuzongera inkuru nshasha!</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {articles[0] && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                  <span className="text-accent-500">⭐</span>
                  Inkuru Nyamukuru
                </h2>
                <article className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl">
                  <Link href={`/news/${articles[0].id}`} className="block">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Featured Image */}
                      <div className="relative h-64 lg:h-80 overflow-hidden">
                        {articles[0].cover_image_url ? (
                          <img 
                            src={articles[0].cover_image_url} 
                            alt="" 
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                            <span className="text-6xl text-brand-400">📰</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
                      </div>
                      
                      {/* Featured Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 ring-1 ring-accent-200">
                            <span className="text-accent-500">📅</span>
                            {articles[0].published_at ? formatKirundiDateFull(articles[0].published_at) : ''}
                          </div>
                          {articles[0].author_name && (
                            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                              <span className="text-brand-500">✍️</span>
                              {articles[0].author_name}
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-2xl lg:text-3xl font-bold text-brand-900 mb-4 group-hover:text-brand-700 transition-colors">
                          {articles[0].title}
                        </h3>
                        
                        <p className="text-brand-600 leading-relaxed mb-6" style={{ display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{articles[0].preview_text ?? articles[0].excerpt ?? ''}</p>
                        
                        <div className="inline-flex items-center gap-2 text-accent-600 font-semibold group-hover:text-accent-700 transition-colors">
                          <span>Soma vyinshi</span>
                          <span className="transition-transform group-hover:translate-x-2">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </div>
            )}

            {/* Regular Articles Grid */}
            {articles.length > 1 && (
              <>
                <h2 className="text-2xl font-bold text-brand-900 mb-8 flex items-center gap-2">
                  <span className="text-accent-500">📚</span>
                  Indi Nkuru
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.slice(1).map((a, index) => (
                    <article 
                      key={a.id} 
                      className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-900/10 animate-fade-in-up"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <Link href={`/news/${a.id}`} className="block">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                        
                        {/* Article Image */}
                        {a.cover_image_url ? (
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={a.cover_image_url} 
                              alt="" 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        ) : (
                          <div className="relative h-48 bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center">
                            <span className="text-4xl text-brand-400">📰</span>
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-500/10 to-transparent" />
                          </div>
                        )}
                        
                        {/* Article Content */}
                        <div className="relative p-6 space-y-4">
                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700 ring-1 ring-accent-200">
                              <span className="text-accent-500">📅</span>
                              {a.published_at ? formatKirundiMonthDay(a.published_at) : ''}
                            </div>
                            {a.author_name && (
                              <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                                <span className="text-brand-500">✍️</span>
                                {a.author_name}
                              </div>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-bold text-brand-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                            {a.title}
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-sm text-brand-600 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {a.preview_text ?? a.excerpt ?? ''}
                          </p>
                          
                          {/* Read More */}
                          <div className="flex items-center justify-between pt-4 border-t border-brand-100">
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 group-hover:text-accent-700 transition-colors">
                              Soma vyinshi
                              <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                            <div className="flex items-center gap-1 text-xs text-brand-400">
                              <span>👁️</span>
                              <span>Raba</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-brand-500/10 px-6 py-3 ring-1 ring-accent-200">
            <span className="text-2xl">📰</span>
            <span className="text-brand-700 font-medium">
              Komeza usoma inkuru zacu nshasha!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
