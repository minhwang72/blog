import { getEnv } from './env'

// Google Analytics ID
const GA_ID = getEnv('NEXT_PUBLIC_GA_ID')

// Google Analytics 스크립트 타입
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (!GA_ID || typeof window === 'undefined') return
  
  window.gtag('config', GA_ID, {
    page_location: url,
  })
}

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!GA_ID || typeof window === 'undefined') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// 블로그 특화 이벤트들
export const blogEvents = {
  // 포스트 조회
  viewPost: (postId: string, title: string, category?: string) => {
    event({
      action: 'view_post',
      category: 'blog',
      label: `${postId}: ${title}`,
    })
    
    // 카테고리별 조회수 추적
    if (category) {
      event({
        action: 'view_category',
        category: 'blog',
        label: category,
      })
    }
  },

  // 포스트 공유
  sharePost: (platform: string, postId: string, title: string) => {
    event({
      action: 'share_post',
      category: 'social',
      label: `${platform}: ${postId}: ${title}`,
    })
  },

  // 댓글 작성
  writeComment: (postId: string) => {
    event({
      action: 'write_comment',
      category: 'engagement',
      label: postId,
    })
  },

  // 검색
  search: (query: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'blog',
      label: query,
      value: resultsCount,
    })
  },

  // 카테고리 탐색
  browseCategory: (category: string) => {
    event({
      action: 'browse_category',
      category: 'navigation',
      label: category,
    })
  },

  // 구독/팔로우 (향후 기능)
  subscribe: (type: 'email' | 'rss') => {
    event({
      action: 'subscribe',
      category: 'conversion',
      label: type,
    })
  },

  // 읽기 시간 추적
  readTime: (postId: string, timeSpent: number) => {
    event({
      action: 'read_time',
      category: 'engagement',
      label: postId,
      value: Math.round(timeSpent), // 초 단위
    })
  },

  // 스크롤 깊이 추적
  scrollDepth: (postId: string, depth: number) => {
    event({
      action: 'scroll_depth',
      category: 'engagement',
      label: postId,
      value: depth, // 퍼센트
    })
  },

  // 외부 링크 클릭
  clickExternalLink: (url: string, postId?: string) => {
    event({
      action: 'click_external_link',
      category: 'outbound',
      label: `${url}${postId ? ` from ${postId}` : ''}`,
    })
  },

  // 에러 발생
  error: (errorType: string, errorMessage: string, page?: string) => {
    event({
      action: 'error',
      category: 'technical',
      label: `${errorType}: ${errorMessage}${page ? ` on ${page}` : ''}`,
    })
  }
}

// 성능 추적
export const performanceEvents = {
  // 페이지 로드 시간
  pageLoadTime: (page: string, loadTime: number) => {
    event({
      action: 'page_load_time',
      category: 'performance',
      label: page,
      value: Math.round(loadTime),
    })
  },

  // 이미지 로드 시간
  imageLoadTime: (imageName: string, loadTime: number) => {
    event({
      action: 'image_load_time',
      category: 'performance',
      label: imageName,
      value: Math.round(loadTime),
    })
  },

  // API 응답 시간
  apiResponseTime: (endpoint: string, responseTime: number) => {
    event({
      action: 'api_response_time',
      category: 'performance',
      label: endpoint,
      value: Math.round(responseTime),
    })
  }
}

// Core Web Vitals 추적
export const webVitals = {
  // Cumulative Layout Shift
  cls: (value: number) => {
    event({
      action: 'cls',
      category: 'web_vitals',
      value: Math.round(value * 1000),
    })
  },

  // First Input Delay
  fid: (value: number) => {
    event({
      action: 'fid',
      category: 'web_vitals',
      value: Math.round(value),
    })
  },

  // Largest Contentful Paint
  lcp: (value: number) => {
    event({
      action: 'lcp',
      category: 'web_vitals',
      value: Math.round(value),
    })
  },

  // First Contentful Paint
  fcp: (value: number) => {
    event({
      action: 'fcp',
      category: 'web_vitals',
      value: Math.round(value),
    })
  },

  // Time to First Byte
  ttfb: (value: number) => {
    event({
      action: 'ttfb',
      category: 'web_vitals',
      value: Math.round(value),
    })
  }
}