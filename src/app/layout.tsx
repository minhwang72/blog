import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SecurityWrapper from '@/components/SecurityWrapper';
import Script from 'next/script';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'min.log',
  description: '개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.',
  keywords: [
    'min.log', '개발 블로그', 'MCP', '개발', '프로그래밍', 
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'AI', '자동화',
    '웹개발', '풀스택', '프론트엔드', '백엔드', '황민', '기술 블로그'
  ],
  authors: [{ name: '황민' }],
  creator: '황민',
  publisher: 'min.log',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.eungming.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'min.log',
    description: '개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.',
    url: 'https://www.eungming.com',
    siteName: 'min.log',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'min.log',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'min.log',
    description: '개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // WebSite 스키마
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "min.log",
    "url": "https://www.eungming.com",
    "description": "개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.",
    "author": {
      "@type": "Person",
      "name": "황민"
    },
    "publisher": {
      "@type": "Organization",
      "name": "min.log",
      "url": "https://www.eungming.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.eungming.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Organization 스키마
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "min.log",
    "url": "https://www.eungming.com",
    "logo": "https://www.eungming.com/logo.svg",
    "description": "개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.",
    "founder": {
      "@type": "Person",
      "name": "황민"
    },
    "sameAs": [
      "https://github.com/minhwang72"
    ]
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans"
      >
        <Providers>
          <SecurityWrapper>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SecurityWrapper>
        </Providers>
      </body>
    </html>
  );
}