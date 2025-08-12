'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('로그인 시도:', formData);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('로그인 응답 상태:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('로그인 성공:', data);
        // 세션 저장
        localStorage.setItem('adminSession', data.sessionId);
        // 강제로 페이지 새로고침하여 상태 업데이트
        window.location.href = '/admin';
      } else {
        const errorData = await response.json();
        console.log('로그인 실패:', errorData);
        setError(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-sm w-full mx-4">
        {/* 로그인 카드 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-slate-900 dark:bg-white mb-4">
              <svg className="h-6 w-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
              관리자 로그인
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              min.log 관리자 페이지
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                placeholder="관리자 아이디를 입력하세요"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>

            {/* 블로그로 돌아가기 링크 */}
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                ← 블로그로 돌아가기
              </Link>
            </div>
          </form>
        </div>

        {/* 하단 정보 */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2024 min.log
          </p>
        </div>
      </div>
    </div>
  );
}