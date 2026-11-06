import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, FileText } from 'lucide-react';
import { getAllPostsMeta } from '@/lib/posts';
import { absoluteUrl, defaultOgImage, siteConfig } from '@/lib/seo';

const blogDescription =
  'Technical notes and essays by Nabil Saragih on AI, AIoT, robotics, edge systems, and applied engineering.';

export const metadata: Metadata = {
  title: 'Blog',
  description: blogDescription,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: `Blog | ${siteConfig.name}`,
    description: blogDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: blogDescription,
    images: [defaultOgImage.url],
  },
};

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

function renderExcerpt(excerpt: string) {
  return excerpt.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded-md bg-navy-50 px-1.5 py-0.5 font-medium text-navy-700 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)] dark:bg-navy-500/10 dark:text-navy-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': absoluteUrl('/blog#blog'),
    url: absoluteUrl('/blog'),
    name: `${siteConfig.name} Blog`,
    description: blogDescription,
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
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-20 pt-10 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        <header className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200/80 bg-navy-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-700 dark:border-navy-500/20 dark:bg-navy-950/60 dark:text-navy-300">
              <FileText className="h-3 w-3" />
              Journal & Notes
            </span>

            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <strong className="font-semibold text-neutral-900 dark:text-white">{posts.length}</strong> published articles
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
              Engineering Notes on AI, Edge Systems & Robotics
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Technical write-ups, architecture breakdowns, and notes on deploying intelligent models under real-world constraints.
            </p>
          </div>
        </header>

        <section className="mt-8 space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all duration-200 hover:border-navy-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-navy-600"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                      {formatLongDate(post.date)}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-neutral-400" />
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-950 dark:text-white group-hover:text-navy-650 dark:group-hover:text-navy-300 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt ? (
                    <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {renderExcerpt(post.excerpt)}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-650 transition hover:bg-neutral-50 hover:text-navy-800 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-navy-300 dark:hover:bg-neutral-800"
                >
                  <span>Read</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {post.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-lg border border-neutral-200/90 bg-neutral-100/70 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
