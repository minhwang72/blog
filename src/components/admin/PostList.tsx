'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  author: {
    name: string;
  };
  category: {
    name: string;
  } | null;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts: initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);

  const handlePublishToggle = async (postId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('게시물 상태 변경에 실패했습니다.');
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, published: !currentStatus }
            : post
        )
      );
    } catch (error) {
      console.error('Error:', error);
      alert('게시물 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('게시물 삭제에 실패했습니다.');
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error:', error);
      alert('게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>{post.category?.name || '카테고리 없음'}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(post.createdAt), 'PPP', { locale: ko })}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePublishToggle(post.id, post.published)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    post.published
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {post.published ? '공개' : '비공개'}
                </button>
                <a
                  href={`/admin/posts/${post.id}/edit`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                >
                  수정
                </a>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 