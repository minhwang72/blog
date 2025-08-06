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
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  
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

  // 댓글 렌더링 (재귀적으로 대댓글 포함) - 더 컴팩트하게
  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-4 mt-2' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{comment.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleReply(comment.id)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
            >
              답글
            </button>
            <button
              onClick={() => setEditingComment(editingComment === comment.id ? null : comment.id)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline px-2 py-1"
            >
              ⋯
            </button>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* 수정/삭제 패널 */}
        {editingComment === comment.id && (
          <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded border">
            <div className="flex items-center space-x-1 text-xs">
              <input
                type="password"
                placeholder="비밀번호"
                value={actionPassword}
                onChange={(e) => setActionPassword(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-3 border-l border-gray-200 dark:border-gray-700 pl-2 mt-2">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}

      {/* 답글 폼 */}
      {replyingTo === comment.id && (
        <div className="ml-4 mt-2">
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
        <button
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
          className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>💬 댓글 {totalComments > 0 && `(${totalComments})`}</span>
          <span className="text-sm transform transition-transform duration-200" style={{ transform: isCommentsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        
        {!isFormExpanded && (
          <button
            onClick={() => setIsFormExpanded(true)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            댓글 쓰기
          </button>
        )}
      </div>

      {/* 댓글 작성 폼 (축소 가능) */}
      {isFormExpanded && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">댓글 작성</span>
            <button
              onClick={() => setIsFormExpanded(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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

      {/* 댓글 목록 (접었다 펼 수 있음) */}
      {isCommentsExpanded && (
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요! 💬
            </div>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      )}
    </div>
  );
}

// 컴팩트한 댓글 폼 컴포넌트
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
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          required
        />
      </div>
      <textarea
        placeholder={isReply ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-sm"
        required
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '작성 중...' : isReply ? '답글 작성' : '댓글 작성'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          댓글은 신중하게 작성해주세요
        </span>
      </div>
    </form>
  );
}