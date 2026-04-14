import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/posts';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPostsMeta();
  const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : undefined;

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: latestPostDate, changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/blog'), lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map<MetadataRoute.Sitemap[number]>((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...postEntries];
}
