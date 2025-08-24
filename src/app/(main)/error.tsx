'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (Sentry 등으로 확장 가능)
    console.error('페이지 오류:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          {/* 에러 아이콘 */}
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            앗! 오류가 발생했어요
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            페이지를 불러오는 중에 예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          
          {/* 에러 상세 정보 (개발 모드에서만) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-left">
              <summary className="font-semibold text-red-700 dark:text-red-300 cursor-pointer mb-2">
                개발자 정보
              </summary>
              <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            다시 시도하기
          </button>
          
          <Link
            href="/"
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
        
        {/* 도움말 링크 */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            문제가 계속 발생한다면:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              문의하기
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              블로그 목록
            </Link>
            <Link href="/categories" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              카테고리
            </Link>
            <Link href="/search" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              검색
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}