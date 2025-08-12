import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: "min.log",
    template: "%s"
  },
  description: "개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.",
  keywords: "블로그,개발,프로그래밍,기술,학습,Next.js,React,TypeScript,JavaScript,Node.js,웹개발,프론트엔드,백엔드,AI,Python,데이터베이스,MySQL,Docker,DevOps,클라우드,AWS,Azure,Git,CI/CD,테스트,코딩,알고리즘,자료구조,디자인패턴,아키텍처,API,REST,GraphQL,상태관리,Redux,Zustand,스타일링,TailwindCSS,성능최적화,SEO,접근성,반응형,모바일,타입스크립트,타입안전성,테스트주도개발,TDD,BDD,단위테스트,통합테스트,E2E테스트,Jest,Vitest,Cypress,Playwright,코드리뷰,페어프로그래밍,애자일,스크럼,칸반,지속적통합,지속적배포,모니터링,로깅,에러처리,보안,인증,권한관리,OAuth,JWT,세션관리,암호화,HTTPS,SSL,인증서,방화벽,백업,복구,로드밸런싱,캐싱,CDN,Redis,메모리관리,가비지컬렉션,메모리릭,성능분석,병목지점,최적화,캐싱,메모이제이션,리팩토링,클린코드,SOLID원칙,DRY원칙,KISS원칙,YAGNI원칙,의존성주입,제어역전,의존성역전,인터페이스분리,단일책임,개방폐쇄,리스코프치환,의존성관리,순환의존성,순환참조,메모리누수,가비지컬렉션,메모리프로파일링,힙덤프,스택트레이스,에러로그,디버깅,브레이크포인트,스텝오버,스텝인,스텝아웃,조건부브레이크포인트,로그포인트,워치,콜스택,스택프레임,레지스터,어셈블리,바이트코드,컴파일,인터프리트,JIT컴파일,AOT컴파일,트랜스파일,바벨,웹팩,롤업,파셀,스노우팩,터보팩,번들러,모듈번들러,청크,스플리팅,코드분할,트리쉐이킹,데드코드제거,미니피케이션,압축,난독화,소스맵,디버깅정보,개발도구,브라우저개발자도구,크롬개발자도구,파이어폭스개발자도구,사파리개발자도구,엣지개발자도구,네트워크탭,콘솔탭,소스탭,애플리케이션탭,성능탭,메모리탭,보안탭,접근성탭,오디트탭,렌더링탭,레이어탭,3D뷰,타임라인,프로파일러,힙스냅샷,메모리힙,가비지컬렉션,메모리누수,성능분석,병목지점,최적화,캐싱,메모이제이션,메모이제이션패턴,메모이제이션함수,메모이제이션훅,메모이제이션컴포넌트,메모이제이션값,메모이제이션결과,메모이제이션키,메모이제이션의존성,메모이제이션조건,메모이제이션무효화,메모이제이션정책,메모이제이션전략,메모이제이션알고리즘,메모이제이션구현,메모이제이션예제,메모이제이션사용법,메모이제이션팁,메모이제이션트릭,메모이제이션베스트프랙티스,메모이제이션안티패턴,메모이제이션주의사항,메모이제이션한계,메모이제이션장점,메모이제이션단점,메모이제이션비교,메모이제이션대안,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도,메모이제이션알고리즘,메모이제이션자료구조,메모이제이션해시테이블,메모이제이션맵,메모이제이션객체,메모이제이션배열,메모이제이션리스트,메모이제이션트리,메모이제이션그래프,메모이제이션네트워크,메모이제이션그리드,메모이제이션매트릭스,메모이제이션벡터,메모이제이션스칼라,메모이제이션텐서,메모이제이션행렬,메모이제이션다차원,메모이제이션중첩,메모이제이션재귀,메모이제이션반복,메모이제이션순환,메모이제이션반복문,메모이제이션조건문,메모이제이션분기,메모이제이션선택,메모이제이션결정,메모이제이션분석,메모이제이션평가,메모이제이션검증,메모이제이션테스트,메모이제이션디버깅,메모이제이션프로파일링,메모이제이션모니터링,메모이제이션로깅,메모이제이션추적,메모이제이션측정,메모이제이션벤치마크,메모이제이션성능,메모이제이션효율성,메모이제이션속도,메모이제이션메모리,메모이제이션공간,메모이제이션시간,메모이제이션복잡도",
  authors: [{ name: "개발자" }],
  creator: "개발자",
  publisher: "개발자",
  metadataBase: new URL("https://eungming.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "min.log - 개발자의 기록 공간",
    description: "개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "min.log",
    url: "https://eungming.com",
    images: [
      {
        url: "https://eungming.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "min.log",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "min.log - 개발자의 기록 공간",
    description: "개발자의 기술과 배움을 기록하는 블로그입니다. 새로운 기술을 탐구하고 경험을 공유하는 지식의 공간입니다.",
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
    google: "_6y4DjCJpX30-CdY9nGiBrTi4GBpxu1vjrXbxLDnq6M",
    other: {
      "naver-site-verification": "86c5c1cc1c8932ac679396eae3ac57d4ad6659c7",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-4467822003966307",
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
    <html lang="ko" suppressHydrationWarning={true}>
      <head>
        <link rel="preload" href="/fonts/Pretendard-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Pretendard-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Pretendard-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Pretendard-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body 
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          // F12 키 차단
          if (e.key === 'F12') {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+I (개발자도구) 차단
          if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+J (콘솔) 차단
          if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
          }
          // Ctrl+U (소스보기) 차단
          if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
          }
          // Ctrl+Shift+C (요소 검사) 차단
          if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
          }
        }}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        
        {/* Google AdSense - 환경변수가 설정된 경우에만 로드 */}
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && 
         !process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID.includes('YOUR_PUBLISHER_ID') && (
          <Script
            id="google-adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
          />
        )}

        {/* 보안 스크립트 */}
        <Script
          id="security-script"
          dangerouslySetInnerHTML={{
            __html: `
              // 오른쪽 클릭 차단
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });

              // 드래그 차단
              document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
              });

              // 텍스트 선택 차단
              document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
              });

              // 키보드 단축키 차단
              document.addEventListener('keydown', function(e) {
                // F12 키 차단
                if (e.key === 'F12') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+I (개발자도구) 차단
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+J (콘솔) 차단
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+U (소스보기) 차단
                if (e.ctrlKey && e.key === 'u') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+C (요소 검사) 차단
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+K (콘솔) 차단 (Firefox)
                if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                  e.preventDefault();
                  return false;
                }
              });

              // 개발자도구 감지 및 차단
              function detectDevTools() {
                const threshold = 160;
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                
                if (widthThreshold || heightThreshold) {
                  document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; font-size: 18px; color: #333;">개발자도구 사용이 제한되었습니다.</div>';
                }
              }

              // 주기적으로 개발자도구 감지
              setInterval(detectDevTools, 1000);

              // 콘솔 경고 메시지
              console.log('%c경고!', 'color: red; font-size: 30px; font-weight: bold;');
              console.log('%c이 브라우저 기능은 개발자만을 위한 것입니다.', 'color: red; font-size: 16px;');
              console.log('%c누군가가 당신에게 이곳에 무언가를 입력하라고 했다면, 이는 사기입니다.', 'color: red; font-size: 16px;');
            `
          }}
        />
      </body>
    </html>
  );
}