import type { Metadata } from 'next';
import PortfolioPage from './portfolio-page';
import { defaultOgImage, siteConfig } from '@/lib/seo';

const homeDescription = siteConfig.description;

export const metadata: Metadata = {
  title: 'Nabil Saragih | AI Engineer',
  description: homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: `${siteConfig.name} | AI Engineer Portfolio`,
    description: homeDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | AI Engineer Portfolio`,
    description: homeDescription,
    images: [defaultOgImage.url],
  },
};

export default PortfolioPage;
