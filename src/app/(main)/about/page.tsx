'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';

interface AboutContent {
  title: string;
  content: string;
  isDefault: boolean;
}

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch about content:', error);
      // 에러 시 기본 컨텐츠 사용
      setAboutContent({
        title: '소개',
        content: '<h1>안녕하세요!</h1><p>개발자 황민입니다.</p>',
        isDefault: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Dynamic Content */}
      {aboutContent && (
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutContent.content }}
        />
      )}

      {/* Static Sections (preserved from original) */}
      <div className="mt-12 space-y-12">
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
      </div>
    </div>
  );
}