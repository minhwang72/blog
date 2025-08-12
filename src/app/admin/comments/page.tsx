'use client';

import { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  FunnelIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  name: string;
  email: string;
  createdAt: string;
  postId: number;
  postTitle: string;
  parentId: number | null;
  isReply: boolean;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'comments' | 'replies'>('all');
  const commentsPerPage = 20;

  useEffect(() => {
    fetchComments();
  }, [currentPage, filter]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: commentsPerPage.toString(),
        filter: filter
      });
      
      const response = await fetch(`/api/admin/comments?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch comments:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?\n대댓글이 있는 경우 함께 삭제됩니다.')) return;

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('댓글이 삭제되었습니다.');
        fetchComments();
      } else {
        const errorData = await response.json();
        alert(errorData.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
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

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">댓글 관리</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              사용자 댓글을 검토하고 관리할 수 있습니다.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>총 {comments.length}개의 댓글</span>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 필터 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center ${
                filter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FunnelIcon className="w-4 h-4 mr-1" />
              전체
            </button>
            <button
              onClick={() => setFilter('comments')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center ${
                filter === 'comments'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
              댓글
            </button>
            <button
              onClick={() => setFilter('replies')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center ${
                filter === 'replies'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
              답글
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.name}
                        </span>
                        {comment.isReply && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            <ArrowUturnLeftIcon className="w-3 h-3 mr-1" />
                            답글
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-3">
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <Link 
                        href={`/blog/${comment.postId}`}
                        target="_blank"
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        <DocumentTextIcon className="w-3 h-3 mr-1" />
                        {comment.postTitle}
                      </Link>
                      <span className="text-blue-600 dark:text-blue-400">
                        {comment.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="삭제"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              댓글이 없습니다.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              블로그 포스트에 댓글이 작성되면 여기에 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}