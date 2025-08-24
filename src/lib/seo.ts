import { Metadata } from 'next'
import { BlogPost, BlogCategory } from '@/types/blog'
import { getEnv } from './env'

const SITE_URL = getEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.eungming.com'
const SITE_NAME = 'min.log'
const DEFAULT_DESCRIPTION = '개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.'

// 기본 메타데이터
export const defaultMetadata: Metadata = {
  title: {
    template: '%s | min.log',
    default: 'min.log - 개발자를 위한 기술 블로그',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'min.log', '개발 블로그', 'MCP', '개발', '프로그래밍', 
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'AI', '자동화',
    '웹개발', '풀스택', '프론트엔드', '백엔드', '황민', '기술 블로그'
  ],
  authors: [{ name: '황민', url: SITE_URL }],
  creator: '황민',
  publisher: 'min.log',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'min.log - 개발자를 위한 기술 블로그',
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'min.log',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@minlog_dev',
    creator: '@minlog_dev',
    title: 'min.log - 개발자를 위한 기술 블로그',
    description: DEFAULT_DESCRIPTION,
    images: ['/og-image.png'],
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
}

// 포스트 메타데이터 생성
export function generatePostMetadata(post: BlogPost): Metadata {
  const title = post.title
  const description = post.excerpt || `${post.content.substring(0, 160)}...`
  const url = `${SITE_URL}/blog/${post.id}`
  const publishedTime = post.createdAt.toISOString()
  const modifiedTime = post.updatedAt.toISOString()
  const imageUrl = post.featuredImage || '/og-image.png'

  return {
    title,
    description,
    keywords: extractKeywords(post.content, post.title),
    authors: [{ name: post.authorName || '황민', url: SITE_URL }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      modifiedTime,
      authors: [post.authorName || '황민'],
      section: post.categoryName || '개발',
      tags: extractTags(post.content),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@minlog_dev',
      creator: '@minlog_dev',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime,
      'article:author': post.authorName || '황민',
      'article:section': post.categoryName || '개발',
      'article:tag': extractTags(post.content).join(', '),
    },
  }
}

// 카테고리 메타데이터 생성
export function generateCategoryMetadata(category: BlogCategory, postsCount: number): Metadata {
  const title = `${category.name} 카테고리`
  const description = category.description || `${category.name} 관련 포스트 ${postsCount}개를 만나보세요. 최신 ${category.name} 기술과 정보를 공유합니다.`
  const url = `${SITE_URL}/categories/${category.slug}`

  return {
    title,
    description,
    keywords: [category.name, '카테고리', '기술 블로그', 'min.log', '개발'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: `/og-category-${category.slug}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@minlog_dev',
      creator: '@minlog_dev',
      title,
      description,
      images: [`/og-category-${category.slug}.png`],
    },
  }
}

// 검색 결과 메타데이터 생성
export function generateSearchMetadata(query: string, resultsCount: number): Metadata {
  const title = `"${query}" 검색 결과`
  const description = `"${query}"에 대한 검색 결과 ${resultsCount}개를 찾았습니다. min.log에서 원하는 개발 정보를 찾아보세요.`
  const url = `${SITE_URL}/search?q=${encodeURIComponent(query)}`

  return {
    title,
    description,
    keywords: [query, '검색', '기술 블로그', 'min.log'],
    alternates: {
      canonical: url,
    },
    robots: {
      index: resultsCount > 0,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: ['/og-search.png'],
    },
    twitter: {
      card: 'summary',
      site: '@minlog_dev',
      creator: '@minlog_dev',
      title,
      description,
    },
  }
}

// 키워드 추출 헬퍼 함수
function extractKeywords(content: string, title: string): string[] {
  const commonWords = ['그', '는', '다', '을', '를', '이', '가', '에', '와', '과', '의', '로', '으로', '에서', '까지', '부터', '보다', '처럼', '같이', '하고', '하며', '하여', '그리고', '또한', '그러나', '하지만', '따라서', '그래서']
  
  // 제목에서 키워드 추출
  const titleWords = title.split(/\s+/)
    .filter(word => word.length > 1 && !commonWords.includes(word))
  
  // 내용에서 기술 관련 키워드 추출
  const techKeywords = content.match(/\b(React|Next\.js|TypeScript|JavaScript|Node\.js|Python|Java|Spring|AWS|Docker|Kubernetes|Git|GitHub|API|REST|GraphQL|MongoDB|MySQL|Redis|Nginx|Linux|macOS|Windows|VS Code|WebStorm|IntelliJ|Chrome|Firefox|Safari|HTML|CSS|Sass|Tailwind|Bootstrap|Webpack|Vite|ESLint|Prettier|Jest|Cypress|Storybook|Figma|Sketch|Photoshop|Illustrator|After Effects|Premier|Final Cut|Logic|Ableton|FL Studio|Cubase|Pro Tools|Reaper|Audacity|OBS|Streamlabs|Discord|Slack|Notion|Obsidian|Roam|Anki|Quizlet|Duolingo|Khan Academy|Coursera|Udemy|Pluralsight|LinkedIn Learning|YouTube|Twitch|Netflix|Spotify|Apple Music|Amazon Music|Google Play Music|Pandora|SoundCloud|Bandcamp|Mixcloud|SoundCloud|Bandcamp|Mixcloud)\b/gi) || []
  
  return Array.from(new Set([...titleWords, ...techKeywords])).slice(0, 10)
}

// 태그 추출 헬퍼 함수
function extractTags(content: string): string[] {
  const codeBlocks = content.match(/```(\w+)/g) || []
  const languages = codeBlocks.map(block => block.replace('```', ''))
  
  const hashTags = content.match(/#\w+/g) || []
  const tags = hashTags.map(tag => tag.replace('#', ''))
  
  return Array.from(new Set([...languages, ...tags])).slice(0, 5)
}

// JSON-LD 구조화 데이터 생성
export function generateArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: post.featuredImage || '/og-image.png',
    author: {
      '@type': 'Person',
      name: post.authorName || '황민',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.id}`,
    },
    articleSection: post.categoryName || '개발',
    keywords: extractKeywords(post.content, post.title).join(', '),
    wordCount: post.content.length,
    timeRequired: `PT${Math.ceil(post.content.length / 200)}M`, // 대략적인 읽기 시간
  }
}

// 브레드크럼 스키마 생성
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// FAQ 스키마 생성
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}