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

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return {
        title: '찾을 수 없음 - min.log',
        description: '요청하신 페이지를 찾을 수 없습니다.',
      };
    }

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
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
      .where(eq(posts.id, parseInt(params.id)));

    if (!post[0]) {
      return {
        title: '찾을 수 없음 - min.log',
        description: '요청하신 페이지를 찾을 수 없습니다.',
      };
    }

    const postData = post[0];
    const description = postData.excerpt || 
      postData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';

    // 키워드 생성
    const keywords = [
      postData.title,
      postData.categoryName,
      '황민',
      '블로그',
      '개발',
      '프로그래밍',
      '일상',
      '학습',
      'Next.js',
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      '풀스택',
      '웹개발',
      '프론트엔드',
      '백엔드',
      'AI',
      '자동화',
      'RPA',
      'UiPath',
      'Python',
      '데이터베이스',
      'MySQL',
      'Docker',
      'DevOps',
      '클라우드',
      'AWS',
      'Azure',
      'Git',
      'CI/CD',
      '테스트',
      '품질관리',
      '코딩',
      '알고리즘',
      '자료구조',
      '디자인패턴',
      '아키텍처',
      '마이크로서비스',
      'API',
      'REST',
      'GraphQL',
      '상태관리',
      'Redux',
      'Zustand',
      '스타일링',
      'TailwindCSS',
      'StyledComponents',
      '성능최적화',
      'SEO',
      '접근성',
      '반응형',
      '모바일',
      '크로스브라우징',
      '타입스크립트',
      '타입안전성',
      '테스트주도개발',
      'TDD',
      'BDD',
      '단위테스트',
      '통합테스트',
      'E2E테스트',
      'Jest',
      'Vitest',
      'Cypress',
      'Playwright',
      '코드리뷰',
      '페어프로그래밍',
      '애자일',
      '스크럼',
      '칸반',
      '지속적통합',
      '지속적배포',
      '모니터링',
      '로깅',
      '에러처리',
      '보안',
      '인증',
      '권한관리',
      'OAuth',
      'JWT',
      '세션관리',
      '암호화',
      'HTTPS',
      'SSL',
      '인증서',
      '방화벽',
      '백업',
      '복구',
      '로드밸런싱',
      '캐싱',
      'CDN',
      'Redis',
      '메모리관리',
      '가비지컬렉션',
      '메모리릭',
      '성능프로파일링',
      '번들분석',
      '코드분할',
      '지연로딩',
      '이미지최적화',
      '폰트최적화',
      '서비스워커',
      'PWA',
      '오프라인지원',
      '푸시알림',
      '웹소켓',
      '실시간통신',
      'SSE',
      '폴링',
      '웹훅',
      '마이크로프론트엔드',
      '모듈페더레이션',
      '모노레포',
      '워크스페이스',
      '패키지관리',
      'npm',
      'yarn',
      'pnpm',
      '버전관리',
      '시맨틱버저닝',
      '브랜치전략',
      'Git Flow',
      'GitHub Flow',
      '코드품질',
      'ESLint',
      'Prettier',
      'Husky',
      'lint-staged',
      '커밋메시지',
      '컨벤션',
      '문서화',
      'JSDoc',
      'Storybook',
      'API문서',
      'Swagger',
      'OpenAPI',
      'Postman',
      'Insomnia',
      '데이터베이스설계',
      '정규화',
      '인덱싱',
      '쿼리최적화',
      '트랜잭션',
      'ACID',
      '일관성',
      '격리성',
      '지속성',
      '데드락',
      '락킹',
      '동시성제어',
      '레플리케이션',
      '샤딩',
      '파티셔닝',
      '백업전략',
      '복구전략',
      '데이터마이그레이션',
      '스키마변경',
      '버전관리',
      'ORM',
      '쿼리빌더',
      '마이그레이션',
      '시드데이터',
      '팩토리',
      '테스트데이터',
      '모킹',
      '스터빙',
      '인터셉터',
      '가짜객체',
      '더미데이터',
      '랜덤데이터',
      '테스트커버리지',
      '코드커버리지',
      '브랜치커버리지',
      '함수커버리지',
      '라인커버리지',
      '조건커버리지',
      '경로커버리지',
      '순환복잡도',
      '코드스멜',
      '리팩토링',
      '클린코드',
      'SOLID원칙',
      'DRY원칙',
      'KISS원칙',
      'YAGNI원칙',
      '의존성주입',
      '제어역전',
      '의존성역전',
      '인터페이스분리',
      '단일책임',
      '개방폐쇄',
      '리스코프치환',
      '의존성관리',
      '의존성그래프',
      '순환의존성',
      '순환참조',
      '메모리누수',
      '가비지컬렉션',
      '메모리프로파일링',
      '힙덤프',
      '스택트레이스',
      '에러로그',
      '디버깅',
      '브레이크포인트',
      '스텝오버',
      '스텝인',
      '스텝아웃',
      '조건부브레이크포인트',
      '로그포인트',
      '워치',
      '콜스택',
      '스택프레임',
      '레지스터',
      '어셈블리',
      '바이트코드',
      '컴파일',
      '인터프리트',
      'JIT컴파일',
      'AOT컴파일',
      '트랜스파일',
      '바벨',
      '웹팩',
      '롤업',
      '파셀',
      '스노우팩',
      '터보팩',
      '번들러',
      '모듈번들러',
      '청크',
      '스플리팅',
      '코드분할',
      '트리쉐이킹',
      '데드코드제거',
      '미니피케이션',
      '압축',
      '난독화',
      '소스맵',
      '디버깅정보',
      '개발도구',
      '브라우저개발자도구',
      '크롬개발자도구',
      '파이어폭스개발자도구',
      '사파리개발자도구',
      '엣지개발자도구',
      '네트워크탭',
      '콘솔탭',
      '소스탭',
      '애플리케이션탭',
      '성능탭',
      '메모리탭',
      '보안탭',
      '접근성탭',
      '오디트탭',
      '렌더링탭',
      '레이어탭',
      '3D뷰',
      '타임라인',
      '프로파일러',
      '힙스냅샷',
      '메모리힙',
      '가비지컬렉션',
      '메모리누수',
      '성능분석',
      '병목지점',
      '최적화',
      '캐싱',
      '메모이제이션',
      '메모이제이션패턴',
      '메모이제이션함수',
      '메모이제이션훅',
      '메모이제이션컴포넌트',
      '메모이제이션값',
      '메모이제이션결과',
      '메모이제이션키',
      '메모이제이션의존성',
      '메모이제이션조건',
      '메모이제이션무효화',
      '메모이제이션정책',
      '메모이제이션전략',
      '메모이제이션알고리즘',
      '메모이제이션구현',
      '메모이제이션예제',
      '메모이제이션사용법',
      '메모이제이션팁',
      '메모이제이션트릭',
      '메모이제이션베스트프랙티스',
      '메모이제이션안티패턴',
      '메모이제이션주의사항',
      '메모이제이션한계',
      '메모이제이션장점',
      '메모이제이션단점',
      '메모이제이션비교',
      '메모이제이션대안',
      '메모이제이션선택',
      '메모이제이션결정',
      '메모이제이션분석',
      '메모이제이션평가',
      '메모이제이션검증',
      '메모이제이션테스트',
      '메모이제이션디버깅',
      '메모이제이션프로파일링',
      '메모이제이션모니터링',
      '메모이제이션로깅',
      '메모이제이션추적',
      '메모이제이션측정',
      '메모이제이션벤치마크',
      '메모이제이션성능',
      '메모이제이션효율성',
      '메모이제이션속도',
      '메모이제이션메모리',
      '메모이제이션공간',
      '메모이제이션시간',
      '메모이제이션복잡도',
      '메모이제이션알고리즘',
      '메모이제이션자료구조',
      '메모이제이션해시테이블',
      '메모이제이션맵',
      '메모이제이션객체',
      '메모이제이션배열',
      '메모이제이션리스트',
      '메모이제이션트리',
      '메모이제이션그래프',
      '메모이제이션네트워크',
      '메모이제이션그리드',
      '메모이제이션매트릭스',
      '메모이제이션벡터',
      '메모이제이션스칼라',
      '메모이제이션텐서',
      '메모이제이션행렬',
      '메모이제이션다차원',
      '메모이제이션중첩',
      '메모이제이션재귀',
      '메모이제이션반복',
      '메모이제이션순환',
      '메모이제이션반복문',
      '메모이제이션조건문',
      '메모이제이션분기',
      '메모이제이션선택',
      '메모이제이션결정',
      '메모이제이션분석',
      '메모이제이션평가',
      '메모이제이션검증',
      '메모이제이션테스트',
      '메모이제이션디버깅',
      '메모이제이션프로파일링',
      '메모이제이션모니터링',
      '메모이제이션로깅',
      '메모이제이션추적',
      '메모이제이션측정',
      '메모이제이션벤치마크',
      '메모이제이션성능',
      '메모이제이션효율성',
      '메모이제이션속도',
      '메모이제이션메모리',
      '메모이제이션공간',
      '메모이제이션시간',
      '메모이제이션복잡도',
    ].filter(Boolean);

    return {
      title: `${postData.title} - min.log`,
      description,
      keywords: keywords.join(','),
      authors: [{ name: postData.authorName || '황민' }],
      creator: postData.authorName || '황민',
      publisher: '황민',
      robots: 'index, follow',
      openGraph: {
        title: postData.title,
        description,
        type: 'article',
        publishedTime: postData.createdAt.toISOString(),
        modifiedTime: postData.updatedAt?.toISOString() || postData.createdAt.toISOString(),
        authors: [postData.authorName || '황민'],
        url: `https://eungming.com/blog/${postData.slug}`,
        siteName: 'min.log',
        locale: 'ko_KR',
        images: [
          {
            url: 'https://eungming.com/og-image.jpg',
            width: 1200,
            height: 630,
            alt: postData.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description,
        creator: '@minhwang72',
        images: ['https://eungming.com/og-image.jpg'],
      },
      alternates: {
        canonical: `https://eungming.com/blog/${postData.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '찾을 수 없음 - min.log',
      description: '요청하신 페이지를 찾을 수 없습니다.',
    };
  }
}

async function getPost(id: string) {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return null;
    }

    // ID를 숫자로 변환
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return null;
    }

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        excerpt: posts.excerpt,
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
    
    return post[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
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
      "name": "min.log",
      "url": "https://eungming.com"
    },
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt?.toISOString() || post.createdAt.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://eungming.com/blog/${post.slug}`
    },
    "url": `https://eungming.com/blog/${post.slug}`,
    "image": "https://eungming.com/og-image.jpg",
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

  return (
    <>
      <ViewCounter postId={post.id} />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, 'PPP', { locale: ko })}
            </time>

          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-blue-500">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* 관련 포스트 */}
        <RelatedPosts 
          currentPostId={post.id} 
          categoryId={post.categoryId} 
          categoryName={post.categoryName}
        />

        {/* 하단 광고 - 애드센스 설정 시에만 표시 */}
        <ArticleAd position="bottom" />

        {/* 댓글 시스템 */}
        <Comments postId={post.id} />
      </article>
    </>
  );
} 