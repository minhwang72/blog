'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Comment as CommentType, User } from '@/lib/db/schema';

interface CommentWithAuthor extends CommentType {
  author: User;
  replies?: CommentWithAuthor[];
}

interface CommentProps {
  comment: CommentWithAuthor;
  onReply: (commentId: number, content: string) => Promise<void>;
}

export default function Comment({ comment, onReply }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="font-semibold mr-2">{comment.author.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isReplying ? '취소' : '답글'}
        </button>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.content}</p>
      {isReplying && (
        <form onSubmit={handleReply} className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              답글 작성
            </button>
          </div>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
} 