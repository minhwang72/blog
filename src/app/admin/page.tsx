'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  recentPosts: Array<{
    id: number;
    title: string;
    createdAt: string;
    viewCount: number;
  }>;
  recentComments: Array<{
    id: number;
    content: string;
    name: string;
    createdAt: string;
    postTitle: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const quickActions = [
    {
      name: '새 포스트 작성',
      description: '새로운 블로그 포스트를 작성합니다',
      href: '/admin/posts/new',
      icon: '✍️',
      color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      textColor: 'text-blue-900 dark:text-blue-100',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: '포스트 관리',
      description: '기존 포스트를 편집하거나 삭제합니다',
      href: '/admin/posts',
      icon: '📝',
      color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
      textColor: 'text-green-900 dark:text-green-100',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      name: '댓글 관리',
      description: '댓글을 검토하고 관리합니다',
      href: '/admin/comments',
      icon: '💬',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      textColor: 'text-yellow-900 dark:text-yellow-100',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      name: '광고 설정',
      description: 'Google AdSense 광고를 관리합니다',
      href: '/admin/ads',
      icon: '📢',
      color: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      textColor: 'text-purple-900 dark:text-purple-100',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: '소개페이지',
      description: 'About 페이지 내용을 수정합니다',
      href: '/admin/about',
      icon: 'ℹ️',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
      textColor: 'text-indigo-900 dark:text-indigo-100',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🛠️ 관리자 대시보드
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          블로그 현황을 한눈에 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 포스트</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 댓글</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 조회수</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">🚀 빠른 액션</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`flex items-center p-4 rounded-lg transition-colors ${action.color}`}
            >
              <span className={`text-2xl mr-3 ${action.iconColor}`}>{action.icon}</span>
              <div>
                <p className={`text-sm font-medium ${action.textColor}`}>{action.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 포스트 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📝 최근 포스트</h3>
            <Link href="/admin/posts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    👁️ {post.viewCount}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                최근 포스트가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* 최근 댓글 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">💬 최근 댓글</h3>
            <Link href="/admin/comments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentComments.length > 0 ? (
              stats.recentComments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {comment.content}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    → {comment.postTitle}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                최근 댓글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}