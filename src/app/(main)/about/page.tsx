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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          안녕하세요! 👋
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          개발과 일상, 그리고 새로운 것을 배우는 과정을 기록하고 공유하는 블로그를 운영하고 있습니다.
        </p>
      </div>

      {/* About Me Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">💻</span>
            개발자 황민
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            풀스택 개발자로서 웹 애플리케이션부터 백엔드 시스템까지 다양한 프로젝트에 참여하고 있습니다. 
            새로운 기술을 학습하고 이를 실무에 적용하는 것을 좋아하며, 배운 것들을 블로그를 통해 공유하고 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            블로그 목표
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            복잡한 기술을 쉽게 설명하고, 개발 과정에서 마주한 문제들과 해결 방법을 정리하여 
            다른 개발자들에게 도움이 되는 콘텐츠를 만들고자 합니다.
          </p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          💡 관심사 & 기술 스택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="mr-2">🎨</span>
              Frontend
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• React & Next.js</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Framer Motion</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="mr-2">⚙️</span>
              Backend
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Node.js & Express</li>
              <li>• Python & Django</li>
              <li>• MySQL & MongoDB</li>
              <li>• RESTful API</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <span className="mr-2">☁️</span>
              DevOps & Tools
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Docker & Kubernetes</li>
              <li>• AWS & Azure</li>
              <li>• Git & GitHub Actions</li>
              <li>• Linux & Nginx</li>
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
          📬 연락처
        </h2>
        <div className="flex justify-center space-x-6">
          <a 
            href="mailto:zxcyui6181@naver.com"
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>이메일</span>
          </a>
          
          <a 
            href="https://github.com/minhwang72"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
        
        <p className="mt-8 text-gray-600 dark:text-gray-300">
          궁금한 점이 있으시거나 함께 이야기하고 싶은 주제가 있다면 언제든 연락주세요! 🚀
        </p>
      </div>
    </div>
  );
}