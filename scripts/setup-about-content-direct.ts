#!/usr/bin/env tsx

/**
 * 소개 페이지 기본 컨텐츠 생성 스크립트 (Direct MySQL)
 */

import * as dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const defaultAboutContent = `
<div class="text-center mb-12">
  <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
    황민
  </div>
  <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
    안녕하세요!
  </h1>
  <div class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto space-y-4">
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

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      🚀 개발 여정
    </h2>
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
      <p>풀스택 개발자로서 프론트엔드부터 백엔드, 인프라까지 다양한 기술 스택을 경험해왔습니다.</p>
      <p>특히 사용자 경험을 중시하며, 기술적 복잡함을 단순하고 직관적인 인터페이스로 녹여내는 것을 즐깁니다.</p>
      <p>UiPath를 활용한 업무 자동화, MCP 기반 AI 콘텐츠 자동화 등 최신 기술을 실무에 적용하며 얻은 노하우를 공유하고 있습니다.</p>
    </div>
  </div>

  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-green-500">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      🎯 현재 관심사
    </h2>
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed">
      <ul class="space-y-2">
        <li class="flex items-start">
          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          AI와 개발 워크플로우의 융합
        </li>
        <li class="flex items-start">
          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          RPA 기반 업무 자동화
        </li>
        <li class="flex items-start">
          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          개발 생산성을 높이는 도구들
        </li>
        <li class="flex items-start">
          <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          사용자 중심의 UX/UI 설계
        </li>
      </ul>
      <p class="mt-4 italic text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
        개발과 자동화, 그리고 사람 이야기가 공존하는 블로그를 지향합니다.
      </p>
    </div>
  </div>
</div>

<div class="mb-12">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
    관심사 & 기술 스택
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Frontend & UI
      </h3>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>React & Next.js (App Router)</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>TypeScript</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Tailwind CSS, Framer Motion</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>사용자 경험을 고려한 UI/UX 설계</li>
      </ul>
    </div>

    <div class="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-lg border border-green-100 dark:border-green-800/50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Backend & Infra
      </h3>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Node.js & Express</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Python & Django</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>MySQL, MongoDB</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>RESTful API 설계 및 최적화</li>
      </ul>
    </div>

    <div class="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-6 rounded-lg border border-orange-100 dark:border-orange-800/50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Automation & AI
      </h3>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>UiPath RPA 개발 및 프로세스 최적화</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>MCP 기반 AI 콘텐츠 자동화 시스템 구축</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>AI API (ChatGPT, Claude 등) 연동 워크플로우 개발</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Cursor IDE를 통한 AI 개발 생산성 향상</li>
      </ul>
    </div>

    <div class="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg border border-purple-100 dark:border-purple-800/50 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        DevOps & Tools
      </h3>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Docker & Kubernetes</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>AWS & Azure</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>GitHub Actions CI/CD 파이프라인 구축</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>Linux 서버 및 Nginx 운영</li>
        <li class="flex items-center"><span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>개발 업무를 편리하게 만드는 도구 연구</li>
      </ul>
    </div>
  </div>
</div>

<div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
    <span class="mr-2">🚀</span>
    이 블로그의 기술적 특징
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2">⚡ 최신 기술 스택</h3>
      <ul class="text-gray-600 dark:text-gray-300 space-y-1">
        <li>• Next.js 14 (App Router)</li>
        <li>• TypeScript</li>
        <li>• Tailwind CSS</li>
        <li>• Drizzle ORM + MySQL</li>
      </ul>
    </div>
    <div>
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2">🤖 AI 통합</h3>
      <ul class="text-gray-600 dark:text-gray-300 space-y-1">
        <li>• MCP (Model Context Protocol)</li>
        <li>• Cursor IDE 연동</li>
        <li>• 자동 카테고리 분류</li>
        <li>• AI 기반 콘텐츠 생성</li>
      </ul>
    </div>
  </div>
</div>
`.trim();

async function setupAboutContent() {
  let connection;
  
  try {
    console.log('📄 소개 페이지 기본 컨텐츠 생성 중...');
    
    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 기존 데이터 확인
    const [existing] = await connection.execute('SELECT COUNT(*) as count FROM about_content');
    const count = (existing as any)[0].count;

    if (count === 0) {
      // 기본 컨텐츠 삽입
      await connection.execute(
        'INSERT INTO about_content (title, content, updated_by) VALUES (?, ?, ?)',
        ['소개', defaultAboutContent, 1]
      );
      console.log('✅ 소개 페이지 기본 컨텐츠가 생성되었습니다!');
    } else {
      console.log('ℹ️  소개 페이지 컨텐츠가 이미 존재합니다.');
    }

    console.log('🎉 소개 페이지 설정이 완료되었습니다!');
    
  } catch (error: any) {
    console.error('❌ 소개 페이지 컨텐츠 생성 실패:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  setupAboutContent();
}

export { setupAboutContent };