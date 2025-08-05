import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    default: "황민 블로그 - 개발, 일상, 그리고 배움에 대한 기록",
    template: "%s | 황민 블로그"
  },
  description: "황민의 개발 블로그입니다. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
  keywords: ["황민", "블로그", "개발", "프로그래밍", "일상", "학습", "Next.js", "React", "TypeScript"],
  authors: [{ name: "황민" }],
  creator: "황민",
  publisher: "황민",
  metadataBase: new URL("https://blog.eungming.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "황민 블로그 - 개발, 일상, 그리고 배움에 대한 기록",
    description: "황민의 개발 블로그입니다. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "황민 블로그",
    url: "https://blog.eungming.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "황민 블로그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "황민 블로그 - 개발, 일상, 그리고 배움에 대한 기록",
    description: "황민의 개발 블로그입니다. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
    creator: "@minhwang72",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'mask-icon',
      url: '/logo.svg',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <style>
          {`
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Medium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-SemiBold.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}