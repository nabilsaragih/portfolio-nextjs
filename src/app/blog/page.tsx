import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/posts';

export const metadata = {
  title: 'Blogs',
  description: 'Articles and notes',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blogs',
    description: 'Articles and notes',
  },
  twitter: {
    card: 'summary',
    title: 'Blogs',
    description: 'Articles and notes',
  },
};

export default function BlogIndex() {
  const posts = getAllPostsMeta();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-[var(--header-h)] pb-12">
      <div className="mb-4">
        <Link href="/" className="text-sm text-navy-600 hover:text-navy-800">← Back to Home</Link>
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Blogs</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Tulisan dari file Markdown.</p>
      </div>
      <div className="space-y-6">
        {posts.map((p) => (
          <article key={p.slug} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6 shadow hover:shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                <Link href={`/blog/${p.slug}`} className="hover:text-navy-600">{p.title}</Link>
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span>{p.readingTimeMinutes} min read</span>
              </div>
            </div>
            {p.excerpt && <p className="mt-2 text-gray-600 dark:text-gray-300">{p.excerpt}</p>}
            {p.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {p.tags.map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5 px-2 py-1 text-gray-700 dark:text-gray-200">{t}</span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
