'use client';

import { useState, useEffect } from 'react';
import { Comment, CommentFormData } from '@/types/comment';
import CommentModal from './CommentModal';

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const INITIAL_COMMENT_COUNT = 3;
  
  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [modalData, setModalData] = useState<{
    commentId?: number;
    content?: string;
    parentId?: number;
  }>({});

  // 댓글을 트리 구조로 변환
  const organizeComments = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  // 댓글 조회
  const fetchComments = async () => {
    try {
      console.log('댓글 조회 시작:', postId);
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        mode: 'cors',
      });
      console.log('댓글 응답 상태:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('댓글 데이터:', data);
        setComments(organizeComments(data));
      }
    } catch (error) {
      console.error('댓글 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성
  const handleCreateComment = async (data: { content: string; name: string; password: string; parentId?: number }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchComments();
        setModalOpen(false);
        alert('댓글이 작성되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (data: { commentId: number; content: string; password: string }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchComments();
        setModalOpen(false);
        alert('댓글이 수정되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (data: { commentId: number; password: string }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchComments();
        setModalOpen(false);
        alert('댓글이 삭제되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 모달 열기
  const openModal = (mode: 'create' | 'edit' | 'delete', data?: { commentId?: number; content?: string; parentId?: number }) => {
    setModalMode(mode);
    setModalData(data || {});
    setModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setModalData({});
  };

  // 답글 달기
  const handleReply = (parentId: number) => {
    openModal('create', { parentId });
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 렌더링
  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'} ${depth === 0 ? 'border-b border-gray-100 dark:border-gray-800 pb-4' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* 작은 아바타 */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
            {comment.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {comment.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            
            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => handleReply(comment.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                답글
              </button>
              <button
                onClick={() => openModal('edit', { commentId: comment.id, content: comment.content })}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                수정
              </button>
              <button
                onClick={() => openModal('delete', { commentId: comment.id })}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                삭제
              </button>
            </div>
          </div>
          
          {/* 댓글 내용 */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-2">
            {comment.content}
          </p>
        </div>
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 border-l border-gray-200 dark:border-gray-700 pl-3 mt-2">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  const totalComments = comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0);

  if (loading) {
    return (
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          💬 댓글을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      {/* 댓글 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            댓글 {totalComments > 0 && `${totalComments}개`}
          </h3>
        </div>
        
        <button
          onClick={() => openModal('create')}
          className="inline-flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>댓글 작성</span>
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </p>
          </div>
        ) : (
          <>
            {(showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT)).map((comment) => renderComment(comment))}
            
            {comments.length > INITIAL_COMMENT_COUNT && (
              <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="inline-flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                >
                  {showAllComments ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>댓글 접기</span>
                    </>
                  ) : (
                    <>
                      <span>댓글 {comments.length - INITIAL_COMMENT_COUNT}개 더 보기</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 댓글 모달 */}
      <CommentModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleCreateComment}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        mode={modalMode}
        initialData={modalData}
        submitting={submitting}
      />
    </div>
  );
}