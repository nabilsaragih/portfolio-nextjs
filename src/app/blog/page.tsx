import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronRight, Clock3, FileText } from 'lucide-react';
import { getAllPostsMeta } from '@/lib/posts';

export const metadata = {
  title: 'Blogs',
  description:
    'AI & IoT engineering insights by Muhammad Nabil Saragih (Nabil Saragih), covering edge AI, machine learning, and smart connected systems.',
  keywords: [
    'Muhammad Nabil Saragih blog',
    'Nabil Saragih blog',
    'AI blog',
    'IoT blog',
    'Edge AI articles',
    'Machine learning tutorials',
  ],
  authors: [{ name: 'Muhammad Nabil Saragih' }, { name: 'Nabil Saragih' }],
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blogs | Muhammad Nabil Saragih',
    description:
      'AI & IoT engineering insights by Muhammad Nabil Saragih (also known as Nabil Saragih), covering edge AI, machine learning, and smart connected systems.',
  },
  twitter: {
    card: 'summary',
    title: 'Blogs by Muhammad Nabil Saragih',
    description:
      'AI & IoT engineering insights by Muhammad Nabil Saragih (Nabil Saragih), covering edge AI, machine learning, and smart connected systems.',
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

  return (
    <div className="relative overflow-hidden pb-20 pt-[calc(var(--header-h)+1.25rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.1),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_26%)]" />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <header className="relative overflow-hidden rounded-[32px] border border-gray-200/70 bg-white/88 px-6 py-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:px-8 sm:py-9 lg:px-10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_32px_80px_-58px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.12),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_24%)]" />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-navy-200/80 bg-navy-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-700 dark:border-navy-500/20 dark:bg-navy-500/10 dark:text-navy-200">
                <FileText className="h-3.5 w-3.5" />
                Journal
              </span>

              <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 text-sm text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">{posts.length}</span>
                Published articles
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-white">
                Writing on AI, AIoT, edge systems, and applied engineering.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
                A focused collection of notes and technical write-ups on building practical intelligent systems
                without unnecessary noise.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 space-y-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-white/92 px-6 py-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.32)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_-42px_rgba(15,23,42,0.38)] sm:px-7 sm:py-7 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_28px_72px_-56px_rgba(0,0,0,0.92)] dark:hover:shadow-[0_34px_84px_-52px_rgba(0,0,0,0.96)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.08),transparent_24%)] opacity-0 transition group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.14),transparent_24%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-300/80 to-transparent opacity-70 dark:via-navy-500/40" />

              <div className="relative">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                        <CalendarDays className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {formatLongDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                        <Clock3 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {post.readingTimeMinutes} min read
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition hover:text-navy-600 dark:hover:text-navy-300"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      {post.excerpt ? (
                        <p className="max-w-3xl text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-300">
                          {renderExcerpt(post.excerpt)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200/70 bg-white/85 px-4 py-2 text-sm font-medium text-navy-600 shadow-sm transition hover:bg-white hover:text-navy-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-navy-300 dark:hover:bg-white/[0.07] dark:hover:text-navy-200"
                  >
                    Read article
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {post.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {post.tags.map((tag) => (
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
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
