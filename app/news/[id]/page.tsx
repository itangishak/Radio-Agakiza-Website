import { apiGet } from "../../../lib/api";

export const metadata = {
  title: "Article — Radio Agakiza",
};

type Article = {
  id: number;
  title: string;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  author_name?: string | null;
};

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const article = await apiGet<Article>(`/articles/${id}`);
  if (!article) {
    return <div className="text-sm text-zinc-500">Article not found.</div>;
  }
  return (
    <article className="prose max-w-none dark:prose-invert">
      <h1>{article.title}</h1>
      <div className="text-sm text-zinc-500">{article.published_at?.slice(0,10) ?? ''} {article.author_name ? `• ${article.author_name}` : ''}</div>
      {article.cover_image_url && (
        <img src={article.cover_image_url} alt="" className="my-4 rounded" />
      )}
      {/* The content may be HTML from CMS; render as-is. Ensure the backend sanitizes content. */}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
