import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import SecurityWrapper from '@/components/SecurityWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '은명의 블로그',
  description: '개발과 일상에 대한 이야기를 담은 블로그입니다.',
  keywords: ['블로그', '개발', '프로그래밍', '일상'],
  authors: [{ name: '은명' }],
  creator: '은명',
  publisher: '은명',
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
    title: '은명의 블로그',
    description: '개발과 일상에 대한 이야기를 담은 블로그입니다.',
    url: 'https://www.eungming.com',
    siteName: '은명의 블로그',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: '은명의 블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '은명의 블로그',
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
  return (
    <html lang="ko" suppressHydrationWarning>
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