'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-300 dark:text-red-600 mb-4">500</div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              서버 오류가 발생했습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
