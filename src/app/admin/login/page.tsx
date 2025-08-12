'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [showManualLink, setShowManualLink] = useState(false);
  const router = useRouter();

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
    setShowManualLink(false);

    try {
      console.log('로그인 시도 중...', formData);
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('로그인 응답:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('로그인 성공:', data);
        
        // 로컬 스토리지에 세션 저장
        localStorage.setItem('adminSession', data.sessionId);
        
        // 성공 메시지 표시
        alert('로그인 성공! 관리자 페이지로 이동합니다.');
        
        // Next.js router를 사용한 페이지 이동
        setTimeout(() => {
          console.log('페이지 이동 시도 중...');
          try {
            router.push('/admin');
            console.log('router.push 호출 완료');
            
            // 3초 후에도 이동이 안 되면 수동 링크 표시
            setTimeout(() => {
              console.log('수동 링크 표시');
              setShowManualLink(true);
            }, 3000);
          } catch (error) {
            console.error('router.push 에러:', error);
            setShowManualLink(true);
          }
        }, 1000);
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

        {showManualLink && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
              자동 이동이 안 되었습니다. 아래 링크를 클릭하세요:
            </p>
            <Link
              href="/admin"
              className="block w-full py-2 px-4 bg-yellow-600 text-white text-sm text-center rounded-md hover:bg-yellow-700"
            >
              관리자 페이지로 이동
            </Link>
          </div>
        )}

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