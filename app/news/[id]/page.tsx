import Link from "next/link";
import { apiGet } from "../../../lib/api";
import type { Metadata } from "next";
import { formatKirundiDateFull } from "../../../lib/time";

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const id = Number(params.id);
  const article = await apiGet<Article>(`/articles/${id}`);
  if (!article) {
    return { title: "Article — Radio Agakiza" };
  }
  const title = `${article.title} — Radio Agakiza`;
  const description = article.excerpt || "";
  const images = article.cover_image_url ? [article.cover_image_url] : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

type Article = {
  id: number;
  title: string;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  author_name?: string | null;
  excerpt?: string | null;
};

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const article = await apiGet<Article>(`/articles/${id}`);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold text-brand-700 mb-2">Inkuru ntiboneka</h1>
          <p className="text-brand-600 mb-6">Inkuru usaba ntiboneka cyangwa yavanywemo.</p>
          <Link href="/news" className="btn-primary">
            Subira ku nkuru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
        {article.cover_image_url && (
          <div className="absolute inset-0">
            <img 
              src={article.cover_image_url} 
              alt="" 
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-800/85 to-brand-700/90" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.15),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span>←</span>
              <span>Subira ku nkuru</span>
            </Link>
          </nav>
          
          {/* Article Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/90 backdrop-blur-sm">
              <span className="text-accent-400">📅</span>
              <span className="text-sm font-medium">
                {article.published_at ? formatKirundiDateFull(article.published_at) : ''}
              </span>
            </div>
            {article.author_name && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/90 backdrop-blur-sm">
                <span className="text-accent-400">✍️</span>
                <span className="text-sm font-medium">{article.author_name}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>
          
          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl" style={{ display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <article className="rounded-2xl bg-white/80 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm overflow-hidden">
          {/* Featured Image */}
          {article.cover_image_url && (
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img 
                src={article.cover_image_url} 
                alt="" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          
          {/* Content */}
          <div className="p-8 sm:p-12">
            <div 
              className="prose prose-lg max-w-none prose-brand prose-headings:text-brand-900 prose-headings:font-bold prose-p:text-brand-700 prose-p:leading-relaxed prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-brand-800 prose-blockquote:border-l-accent-500 prose-blockquote:bg-accent-50/50 prose-blockquote:text-brand-700"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </article>

        {/* Share & Actions */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-white/60 p-6 shadow-lg shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="font-semibold text-brand-700">Sangira aba bakureba</h3>
              <p className="text-sm text-brand-600">Sangira iyi nkuru n'abandi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-white font-medium hover:bg-accent-600 transition-colors">
              <span>📱</span>
              <span>Sangira</span>
            </button>
            <Link href="/news" className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-brand-700 font-medium hover:bg-brand-200 transition-colors">
              <span>📰</span>
              <span>Indi nkuru</span>
            </Link>
          </div>
        </div>

        {/* Related Articles CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-brand-500/10 px-6 py-3 ring-1 ring-accent-200">
            <span className="text-2xl">📚</span>
            <span className="text-brand-700 font-medium">
              Raba indi nkuru nshasha
            </span>
          </div>
          <div className="mt-4">
            <Link href="/news" className="btn-primary">
              Raba inkuru zose
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
