'use client'

import { useEffect, useCallback } from 'react'
import { performanceEvents, webVitals } from '@/lib/analytics'

// 페이지 로드 성능 추적
export function usePagePerformance(pageName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const startTime = Date.now()
    
    const measureLoadTime = () => {
      const loadTime = Date.now() - startTime
      performanceEvents.pageLoadTime(pageName, loadTime)
    }

    // DOM이 로드되면 측정
    if (document.readyState === 'complete') {
      measureLoadTime()
    } else {
      window.addEventListener('load', measureLoadTime)
      return () => window.removeEventListener('load', measureLoadTime)
    }
  }, [pageName])
}

// API 성능 추적
export function useApiPerformance() {
  const trackApiCall = useCallback(async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = Date.now()
    
    try {
      const result = await apiCall()
      const responseTime = Date.now() - startTime
      performanceEvents.apiResponseTime(endpoint, responseTime)
      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      performanceEvents.apiResponseTime(`${endpoint}_error`, responseTime)
      throw error
    }
  }, [])

  return { trackApiCall }
}

// 이미지 로드 성능 추적
export function useImagePerformance() {
  const trackImageLoad = useCallback((imageSrc: string) => {
    if (typeof window === 'undefined') return

    const startTime = Date.now()
    const img = new Image()
    
    img.onload = () => {
      const loadTime = Date.now() - startTime
      const imageName = imageSrc.split('/').pop() || imageSrc
      performanceEvents.imageLoadTime(imageName, loadTime)
    }
    
    img.onerror = () => {
      const loadTime = Date.now() - startTime
      const imageName = imageSrc.split('/').pop() || imageSrc
      performanceEvents.imageLoadTime(`${imageName}_error`, loadTime)
    }
    
    img.src = imageSrc
  }, [])

  return { trackImageLoad }
}

// Core Web Vitals 추적
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Web Vitals 라이브러리가 있다면 사용
    if ('web-vitals' in window) return

    // 직접 측정
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              webVitals.cls((entry as any).value)
            }
            break
          case 'first-input':
            webVitals.fid((entry as any).processingStart - entry.startTime)
            break
          case 'largest-contentful-paint':
            webVitals.lcp(entry.startTime)
            break
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              webVitals.fcp(entry.startTime)
            }
            break
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming
            webVitals.ttfb(navEntry.responseStart - navEntry.requestStart)
            break
        }
      }
    })

    // 다양한 성능 메트릭 관찰
    try {
      observer.observe({ entryTypes: ['layout-shift', 'first-input', 'largest-contentful-paint', 'paint', 'navigation'] })
    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }

    return () => observer.disconnect()
  }, [])
}

// 읽기 시간 추적
export function useReadingTime(postId: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const startTime = Date.now()
    let isActive = true

    // 페이지 가시성 추적
    const handleVisibilityChange = () => {
      isActive = !document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 스크롤 깊이 추적
    let maxScrollDepth = 0
    const handleScroll = () => {
      if (!isActive) return

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const scrollDepth = Math.round((scrolled / scrollHeight) * 100)
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
      }

      // 25%, 50%, 75%, 90% 지점에서 이벤트 발생
      if ([25, 50, 75, 90].includes(scrollDepth) && scrollDepth > maxScrollDepth - 5) {
        performanceEvents.apiResponseTime(`scroll_${scrollDepth}`, Date.now() - startTime)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 페이지 떠날 때 읽기 시간 전송
    const handleBeforeUnload = () => {
      if (isActive) {
        const readTime = (Date.now() - startTime) / 1000 // 초 단위
        if (readTime > 5) { // 5초 이상 읽은 경우만 추적
          // 비동기로 전송 (페이지 언로드 중에도 전송되도록)
          navigator.sendBeacon?.('/api/analytics/reading-time', JSON.stringify({
            postId,
            readTime,
            scrollDepth: maxScrollDepth
          }))
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [postId])
}

// 에러 추적
export function useErrorTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleError = (event: ErrorEvent) => {
      performanceEvents.apiResponseTime('javascript_error', 1)
      console.error('JavaScript Error:', event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      performanceEvents.apiResponseTime('promise_rejection', 1)
      console.error('Unhandled Promise Rejection:', event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
}