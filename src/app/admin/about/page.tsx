'use client';

import { useState, useEffect } from 'react';

interface AboutContent {
  id: number | null;
  title: string;
  content: string;
  updatedAt: string;
  updatedBy: number;
}

export default function AdminAboutPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/admin/about');
      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
        setFormData({
          title: data.title,
          content: data.content,
        });
      }
    } catch (error) {
      console.error('Failed to fetch about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('소개 페이지가 성공적으로 수정되었습니다!');
        fetchAboutContent(); // 업데이트된 내용 다시 로드
      } else {
        const errorData = await response.json();
        alert(errorData.message || '소개 페이지 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('소개 페이지 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('변경사항이 취소됩니다. 정말 초기화하시겠습니까?')) {
      if (aboutContent) {
        setFormData({
          title: aboutContent.title,
          content: aboutContent.content,
        });
      }
    }
  };

  const insertSampleContent = () => {
    const sampleContent = `
<div class="text-center mb-12">
  <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
    황민
  </div>
  <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
    안녕하세요!
  </h1>
  <div class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
    <p>개발자로서의 경험과 일상 속 배움을 기록하며,<br/>기술을 쉽고 재밌게 공유하는 블로그를 운영하고 있습니다.</p>
    <p>웹 개발, 자동화 솔루션, AI 기반 워크플로우까지<br/>다양한 분야에서 쌓은 인사이트를 나누며,<br/>저만의 색깔로 성장하는 과정을 담고 있습니다.</p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      🚀 개발 여정
    </h2>
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
      <p>풀스택 개발자로서 프론트엔드부터 백엔드, 인프라까지 다양한 기술 스택을 경험해왔습니다.</p>
      <p>특히 사용자 경험을 중시하며, 기술적 복잡함을 단순하고 직관적인 인터페이스로 녹여내는 것을 즐깁니다.</p>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      🎯 현재 관심사
    </h2>
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed">
      <ul class="space-y-2">
        <li>• AI와 개발 워크플로우의 융합</li>
        <li>• RPA 기반 업무 자동화</li>
        <li>• 개발 생산성을 높이는 도구들</li>
        <li>• 사용자 중심의 UX/UI 설계</li>
      </ul>
    </div>
  </div>
</div>
    `.trim();
    
    setFormData({ ...formData, content: sampleContent });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">소개 페이지 관리</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            블로그의 소개 페이지 내용을 수정할 수 있습니다.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            미리보기
          </a>
        </div>
      </div>

      {/* 소개 페이지 수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                페이지 제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="소개 페이지 제목을 입력하세요"
              />
            </div>

            {/* 내용 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  페이지 내용 * (HTML 지원)
                </label>
                <button
                  type="button"
                  onClick={insertSampleContent}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  샘플 내용 삽입
                </button>
              </div>
              <textarea
                id="content"
                name="content"
                rows={20}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="HTML 형식으로 소개 페이지 내용을 입력하세요"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>HTML 태그를 사용할 수 있습니다. 예: &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;div&gt;, &lt;img&gt;, &lt;a&gt; 등</p>
                <p>Tailwind CSS 클래스를 사용하여 스타일링할 수 있습니다.</p>
                <p>⚠️ 안전한 HTML만 사용하세요. 스크립트 태그는 보안상 제한될 수 있습니다.</p>
              </div>
            </div>

            {/* 메타 정보 */}
            {aboutContent && aboutContent.id && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">메타 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">마지막 수정:</span> {new Date(aboutContent.updatedAt).toLocaleString('ko-KR')}
                  </div>
                  <div>
                    <span className="font-medium">수정자:</span> 관리자 (ID: {aboutContent.updatedBy})
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              초기화
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  저장 중...
                </>
              ) : (
                '저장하기'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 미리보기 섹션 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">실시간 미리보기</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">작성 중인 내용이 어떻게 보일지 확인하세요.</p>
        </div>
        <div className="p-6">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>' }}
          />
        </div>
      </div>
    </div>
  );
}