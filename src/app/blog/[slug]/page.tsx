import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPostsMeta, getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${site}/blog/${slug}`;
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.meta.title,
      description: post.meta.excerpt,
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.excerpt,
    },
  };
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
        {/* JSON-LD structured data for BlogPosting */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: meta.title,
              datePublished: meta.date,
              dateModified: meta.date,
              author: [{ '@type': 'Person', name: 'Nabil Saragih' }],
              keywords: meta.tags,
              description: meta.excerpt,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/blog/${meta.slug}`,
              },
            }),
          }}
        />
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
