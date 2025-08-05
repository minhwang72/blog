import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Post } from '@/lib/db/schema';

interface PostCardProps {
  post: Omit<Post, 'thumbnail' | 'viewCount'> & {
    thumbnail?: string | null;
    viewCount?: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      aria-labelledby={`post-title-${post.id}`}
    >
      {post.thumbnail && (
        <div className="relative h-48">
          <img
            src={post.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
      )}
      <div className="p-6">
        <Link
          href={`/blog/${post.slug}`}
          className="block hover:text-blue-600 dark:hover:text-blue-400"
        >
          <h2
            id={`post-title-${post.id}`}
            className="text-xl font-semibold mb-2"
          >
            {post.title}
          </h2>
        </Link>
        <p
          className="text-gray-600 dark:text-gray-300 text-sm mb-4"
          aria-label="포스트 요약"
        >
          {post.excerpt}
        </p>
        <div
          className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
          aria-label="포스트 메타 정보"
        >
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          {post.viewCount !== undefined && (
            <span aria-label={`조회수 ${post.viewCount}회`}>
              {post.viewCount} views
            </span>
          )}
        </div>
      </div>
    </article>
  );
} 