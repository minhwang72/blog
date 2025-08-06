'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: Date;
  categoryName?: string;
}

interface RelatedPostsProps {
  currentPostId: number;
  categoryId?: number;
  categoryName?: string;
}

export default function RelatedPosts({ currentPostId, categoryId, categoryName }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/${currentPostId}/related?categoryId=${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setRelatedPosts(data);
        }
      } catch (error) {
        console.error('관련 포스트 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, categoryId]);

  if (loading) {
    return (
      <div className="my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          관련 포스트를 불러오는 중...
        </div>
      </div>
    );
  }

  // 디버그용: 개발 환경에서는 관련 포스트가 없어도 컴포넌트 표시
  if (relatedPosts.length === 0) {
    return (
      <div className="my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {categoryName || '다른 글'}
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          {categoryName ? 
            `${categoryName} 카테고리에 아직 다른 글이 없습니다.` : 
            '아직 관련 포스트가 없습니다.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {categoryName || '다른 글'}
        </h3>
      </div>
      
      <div className="space-y-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="block p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {post.excerpt}
                  </p>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="ml-2 flex-shrink-0">
                <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {relatedPosts.length > 0 && categoryName && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <Link
            href={`/category/${categoryName.toLowerCase()}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {categoryName} 카테고리의 모든 글 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}