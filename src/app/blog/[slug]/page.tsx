import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, FileText } from 'lucide-react';
import { BlogContent } from '@/components/blog-content';
import { getAllPostsMeta, getPostBySlug, type PostMeta } from '@/lib/posts';
import { absoluteUrl, getPostDescription, siteConfig } from '@/lib/seo';

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
    return {
      title: 'Article not found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postPath = `/blog/${post.meta.slug}`;
  const postDescription = getPostDescription(post.meta.excerpt, post.meta.title);
  const ogImageUrl = absoluteUrl(`${postPath}/opengraph-image`);

  return {
    title: post.meta.title,
    description: postDescription,
    alternates: {
      canonical: postPath,
    },
    openGraph: {
      type: 'article',
      url: postPath,
      title: post.meta.title,
      description: postDescription,
      publishedTime: post.meta.date,
      modifiedTime: post.meta.date,
      authors: [siteConfig.name],
      tags: post.meta.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: postDescription,
      images: [ogImageUrl],
    },
  };
}

function BlogPostArticle({ html, meta }: { html: string; meta: PostMeta }) {
  const postUrl = absoluteUrl(`/blog/${meta.slug}`);
  const postDescription = getPostDescription(meta.excerpt, meta.title);
  const postOgImageUrl = absoluteUrl(`/blog/${meta.slug}/opengraph-image`);
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        headline: meta.title,
        description: postDescription,
        datePublished: meta.date,
        dateModified: meta.date,
        image: [postOgImageUrl],
        articleSection: 'Blog',
        keywords: meta.tags.length ? meta.tags.join(', ') : undefined,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        author: {
          '@type': 'Person',
          '@id': absoluteUrl('/#person'),
          name: siteConfig.name,
          url: absoluteUrl('/'),
        },
        publisher: {
          '@type': 'Person',
          '@id': absoluteUrl('/#person'),
          name: siteConfig.name,
          url: absoluteUrl('/'),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: absoluteUrl('/blog'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: meta.title,
            item: postUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-20 pt-8 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />

          <Link href="/blog" className="transition hover:text-navy-650 dark:hover:text-navy-300">
            Blog
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />

          <span className="truncate max-w-[200px] text-neutral-400">{meta.title}</span>
        </div>

        <header className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200/80 bg-navy-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-700 dark:border-navy-500/20 dark:bg-navy-950/60 dark:text-navy-300">
              <FileText className="h-3 w-3" />
              Article
            </span>

            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                {formatLongDate(meta.date)}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 text-neutral-400" />
                {meta.readingTimeMinutes} min read
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-tight">
              {meta.title}
            </h1>

            {meta.excerpt ? (
              <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {meta.excerpt}
              </p>
            ) : null}
          </div>

          {meta.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg border border-neutral-200/90 bg-white px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <article className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-10 dark:border-neutral-800 dark:bg-neutral-900/50">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(articleStructuredData),
            }}
          />

          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200/80 pb-4 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Author:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">Nabil Saragih</span>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-medium text-navy-650 hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-300"
              >
                <span>Back to All Articles</span>
                <ChevronRight className="h-3.5 w-3.5" />
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
