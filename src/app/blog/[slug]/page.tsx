import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, FileText } from 'lucide-react';
import { BlogContent } from '@/components/blog-content';
import { getAllPostsMeta, getPostBySlug, type PostMeta } from '@/lib/posts';

function formatLongDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = `${site}/blog/${slug}`;

  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    keywords: post.meta.tags?.length
      ? [...post.meta.tags, 'Muhammad Nabil Saragih', 'Nabil Saragih']
      : ['Muhammad Nabil Saragih', 'Nabil Saragih', 'AI', 'IoT', 'Edge AI'],
    authors: [{ name: 'Muhammad Nabil Saragih' }, { name: 'Nabil Saragih' }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Muhammad Nabil Saragih | Nabil Saragih',
      title: `${post.meta.title} | Muhammad Nabil Saragih`,
      description: post.meta.excerpt,
      publishedTime: post.meta.date,
      authors: ['Muhammad Nabil Saragih', 'Nabil Saragih'],
      tags: post.meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.meta.title} | Muhammad Nabil Saragih`,
      description: post.meta.excerpt,
    },
  };
}

function BlogPostArticle({ html, meta }: { html: string; meta: PostMeta }) {
  return (
    <div className="relative overflow-hidden pb-20 pt-[calc(var(--header-h)+1.25rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.1),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_26%)]" />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-4 py-2 text-gray-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />

          <Link href="/blog" className="transition hover:text-navy-600 dark:hover:text-navy-300">
            Blogs
          </Link>

          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />

          <span className="truncate text-gray-400 dark:text-gray-500">{meta.title}</span>
        </div>

        <header className="relative overflow-hidden rounded-[32px] border border-gray-200/70 bg-white/88 px-6 py-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:px-8 sm:py-9 lg:px-10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_32px_80px_-58px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_24%)]" />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-200/80 bg-navy-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-700 dark:border-navy-500/20 dark:bg-navy-500/10 dark:text-navy-200">
                <FileText className="h-3.5 w-3.5" />
                Journal
              </span>

              <div className="ml-auto flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                  <CalendarDays className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {formatLongDate(meta.date)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                  <Clock3 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {meta.readingTimeMinutes} min read
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-white">
                {meta.title}
              </h1>

              {meta.excerpt ? (
                <p className="max-w-3xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
                  {meta.excerpt}
                </p>
              ) : null}
            </div>

            {meta.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-gray-200/80 bg-white/85 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <article className="relative mt-8 overflow-hidden rounded-[32px] border border-gray-200/70 bg-white/92 px-6 py-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:px-8 sm:py-8 lg:px-10 lg:py-10 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_28px_72px_-56px_rgba(0,0,0,0.92)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-300/80 to-transparent dark:via-navy-500/40" />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: meta.title,
                datePublished: meta.date,
                dateModified: meta.date,
                author: [
                  {
                    '@type': 'Person',
                    name: 'Muhammad Nabil Saragih',
                    alternateName: 'Nabil Saragih',
                    knowsAbout: ['AI Engineering', 'IoT Systems', 'Edge AI', 'Machine Learning'],
                    sameAs: [
                      'https://github.com/nabilsaragih',
                      'https://www.linkedin.com/in/nabilsaragih/',
                    ],
                  },
                ],
                publisher: {
                  '@type': 'Person',
                  name: 'Muhammad Nabil Saragih',
                  alternateName: 'Nabil Saragih',
                },
                keywords: meta.tags,
                description: meta.excerpt,
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/blog/${meta.slug}`,
                },
              }),
            }}
          />

          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col gap-4 border-b border-gray-200/70 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  Written by
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-950 dark:text-white">Nabil Saragih</p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition hover:text-navy-800 dark:text-navy-300 dark:hover:text-navy-200"
              >
                Browse more posts
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <BlogContent html={html} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getPostBySlug(slug);

  if (!result) {
    return notFound();
  }

  const { meta, html } = result;

  return <BlogPostArticle html={html} meta={meta} />;
}
