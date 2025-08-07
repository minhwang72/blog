'use client';

import { useState } from 'react';

interface MCPResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function MCPPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MCPResponse | null>(null);

  const handleGeneratePost = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 실제 MCP 서버 호출 (상대경로 사용)
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MCP_API_TOKEN || 'mcp-secure-token-2024'}`,
        },
        body: JSON.stringify({
          tool: 'create_blog_post',
          args: {
            title: title,
            content: content || `제목 "${title}"에 맞는 한국어 블로그 포스트를 HTML 형식으로 작성해주세요. 실용적이고 유용한 내용으로 작성해주세요.`,
          },
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('MCP error:', error);
      setResult({
        success: false,
        message: 'AI 포스트 생성 중 오류가 발생했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClassifyContent = async () => {
    if (!content.trim()) {
      alert('분류할 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MCP_API_TOKEN || 'mcp-secure-token-2024'}`,
        },
        body: JSON.stringify({
          tool: 'classify_content',
          args: {
            content: content,
          },
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('MCP error:', error);
      setResult({
        success: false,
        message: '내용 분류 중 오류가 발생했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MCP 도구</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          AI 기반 블로그 포스트 생성 및 내용 분류 도구입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI 포스트 생성 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🤖 AI 포스트 생성
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  포스트 제목 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="AI가 생성할 포스트의 제목을 입력하세요"
                />
              </div>
       
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  추가 지시사항 (선택사항)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="포스트 작성에 대한 추가 지시사항을 입력하세요 (예: 특정 기술에 대해 다루기, 실용적인 예시 포함 등)"
                />
              </div>
       
              <button
                onClick={handleGeneratePost}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI 생성 중...
                  </>
                ) : (
                  '🤖 AI 포스트 생성'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 내용 분류 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏷️ 내용 분류
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  분류할 내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="분류할 내용을 입력하세요"
                />
              </div>

              <button
                onClick={handleClassifyContent}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    분류 중...
                  </>
                ) : (
                  '내용 분류하기'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 결과
            </h3>
            
            <div className={`p-4 rounded-md ${
              result.success 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex">
                {result.success ? (
                  <svg className="h-5 w-5 text-green-400 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    result.success 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          💡 사용법
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p><strong>🤖 AI 포스트 생성:</strong> 제목을 입력하면 AI가 자동으로 블로그 포스트를 생성합니다. 추가 지시사항을 통해 더 구체적인 내용을 요청할 수 있습니다.</p>
          <p><strong>🏷️ 내용 분류:</strong> 텍스트를 입력하면 적절한 카테고리로 자동 분류됩니다.</p>
          <p><strong>✨ AI 생성 특징:</strong> HTML 형식으로 작성되며, 제목에 맞는 실용적이고 유용한 내용을 자동 생성합니다.</p>
          <p><strong>📝 추가 지시사항:</strong> 특정 기술, 예시, 코드 등을 포함하도록 요청할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
} 