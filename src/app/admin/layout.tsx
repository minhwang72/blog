'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);

  useEffect(() => {
    // 로그인 페이지에서는 인증 체크를 하지 않음
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        console.log('🔐 인증 체크 시작...');
        const response = await fetch('/api/admin/me');
        console.log('인증 응답:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ 인증 성공:', data);
          setIsAuthenticated(true);
          setAdminInfo(data.admin);
        } else {
          console.log('❌ 인증 실패:', response.status);
          // 세션이 만료되었거나 유효하지 않음
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/admin/login');
    }
  };

  // 로그인 페이지인 경우 바로 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">관리자 페이지 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { 
      name: '대시보드', 
      href: '/admin', 
      icon: ChartBarIcon,
      description: '전체 통계 및 개요'
    },
    { 
      name: '포스트 관리', 
      href: '/admin/posts', 
      icon: DocumentTextIcon,
      description: '블로그 포스트 작성 및 관리'
    },
    { 
      name: '댓글 관리', 
      href: '/admin/comments', 
      icon: ChatBubbleLeftRightIcon,
      description: '사용자 댓글 관리'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 메인 헤더와 푸터 숨기기 */}
      <style jsx global>{`
        header, footer {
          display: none !important;
        }
      `}</style>
      
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* 로고 영역 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Cog6ToothIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              관리자
            </span>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs mt-0.5 transition-colors duration-200 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 하단 사용자 정보 */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {adminInfo?.username || '관리자'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  관리자 계정
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              title="로그아웃"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        {/* 상단 헤더 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => 
                  pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                )?.name || '관리자 대시보드'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                블로그 보기
              </Link>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}