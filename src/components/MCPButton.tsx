'use client';

import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function MCPButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMCPClick = () => {
    // MCP 글 생성 모달이나 페이지로 이동
    window.open('/admin/ai-generator', '_blank');
  };

  return (
    <button
      onClick={handleMCPClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{
        background: 'var(--gradient-primary)',
        color: 'var(--primary-text)',
      }}
    >
      <SparklesIcon className="w-5 h-5" />
      <span className="font-semibold">MCP 기반 글 생성</span>
      
      {/* 호버 효과 */}
      <div
        className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isHovered ? 'opacity-20' : 'opacity-0'
        }`}
        style={{
          background: 'var(--gradient-primary)',
          filter: 'blur(8px)',
        }}
      />
      
      {/* 애니메이션 효과 */}
      <div className="absolute -inset-1 rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-300">
        <div
          className="w-full h-full rounded-lg"
          style={{
            background: 'var(--gradient-primary)',
            filter: 'blur(12px)',
          }}
        />
      </div>
    </button>
  );
} 