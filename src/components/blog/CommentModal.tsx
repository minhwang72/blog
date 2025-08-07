'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Trash2, MessageSquare } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; name: string; password: string; parentId?: number }) => void;
  onEdit?: (data: { commentId: number; content: string; password: string }) => void;
  onDelete?: (data: { commentId: number; password: string }) => void;
  mode: 'create' | 'edit' | 'delete';
  initialData?: {
    commentId?: number;
    content?: string;
    parentId?: number;
  };
  submitting: boolean;
}

export default function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
  mode,
  initialData,
  submitting
}: CommentModalProps) {
  const [formData, setFormData] = useState({
    content: '',
    name: '',
    password: '',
  });

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData?.content) {
        // 수정 모드: 기존 내용 로드
        setFormData({
          content: initialData.content,
          name: '',
          password: '',
        });
      } else {
        // 생성 모드: 폼 초기화
        setFormData({
          content: '',
          name: '',
          password: '',
        });
      }
    }
  }, [isOpen, mode, initialData?.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      if (!formData.content.trim() || !formData.name.trim() || !formData.password.trim()) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      onSubmit({
        content: formData.content,
        name: formData.name,
        password: formData.password,
        parentId: initialData?.parentId,
      });
    } else if (mode === 'edit' && onEdit) {
      if (!formData.content.trim() || !formData.password.trim()) {
        alert('내용과 비밀번호를 입력해주세요.');
        return;
      }
      onEdit({
        commentId: initialData?.commentId!,
        content: formData.content,
        password: formData.password,
      });
    } else if (mode === 'delete' && onDelete) {
      if (!formData.password.trim()) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
      if (confirm('정말 삭제하시겠습니까?')) {
        onDelete({
          commentId: initialData?.commentId!,
          password: formData.password,
        });
      }
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return initialData?.parentId ? '답글 작성' : '댓글 작성';
      case 'edit':
        return '댓글 수정';
      case 'delete':
        return '댓글 삭제';
      default:
        return '댓글';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'create':
        return <MessageSquare className="w-5 h-5" />;
      case 'edit':
        return <Edit className="w-5 h-5" />;
      case 'delete':
        return <Trash2 className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg">
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'create' && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                required
              />
            </div>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <textarea
              placeholder={mode === 'create' ? (initialData?.parentId ? "답글을 입력하세요..." : "댓글을 입력하세요...") : "수정할 내용을 입력하세요..."}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none text-sm"
              required
            />
          )}

          {mode === 'delete' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          )}

          {(mode === 'edit' || mode === 'delete') && (
            <input
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              required
            />
          )}

          {/* 버튼 */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center space-x-2 px-4 py-2 text-white text-sm rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'delete' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:ring-red-500' 
                  : 'bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 focus:ring-violet-500'
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>처리 중...</span>
                </>
              ) : (
                <span>
                  {mode === 'create' ? '작성' : mode === 'edit' ? '수정' : '삭제'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 