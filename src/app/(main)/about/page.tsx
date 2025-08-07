import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 - min.log',
  description: '황민의 개발 블로그 소개 페이지입니다. 기술 스택, 블로그 목적, 연락처 등을 확인하세요.',
  openGraph: {
    title: '소개 - min.log',
    description: '황민의 개발 블로그 소개 페이지입니다. 기술 스택, 블로그 목적, 연락처 등을 확인하세요.',
    url: 'https://eungming.com/about',
    siteName: 'min.log',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eungming.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          황민
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          안녕하세요!
        </h1>
        <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
          <p>
            개발자로서의 경험과 일상 속 배움을 기록하며,<br/>
            기술을 쉽고 재밌게 공유하는 블로그를 운영하고 있습니다.
          </p>
          <p>
            웹 개발, 자동화 솔루션, AI 기반 워크플로우까지<br/>
            다양한 분야에서 쌓은 인사이트를 나누며,<br/>
            저만의 색깔로 성장하는 과정을 담고 있습니다.
          </p>
        </div>
      </div>

      {/* About Me Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            개발자 & 기술 크리에이터
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
            <p>
              풀스택 개발자로서 웹 애플리케이션, 백엔드 시스템, RPA 자동화 프로젝트까지 
              다양한 기술을 경험해왔습니다.
            </p>
            <p>
              특히 UiPath를 활용한 업무 자동화,<br/>
              MCP 기반 AI 콘텐츠 자동화 등<br/>
              최신 기술을 실무에 적용하며 얻은 노하우를 공유하고 있습니다.
            </p>
            <p>
              기술을 배우고 적용하는 과정에서 느낀 깨달음들을<br/>
              이 블로그를 통해 많은 분들과 나누고 싶습니다.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            블로그 목표
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                복잡한 기술을 쉽고 명확하게 설명하기
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                개발 과정에서 마주하는 문제와 해결법을 기록하기
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                RPA, AI, 개발 툴 등 최신 기술을 실무 관점에서 소개하기
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                일상 속 배움과 성장 이야기를 공유하기
              </li>
            </ul>
            <p className="mt-4 italic text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              개발과 자동화, 그리고 사람 이야기가 공존하는 블로그를 지향합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          관심사 & 기술 스택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Frontend & UI
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>React & Next.js (App Router)</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>TypeScript</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Tailwind CSS, Framer Motion</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>사용자 경험을 고려한 UI/UX 설계</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-lg border border-green-100 dark:border-green-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Backend & Infra
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Node.js & Express</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Python & Django</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>MySQL, MongoDB</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>RESTful API 설계 및 최적화</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-6 rounded-lg border border-orange-100 dark:border-orange-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Automation & AI
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>UiPath RPA 개발 및 프로세스 최적화</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>MCP 기반 AI 콘텐츠 자동화 시스템 구축</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>AI API (ChatGPT, Claude 등) 연동 워크플로우 개발</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Cursor IDE를 통한 AI 개발 생산성 향상</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg border border-purple-100 dark:border-purple-800/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              DevOps & Tools
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Docker & Kubernetes</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>AWS & Azure</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>GitHub Actions CI/CD 파이프라인 구축</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Linux 서버 및 Nginx 운영</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>개발 업무를 편리하게 만드는 도구 연구</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Blog Tech Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="mr-2">🚀</span>
          이 블로그의 기술적 특징
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ 최신 기술 스택</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Next.js 14 (App Router)</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Drizzle ORM + MySQL</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🤖 AI 통합</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-1">
              <li>• MCP (Model Context Protocol)</li>
              <li>• Cursor IDE 연동</li>
              <li>• 자동 카테고리 분류</li>
              <li>• AI 기반 콘텐츠 생성</li>
            </ul>
          </div>
        </div>
      </div>

            {/* Contact Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          연락처
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
          <a
            href="mailto:zxcyui6181@naver.com"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div className="text-center">
              <div className="font-medium text-sm">이메일</div>
              <div className="text-xs opacity-90">zxcyui6181@naver.com</div>
            </div>
          </a>

          <a
            href="https://github.com/minhwang72"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <div className="text-center">
              <div className="font-medium text-sm">GitHub</div>
              <div className="text-xs opacity-90">@minhwang72</div>
            </div>
          </a>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            개발 관련 질문, 협업 제안, 또는 가벼운 인사까지 언제든 환영합니다.<br/>
            <span className="text-xs text-gray-600 dark:text-gray-400">기술을 통해 더 많은 사람들과 소통하고 싶습니다.</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16 pt-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <a
              href="mailto:zxcyui6181@naver.com"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
            <a
              href="https://github.com/minhwang72"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 min.log. 모든 권리 보유.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            개발과 일상의 경계에서 성장하는 이야기
          </p>
        </div>
      </footer>
    </div>
  );
}