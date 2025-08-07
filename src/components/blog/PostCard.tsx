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
      <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-slate-900/80 transition-all duration-300 hover:-translate-y-1 p-6 h-full flex flex-col">
        {/* 카테고리 태그 */}
        {post.categoryName && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
              {post.categoryName}
            </span>
          </div>
        )}

        {/* 제목 */}
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {/* 요약 */}
        {post.excerpt && (
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            {post.viewCount !== undefined && (
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>{post.viewCount}</span>
              </div>
            )}
          </div>


        </div>

        {/* 호버 효과 */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div
            className="w-full h-full rounded-lg"
            style={{
              background: 'var(--gradient-primary)',
              opacity: 0.05,
            }}
          />
        </div>
      </article>
    </Link>
  );
} 