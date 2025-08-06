import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    default: "min.log",
    template: "%s - min.log"
  },
  description: "개발, 일상, 그리고 배움에 대한 기록. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
  keywords: "황민,블로그,개발,프로그래밍,일상,학습,Next.js,React,TypeScript,JavaScript,Node.js,풀스택,웹개발,프론트엔드,백엔드,MCP,AI,자동화,RPA,UiPath,Python,데이터베이스,MySQL,Docker,DevOps,클라우드,AWS,Azure,Git,CI/CD,테스트,품질관리,코딩,알고리즘,자료구조,디자인패턴,아키텍처,마이크로서비스,API,REST,GraphQL,상태관리,Redux,Zustand,스타일링,TailwindCSS,StyledComponents,성능최적화,SEO,접근성,반응형,모바일,크로스브라우징,타입스크립트,타입안전성,테스트주도개발,TDD,BDD,단위테스트,통합테스트,E2E테스트,Jest,Vitest,Cypress,Playwright,코드리뷰,페어프로그래밍,애자일,스크럼,칸반,지속적통합,지속적배포,모니터링,로깅,에러처리,보안,인증,권한관리,OAuth,JWT,세션관리,암호화,HTTPS,SSL,인증서,방화벽,백업,복구,로드밸런싱,캐싱,CDN,Redis,메모리관리,가비지컬렉션,메모리릭,성능프로파일링,번들분석,코드분할,지연로딩,이미지최적화,폰트최적화,서비스워커,PWA,오프라인지원,푸시알림,웹소켓,실시간통신,SSE,폴링,웹훅,마이크로프론트엔드,모듈페더레이션,모노레포,워크스페이스,패키지관리,npm,yarn,pnpm,버전관리,시맨틱버저닝,브랜치전략,Git Flow,GitHub Flow,코드품질,ESLint,Prettier,Husky,lint-staged,커밋메시지,컨벤션,문서화,JSDoc,Storybook,API문서,Swagger,OpenAPI,Postman,Insomnia,데이터베이스설계,정규화,인덱싱,쿼리최적화,트랜잭션,ACID,일관성,격리성,지속성,데드락,락킹,동시성제어,레플리케이션,샤딩,파티셔닝,백업전략,복구전략,데이터마이그레이션,스키마변경,버전관리,ORM,쿼리빌더,마이그레이션,시드데이터,팩토리,테스트데이터,모킹,스터빙,인터셉터,가짜객체,더미데이터,랜덤데이터,테스트커버리지,코드커버리지,브랜치커버리지,함수커버리지,라인커버리지,조건커버리지,경로커버리지,순환복잡도,코드스멜,리팩토링,클린코드,SOLID원칙,DRY원칙,KISS원칙,YAGNI원칙,의존성주입,제어역전,의존성역전,인터페이스분리,단일책임,개방폐쇄,리스코프치환,의존성관리,의존성그래프,순환의존성,순환참조,메모리누수,가비지컬렉션,메모리프로파일링,힙덤프,스택트레이스,에러로그,디버깅,브레이크포인트,스텝오버,스텝인,스텝아웃,조건부브레이크포인트,로그포인트,워치,콜스택,스택프레임,레지스터,어셈블리,바이트코드,컴파일,인터프리트,JIT컴파일,AOT컴파일,트랜스파일,바벨,웹팩,롤업,파셀,스노우팩,터보팩,번들러,모듈번들러,청크,스플리팅,코드분할,트리쉐이킹,데드코드제거,미니피케이션,압축,난독화,소스맵,디버깅정보,개발도구,브라우저개발자도구,크롬개발자도구,파이어폭스개발자도구,사파리개발자도구,엣지개발자도구,네트워크탭,콘솔탭,소스탭,애플리케이션탭,성능탭,메모리탭,보안탭,접근성탭,오디트탭,렌더링탭,레이어탭,3D뷰,타임라인,프로파일러,힙스냅샷,메모리힙,가비지컬렉션,메모리누수,성능분석,병목지점,최적화,캐싱,메모이제이션,메모이제이션패턴,메모이제이션함수,메모이제이션훅,메모이제이션컴포넌트,메모이제이션값,메모이제이션결과,메모이제이션키,메모이제이션의존성,메모이제이션조건,메모이제이션무효화,메모이제이션정책,메모이제이션전략,메모이제이션알고리즘,메모이제이션구현,메모이제이션예제,메모이제이션사용법,메모이제이션팁,메모이제이션트릭,메모이제이션베스트프랙티스,메모이제이션안티패턴,메모이제이션주의사항,메모이제이션한계,메모이제이션장점,메모이제이션단점,메모이제이션비교,메모이제이션대안,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도,메모이제이션알고리즘,메모이제이션자료구조,메모이제이션해시테이블,메모이제이션맵,메모이제이션객체,메모이제이션배열,메모이제이션리스트,메모이제이션트리,메모이제이션그래프,메모이제이션네트워크,메모이제이션그리드,메모이제이션매트릭스,메모이제이션벡터,메모이제이션스칼라,메모이제이션텐서,메모이제이션행렬,메모이제이션다차원,메모이제이션중첩,메모이제이션재귀,메모이제이션반복,메모이제이션순환,메모이제이션반복문,메모이제이션조건문,메모이제이션분기,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도",
  authors: [{ name: "황민" }],
  creator: "황민",
  publisher: "황민",
  metadataBase: new URL("https://blog.eungming.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "min.log - 개발, 일상, 그리고 배움에 대한 기록",
    description: "황민의 개발 블로그입니다. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "min.log",
    url: "https://blog.eungming.com",
    images: [
      {
        url: "https://blog.eungming.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "min.log",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "min.log - 개발, 일상, 그리고 배움에 대한 기록",
    description: "황민의 개발 블로그입니다. 프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.",
    creator: "@minhwang72",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    other: {
      rel: 'mask-icon',
      url: '/logo.svg',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <style>
          {`
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Medium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-SemiBold.woff2') format('woff2');
              font-weight: 600;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Pretendard';
              src: url('/fonts/Pretendard-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}