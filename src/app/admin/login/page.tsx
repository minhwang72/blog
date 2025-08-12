'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') || 
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };

    checkDarkMode();
    
    // 다크모드 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(checkDarkMode);
    
    return () => mediaQuery.removeListener(checkDarkMode);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 로그인 시도 중...', formData);
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('로그인 응답:', response.status, response.statusText);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 로그인 성공:', data);
        
        // 성공 메시지 표시
        alert('로그인 성공! 관리자 페이지로 이동합니다.');
        
        // 쿠키 설정을 위한 약간의 지연 후 관리자 페이지로 이동
        setTimeout(() => {
          console.log('🔄 관리자 페이지로 이동 중...');
          router.push('/admin');
        }, 100);
        
      } else {
        const errorData = await response.json();
        console.error('로그인 실패:', errorData);
        setError(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
      <div style={{ width: '320px', maxWidth: '100%' }}>
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-1" style={{ color: isDark ? '#ffffff' : '#111827' }}>
            로그인
          </h1>
          <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            관리자 페이지
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="아이디"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1"
              style={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#ffffff' : '#111827',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderColor: isDark ? '#4b5563' : '#d1d5db'
              }}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1"
              style={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#ffffff' : '#111827',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderColor: isDark ? '#4b5563' : '#d1d5db'
              }}
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isDark ? '#ffffff' : '#111827',
              color: isDark ? '#111827' : '#ffffff'
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}