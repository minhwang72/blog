'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/lib/db/schema';
import PostCard from './PostCard';

interface RelatedPostsProps {
  postId: number;
}

export default function RelatedPosts({ postId }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/related`);
        if (response.ok) {
          const data = await response.json();
          setRelatedPosts(data);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 