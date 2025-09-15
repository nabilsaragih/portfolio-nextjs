import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const posts = getAllPostsMeta().map((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}

