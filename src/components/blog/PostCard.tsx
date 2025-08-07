import Link from 'next/link';
import { CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: Date;
    updatedAt?: Date;
    authorName?: string;
    categoryName?: string;
    viewCount?: number;
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

  return (
    <Link href={`/blog/${post.id}`} className="block group">
      <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 h-full flex flex-col relative overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-indigo-50/30 to-purple-50/50 dark:from-sky-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 카테고리 태그 */}
        {post.categoryName && (
          <div className="mb-4 relative z-10">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
              {post.categoryName}
            </span>
          </div>
        )}

        {/* 제목 */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 line-clamp-2 relative z-10">
          {post.title}
        </h3>

        {/* 요약 */}
        {post.excerpt && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow relative z-10">
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
            
            {post.viewCount !== undefined && (
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4 text-indigo-500" />
                <span>{post.viewCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* 우상단 장식 요소 */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>
    </Link>
  );
} 