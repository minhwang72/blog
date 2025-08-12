import Link from 'next/link';
import { CalendarIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    authorName?: string | null;
    categoryName?: string | null;
    viewCount?: number | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
    return `${Math.floor(diffInDays / 365)}년 전`;
  };

  return (
    <Link href={`/blog/${post.id}`} className="block group">
      <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 h-full flex flex-col relative overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-blue-50/30 to-indigo-50/50 dark:from-sky-900/10 dark:via-blue-900/5 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 카테고리 태그 */}
        {post.categoryName && (
          <div className="mb-4 relative z-10">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800 shadow-sm">
              {post.categoryName}
            </span>
          </div>
        )}

        {/* 제목 */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 line-clamp-2 relative z-10 leading-tight">
          {post.title}
        </h3>

        {/* 요약 */}
        {post.excerpt && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow relative z-10 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="mt-auto space-y-3 relative z-10">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-sky-500" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            {post.viewCount !== undefined && post.viewCount !== null && (
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4 text-slate-500" />
                <span>{post.viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          {/* 상대적 시간 표시 */}
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <ClockIcon className="w-3 h-3" />
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>

        {/* 우상단 장식 요소 */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 하단 그라데이션 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    </Link>
  );
} 