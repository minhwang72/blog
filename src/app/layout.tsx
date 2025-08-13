import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import SecurityWrapper from '@/components/SecurityWrapper';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'min.log',
  description: '개발과 일상에 대한 이야기를 담은 블로그입니다.',
  keywords: ['블로그', '개발', '프로그래밍', '일상'],
  authors: [{ name: 'hwnagmin' }],
  creator: 'hwnagmin',
  publisher: 'hwnagmin',
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
    description: '개발과 일상에 대한 이야기를 담은 블로그입니다.',
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
    description: '개발과 일상에 대한 이야기를 담은 블로그입니다.',
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
    "description": "개발과 일상에 대한 이야기를 담은 블로그입니다.",
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
    "description": "개발과 일상에 대한 이야기를 담은 블로그입니다.",
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
        <SecurityWrapper>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ThemeToggle />
        </SecurityWrapper>
      </body>
    </html>
  );
}