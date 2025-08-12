'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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
    setLoginSuccess(false);

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
        
        // 로그인 성공 상태로 변경
        setLoginSuccess(true);
        
        // 성공 메시지 표시
        alert('로그인 성공! 관리자 페이지로 이동합니다.');
        
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

  const handleAdminRedirect = () => {
    // 여러 방법으로 관리자 페이지 접근 시도
    console.log('관리자 페이지 접근 시도...');
    
    // 방법 1: 새 창에서 열기
    window.open('/admin', '_blank');
    
    // 방법 2: 현재 창에서 이동
    setTimeout(() => {
      window.location.href = '/admin';
    }, 500);
    
    // 방법 3: replace로 이동
    setTimeout(() => {
      window.location.replace('/admin');
    }, 1000);
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
        <div style={{ width: '400px', maxWidth: '100%' }}>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-1" style={{ color: isDark ? '#ffffff' : '#111827' }}>
              ✅ 로그인 성공!
            </h1>
            <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              관리자 페이지로 이동하세요
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAdminRedirect}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              🚀 관리자 페이지로 이동
            </button>
            
            <button
              onClick={() => window.open('/admin', '_blank')}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              🔗 새 창에서 관리자 페이지 열기
            </button>
            
            <Link
              href="/admin"
              className="block w-full py-3 px-4 bg-gray-600 text-white text-center rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              📝 링크로 관리자 페이지 접근
            </Link>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setLoginSuccess(false)}
              className="text-sm"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              다시 로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

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