'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  authorName: string;
  categoryName: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>{post.categoryName}</span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Read More →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 