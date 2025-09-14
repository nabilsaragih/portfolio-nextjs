import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPostsMeta, getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post' };
  return { title: post.meta.title, description: post.meta.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getPostBySlug(slug);
  if (!result) return notFound();
  const { meta, html } = result;
  return (
    <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-h)+1rem)] pb-16">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="text-sm text-navy-600 hover:text-navy-800">← Home</Link>
        <span className="text-gray-400">•</span>
        <Link href="/blog" className="text-sm text-navy-600 hover:text-navy-800">Back to Blogs</Link>
      </div>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{meta.title}</h1>
        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
          <span>{new Date(meta.date).toLocaleDateString()}</span>
          <span>{meta.readingTimeMinutes} min read</span>
        </div>
        {meta.tags?.length ? (
          <div className="mb-6 flex flex-wrap gap-2 text-xs">
            {meta.tags.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5 px-2 py-1 text-gray-700 dark:text-gray-200">{t}</span>
            ))}
          </div>
        ) : null}
        {/* Basic Markdown → HTML */}
        <div className="space-y-4" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
