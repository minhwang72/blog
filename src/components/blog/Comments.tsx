'use client';

import { useState, useEffect } from 'react';
import { Comment, CommentFormData } from '@/types/comment';

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(true); // 기본적으로 댓글 표시
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false); // 더보기/접기 상태
  const INITIAL_COMMENT_COUNT = 3; // 처음에 보여줄 댓글 수
  
  // 댓글 폼 데이터
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    name: '',
    password: '',
    parentId: null,
  });

  // 수정/삭제용 비밀번호
  const [actionPassword, setActionPassword] = useState('');

  // 댓글을 트리 구조로 변환
  const organizeComments = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // 모든 댓글을 맵에 추가하고 replies 배열 초기화
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 각 댓글을 적절한 위치에 배치
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
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(organizeComments(data));
      }
    } catch (error) {
      console.error('댓글 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.name.trim() || !formData.password.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ content: '', name: '', password: '', parentId: null });
        setReplyingTo(null);
        await fetchComments();
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
  const handleEdit = async (commentId: number) => {
    if (!actionPassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    const newContent = prompt('수정할 내용을 입력하세요:');
    if (!newContent || !newContent.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          content: newContent,
          password: actionPassword,
        }),
      });

      if (response.ok) {
        setActionPassword('');
        setEditingComment(null);
        await fetchComments();
        alert('댓글이 수정되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!actionPassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          password: actionPassword,
        }),
      });

      if (response.ok) {
        setActionPassword('');
        await fetchComments();
        alert('댓글이 삭제되었습니다!');
      } else {
        const error = await response.json();
        alert(error.error || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 답글 달기
  const handleReply = (parentId: number) => {
    setReplyingTo(parentId);
    setFormData({ ...formData, parentId });
  };

  // 답글 취소
  const cancelReply = () => {
    setReplyingTo(null);
    setFormData({ ...formData, parentId: null });
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 렌더링 (간소화된 스타일 - 박스 제거, 가로선으로 구분)
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
          {/* 헤더 - 더 컴팩트하게 */}
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
            
            {/* 액션 버튼들 - 더 작게 */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => handleReply(comment.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                답글
              </button>
              <button
                onClick={() => setEditingComment(editingComment === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                •••
              </button>
            </div>
          </div>
          
          {/* 댓글 내용 - 더 간단하게 */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-2">
            {comment.content}
          </p>

          {/* 수정/삭제 패널 - 더 컴팩트하게 */}
          {editingComment === comment.id && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={actionPassword}
                  onChange={(e) => setActionPassword(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleEdit(comment.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                >
                  삭제
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setActionPassword('');
                  }}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 답글 폼 */}
          {replyingTo === comment.id && (
            <div className="mt-3">
              <CompactCommentForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={cancelReply}
                submitting={submitting}
                isReply={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 - 더 가벼운 구분선 */}
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
      {/* 댓글 섹션 헤더 - 간소화된 스타일 */}
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
        
        {!isFormExpanded && (
          <button
            onClick={() => setIsFormExpanded(true)}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>댓글 작성</span>
          </button>
        )}
      </div>

      {/* 댓글 작성 폼 (더 간소화) */}
      {isFormExpanded && (
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">댓글 작성</h4>
            <button
              onClick={() => setIsFormExpanded(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <CompactCommentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      )}

      {/* 댓글 목록 - 기본적으로 3개 표시, 더보기 기능 */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </p>
          </div>
        ) : (
          <>
            {/* 처음 3개 댓글 또는 모든 댓글 표시 */}
            {(showAllComments ? comments : comments.slice(0, INITIAL_COMMENT_COUNT)).map((comment) => renderComment(comment))}
            
            {/* 더보기/접기 버튼 */}
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
    </div>
  );
}

// 현대적인 댓글 폼 컴포넌트
interface ModernCommentFormProps {
  formData: CommentFormData;
  setFormData: (data: CommentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitting: boolean;
  isReply?: boolean;
}

// ModernCommentForm을 제거하고 CompactCommentForm만 사용

// 답글용 컴팩트 폼
interface CompactCommentFormProps {
  formData: CommentFormData;
  setFormData: (data: CommentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitting: boolean;
  isReply?: boolean;
}

function CompactCommentForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  submitting, 
  isReply = false 
}: CompactCommentFormProps) {
  return (
    <form onSubmit={onSubmit} className={isReply ? "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 border border-gray-200 dark:border-slate-600" : ""}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            required
          />
        </div>
        <textarea
          placeholder={isReply ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={isReply ? 3 : 4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm"
          required
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>작성 중...</span>
                </>
              ) : (
                <span>{isReply ? '답글 작성' : '댓글 작성'}</span>
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            )}
          </div>
          {!isReply && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              정중한 댓글 부탁드려요 😊
            </span>
          )}
        </div>
      </div>
    </form>
  );
}