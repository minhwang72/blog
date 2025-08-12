'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function NewPostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    published: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('카테고리 데이터 가져오는 중...');
      const response = await fetch('/api/categories');
      console.log('카테고리 응답:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('카테고리 데이터:', data);
        setCategories(data);
      } else {
        console.error('카테고리 가져오기 실패:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        setFormData({ ...formData, categoryId: data.id.toString() });
        setNewCategory({ name: '', slug: '' });
        setShowCategoryForm(false);
        alert('카테고리가 생성되었습니다!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || '카테고리 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Category creation error:', error);
      alert('카테고리 생성 중 오류가 발생했습니다.');
    }
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    let insertText = '';
    switch (tag) {
      case 'h2':
        insertText = '<h2>제목</h2>';
        break;
      case 'h3':
        insertText = '<h3>소제목</h3>';
        break;
      case 'p':
        insertText = '<p>단락 텍스트</p>';
        break;
      case 'img':
        insertText = '<img src="이미지URL" alt="이미지 설명" style="max-width: 100%; height: auto;" />';
        break;
      case 'a':
        insertText = '<a href="링크URL" target="_blank" rel="noopener noreferrer">링크 텍스트</a>';
        break;
      case 'code':
        insertText = '<code>코드</code>';
        break;
      case 'pre':
        insertText = '<pre><code>코드 블록</code></pre>';
        break;
      case 'blockquote':
        insertText = '<blockquote>인용문</blockquote>';
        break;
      case 'ul':
        insertText = '<ul>\n  <li>목록 항목 1</li>\n  <li>목록 항목 2</li>\n</ul>';
        break;
      case 'ol':
        insertText = '<ol>\n  <li>번호 목록 1</li>\n  <li>번호 목록 2</li>\n</ol>';
        break;
      case 'table':
        insertText = '<table border="1" style="border-collapse: collapse; width: 100%;">\n  <tr>\n    <th>제목 1</th>\n    <th>제목 2</th>\n  </tr>\n  <tr>\n    <td>내용 1</td>\n    <td>내용 2</td>\n  </tr>\n</table>';
        break;
    }

    const newText = before + insertText + after;
    setFormData({ ...formData, content: newText });
    
    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('포스트가 생성되었습니다!');
        router.push('/admin/posts');
      } else {
        const errorData = await response.json();
        alert(errorData.message || '포스트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('포스트 생성 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
      router.push('/admin/posts');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">새 포스트 작성</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            새로운 블로그 포스트를 작성합니다. HTML 태그를 지원합니다.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {previewMode ? '편집 모드' : '미리보기'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            취소
          </button>
        </div>
      </div>

      {/* 포스트 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="포스트 제목을 입력하세요"
              />
            </div>

            {/* 카테고리 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  카테고리
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  + 새 카테고리
                </button>
              </div>
              
              {showCategoryForm && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        카테고리 이름
                      </label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="카테고리 이름"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        슬러그 (선택사항)
                      </label>
                      <input
                        type="text"
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="자동 생성됨"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      생성
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">카테고리 선택 (선택사항)</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>카테고리 로딩 중...</option>
                )}
              </select>
              {/* 디버깅 정보 */}
              <div className="mt-1 text-xs text-gray-500">
                카테고리 개수: {categories.length}개
              </div>
            </div>

            {/* 요약 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                요약 (선택사항)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="포스트 요약을 입력하세요 (자동 생성됨)"
              />
            </div>

            {/* 내용 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  내용 * (HTML 지원)
                </label>
                <div className="flex space-x-1">
                  {[
                    { tag: 'h2', label: 'H2' },
                    { tag: 'h3', label: 'H3' },
                    { tag: 'p', label: 'P' },
                    { tag: 'img', label: 'IMG' },
                    { tag: 'a', label: 'A' },
                    { tag: 'code', label: 'CODE' },
                    { tag: 'pre', label: 'PRE' },
                    { tag: 'blockquote', label: 'QUOTE' },
                    { tag: 'ul', label: 'UL' },
                    { tag: 'ol', label: 'OL' },
                    { tag: 'table', label: 'TABLE' },
                  ].map(({ tag, label }) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertHtmlTag(tag)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      title={`${label} 태그 삽입`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {previewMode ? (
                <div className="w-full min-h-[400px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <textarea
                  id="content"
                  name="content"
                  rows={20}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="HTML 형식으로 포스트 내용을 입력하세요. 광고는 &lt;div class='ad-placeholder'&gt;광고 위치&lt;/div&gt; 형태로 삽입하세요."
                />
              )}
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                HTML 태그를 사용할 수 있습니다. 예: &lt;h2&gt;, &lt;p&gt;, &lt;img&gt;, &lt;a&gt; 등<br />
                광고 삽입: &lt;div class='ad-placeholder'&gt;광고 위치&lt;/div&gt;
              </div>
            </div>

            {/* 발행 설정 */}
            <div>
              <div className="flex items-center">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  즉시 발행
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                체크하지 않으면 초안으로 저장됩니다.
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              취소
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
                formData.published ? '발행하기' : '초안 저장'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}