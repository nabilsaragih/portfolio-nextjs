const DEFAULT_SITE_URL = 'http://localhost:3000';

function normalizeSiteUrl(value?: string) {
  const candidate = value?.trim() || DEFAULT_SITE_URL;

  try {
    const url = new URL(candidate);
    return url.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteConfig = {
  name: 'Nabil Saragih',
  legalName: 'Muhammad Nabil Saragih',
  description:
    'Portfolio and blog of Nabil Saragih, an AI engineer building practical AI, AIoT, robotics, and edge systems.',
  locale: 'en_US',
  defaultOgAlt: 'Nabil Saragih portfolio and blog',
  sameAs: ['https://github.com/nabilsaragih', 'https://www.linkedin.com/in/nabilsaragih/'],
} as const;

export const siteAuthor = {
  name: siteConfig.name,
  url: absoluteUrl('/'),
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString();
}

export const defaultOgImage = {
  url: absoluteUrl('/opengraph-image'),
  width: 1200,
  height: 630,
  alt: siteConfig.defaultOgAlt,
} as const;

export function getPostDescription(excerpt: string | undefined, title: string) {
  const trimmedExcerpt = excerpt?.trim();

  if (trimmedExcerpt) {
    return trimmedExcerpt;
  }

  return `Read ${title} by ${siteConfig.name} on AI, AIoT, robotics, and applied engineering.`;
}

export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': absoluteUrl('/#website'),
      url: absoluteUrl('/'),
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: 'en',
      publisher: {
        '@id': absoluteUrl('/#person'),
      },
    },
    {
      '@type': 'Person',
      '@id': absoluteUrl('/#person'),
      name: siteConfig.name,
      alternateName: siteConfig.legalName,
      url: absoluteUrl('/'),
      jobTitle: 'AI Engineer',
      description: siteConfig.description,
      sameAs: [...siteConfig.sameAs],
    },
  ],
} as const;
