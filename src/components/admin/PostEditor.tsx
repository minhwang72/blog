'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface PostEditorProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    excerpt?: string;
    slug?: string;
    published?: boolean;
    categoryId?: number | null;
  };
  categories: Category[];
}

export default function PostEditor({
  initialData,
  categories,
}: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState<number | undefined | null>(
    initialData?.categoryId
  );
  const [published, setPublished] = useState(initialData?.published || false);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ type: 'success', message: '이미지 업로드 중...' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // 에디터에 이미지 태그 삽입
      const imageTag = `<img src="${result.url}" alt="${result.originalName}" style="max-width: 100%; height: auto;" />`;
      setContent(prev => prev + '\n\n' + imageTag + '\n\n');
      
      setUploadStatus({ type: 'success', message: '이미지가 성공적으로 업로드되었습니다!' });
      
      // 3초 후 메시지 숨기기
      setTimeout(() => setUploadStatus(null), 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ type: 'error', message: '이미지 업로드에 실패했습니다.' });
      setTimeout(() => setUploadStatus(null), 5000);
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        initialData?.id ? `/api/posts/${initialData.id}` : '/api/posts',
        {
          method: initialData?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            excerpt,
            slug,
            categoryId,
            published,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      setError('게시물 저장에 실패했습니다.');
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          슬러그
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700"
        >
          요약
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          카테고리
        </label>
        <select
          id="category"
          value={categoryId || ''}
          onChange={(e) =>
            setCategoryId(e.target.value ? parseInt(e.target.value) : null)
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            내용 (HTML/Markdown 지원)
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-green-600 hover:text-green-500"
              >
                📷 이미지 업로드
              </button>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">공개</span>
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isPreview ? '편집' : '미리보기'}
            </button>
          </div>
        </div>
        
        {/* 업로드 상태 표시 */}
        {uploadStatus && (
          <div className={`mt-2 p-2 rounded ${
            uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {uploadStatus.message}
          </div>
        )}

        {/* HTML/Markdown 도움말 */}
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <p><strong>지원 형식:</strong></p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>이미지:</strong> &lt;img src="/path" alt="설명" /&gt;</p>
              <p><strong>링크:</strong> &lt;a href="url"&gt;텍스트&lt;/a&gt;</p>
            </div>
            <div>
              <p><strong>Markdown:</strong> ![alt](url), [text](url)</p>
              <p><strong>제목:</strong> # 제목, ## 부제목</p>
            </div>
          </div>
        </div>

        {isPreview ? (
          <div className="mt-2 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-blue-500">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            required
            placeholder="HTML 태그나 Markdown 문법을 사용하여 작성하세요...

예시:
<h2>제목</h2>
<p>일반 텍스트</p>
<img src='/uploads/images/example.jpg' alt='이미지 설명' />
<a href='https://example.com'>링크</a>

또는 Markdown:
## 제목
**굵은 글씨** *기울임* 
![이미지](url)
[링크](url)"
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono text-sm"
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '저장 중...' : initialData?.id ? '수정' : '작성'}
        </button>
      </div>
    </form>
  );
} 