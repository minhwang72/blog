'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  EyeIcon, 
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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
    postId: number; // Added postId to the interface
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    
    try {
      const response = await fetch('/api/admin/dashboard', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setRefreshing(false);
      }
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchStats();
  }, []);

  // 60초마다 자동 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 60000); // 60초

    return () => clearInterval(interval);
  }, []);

  // 다른 탭에서의 업데이트 감지
  useEffect(() => {
    const channel = new BroadcastChannel('admin-updates');
    
    channel.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'POST_DELETED' || type === 'POST_CREATED' || type === 'POST_UPDATED') {
        // 즉시 통계 새로고침
        fetchStats();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

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
      icon: PlusIcon,
      color: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-blue-600 dark:to-indigo-700',
      hoverColor: 'hover:from-gray-200 hover:to-gray-300 dark:hover:from-blue-700 dark:hover:to-indigo-800'
    },
    {
      name: '포스트 관리',
      description: '기존 포스트를 편집하거나 삭제합니다',
      href: '/admin/posts',
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-green-600 dark:to-emerald-700',
      hoverColor: 'hover:from-gray-200 hover:to-gray-300 dark:hover:from-green-700 dark:hover:to-emerald-800'
    },
    {
      name: '댓글 관리',
      description: '댓글을 검토하고 관리합니다',
      href: '/admin/comments',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-purple-600 dark:to-violet-700',
      hoverColor: 'hover:from-gray-200 hover:to-gray-300 dark:hover:from-purple-700 dark:hover:to-violet-800'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-blue-600 dark:to-indigo-700 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">관리자 대시보드</h1>
            <p className="text-gray-700 dark:text-blue-100 text-lg">
              블로그 현황을 한눈에 확인하고 효율적으로 관리하세요
            </p>
            <p className="text-sm text-gray-600 dark:text-blue-200 mt-2">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => fetchStats(true)}
              className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              새로고침
            </button>
            <div className="w-16 h-16 bg-gray-300 dark:bg-white/20 rounded-full flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-8 h-8 text-gray-700 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">총 포스트</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalPosts)}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                활성 포스트
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">총 댓글</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalComments)}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                사용자 참여
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">총 조회수</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                <EyeIcon className="w-3 h-3 mr-1" />
                페이지뷰
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2 text-blue-600" />
          빠른 액션
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`group flex flex-col items-center p-6 rounded-xl transition-all duration-200 ${action.color} ${action.hoverColor} transform hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="w-8 h-8 mb-3 text-gray-700 dark:text-white" />
              <div className="text-center">
                <p className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{action.name}</p>
                <p className="text-xs text-gray-700 dark:text-white/90">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 포스트 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
              최근 포스트
            </h3>
            <Link 
              href="/admin/posts" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                      {post.title}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                      <span className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <EyeIcon className="w-3 h-3 mr-1" />
                        {formatNumber(post.viewCount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">최근 포스트가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 최근 댓글 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-green-600" />
              최근 댓글
            </h3>
            <Link 
              href="/admin/comments" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentComments.length > 0 ? (
              stats.recentComments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.name}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {comment.content}
                  </p>
                  <Link 
                    href={`/blog/${comment.postId}`}
                    target="_blank"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    → {comment.postTitle}
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">최근 댓글이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}