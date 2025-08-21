import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts, categories, users } from '@/lib/db/schema';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Metadata } from 'next';
import Script from 'next/script';
import ViewCounter from '@/components/ViewCounter';
import Comments from '@/components/blog/Comments';
import ArticleAd from '@/components/ads/ArticleAd';
import RelatedPosts from '@/components/blog/RelatedPosts';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return {
        title: '잘못된 요청',
        description: '잘못된 포스트 ID입니다.',
      };
    }

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        authorName: users.name,
        categoryId: posts.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, postId));

    if (!post[0]) {
      return {
        title: '찾을 수 없음',
        description: '요청하신 페이지를 찾을 수 없습니다.',
      };
    }

    const postData = post[0];
    const description = postData.excerpt || 
      postData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

    return {
      title: postData.title,
      description,
              keywords: [
          postData.title,
          postData.categoryName,
          '바이브코딩',
          'MCP',
          '블로그 시스템',
          '황민',
          '응명',
          '개발',
          '프로그래밍',
          'React',
          'Next.js',
          'TypeScript',
          'JavaScript',
          'AI',
          '자동화',
          '웹개발',
          '풀스택',
          '프론트엔드',
          '백엔드',
          '블로그',
          '튜토리얼',
          '가이드',
          'Claude',
          'Cursor',
          'OpenAI',
          'GPT',
          '인공지능',
          '머신러닝',
          'LLM',
          '대화형 AI',
          '코딩',
          '개발팁',
          '프로젝트',
          '경험담',
          '기술블로그'
        ].filter(Boolean) as string[],
      authors: [{ name: postData.authorName || '황민' }],
      creator: postData.authorName || '황민',
      publisher: '황민',
      robots: 'index, follow',
      openGraph: {
        title: postData.title,
        description,
        url: `https://eungming.com/blog/${postData.id}`,
        siteName: '응명 로그',
        locale: 'ko_KR',
        type: 'article',
        publishedTime: postData.createdAt.toISOString(),
        modifiedTime: postData.updatedAt?.toISOString() || postData.createdAt.toISOString(),
        authors: [postData.authorName || '황민'],
        tags: [postData.categoryName, '개발', '블로그'].filter(Boolean) as string[],
        images: [
          {
            url: postData.featuredImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop&crop=center',
            width: 1200,
            height: 630,
            alt: postData.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description,
        creator: '@minhwang72',
      },
      alternates: {
        canonical: `https://eungming.com/blog/${postData.id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '오류',
      description: '페이지를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

async function getPost(id: string) {
  try {
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return null;
    }

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        authorName: users.name,
        categoryId: posts.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, postId));
    
    return post[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 글 길이에 따른 광고 배치 전략
function getAdPositions(contentLength: number) {
  const positions: Array<{ position: 'top' | 'middle' | 'bottom', priority: number }> = [];
  
  if (contentLength >= 5000) {
    // 긴 글: 상단, 중간, 하단 (3개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'middle', priority: 2 });
    positions.push({ position: 'bottom', priority: 3 });
  } else if (contentLength >= 2000) {
    // 중간 글: 상단, 중간, 하단 (3개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'middle', priority: 2 });
    positions.push({ position: 'bottom', priority: 3 });
  } else if (contentLength >= 1000) {
    // 짧은 글: 상단, 하단 (2개)
    positions.push({ position: 'top', priority: 1 });
    positions.push({ position: 'bottom', priority: 2 });
  } else {
    // 매우 짧은 글: 하단만 (1개)
    positions.push({ position: 'bottom', priority: 1 });
  }
  
  return positions;
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // 구조화된 데이터 생성
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 200),
    "author": {
      "@type": "Person",
      "name": post.authorName || "황민"
    },
    "publisher": {
      "@type": "Organization",
      "name": "응명 로그",
      "url": "https://eungming.com"
    },
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt?.toISOString() || post.createdAt.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://eungming.com/blog/${post.id}`
    },
    "url": `https://eungming.com/blog/${post.id}`,
    "image": post.featuredImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop&crop=center",
    "articleSection": post.categoryName,
    "keywords": [
      post.title,
      post.categoryName,
      "황민",
      "블로그",
      "개발",
      "프로그래밍"
    ].filter(Boolean)
  };

  // BreadcrumbList 스키마
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://eungming.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "블로그",
        "item": "https://eungming.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.categoryName || "기본",
        "item": post.categorySlug ? `https://eungming.com/categories/${post.categorySlug}` : "https://eungming.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `https://eungming.com/blog/${post.id}`
      }
    ]
  };

  // 글 길이에 따른 광고 배치 결정
  const adPositions = getAdPositions(post.content.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ViewCounter postId={post.id} />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        
        {/* Breadcrumb 네비게이션 */}
        <Breadcrumb
          items={[
            { label: '블로그', href: '/blog' },
            { label: post.categoryName || '기본', href: post.categorySlug ? `/categories/${post.categorySlug}` : '/blog' },
            { label: post.title }
          ]}
        />
        
        <article className="prose prose-lg dark:prose-invert max-w-none min-w-0">
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl break-words">
                {post.title}
              </h1>
              <a
                href={`/admin/posts/${post.id}/edit`}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors opacity-70 hover:opacity-100 flex-shrink-0 ml-4"
                title="관리자 편집"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'PPP', { locale: ko })}
              </time>
              {post.categoryName && (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50 whitespace-nowrap">
                  {post.categoryName}
                </span>
              )}
            </div>
            {post.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg break-words">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* 상단 광고 */}
          {adPositions.some(p => p.position === 'top') && (
            <ArticleAd 
              position="top" 
              postId={post.id}
              contentLength={post.content.length}
            />
          )}

          <MarkdownRenderer content={post.content} />

          {/* 중간 광고 */}
          {adPositions.some(p => p.position === 'middle') && (
            <ArticleAd 
              position="middle" 
              postId={post.id}
              contentLength={post.content.length}
            />
          )}

          {/* 하단 광고 */}
          {adPositions.some(p => p.position === 'bottom') && (
            <ArticleAd 
              position="bottom" 
              postId={post.id}
              contentLength={post.content.length}
            />
          )}

          {/* 관련 포스트 - 부드러운 스타일 */}
          <RelatedPosts 
            currentPostId={post.id} 
            categoryId={post.categoryId || undefined} 
            categoryName={post.categoryName || undefined}
          />

          {/* 댓글 시스템 */}
          <Comments postId={post.id} />
        </article>
      </div>
    </div>
  );
} 