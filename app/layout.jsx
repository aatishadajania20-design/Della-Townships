import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.dellatownships.com'),
  title: 'Della Townships — Theme-Based Luxury Townships Across India',
  description:
    'Della Townships designs asset-light, theme-based luxury townships across India. 4,288 acres, ₹46,480 Cr GDV, 12 projects, 10 cities. Built on the proof of Della Resorts, Lonavala.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Della Townships',
    title: "Della Townships — We Don't Build Cities. We Design How India Lives.",
    description:
      'Asset-light. Theme-based. Longevity-led. 4,288 acres of theme-based luxury townships across 10 Indian cities, designed by the team behind Della Resorts, Lonavala.',
    url: 'https://www.dellatownships.com/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 800,
        alt: 'Modern luxury villa glowing at dusk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Della Townships — We Don't Build Cities. We Design How India Lives.",
    description:
      'Asset-light. Theme-based. Longevity-led. 4,288 acres across 10 Indian cities, designed by the team behind Della Resorts, Lonavala.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ],
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Della Townships',
  url: 'https://www.dellatownships.com/',
  description:
    'Asset-light, theme-based luxury township developer designing longevity-led communities across India.',
  slogan: 'Redefining How India Lives, Works & Dreams.',
  founder: { '@type': 'Person', name: 'Jimmy Mistry', jobTitle: 'Founder & Chairman' },
  parentOrganization: { '@type': 'Organization', name: 'Della Group' },
  areaServed: 'India',
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Della Townships — Theme-Based Luxury Townships Across India',
  url: 'https://www.dellatownships.com/',
  description:
    'Della Townships designs asset-light, theme-based luxury townships across India. 4,288 acres, ₹46,480 Cr GDV, 12 projects, 10 cities.',
  inLanguage: 'en',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Della Townships',
    url: 'https://www.dellatownships.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      </body>
    </html>
  );
}
