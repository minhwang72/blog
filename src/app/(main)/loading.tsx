import { PostListSkeleton, StatsSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/40 via-gray-100/30 to-slate-300/40 dark:from-slate-700/40 dark:via-slate-800/30 dark:to-slate-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="text-6xl md:text-8xl font-black bg-gradient-to-r from-slate-600 via-gray-500 to-slate-700 bg-clip-text text-transparent leading-none tracking-tight">
                min.log
              </div>
              <div className="absolute -inset-x-12 -inset-y-6 bg-gradient-to-r from-slate-200/60 via-gray-100/40 to-slate-300/60 dark:from-slate-700/40 dark:via-slate-800/30 dark:to-slate-900/40 rounded-3xl blur-3xl -z-10 opacity-50"></div>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                개발자의 기술과 배움을 기록하는 공간
              </p>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                새로운 기술을 탐구하고, 경험을 공유하며, 함께 성장하는 지식의 공간입니다.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-full shadow-lg">
                  블로그 둘러보기
                </div>
                <div className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-full border-2 border-slate-300 dark:border-slate-600">
                  카테고리 보기
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 Skeleton */}
      <section className="py-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSkeleton />
        </div>
      </section>

      {/* 최신 포스트 섹션 Skeleton */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                최신 포스트
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                가장 최근에 작성된 포스트들을 확인하세요
              </p>
            </div>
            <div className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-full">
              전체 보기
            </div>
          </div>
          <PostListSkeleton count={6} />
        </div>
      </section>

      {/* 인기 포스트 섹션 Skeleton */}
      <section className="py-16 bg-white/60 dark:bg-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              인기 포스트
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              많은 분들이 읽고 있는 인기 포스트입니다
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                    🔥 인기
                  </div>
                  <div className="px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full animate-pulse h-6 w-16"></div>
                </div>
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}