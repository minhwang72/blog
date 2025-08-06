'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  postId: number;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
  useEffect(() => {
    // 조회수 증가 API 호출
    const incrementView = async () => {
      try {
        await fetch(`/api/posts/${postId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    // 페이지 로드 시 조회수 증가
    incrementView();
  }, [postId]);

  return null; // 렌더링할 UI가 없음
}