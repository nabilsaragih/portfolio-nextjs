import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getAllPostsMeta } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const site = host ? `${proto}://${host}` : 'http://localhost:3000';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPostsMeta().map<MetadataRoute.Sitemap[number]>((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}
