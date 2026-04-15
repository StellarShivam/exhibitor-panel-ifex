import { Metadata } from 'next';

const title = 'Pre-fair Directory';
const description = 'Explore exhibitors, product groups and categories before the fair.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://exhibitor.bharat-tex.com/pre-fair-directory',
    siteName: 'IFEX 2026',
    images: [
      {
        url: '/assets/images/IFEX 2026-Web Banner-171125-3.jpg',
        width: 1200,
        height: 630,
        alt: 'Pre-fair Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/assets/images/IFEX 2026-Web Banner-171125-3.jpg'],
  },
};
