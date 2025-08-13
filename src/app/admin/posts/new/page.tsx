'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { KeywordExtractorService } from '@/lib/services/keyword-extractor.service';

// Toast UI Editor를 동적으로 import (SSR 문제 방지)
const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <p>에디터 로딩 중...</p>,
});

import '@toast-ui/editor/dist/toastui-editor.css';

// Toast UI Editor 커스텀 스타일
const editorStyles = `
  .toastui-editor-container {
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }
  
  .toastui-editor-defaultUI {
    border: none;
  }
  
  .toastui-editor-defaultUI-toolbar {
    background: #f9fafb;
    border-bottom: 1px solid #d1d5db;
  }
  
  .toastui-editor-contents {
    font-family: "굴림", Gulim, "Malgun Gothic", sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .toastui-editor-contents .ad-placeholder {
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
    color: #6b7280;
  }
  
  .dark .toastui-editor-container {
    border-color: #4b5563;
  }
  
  .dark .toastui-editor-defaultUI-toolbar {
    background: #374151;
    border-color: #4b5563;
  }
`;

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
    featuredImage: '', // 썸네일 이미지 URL
    tags: [] as string[], // 자동 추출된 태그
    categoryId: '',
    published: true,
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

    // slug 자동 생성 로직 개선
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 특수문자 제거
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .replace(/-+/g, '-') // 연속된 하이픈을 하나로
        .trim();
    };

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          slug: newCategory.slug || generateSlug(newCategory.name),
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

  // 요약 자동 생성 함수
  const generateExcerpt = (content: string) => {
    // HTML 태그 제거
    const plainText = content.replace(/<[^>]*>/g, '');
    // 150자로 제한하고 마지막 단어가 잘리지 않도록 조정
    if (plainText.length <= 150) {
      return plainText;
    }
    const truncated = plainText.substring(0, 150);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };

  // 내용이 변경될 때 요약 자동 생성
  const handleContentChange = (content: string) => {
    setFormData({ ...formData, content });
    
    // 자동 요약 생성
    const plainText = content.replace(/<[^>]*>/g, '');
    const newExcerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    setFormData(prev => ({ ...prev, excerpt: newExcerpt }));

    // 자동 키워드 추출
    if (content.length > 50 && formData.title.length > 5) {
      const extractedTags = KeywordExtractorService.generateTags(content, formData.title);
      setFormData(prev => ({ ...prev, tags: extractedTags }));
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

  const editorRef = useRef<any>(null);

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
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
            </div>

            {/* 썸네일 이미지 */}
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                썸네일 이미지 (선택사항)
              </label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                외부 이미지 URL을 입력하세요. 입력하지 않으면 기본 이미지가 사용됩니다.
              </div>
              {formData.featuredImage && (
                <div className="mt-2">
                  <img 
                    src={formData.featuredImage} 
                    alt="썸네일 미리보기" 
                    className="w-32 h-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* 자동 추출된 태그 */}
            {formData.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  자동 추출된 태그
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  제목과 내용을 기반으로 자동 추출된 태그입니다.
                </div>
              </div>
            )}

            {/* 요약 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  요약 (자동 생성됨)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, excerpt: generateExcerpt(formData.content) })}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  다시 생성
                </button>
              </div>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="내용을 입력하면 자동으로 요약이 생성됩니다"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                내용을 입력하면 자동으로 150자 요약이 생성됩니다. 수동으로 수정할 수도 있습니다.
              </div>
            </div>

            {/* 내용 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  내용 *
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  에디터로 작성하세요
                </div>
              </div>
              
              {previewMode ? (
                <div className="w-full min-h-[400px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <div className="toastui-editor-container">
                  <Editor
                    initialValue={formData.content}
                    height="400px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    language="ko"
                    toolbarItems={[
                      ['heading', 'bold', 'italic', 'strike'],
                      ['hr', 'quote'],
                      ['ul', 'ol', 'task', 'indent', 'outdent'],
                      ['table', 'image', 'link'],
                      ['code', 'codeblock']
                    ]}
                    onLoad={(editor) => {
                      editorRef.current = editor;
                    }}
                    onChange={() => {
                      if (editorRef.current) {
                        const content = editorRef.current.getHTML();
                        handleContentChange(content);
                      }
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (editorRef.current) {
                          const adHtml = '<div class="ad-placeholder" style="background: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; text-align: center; margin: 20px 0; color: #6b7280;">광고 위치</div>';
                          editorRef.current.insertText(adHtml);
                        }
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      광고 삽입
                    </button>
                  </div>
                </div>
              )}
              
              {/* 발행 설정 - 에디터 밖으로 이동 */}
              <div className="mt-4 flex justify-end">
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
              </div>
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