'use client';

import { useState } from 'react';
import { Comment as CommentType, User } from '@/lib/db/schema';
import Comment from './Comment';

interface CommentWithAuthor extends CommentType {
  author: User;
  replies?: CommentWithAuthor[];
}

interface CommentListProps {
  comments: CommentWithAuthor[];
  onAddComment: (content: string) => Promise<void>;
  onReply: (commentId: number, content: string) => Promise<void>;
}

export default function CommentList({
  comments,
  onAddComment,
  onReply,
}: CommentListProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">댓글</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            댓글 작성
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
} 