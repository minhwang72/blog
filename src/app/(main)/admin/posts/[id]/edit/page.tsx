'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
}

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, categoriesRes, tagsRes] = await Promise.all([
          fetch(`/api/admin/posts/${params.id}`),
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags'),
        ]);

        if (!postRes.ok || !categoriesRes.ok || !tagsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [postData, categoriesData, tagsData] = await Promise.all([
          postRes.json(),
          categoriesRes.json(),
          tagsRes.json(),
        ]);

        setPost(postData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching post:', error.message);
        }
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/admin/posts/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-500">
        {error || 'Post not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
        <PostEditor
          initialData={post}
          categories={categories}
          tags={tags}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
} 