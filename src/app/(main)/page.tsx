import { db } from '@/lib/db';
import { categories, posts, users } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import PostCard from '@/components/blog/PostCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'min.log',
  description: '개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.',
  keywords: '블로그,개발,프로그래밍,기술,학습,Next.js,React,TypeScript,JavaScript,Node.js,풀스택,웹개발,프론트엔드,백엔드,AI,자동화,RPA,UiPath,Python,데이터베이스,MySQL,Docker,DevOps,클라우드,AWS,Azure,Git,CI/CD,테스트,품질관리,코딩,알고리즘,자료구조,디자인패턴,아키텍처,마이크로서비스,API,REST,GraphQL,상태관리,Redux,Zustand,스타일링,TailwindCSS,StyledComponents,성능최적화,SEO,접근성,반응형,모바일,크로스브라우징,타입스크립트,타입안전성,테스트주도개발,TDD,BDD,단위테스트,통합테스트,E2E테스트,Jest,Vitest,Cypress,Playwright,코드리뷰,페어프로그래밍,애자일,스크럼,칸반,지속적통합,지속적배포,모니터링,로깅,에러처리,보안,인증,권한관리,OAuth,JWT,세션관리,암호화,HTTPS,SSL,인증서,방화벽,백업,복구,로드밸런싱,캐싱,CDN,Redis,메모리관리,가비지컬렉션,메모리릭,성능프로파일링,번들분석,코드분할,지연로딩,이미지최적화,폰트최적화,서비스워커,PWA,오프라인지원,푸시알림,웹소켓,실시간통신,SSE,폴링,웹훅,마이크로프론트엔드,모듈페더레이션,모노레포,워크스페이스,패키지관리,npm,yarn,pnpm,버전관리,시맨틱버저닝,브랜치전략,Git Flow,GitHub Flow,코드품질,ESLint,Prettier,Husky,lint-staged,커밋메시지,컨벤션,문서화,JSDoc,Storybook,API문서,Swagger,OpenAPI,Postman,Insomnia,데이터베이스설계,정규화,인덱싱,쿼리최적화,트랜잭션,ACID,일관성,격리성,지속성,데드락,락킹,동시성제어,레플리케이션,샤딩,파티셔닝,백업전략,복구전략,데이터마이그레이션,스키마변경,버전관리,ORM,쿼리빌더,마이그레이션,시드데이터,팩토리,테스트데이터,모킹,스터빙,인터셉터,가짜객체,더미데이터,랜덤데이터,테스트커버리지,코드커버리지,브랜치커버리지,함수커버리지,라인커버리지,조건커버리지,경로커버리지,순환복잡도,코드스멜,리팩토링,클린코드,SOLID원칙,DRY원칙,KISS원칙,YAGNI원칙,의존성주입,제어역전,의존성역전,인터페이스분리,단일책임,개방폐쇄,리스코프치환,의존성관리,의존성그래프,순환의존성,순환참조,메모리누수,가비지컬렉션,메모리프로파일링,힙덤프,스택트레이스,에러로그,디버깅,브레이크포인트,스텝오버,스텝인,스텝아웃,조건부브레이크포인트,로그포인트,워치,콜스택,스택프레임,레지스터,어셈블리,바이트코드,컴파일,인터프리트,JIT컴파일,AOT컴파일,트랜스파일,바벨,웹팩,롤업,파셀,스노우팩,터보팩,번들러,모듈번들러,청크,스플리팅,코드분할,트리쉐이킹,데드코드제거,미니피케이션,압축,난독화,소스맵,디버깅정보,개발도구,브라우저개발자도구,크롬개발자도구,파이어폭스개발자도구,사파리개발자도구,엣지개발자도구,네트워크탭,콘솔탭,소스탭,애플리케이션탭,성능탭,메모리탭,보안탭,접근성탭,오디트탭,렌더링탭,레이어탭,3D뷰,타임라인,프로파일러,힙스냅샷,메모리힙,가비지컬렉션,메모리누수,성능분석,병목지점,최적화,캐싱,메모이제이션,메모이제이션패턴,메모이제이션함수,메모이제이션훅,메모이제이션컴포넌트,메모이제이션값,메모이제이션결과,메모이제이션키,메모이제이션의존성,메모이제이션조건,메모이제이션무효화,메모이제이션정책,메모이제이션전략,메모이제이션알고리즘,메모이제이션구현,메모이제이션예제,메모이제이션사용법,메모이제이션팁,메모이제이션트릭,메모이제이션베스트프랙티스,메모이제이션안티패턴,메모이제이션주의사항,메모이제이션한계,메모이제이션장점,메모이제이션단점,메모이제이션비교,메모이제이션대안,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도,메모이제이션알고리즘,메모이제이션자료구조,메모이제이션해시테이블,메모이제이션맵,메모이제이션객체,메모이제이션배열,메모이제이션리스트,메모이제이션트리,메모이제이션그래프,메모이제이션네트워크,메모이제이션그리드,메모이제이션매트릭스,메모이제이션벡터,메모이제이션스칼라,메모이제이션텐서,메모이제이션행렬,메모이제이션다차원,메모이제이션중첩,메모이제이션재귀,메모이제이션반복,메모이제이션순환,메모이제이션반복문,메모이제이션조건문,메모이제이션분기,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도',
  authors: [{ name: '개발자' }],
  creator: '개발자',
  publisher: '개발자',
  robots: 'index, follow',
  openGraph: {
    title: 'min.log - 개발자의 기록 공간',
    description: '개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.',
    url: 'https://eungming.com',
    siteName: 'min.log',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'min.log - 개발자의 기록 공간',
    description: '개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.',
    creator: '@minhwang72',
  },
  alternates: {
    canonical: 'https://eungming.com',
  },
};

async function getPosts(categorySlug?: string) {
  try {
    // 기본 쿼리 구성
    let whereConditions = [eq(posts.published, true)];
    
    // 카테고리 필터링 추가
    if (categorySlug && categorySlug !== 'all') {
      whereConditions.push(eq(categories.slug, categorySlug));
    }

    // Drizzle ORM 타입 문제로 인해 any 사용
    const allPosts: any = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        authorName: users.name,
        categoryName: categories.name,
        categorySlug: categories.slug,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...whereConditions))
      .orderBy(desc(posts.createdAt));
    
    return Array.isArray(allPosts) ? allPosts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

interface PageProps {
  searchParams: { category?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const categorySlug = searchParams.category || 'all';
  const posts = await getPosts(categorySlug);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-12 py-16">
            <div className="space-y-8">
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent leading-tight tracking-tight">
                  개발자의 기록 공간
                </h1>
                <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-sky-100/50 via-slate-100/50 to-gray-100/50 dark:from-sky-900/20 dark:via-slate-900/20 dark:to-gray-900/20 rounded-3xl blur-3xl -z-10 opacity-40"></div>
              </div>
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed font-medium">
                  기술과 배움, 그리고 일상의 순간들을 기록하는 블로그입니다.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  새로운 기술을 탐구하고, 경험을 공유하며, 함께 성장하는 지식의 공간입니다.
                </p>
              </div>
            </div>
            
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600">
                <div className="text-4xl font-bold text-sky-600 dark:text-sky-400 mb-2">{posts.length}</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">총 포스트</div>
                <div className="absolute top-4 right-4 text-sky-200 dark:text-sky-800 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="text-4xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                  {posts.reduce((sum, post: any) => sum + (post.viewCount || 0), 0)}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">총 조회수</div>
                <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-600">
                <div className="text-4xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  {new Set(posts.map((post: any) => post.categoryName)).size}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">카테고리</div>
                <div className="absolute top-4 right-4 text-gray-200 dark:text-gray-800 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {categorySlug === 'all' ? '최근 포스트' : `${posts[0]?.categoryName || '카테고리'} 포스트`}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                {posts.length}개의 포스트
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  아직 포스트가 없습니다
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  첫 번째 포스트를 기다리고 있습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
} 